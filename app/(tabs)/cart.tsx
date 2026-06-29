import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Minus, Plus, Trash2, Heart, Tag, ShoppingBag, ChevronRight, X } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { useCart } from '@/store/cart';
import { useWishlist } from '@/store/wishlist';
import { useToast } from '@/store/toast';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { coupons } from '@/mock/data';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, removeItem, updateQty, saveForLater, applyCoupon, removeCoupon, subtotal, deliveryCharge, gst, grandTotal, totalItems } = useCart();
  const { toggle } = useWishlist();
  const { show } = useToast();
  const [couponInput, setCouponInput] = useState('');
  const [showCoupons, setShowCoupons] = useState(false);

  const handleApplyCoupon = (code: string, discount: number, minOrder: number) => {
    if (subtotal < minOrder) {
      show(`Minimum order ₹${minOrder.toLocaleString('en-IN')} required`, 'error');
      return;
    }
    applyCoupon(code, discount);
    setShowCoupons(false);
    show('Coupon applied!');
  };

  const handleMoveToWishlist = (id: string, productId: string) => {
    toggle(productId);
    removeItem(id);
    show('Moved to wishlist');
  };

  if (state.items.length === 0) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.title}>Shopping Cart</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyState
            icon={<ShoppingBag color={COLORS.neutral[400]} size={36} />}
            title="Your cart is empty"
            message="Browse our premium collections and add items to your cart"
          />
          <View style={{ paddingHorizontal: SPACING.xl }}>
            <Button onPress={() => router.push('/(tabs)/categories')} fullWidth size="lg">Start Shopping</Button>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Shopping Cart</Text>
        <Text style={styles.subtitle}>{totalItems} item{totalItems > 1 ? 's' : ''} in cart</Text>
      </View>

      <FlatList
        data={state.items}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: 200 }}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemBody}>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.itemPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
              <View style={styles.itemActions}>
                <View style={styles.qtyRow}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, item.quantity - 1)}>
                    <Minus color={COLORS.neutral[700]} size={16} />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, item.quantity + 1)}>
                    <Plus color={COLORS.neutral[700]} size={16} />
                  </TouchableOpacity>
                </View>
                <View style={styles.itemActionBtns}>
                  <TouchableOpacity style={styles.iconAction} onPress={() => saveForLater(item.id)}>
                    <Heart color={COLORS.neutral[500]} size={16} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconAction} onPress={() => removeItem(item.id)}>
                    <Trash2 color={COLORS.error} size={16} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          <View style={styles.couponSection}>
            {state.appliedCoupon ? (
              <View style={styles.appliedCoupon}>
                <View style={styles.couponInfo}>
                  <Tag color={COLORS.success} size={18} />
                  <View>
                    <Text style={styles.couponCode}>{state.appliedCoupon}</Text>
                    <Text style={styles.couponSaved}>You saved ₹{state.couponDiscount.toLocaleString('en-IN')}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={removeCoupon}>
                  <X color={COLORS.neutral[500]} size={20} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.couponInput} onPress={() => setShowCoupons(true)}>
                <Tag color={COLORS.gold[500]} size={20} />
                <Text style={styles.couponPlaceholder}>Apply coupon code</Text>
                <ChevronRight color={COLORS.neutral[400]} size={20} />
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₹{subtotal.toLocaleString('en-IN')}</Text>
        </View>
        {state.couponDiscount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount</Text>
            <Text style={[styles.summaryValue, { color: COLORS.success }]}>-₹{state.couponDiscount.toLocaleString('en-IN')}</Text>
          </View>
        )}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery</Text>
          <Text style={styles.summaryValue}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toLocaleString('en-IN')}`}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>GST (18%)</Text>
          <Text style={styles.summaryValue}>₹{gst.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Grand Total</Text>
          <Text style={styles.totalValue}>₹{grandTotal.toLocaleString('en-IN')}</Text>
        </View>
        <Button onPress={() => router.push('/checkout')} fullWidth size="lg" style={{ marginTop: SPACING.md }}>
          Proceed to Checkout
        </Button>
      </View>

      {/* Coupon Sheet */}
      {showCoupons && (
        <View style={styles.sheetOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowCoupons(false)} />
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Available Coupons</Text>
              <TouchableOpacity onPress={() => setShowCoupons(false)}>
                <X color={COLORS.neutral[600]} size={24} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={coupons}
              keyExtractor={(c) => c.code}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.couponCard} onPress={() => handleApplyCoupon(item.code, item.type === 'percentage' ? Math.round(subtotal * item.discount / 100) : item.discount, item.minOrder)}>
                  <View style={styles.couponCardLeft}>
                    <Text style={styles.couponCardCode}>{item.code}</Text>
                    <Text style={styles.couponCardDesc}>{item.description}</Text>
                    <Text style={styles.couponCardMin}>Min order: ₹{item.minOrder.toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.couponCardRight}>
                    <Text style={styles.couponCardDiscount}>{item.type === 'percentage' ? `${item.discount}%` : `₹${item.discount}`}</Text>
                    <Text style={styles.couponCardOff}>OFF</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
  title: { fontSize: 28, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  subtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
  cartItem: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.small },
  itemImage: { width: 90, height: 90, borderRadius: RADIUS.lg, resizeMode: 'cover' },
  itemBody: { flex: 1, marginLeft: SPACING.md },
  itemName: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900], lineHeight: 18 },
  itemPrice: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.primary[700], marginTop: 4 },
  itemActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.sm },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.neutral[100], borderRadius: RADIUS.md, paddingHorizontal: 4 },
  qtyBtn: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
  qtyText: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  itemActionBtns: { flexDirection: 'row', gap: SPACING.sm },
  iconAction: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.neutral[100], justifyContent: 'center', alignItems: 'center' },
  couponSection: { marginTop: SPACING.md },
  couponInput: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.white, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, borderWidth: 1, borderColor: COLORS.gold[200], borderStyle: 'dashed' },
  couponPlaceholder: { flex: 1, fontSize: 14, fontFamily: 'Inter-Medium', color: COLORS.neutral[600] },
  appliedCoupon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.success + '15', borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  couponInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  couponCode: { fontSize: 14, fontFamily: 'Inter-Bold', color: COLORS.success },
  couponSaved: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[600] },
  summary: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, padding: SPACING.lg, paddingBottom: 40, ...SHADOWS.large },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 },
  summaryLabel: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[600] },
  summaryValue: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  summaryDivider: { height: 1, backgroundColor: COLORS.neutral[200], marginVertical: SPACING.sm },
  totalLabel: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  totalValue: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
  sheetOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', zIndex: 100 },
  sheet: { backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, maxHeight: '70%', paddingBottom: 40 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
  sheetTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  couponCard: { flexDirection: 'row', marginHorizontal: SPACING.lg, marginBottom: SPACING.md, borderRadius: RADIUS.lg, borderWidth: 1.5, borderColor: COLORS.gold[200], overflow: 'hidden' },
  couponCardLeft: { flex: 1, padding: SPACING.md, borderRightWidth: 2, borderRightColor: COLORS.gold[200], borderStyle: 'dashed' },
  couponCardCode: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
  couponCardDesc: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginTop: 4 },
  couponCardMin: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], marginTop: 4 },
  couponCardRight: { width: 80, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.gold[50] },
  couponCardDiscount: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.gold[600] },
  couponCardOff: { fontSize: 11, fontFamily: 'Inter-SemiBold', color: COLORS.gold[600] },
});
