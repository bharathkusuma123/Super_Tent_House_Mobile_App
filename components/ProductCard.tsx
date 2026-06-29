import { memo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Heart, ShoppingBag, Star } from 'lucide-react-native';
import { Product } from '@/types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '@/constants/theme';
import { useWishlist } from '@/store/wishlist';
import { useCart } from '@/store/cart';
import { useToast } from '@/store/toast';
import { RatingBadge } from './ui/RatingBadge';

type Props = { product: Product; index?: number; horizontal?: boolean };

function ProductCardBase({ product, index = 0, horizontal = false }: Props) {
  const router = useRouter();
  const { has, toggle } = useWishlist();
  const { addItem } = useCart();
  const { show } = useToast();
  const isWishlisted = has(product.id);

  const handlePress = useCallback(() => {
    router.push(`/product/${product.id}`);
  }, [router, product.id]);

  const handleAdd = useCallback(() => {
    addItem({
      id: `${product.id}_${Date.now()}`,
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: 1,
      type: 'product',
    });
    show('Added to cart');
  }, [addItem, product, show]);

  const handleWishlist = useCallback(() => {
    toggle(product.id);
    show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info');
  }, [toggle, product.id, isWishlisted, show]);

  // ── Horizontal card (used in home screen carousels) ────────────────────────
  if (horizontal) {
    return (
      <Pressable onPress={handlePress} style={hStyles.card}>
        <Animated.View entering={FadeInDown.delay(index * 50)}>
          <View style={hStyles.imageWrap}>
            <Image source={{ uri: product.images[0] }} style={hStyles.image} />
            {product.discount > 0 && (
              <View style={hStyles.discountBadge}>
                <Text style={hStyles.discountText}>{product.discount}% OFF</Text>
              </View>
            )}
            <TouchableOpacity style={hStyles.wishBtn} onPress={handleWishlist}>
              <Heart size={16} color={isWishlisted ? COLORS.error : COLORS.white} fill={isWishlisted ? COLORS.error : 'transparent'} />
            </TouchableOpacity>
          </View>
          <View style={hStyles.body}>
            <Text style={hStyles.category}>{product.categoryName}</Text>
            <Text style={hStyles.name} numberOfLines={2}>{product.name}</Text>
            <View style={hStyles.row}>
              <RatingBadge rating={product.rating} size="sm" />
              <Text style={hStyles.reviews}>({product.reviewCount})</Text>
            </View>
            <View style={hStyles.priceRow}>
              <Text style={hStyles.price}>₹{product.price.toLocaleString('en-IN')}</Text>
              {product.originalPrice > product.price && (
                <Text style={hStyles.original}>₹{product.originalPrice.toLocaleString('en-IN')}</Text>
              )}
            </View>
            <TouchableOpacity style={hStyles.addBtn} onPress={handleAdd}>
              <ShoppingBag size={15} color={COLORS.white} />
              <Text style={hStyles.addText}>Add</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Pressable>
    );
  }

  // ── Vertical / grid card ──────────────────────────────────────────────────
  const discountAmount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Pressable onPress={handlePress} style={vStyles.card}>
      <Animated.View entering={FadeInDown.delay(index * 60)} style={{ flex: 1 }}>
        {/* Image area */}
        <View style={vStyles.imageWrap}>
          <Image source={{ uri: product.images[0] }} style={vStyles.image} />

          {/* Gradient overlay at bottom of image */}
          <View style={vStyles.imageGradient} />

          {/* Top badges */}
          {discountAmount > 0 && (
            <View style={vStyles.discountBadge}>
              <Text style={vStyles.discountText}>{discountAmount}% OFF</Text>
            </View>
          )}
          {!product.inStock && (
            <View style={vStyles.outOfStockBanner}>
              <Text style={vStyles.outOfStockText}>Out of Stock</Text>
            </View>
          )}

          {/* Wishlist button */}
          <TouchableOpacity style={[vStyles.wishBtn, isWishlisted && vStyles.wishBtnActive]} onPress={handleWishlist}>
            <Heart
              size={15}
              color={isWishlisted ? COLORS.error : COLORS.neutral[600]}
              fill={isWishlisted ? COLORS.error : 'transparent'}
            />
          </TouchableOpacity>

          {/* Rating pill sitting on top of image bottom */}
          <View style={vStyles.ratingPill}>
            <Star size={10} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
            <Text style={vStyles.ratingPillText}>{product.rating.toFixed(1)}</Text>
          </View>
        </View>

        {/* Body */}
        <View style={vStyles.body}>
          <Text style={vStyles.category} numberOfLines={1}>{product.categoryName}</Text>
          <Text style={vStyles.name} numberOfLines={2}>{product.name}</Text>

          {/* Review count */}
          <Text style={vStyles.reviewCount}>{product.reviewCount} reviews</Text>

          {/* Price row */}
          <View style={vStyles.priceRow}>
            <View>
              <Text style={vStyles.price}>₹{product.price.toLocaleString('en-IN')}</Text>
              {product.originalPrice > product.price && (
                <Text style={vStyles.original}>₹{product.originalPrice.toLocaleString('en-IN')}</Text>
              )}
            </View>
            <TouchableOpacity
              style={[vStyles.addBtn, !product.inStock && vStyles.addBtnDisabled]}
              onPress={product.inStock ? handleAdd : undefined}
              activeOpacity={product.inStock ? 0.8 : 1}
            >
              <ShoppingBag size={15} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export const ProductCard = memo(ProductCardBase);

// ─── Grid card styles ─────────────────────────────────────────────────────────
const vStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 170, resizeMode: 'cover' },
  imageGradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
    backgroundColor: 'rgba(10,18,36,0.25)',
  },
  discountBadge: {
    position: 'absolute', top: 10, left: 10,
    backgroundColor: COLORS.error, paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  discountText: { color: COLORS.white, fontSize: 10, fontFamily: 'Inter-Bold' },
  outOfStockBanner: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(10,18,36,0.72)', paddingVertical: 5, alignItems: 'center',
  },
  outOfStockText: { color: COLORS.neutral[300], fontSize: 11, fontFamily: 'Inter-SemiBold' },
  wishBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center',
    ...SHADOWS.small,
  },
  wishBtnActive: { backgroundColor: '#FFF0F0' },
  ratingPill: {
    position: 'absolute', bottom: 8, left: 8,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(10,18,36,0.7)', paddingHorizontal: 7, paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  ratingPillText: { fontSize: 11, fontFamily: 'Inter-Bold', color: COLORS.white },
  body: { padding: 12, flex: 1, justifyContent: 'space-between' },
  category: {
    fontSize: 10, fontFamily: 'Inter-Medium', color: COLORS.neutral[500],
    textTransform: 'uppercase', letterSpacing: 0.4,
  },
  name: {
    fontSize: 13, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900],
    marginTop: 3, lineHeight: 17,
  },
  reviewCount: {
    fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10,
  },
  price: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  original: {
    fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[400],
    textDecorationLine: 'line-through', marginTop: 1,
  },
  addBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: COLORS.primary[700], justifyContent: 'center', alignItems: 'center',
    ...SHADOWS.small,
  },
  addBtnDisabled: { backgroundColor: COLORS.neutral[300] },
});

// ─── Horizontal card styles ───────────────────────────────────────────────────
const hStyles = StyleSheet.create({
  card: {
    width: 180, marginRight: SPACING.md, backgroundColor: COLORS.white,
    borderRadius: RADIUS.xxl, overflow: 'hidden', ...SHADOWS.medium,
  },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 160, resizeMode: 'cover' },
  discountBadge: {
    position: 'absolute', top: 8, left: 8, backgroundColor: COLORS.error,
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: RADIUS.sm,
  },
  discountText: { color: COLORS.white, fontSize: 10, fontFamily: 'Inter-Bold' },
  wishBtn: {
    position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(10,18,36,0.4)', justifyContent: 'center', alignItems: 'center',
  },
  body: { padding: SPACING.sm + 2 },
  category: { fontSize: 10, color: COLORS.neutral[500], fontFamily: 'Inter-Medium' },
  name: { fontSize: 13, color: COLORS.neutral[900], fontFamily: 'Inter-SemiBold', marginTop: 2, lineHeight: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  reviews: { fontSize: 10, color: COLORS.neutral[500] },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  price: { fontSize: 14, color: COLORS.neutral[900], fontFamily: 'Inter-Bold' },
  original: { fontSize: 11, color: COLORS.neutral[400], textDecorationLine: 'line-through' },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    backgroundColor: COLORS.primary[700], paddingVertical: 8, borderRadius: RADIUS.md, marginTop: 8,
  },
  addText: { color: COLORS.white, fontSize: 12, fontFamily: 'Inter-SemiBold' },
});
