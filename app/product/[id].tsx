// import { useState, useEffect, useCallback, useRef } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, Share } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useLocalSearchParams } from 'expo-router';
// import Animated, { FadeIn } from 'react-native-reanimated';
// import { ArrowLeft, Heart, Share2, ShoppingBag, Star, Truck, Shield, RotateCcw, ChevronRight, Minus, Plus, Check } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { mockApi } from '@/services/api';
// import { Product } from '@/types';
// import { Button } from '@/components/ui/Button';
// import { RatingBadge } from '@/components/ui/RatingBadge';
// import { ProductCard } from '@/components/ProductCard';
// import { Skeleton } from '@/components/ui/Skeleton';
// import { useWishlist } from '@/store/wishlist';
// import { useCart } from '@/store/cart';
// import { useToast } from '@/store/toast';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const { width } = Dimensions.get('window');

// export default function ProductDetailScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { has, toggle } = useWishlist();
//   const { addItem } = useCart();
//   const { show } = useToast();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [related, setRelated] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeImage, setActiveImage] = useState(0);
//   const [qty, setQty] = useState(1);
//   const [selectedColor, setSelectedColor] = useState(0);
//   const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'faq'>('description');

//   const load = useCallback(async () => {
//     const p = await mockApi.getProduct(id);
//     setProduct(p || null);
//     if (p) {
//       const rels = (await Promise.all(p.relatedIds.map((rid) => mockApi.getProduct(rid)))).filter(Boolean) as Product[];
//       setRelated(rels);
//     }
//     setLoading(false);
//   }, [id]);

//   useEffect(() => { load(); }, [load]);

//   const handleAddCart = () => {
//     if (!product) return;
//     addItem({
//       id: `${product.id}_${Date.now()}`,
//       productId: product.id,
//       name: product.name,
//       image: product.images[0],
//       price: product.price,
//       quantity: qty,
//       type: 'product',
//     });
//     show('Added to cart');
//   };

//   const handleBuyNow = () => {
//     handleAddCart();
//     router.push('/checkout');
//   };

//   const handleShare = async () => {
//     try {
//       await Share.share({ message: `Check out ${product?.name} on Super Tent House!` });
//     } catch {}
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <View style={{ padding: SPACING.md }}>
//           <Skeleton width="100%" height={350} radius={RADIUS.xxl} />
//           <Skeleton width="60%" height={20} style={{ marginTop: SPACING.md }} />
//           <Skeleton width="100%" height={40} style={{ marginTop: SPACING.sm }} />
//           <Skeleton width="100%" height={120} style={{ marginTop: SPACING.md }} />
//         </View>
//       </View>
//     );
//   }

//   if (!product) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <Text>Product not found</Text>
//         <Button onPress={() => router.back()} style={{ marginTop: SPACING.md }}>Go Back</Button>
//       </View>
//     );
//   }

//   const isWishlisted = has(product.id);
//   const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => {
//     const count = product.reviews.filter(r => Math.round(r.rating) === stars).length;
//     const pct = product.reviews.length > 0 ? (count / product.reviews.length) * 100 : 0;
//     return { stars, count, pct };
//   });

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
//         {/* Image Gallery */}
//         <View style={styles.galleryWrap}>
//           <FlatList
//             data={product.images}
//             horizontal
//             pagingEnabled
//             showsHorizontalScrollIndicator={false}
//             onScroll={(e) => setActiveImage(Math.round(e.nativeEvent.contentOffset.x / (width)))}
//             scrollEventThrottle={16}
//             keyExtractor={(_, i) => i.toString()}
//             renderItem={({ item }) => (
//               <Image source={{ uri: item }} style={styles.galleryImage} resizeMode="cover" />
//             )}
//           />
//           <View style={styles.galleryDots}>
//             {product.images.map((_, i) => (
//               <View key={i} style={[styles.galleryDot, i === activeImage && styles.galleryDotActive]} />
//             ))}
//           </View>
//         </View>

//         {/* Header Actions */}
//         <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
//           <TouchableOpacity style={styles.floatBtn} onPress={() => router.back()}>
//             <ArrowLeft color={COLORS.neutral[800]} size={22} />
//           </TouchableOpacity>
//           <View style={styles.floatBtnRow}>
//             <TouchableOpacity style={styles.floatBtn} onPress={handleShare}>
//               <Share2 color={COLORS.neutral[800]} size={20} />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.floatBtn} onPress={() => { toggle(product.id); show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info'); }}>
//               <Heart color={isWishlisted ? COLORS.error : COLORS.neutral[800]} size={20} fill={isWishlisted ? COLORS.error : 'transparent'} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Product Info */}
//         <View style={styles.infoSection}>
//           <View style={styles.categoryRow}>
//             <Text style={styles.categoryText}>{product.categoryName}</Text>
//             {product.isBestSeller && <View style={styles.bestBadge}><Text style={styles.bestText}>BESTSELLER</Text></View>}
//           </View>
//           <Text style={styles.productName}>{product.name}</Text>
//           <View style={styles.ratingRow}>
//             <RatingBadge rating={product.rating} />
//             <Text style={styles.reviewCount}>{product.reviewCount} reviews</Text>
//             {product.inStock ? (
//               <View style={styles.stockBadge}><View style={styles.stockDot} /><Text style={styles.stockText}>In Stock</Text></View>
//             ) : (
//               <View style={[styles.stockBadge, { backgroundColor: COLORS.error + '20' }]}><Text style={[styles.stockText, { color: COLORS.error }]}>Out of Stock</Text></View>
//             )}
//           </View>

//           <View style={styles.priceRow}>
//             <Text style={styles.price}>₹{product.price.toLocaleString('en-IN')}</Text>
//             {product.originalPrice > product.price && (
//               <>
//                 <Text style={styles.originalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</Text>
//                 <View style={styles.discountBadge}><Text style={styles.discountText}>{product.discount}% OFF</Text></View>
//               </>
//             )}
//           </View>

//           {/* Colors */}
//           <View style={styles.colorSection}>
//             <Text style={styles.colorLabel}>Available Colors</Text>
//             <View style={styles.colorRow}>
//               {product.colors.map((c, i) => (
//                 <TouchableOpacity
//                   key={i}
//                   style={[styles.colorDot, { backgroundColor: c }, selectedColor === i && styles.colorDotActive]}
//                   onPress={() => setSelectedColor(i)}
//                 >
//                   {selectedColor === i && <Check color={c === '#FFFFFF' ? COLORS.neutral[900] : COLORS.white} size={16} />}
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>

//           {/* Quantity */}
//           <View style={styles.qtySection}>
//             <Text style={styles.qtyLabel}>Quantity</Text>
//             <View style={styles.qtyControl}>
//               <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(Math.max(1, qty - 1))}>
//                 <Minus color={COLORS.neutral[700]} size={18} />
//               </TouchableOpacity>
//               <Text style={styles.qtyValue}>{qty}</Text>
//               <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(qty + 1)}>
//                 <Plus color={COLORS.neutral[700]} size={18} />
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Tabs */}
//           <View style={styles.tabsRow}>
//             {([
//               { key: 'description', label: 'Description' },
//               { key: 'specs', label: 'Specs' },
//               { key: 'reviews', label: 'Reviews' },
//               { key: 'faq', label: 'FAQ' },
//             ] as const).map((t) => (
//               <TouchableOpacity
//                 key={t.key}
//                 style={[styles.tab, activeTab === t.key && styles.tabActive]}
//                 onPress={() => setActiveTab(t.key)}
//               >
//                 <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>{t.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* Tab Content */}
//           {activeTab === 'description' && (
//             <View style={styles.tabContent}>
//               <Text style={styles.descriptionText}>{product.description}</Text>
//               <Text style={styles.featuresTitle}>Key Features</Text>
//               {product.features.map((f, i) => (
//                 <View key={i} style={styles.featureRow}>
//                   <View style={styles.featureDot} />
//                   <Text style={styles.featureText}>{f}</Text>
//                 </View>
//               ))}
//             </View>
//           )}

//           {activeTab === 'specs' && (
//             <View style={styles.tabContent}>
//               {product.specifications.map((s, i) => (
//                 <View key={i} style={styles.specRow}>
//                   <Text style={styles.specLabel}>{s.label}</Text>
//                   <Text style={styles.specValue}>{s.value}</Text>
//                 </View>
//               ))}
//             </View>
//           )}

//           {activeTab === 'reviews' && (
//             <View style={styles.tabContent}>
//               <View style={styles.ratingSummary}>
//                 <View style={styles.ratingBig}>
//                   <Text style={styles.ratingBigValue}>{product.rating.toFixed(1)}</Text>
//                   <View style={styles.ratingStars}>
//                     {[1,2,3,4,5].map(s => <Star key={s} size={14} color={COLORS.gold[400]} fill={s <= Math.round(product.rating) ? COLORS.gold[400] : 'transparent'} />)}
//                   </View>
//                   <Text style={styles.ratingCount}>{product.reviewCount} reviews</Text>
//                 </View>
//                 <View style={styles.ratingBreakdown}>
//                   {ratingBreakdown.map((r) => (
//                     <View key={r.stars} style={styles.breakdownRow}>
//                       <Text style={styles.breakdownLabel}>{r.stars}★</Text>
//                       <View style={styles.breakdownBar}>
//                         <View style={[styles.breakdownFill, { width: `${r.pct}%` }]} />
//                       </View>
//                       <Text style={styles.breakdownCount}>{r.count}</Text>
//                     </View>
//                   ))}
//                 </View>
//               </View>
//               {product.reviews.map((review) => (
//                 <View key={review.id} style={styles.reviewCard}>
//                   <Image source={{ uri: review.userAvatar }} style={styles.reviewAvatar} />
//                   <View style={styles.reviewBody}>
//                     <View style={styles.reviewHeader}>
//                       <Text style={styles.reviewName}>{review.userName}</Text>
//                       <View style={styles.reviewStars}>
//                         {[1,2,3,4,5].map(s => <Star key={s} size={11} color={COLORS.gold[400]} fill={s <= review.rating ? COLORS.gold[400] : 'transparent'} />)}
//                       </View>
//                     </View>
//                     <Text style={styles.reviewComment}>{review.comment}</Text>
//                     <Text style={styles.reviewDate}>{review.date}</Text>
//                   </View>
//                 </View>
//               ))}
//             </View>
//           )}

//           {activeTab === 'faq' && (
//             <View style={styles.tabContent}>
//               {[
//                 { q: 'Is installation included?', a: 'Yes, professional installation is included with all our products.' },
//                 { q: 'What is the rental period?', a: 'Standard rental period is 1-3 days. Extended periods available on request.' },
//                 { q: 'Do you provide delivery?', a: 'Yes, free delivery for orders above ₹50,000 within the city.' },
//                 { q: 'Can I customize the decoration?', a: 'Absolutely! We offer full customization to match your event theme.' },
//               ].map((f, i) => (
//                 <View key={i} style={styles.faqItem}>
//                   <Text style={styles.faqQ}>{f.q}</Text>
//                   <Text style={styles.faqA}>{f.a}</Text>
//                 </View>
//               ))}
//             </View>
//           )}

//           {/* Delivery Info */}
//           <View style={styles.deliveryCard}>
//             <View style={styles.deliveryRow}>
//               <Truck color={COLORS.primary[600]} size={20} />
//               <View>
//                 <Text style={styles.deliveryTitle}>Free Delivery</Text>
//                 <Text style={styles.deliveryDesc}>On orders above ₹50,000</Text>
//               </View>
//             </View>
//             <View style={styles.deliveryRow}>
//               <Shield color={COLORS.primary[600]} size={20} />
//               <View>
//                 <Text style={styles.deliveryTitle}>Quality Assured</Text>
//                 <Text style={styles.deliveryDesc}>Premium materials guaranteed</Text>
//               </View>
//             </View>
//             <View style={styles.deliveryRow}>
//               <RotateCcw color={COLORS.primary[600]} size={20} />
//               <View>
//                 <Text style={styles.deliveryTitle}>Flexible Booking</Text>
//                 <Text style={styles.deliveryDesc}>Reschedule anytime before event</Text>
//               </View>
//             </View>
//           </View>

//           {/* Related Products */}
//           {related.length > 0 && (
//             <View style={styles.relatedSection}>
//               <Text style={styles.relatedTitle}>You May Also Like</Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//                 {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} horizontal />)}
//               </ScrollView>
//             </View>
//           )}
//         </View>
//       </ScrollView>

//       {/* Bottom Actions */}
//       <View style={styles.bottomBar}>
//         <TouchableOpacity style={styles.wishAction} onPress={() => { toggle(product.id); show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info'); }}>
//           <Heart color={isWishlisted ? COLORS.error : COLORS.neutral[600]} size={22} fill={isWishlisted ? COLORS.error : 'transparent'} />
//         </TouchableOpacity>
//         <Button onPress={handleAddCart} variant="outline" size="lg" style={{ flex: 1 }}>
//           <ShoppingBag size={18} color={COLORS.primary[700]} /> Add to Cart
//         </Button>
//         <Button onPress={handleBuyNow} variant="gold" size="lg" style={{ flex: 1 }}>Buy Now</Button>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.offWhite },
//   galleryWrap: { width: width, height: 350, position: 'relative' },
//   galleryImage: { width, height: 350 },
//   galleryDots: { position: 'absolute', bottom: 16, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
//   galleryDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
//   galleryDotActive: { width: 24, backgroundColor: COLORS.white },
//   floatingHeader: { position: 'absolute', left: SPACING.md, right: SPACING.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
//   floatBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
//   floatBtnRow: { flexDirection: 'row', gap: 8 },
//   infoSection: { backgroundColor: COLORS.white, marginTop: -20, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, padding: SPACING.lg },
//   categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   categoryText: { fontSize: 12, fontFamily: 'Inter-Medium', color: COLORS.neutral[500], textTransform: 'uppercase', letterSpacing: 1 },
//   bestBadge: { backgroundColor: COLORS.gold[400], paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.sm },
//   bestText: { fontSize: 9, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   productName: { fontSize: 22, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], marginTop: 6, lineHeight: 28 },
//   ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: SPACING.sm },
//   reviewCount: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
//   stockBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.success + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.sm, marginLeft: 'auto' },
//   stockDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
//   stockText: { fontSize: 11, fontFamily: 'Inter-SemiBold', color: COLORS.success },
//   priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: SPACING.md },
//   price: { fontSize: 26, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   originalPrice: { fontSize: 16, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], textDecorationLine: 'line-through' },
//   discountBadge: { backgroundColor: COLORS.error + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.sm },
//   discountText: { fontSize: 12, fontFamily: 'Inter-Bold', color: COLORS.error },
//   colorSection: { marginTop: SPACING.lg },
//   colorLabel: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[800], marginBottom: SPACING.sm },
//   colorRow: { flexDirection: 'row', gap: 10 },
//   colorDot: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: COLORS.neutral[200], justifyContent: 'center', alignItems: 'center' },
//   colorDotActive: { borderColor: COLORS.primary[600], borderWidth: 3 },
//   qtySection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: SPACING.lg },
//   qtyLabel: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[800] },
//   qtyControl: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: COLORS.neutral[100], borderRadius: RADIUS.lg, paddingHorizontal: 4 },
//   qtyBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
//   qtyValue: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   tabsRow: { flexDirection: 'row', marginTop: SPACING.xl, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[200] },
//   tab: { flex: 1, paddingVertical: SPACING.sm, alignItems: 'center' },
//   tabActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary[700] },
//   tabText: { fontSize: 13, fontFamily: 'Inter-Medium', color: COLORS.neutral[500] },
//   tabTextActive: { color: COLORS.primary[700], fontFamily: 'Inter-SemiBold' },
//   tabContent: { marginTop: SPACING.md },
//   descriptionText: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], lineHeight: 22 },
//   featuresTitle: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900], marginTop: SPACING.md, marginBottom: SPACING.sm },
//   featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
//   featureDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.gold[400] },
//   featureText: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[700] },
//   specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
//   specLabel: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
//   specValue: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   ratingSummary: { flexDirection: 'row', gap: SPACING.lg, marginBottom: SPACING.lg, padding: SPACING.md, backgroundColor: COLORS.neutral[50], borderRadius: RADIUS.lg },
//   ratingBig: { alignItems: 'center' },
//   ratingBigValue: { fontSize: 36, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   ratingStars: { flexDirection: 'row', gap: 2, marginTop: 4 },
//   ratingCount: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 4 },
//   ratingBreakdown: { flex: 1, gap: 4 },
//   breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   breakdownLabel: { fontSize: 12, fontFamily: 'Inter-Medium', color: COLORS.neutral[600], width: 28 },
//   breakdownBar: { flex: 1, height: 6, borderRadius: 3, backgroundColor: COLORS.neutral[200] },
//   breakdownFill: { height: '100%', borderRadius: 3, backgroundColor: COLORS.gold[400] },
//   breakdownCount: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], width: 20 },
//   reviewCard: { flexDirection: 'row', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
//   reviewAvatar: { width: 40, height: 40, borderRadius: 20 },
//   reviewBody: { flex: 1, marginLeft: SPACING.md },
//   reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   reviewName: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   reviewStars: { flexDirection: 'row', gap: 1 },
//   reviewComment: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginTop: 4, lineHeight: 18 },
//   reviewDate: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], marginTop: 4 },
//   faqItem: { paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
//   faqQ: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   faqA: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginTop: 4, lineHeight: 18 },
//   deliveryCard: { marginTop: SPACING.lg, backgroundColor: COLORS.primary[50], borderRadius: RADIUS.xl, padding: SPACING.md, gap: SPACING.md },
//   deliveryRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   deliveryTitle: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   deliveryDesc: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
//   relatedSection: { marginTop: SPACING.xl },
//   relatedTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
//   bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.white, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, paddingBottom: 30, borderTopWidth: 1, borderTopColor: COLORS.neutral[100], ...SHADOWS.large },
//   wishAction: { width: 52, height: 52, borderRadius: RADIUS.lg, backgroundColor: COLORS.neutral[100], justifyContent: 'center', alignItems: 'center' },
// });






// app/product/[id].tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ArrowLeft, Heart, Share2, ShoppingBag, Star, Truck, Shield, RotateCcw, ChevronRight, Minus, Plus, Check } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { mockApi } from '@/services/api';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { RatingBadge } from '@/components/ui/RatingBadge';
import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { useWishlist } from '@/store/wishlist';
import { useCart } from '@/store/cart';
import { useToast } from '@/store/toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { has, toggle } = useWishlist();
  const { addItem } = useCart();
  const { show } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'faq'>('description');

  const load = useCallback(async () => {
    const p = await mockApi.getProduct(id);
    setProduct(p || null);
    if (p) {
      const rels = (await Promise.all(p.relatedIds.map((rid) => mockApi.getProduct(rid)))).filter(Boolean) as Product[];
      setRelated(rels);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleAddCart = () => {
    if (!product) return;
    addItem({
      id: `${product.id}_${Date.now()}`,
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: qty,
      type: 'product',
    });
    show('Added to cart');
  };

  const handleBuyNow = () => {
    handleAddCart();
    router.push('/checkout');
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: `Check out ${product?.name} on Super Tent House!` });
    } catch {}
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={{ padding: SPACING.md }}>
          <Skeleton width="100%" height={350} radius={RADIUS.xxl} />
          <Skeleton width="60%" height={20} style={{ marginTop: SPACING.md }} />
          <Skeleton width="100%" height={40} style={{ marginTop: SPACING.sm }} />
          <Skeleton width="100%" height={120} style={{ marginTop: SPACING.md }} />
        </View>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Product not found</Text>
        <Button onPress={() => router.back()} style={{ marginTop: SPACING.md }}>Go Back</Button>
      </View>
    );
  }

  const isWishlisted = has(product.id);
  
  // Safely get reviews array
  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  
  const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => Math.round(r.rating) === stars).length;
    const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { stars, count, pct };
  });

  // Safely get features array
  const features = Array.isArray(product.features) ? product.features : [];
  
  // Safely get colors array
  const colors = Array.isArray(product.colors) ? product.colors : ['#6C63FF'];
  
  // Safely get specifications - handle both array and object
  const getSpecsArray = () => {
    const specs = product.specifications;
    if (!specs) return [];
    
    if (Array.isArray(specs)) {
      return specs;
    }
    
    if (typeof specs === 'object') {
      return Object.entries(specs).map(([key, value]) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: String(value)
      }));
    }
    
    return [];
  };
  
  const specifications = getSpecsArray();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Image Gallery */}
        <View style={styles.galleryWrap}>
          <FlatList
            data={product.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => setActiveImage(Math.round(e.nativeEvent.contentOffset.x / (width)))}
            scrollEventThrottle={16}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.galleryImage} resizeMode="cover" />
            )}
          />
          <View style={styles.galleryDots}>
            {product.images.map((_, i) => (
              <View key={i} style={[styles.galleryDot, i === activeImage && styles.galleryDotActive]} />
            ))}
          </View>
        </View>

        {/* Header Actions */}
        <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
          <TouchableOpacity style={styles.floatBtn} onPress={() => router.back()}>
            <ArrowLeft color={COLORS.neutral[800]} size={22} />
          </TouchableOpacity>
          <View style={styles.floatBtnRow}>
            <TouchableOpacity style={styles.floatBtn} onPress={handleShare}>
              <Share2 color={COLORS.neutral[800]} size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatBtn} onPress={() => { toggle(product.id); show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info'); }}>
              <Heart color={isWishlisted ? COLORS.error : COLORS.neutral[800]} size={20} fill={isWishlisted ? COLORS.error : 'transparent'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          <View style={styles.categoryRow}>
            <Text style={styles.categoryText}>{product.categoryName}</Text>
            {product.isBestSeller && <View style={styles.bestBadge}><Text style={styles.bestText}>BESTSELLER</Text></View>}
          </View>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.ratingRow}>
            <RatingBadge rating={product.rating} />
            <Text style={styles.reviewCount}>{product.reviewCount} reviews</Text>
            {product.inStock ? (
              <View style={styles.stockBadge}><View style={styles.stockDot} /><Text style={styles.stockText}>In Stock</Text></View>
            ) : (
              <View style={[styles.stockBadge, { backgroundColor: COLORS.error + '20' }]}><Text style={[styles.stockText, { color: COLORS.error }]}>Out of Stock</Text></View>
            )}
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{product.price.toLocaleString('en-IN')}</Text>
            {product.originalPrice > product.price && (
              <>
                <Text style={styles.originalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</Text>
                <View style={styles.discountBadge}><Text style={styles.discountText}>{product.discount}% OFF</Text></View>
              </>
            )}
          </View>

          {/* Colors */}
          {colors.length > 0 && (
            <View style={styles.colorSection}>
              <Text style={styles.colorLabel}>Available Colors</Text>
              <View style={styles.colorRow}>
                {colors.map((c, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.colorDot, { backgroundColor: c }, selectedColor === i && styles.colorDotActive]}
                    onPress={() => setSelectedColor(i)}
                  >
                    {selectedColor === i && <Check color={c === '#FFFFFF' ? COLORS.neutral[900] : COLORS.white} size={16} />}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Quantity */}
          <View style={styles.qtySection}>
            <Text style={styles.qtyLabel}>Quantity</Text>
            <View style={styles.qtyControl}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(Math.max(1, qty - 1))}>
                <Minus color={COLORS.neutral[700]} size={18} />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{qty}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(qty + 1)}>
                <Plus color={COLORS.neutral[700]} size={18} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsRow}>
            {([
              { key: 'description', label: 'Description' },
              { key: 'specs', label: 'Specs' },
              { key: 'reviews', label: 'Reviews' },
              { key: 'faq', label: 'FAQ' },
            ] as const).map((t) => (
              <TouchableOpacity
                key={t.key}
                style={[styles.tab, activeTab === t.key && styles.tabActive]}
                onPress={() => setActiveTab(t.key)}
              >
                <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {activeTab === 'description' && (
            <View style={styles.tabContent}>
              <Text style={styles.descriptionText}>{product.description}</Text>
              {features.length > 0 && (
                <>
                  <Text style={styles.featuresTitle}>Key Features</Text>
                  {features.map((f, i) => (
                    <View key={i} style={styles.featureRow}>
                      <View style={styles.featureDot} />
                      <Text style={styles.featureText}>{f}</Text>
                    </View>
                  ))}
                </>
              )}
            </View>
          )}

          {activeTab === 'specs' && (
            <View style={styles.tabContent}>
              {specifications.length > 0 ? (
                specifications.map((s, i) => (
                  <View key={i} style={styles.specRow}>
                    <Text style={styles.specLabel}>{s.label}</Text>
                    <Text style={styles.specValue}>{s.value}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noDataText}>No specifications available</Text>
              )}
            </View>
          )}

          {activeTab === 'reviews' && (
            <View style={styles.tabContent}>
              <View style={styles.ratingSummary}>
                <View style={styles.ratingBig}>
                  <Text style={styles.ratingBigValue}>{product.rating.toFixed(1)}</Text>
                  <View style={styles.ratingStars}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={14} color={COLORS.gold[400]} fill={s <= Math.round(product.rating) ? COLORS.gold[400] : 'transparent'} />)}
                  </View>
                  <Text style={styles.ratingCount}>{product.reviewCount} reviews</Text>
                </View>
                <View style={styles.ratingBreakdown}>
                  {ratingBreakdown.map((r) => (
                    <View key={r.stars} style={styles.breakdownRow}>
                      <Text style={styles.breakdownLabel}>{r.stars}★</Text>
                      <View style={styles.breakdownBar}>
                        <View style={[styles.breakdownFill, { width: `${r.pct}%` }]} />
                      </View>
                      <Text style={styles.breakdownCount}>{r.count}</Text>
                    </View>
                  ))}
                </View>
              </View>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <View key={review.id} style={styles.reviewCard}>
                    <Image source={{ uri: review.userAvatar }} style={styles.reviewAvatar} />
                    <View style={styles.reviewBody}>
                      <View style={styles.reviewHeader}>
                        <Text style={styles.reviewName}>{review.userName}</Text>
                        <View style={styles.reviewStars}>
                          {[1,2,3,4,5].map(s => <Star key={s} size={11} color={COLORS.gold[400]} fill={s <= review.rating ? COLORS.gold[400] : 'transparent'} />)}
                        </View>
                      </View>
                      <Text style={styles.reviewComment}>{review.comment}</Text>
                      <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noDataText}>No reviews yet</Text>
              )}
            </View>
          )}

          {activeTab === 'faq' && (
            <View style={styles.tabContent}>
              {[
                { q: 'Is installation included?', a: 'Yes, professional installation is included with all our products.' },
                { q: 'What is the rental period?', a: 'Standard rental period is 1-3 days. Extended periods available on request.' },
                { q: 'Do you provide delivery?', a: 'Yes, free delivery for orders above ₹50,000 within the city.' },
                { q: 'Can I customize the decoration?', a: 'Absolutely! We offer full customization to match your event theme.' },
              ].map((f, i) => (
                <View key={i} style={styles.faqItem}>
                  <Text style={styles.faqQ}>{f.q}</Text>
                  <Text style={styles.faqA}>{f.a}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Delivery Info */}
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryRow}>
              <Truck color={COLORS.primary[600]} size={20} />
              <View>
                <Text style={styles.deliveryTitle}>Free Delivery</Text>
                <Text style={styles.deliveryDesc}>On orders above ₹50,000</Text>
              </View>
            </View>
            <View style={styles.deliveryRow}>
              <Shield color={COLORS.primary[600]} size={20} />
              <View>
                <Text style={styles.deliveryTitle}>Quality Assured</Text>
                <Text style={styles.deliveryDesc}>Premium materials guaranteed</Text>
              </View>
            </View>
            <View style={styles.deliveryRow}>
              <RotateCcw color={COLORS.primary[600]} size={20} />
              <View>
                <Text style={styles.deliveryTitle}>Flexible Booking</Text>
                <Text style={styles.deliveryDesc}>Reschedule anytime before event</Text>
              </View>
            </View>
          </View>

          {/* Related Products */}
          {related.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.relatedTitle}>You May Also Like</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
                {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} horizontal />)}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.wishAction} onPress={() => { toggle(product.id); show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info'); }}>
          <Heart color={isWishlisted ? COLORS.error : COLORS.neutral[600]} size={22} fill={isWishlisted ? COLORS.error : 'transparent'} />
        </TouchableOpacity>
        <Button onPress={handleAddCart} variant="outline" size="lg" style={{ flex: 1 }}>
          <ShoppingBag size={18} color={COLORS.primary[700]} /> Add to Cart
        </Button>
        <Button onPress={handleBuyNow} variant="gold" size="lg" style={{ flex: 1 }}>Buy Now</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  galleryWrap: { width: width, height: 350, position: 'relative' },
  galleryImage: { width, height: 350 },
  galleryDots: { position: 'absolute', bottom: 16, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  galleryDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  galleryDotActive: { width: 24, backgroundColor: COLORS.white },
  floatingHeader: { position: 'absolute', left: SPACING.md, right: SPACING.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
  floatBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
  floatBtnRow: { flexDirection: 'row', gap: 8 },
  infoSection: { backgroundColor: COLORS.white, marginTop: -20, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, padding: SPACING.lg },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  categoryText: { fontSize: 12, fontFamily: 'Inter-Medium', color: COLORS.neutral[500], textTransform: 'uppercase', letterSpacing: 1 },
  bestBadge: { backgroundColor: COLORS.gold[400], paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.sm },
  bestText: { fontSize: 9, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  productName: { fontSize: 22, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], marginTop: 6, lineHeight: 28 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: SPACING.sm },
  reviewCount: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
  stockBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.success + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.sm, marginLeft: 'auto' },
  stockDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
  stockText: { fontSize: 11, fontFamily: 'Inter-SemiBold', color: COLORS.success },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: SPACING.md },
  price: { fontSize: 26, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  originalPrice: { fontSize: 16, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], textDecorationLine: 'line-through' },
  discountBadge: { backgroundColor: COLORS.error + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.sm },
  discountText: { fontSize: 12, fontFamily: 'Inter-Bold', color: COLORS.error },
  colorSection: { marginTop: SPACING.lg },
  colorLabel: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[800], marginBottom: SPACING.sm },
  colorRow: { flexDirection: 'row', gap: 10 },
  colorDot: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: COLORS.neutral[200], justifyContent: 'center', alignItems: 'center' },
  colorDotActive: { borderColor: COLORS.primary[600], borderWidth: 3 },
  qtySection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: SPACING.lg },
  qtyLabel: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[800] },
  qtyControl: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: COLORS.neutral[100], borderRadius: RADIUS.lg, paddingHorizontal: 4 },
  qtyBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  qtyValue: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  tabsRow: { flexDirection: 'row', marginTop: SPACING.xl, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[200] },
  tab: { flex: 1, paddingVertical: SPACING.sm, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary[700] },
  tabText: { fontSize: 13, fontFamily: 'Inter-Medium', color: COLORS.neutral[500] },
  tabTextActive: { color: COLORS.primary[700], fontFamily: 'Inter-SemiBold' },
  tabContent: { marginTop: SPACING.md },
  descriptionText: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], lineHeight: 22 },
  featuresTitle: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900], marginTop: SPACING.md, marginBottom: SPACING.sm },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  featureDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.gold[400] },
  featureText: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[700] },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
  specLabel: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
  specValue: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  noDataText: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], textAlign: 'center', paddingVertical: SPACING.lg },
  ratingSummary: { flexDirection: 'row', gap: SPACING.lg, marginBottom: SPACING.lg, padding: SPACING.md, backgroundColor: COLORS.neutral[50], borderRadius: RADIUS.lg },
  ratingBig: { alignItems: 'center' },
  ratingBigValue: { fontSize: 36, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  ratingStars: { flexDirection: 'row', gap: 2, marginTop: 4 },
  ratingCount: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 4 },
  ratingBreakdown: { flex: 1, gap: 4 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  breakdownLabel: { fontSize: 12, fontFamily: 'Inter-Medium', color: COLORS.neutral[600], width: 28 },
  breakdownBar: { flex: 1, height: 6, borderRadius: 3, backgroundColor: COLORS.neutral[200] },
  breakdownFill: { height: '100%', borderRadius: 3, backgroundColor: COLORS.gold[400] },
  breakdownCount: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], width: 20 },
  reviewCard: { flexDirection: 'row', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
  reviewAvatar: { width: 40, height: 40, borderRadius: 20 },
  reviewBody: { flex: 1, marginLeft: SPACING.md },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewName: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  reviewStars: { flexDirection: 'row', gap: 1 },
  reviewComment: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginTop: 4, lineHeight: 18 },
  reviewDate: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], marginTop: 4 },
  faqItem: { paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
  faqQ: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  faqA: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginTop: 4, lineHeight: 18 },
  deliveryCard: { marginTop: SPACING.lg, backgroundColor: COLORS.primary[50], borderRadius: RADIUS.xl, padding: SPACING.md, gap: SPACING.md },
  deliveryRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  deliveryTitle: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  deliveryDesc: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
  relatedSection: { marginTop: SPACING.xl },
  relatedTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.white, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, paddingBottom: 30, borderTopWidth: 1, borderTopColor: COLORS.neutral[100], ...SHADOWS.large },
  wishAction: { width: 52, height: 52, borderRadius: RADIUS.lg, backgroundColor: COLORS.neutral[100], justifyContent: 'center', alignItems: 'center' },
});