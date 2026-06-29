import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Heart, ShoppingBag, Trash2 } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { mockApi } from '@/services/api';
import { Product } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { RatingBadge } from '@/components/ui/RatingBadge';
import { useWishlist } from '@/store/wishlist';
import { useCart } from '@/store/cart';
import { useToast } from '@/store/toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WishlistScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, toggle, remove } = useWishlist();
  const { addItem } = useCart();
  const { show } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const all = await mockApi.getProducts();
    const filtered = all.filter((p) => state.productIds.includes(p.id));
    setProducts(filtered);
    setLoading(false);
  }, [state.productIds]);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const handleMoveToCart = (product: Product) => {
    addItem({
      id: `${product.id}_${Date.now()}`,
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: 1,
      type: 'product',
    });
    toggle(product.id);
    show('Moved to cart');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color={COLORS.neutral[800]} size={24} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>My Wishlist</Text>
          <Text style={styles.subtitle}>{products.length} saved items</Text>
        </View>
      </View>

      {products.length === 0 && !loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyState
            icon={<Heart color={COLORS.neutral[400]} size={36} />}
            title="Your wishlist is empty"
            message="Save items you love to find them quickly later"
          />
        </View>
      ) : (
        <FlatList
          data={products}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary[600]} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity onPress={() => router.push(`/product/${item.id}`)}>
                <View style={styles.cardImageWrap}>
                  <TouchableOpacity onPress={() => router.push(`/product/${item.id}`)}>
                    <View style={styles.cardImageWrap}>
                      <Image source={{ uri: item.images[0] }} style={styles.cardImage} />
                    </View>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
              <View style={styles.cardBody}>
                <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
                <View style={styles.cardRating}>
                  <RatingBadge rating={item.rating} size="sm" />
                </View>
                <Text style={styles.cardPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.cartBtn} onPress={() => handleMoveToCart(item)}>
                    <ShoppingBag color={COLORS.white} size={16} />
                    <Text style={styles.cartBtnText}>Move to Cart</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.removeBtn} onPress={() => { remove(item.id); show('Removed', 'info'); }}>
                    <Trash2 color={COLORS.error} size={18} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, gap: SPACING.sm },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
  title: { fontSize: 22, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  subtitle: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
  card: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.small },
  cardImageWrap: { width: 100, height: 100, borderRadius: RADIUS.lg, overflow: 'hidden' },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardBody: { flex: 1, marginLeft: SPACING.md },
  cardName: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900], lineHeight: 18 },
  cardRating: { marginTop: 6 },
  cardPrice: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.primary[700], marginTop: 6 },
  cardActions: { flexDirection: 'row', gap: 8, marginTop: SPACING.sm },
  cartBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.primary[700], paddingVertical: 10, borderRadius: RADIUS.lg },
  cartBtnText: { fontSize: 12, fontFamily: 'Inter-SemiBold', color: COLORS.white },
  removeBtn: { width: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.error + '15', borderRadius: RADIUS.lg },
});
