import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check, Users, Star, Plus, Minus, ShoppingBag, Calendar, MapPin } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { mockApi } from '@/services/api';
import { Package, AddOn } from '@/types';
import { Button } from '@/components/ui/Button';
import { RatingBadge } from '@/components/ui/RatingBadge';
import { useCart } from '@/store/cart';
import { useToast } from '@/store/toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PackageDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();
  const { show } = useToast();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [pkgs, ads] = await Promise.all([mockApi.getPackages(), mockApi.getAddOns()]);
      setPkg(pkgs.find((p) => p.id === id) || null);
      setAddOns(ads);
      setLoading(false);
    })();
  }, [id]);

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns((prev) => prev.includes(addOnId) ? prev.filter(a => a !== addOnId) : [...prev, addOnId]);
  };

  const addOnTotal = useMemo(() => {
    return addOns.filter(a => selectedAddOns.includes(a.id)).reduce((sum, a) => sum + a.price, 0);
  }, [addOns, selectedAddOns]);

  const grandTotal = (pkg?.price || 0) + addOnTotal;

  const handleAddToCart = () => {
    if (!pkg) return;
    addItem({
      id: `${pkg.id}_${Date.now()}`,
      productId: pkg.id,
      packageId: pkg.id,
      name: pkg.name,
      image: pkg.image,
      price: grandTotal,
      quantity: 1,
      type: 'package',
    });
    show('Package added to cart');
  };

  const handleBookNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  if (loading || !pkg) {
    return <View style={styles.container}><Text style={{ padding: 20 }}>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: pkg.image }} style={styles.image} />
          <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
            <TouchableOpacity style={styles.floatBtn} onPress={() => router.back()}>
              <ArrowLeft color={COLORS.neutral[800]} size={22} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <View style={[styles.tierBadge, { backgroundColor: pkg.tier === 'Luxury' ? COLORS.neutral[900] : pkg.tier === 'Premium' ? COLORS.gold[400] : COLORS.primary[500] }]}>
            <Text style={[styles.tierText, pkg.tier === 'Luxury' && { color: COLORS.gold[400] }]}>{pkg.tier.toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{pkg.name}</Text>
          <View style={styles.metaRow}>
            <RatingBadge rating={pkg.rating} />
            <Text style={styles.reviewCount}>{pkg.reviewCount} reviews</Text>
            <View style={styles.guestBadge}>
              <Users color={COLORS.primary[600]} size={14} />
              <Text style={styles.guestText}>Up to {pkg.guestCapacity} guests</Text>
            </View>
          </View>

          <Text style={styles.description}>{pkg.description}</Text>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{pkg.price.toLocaleString('en-IN')}</Text>
            {pkg.originalPrice > pkg.price && (
              <>
                <Text style={styles.originalPrice}>₹{pkg.originalPrice.toLocaleString('en-IN')}</Text>
                <View style={styles.discountBadge}><Text style={styles.discountText}>{pkg.discount}% OFF</Text></View>
              </>
            )}
          </View>

          {/* What's Included */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's Included</Text>
            <View style={styles.includesGrid}>
              {pkg.includes.map((inc, i) => (
                <View key={i} style={styles.includeItem}>
                  <View style={styles.includeCheck}><Check color={COLORS.success} size={14} /></View>
                  <Text style={styles.includeText}>{inc}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Customization */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customize Your Package</Text>
            <Text style={styles.sectionSubtitle}>Add extra services to make your event perfect</Text>
            <View style={styles.addOnsList}>
              {addOns.map((addon) => {
                const selected = selectedAddOns.includes(addon.id);
                return (
                  <TouchableOpacity
                    key={addon.id}
                    style={[styles.addOnCard, selected && styles.addOnCardActive]}
                    onPress={() => toggleAddOn(addon.id)}
                  >
                    <View style={styles.addOnCheck}>
                      {selected ? <Check color={COLORS.white} size={16} /> : <Plus color={COLORS.neutral[400]} size={16} />}
                    </View>
                    <View style={styles.addOnBody}>
                      <Text style={styles.addOnName}>{addon.name}</Text>
                      <Text style={styles.addOnPrice}>+₹{addon.price.toLocaleString('en-IN')}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Price Summary */}
          <View style={styles.priceSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Package Price</Text>
              <Text style={styles.summaryValue}>₹{pkg.price.toLocaleString('en-IN')}</Text>
            </View>
            {addOnTotal > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Add-ons ({selectedAddOns.length})</Text>
                <Text style={styles.summaryValue}>+₹{addOnTotal.toLocaleString('en-IN')}</Text>
              </View>
            )}
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{grandTotal.toLocaleString('en-IN')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button onPress={handleAddToCart} variant="outline" size="lg" style={{ flex: 1 }}>
          <ShoppingBag size={18} color={COLORS.primary[700]} /> Add to Cart
        </Button>
        <Button onPress={handleBookNow} variant="gold" size="lg" style={{ flex: 1, marginLeft: SPACING.sm }}>Book Now</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 280, resizeMode: 'cover' },
  floatingHeader: { position: 'absolute', left: SPACING.md, flexDirection: 'row' },
  floatBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
  content: { backgroundColor: COLORS.white, marginTop: -20, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, padding: SPACING.lg },
  tierBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: RADIUS.sm, marginBottom: 8 },
  tierText: { fontSize: 11, fontFamily: 'Inter-Bold', color: COLORS.white },
  name: { fontSize: 24, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], lineHeight: 30 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: SPACING.sm, flexWrap: 'wrap' },
  reviewCount: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
  guestBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primary[50], paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.sm },
  guestText: { fontSize: 11, fontFamily: 'Inter-SemiBold', color: COLORS.primary[700] },
  description: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginTop: SPACING.md, lineHeight: 22 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: SPACING.md },
  price: { fontSize: 28, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  originalPrice: { fontSize: 16, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], textDecorationLine: 'line-through' },
  discountBadge: { backgroundColor: COLORS.error + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.sm },
  discountText: { fontSize: 12, fontFamily: 'Inter-Bold', color: COLORS.error },
  section: { marginTop: SPACING.xl },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginBottom: SPACING.md },
  includesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  includeItem: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '48%', backgroundColor: COLORS.neutral[50], paddingHorizontal: 12, paddingVertical: 10, borderRadius: RADIUS.md },
  includeCheck: { width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.success + '20', justifyContent: 'center', alignItems: 'center' },
  includeText: { fontSize: 12, fontFamily: 'Inter-Medium', color: COLORS.neutral[800], flex: 1 },
  addOnsList: { gap: SPACING.sm },
  addOnCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 2, borderColor: COLORS.neutral[200], ...SHADOWS.small },
  addOnCardActive: { borderColor: COLORS.primary[600], backgroundColor: COLORS.primary[50] },
  addOnCheck: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.neutral[100], justifyContent: 'center', alignItems: 'center' },
  addOnBody: { flex: 1, marginLeft: SPACING.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addOnName: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  addOnPrice: { fontSize: 14, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
  priceSummary: { marginTop: SPACING.lg, backgroundColor: COLORS.neutral[50], borderRadius: RADIUS.xl, padding: SPACING.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  summaryLabel: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[600] },
  summaryValue: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  summaryDivider: { height: 1, backgroundColor: COLORS.neutral[200], marginVertical: SPACING.sm },
  totalLabel: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  totalValue: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: COLORS.white, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, paddingBottom: 30, borderTopWidth: 1, borderTopColor: COLORS.neutral[100], ...SHADOWS.large },
});
