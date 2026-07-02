
// app/package/[id].tsx
import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check, Users, ShoppingBag, Star, Plus, Minus, Crown, Sparkles, Music, Camera, Flower2, Mic, Palette, Utensils, PartyPopper, Heart } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { mockApi } from '@/services/api';
import { Package, AddOn } from '@/types';
import { useCart } from '@/store/cart';
import { useToast } from '@/store/toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useWishlist } from '@/store/wishlist';

const { width } = Dimensions.get('window');

const iconMap: Record<string, any> = {
  '📸': Camera,
  '🎵': Music,
  '🌸': Flower2,
  '💡': Sparkles,
  '✈️': Camera,
  '🎸': Mic,
  '🍽️': Utensils,
  '📷': Camera,
  '🎨': Palette,
  '🎪': PartyPopper,
  '👑': Crown,
};

export default function PackageDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();
  const { show } = useToast();
  const { state, toggle, has } = useWishlist();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const [pkgData, addonsData] = await Promise.all([
          mockApi.getPackage(id),
          mockApi.getAddOns()
        ]);
        setPkg(pkgData || null);
        setAddOns(addonsData || []);
      } catch (error) {
        console.error('Error loading package:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns((prev) => 
      prev.includes(addOnId) 
        ? prev.filter(a => a !== addOnId) 
        : [...prev, addOnId]
    );
  };

  const addOnTotal = useMemo(() => {
    return addOns
      .filter(a => selectedAddOns.includes(a.id))
      .reduce((sum, a) => sum + a.price, 0);
  }, [addOns, selectedAddOns]);

  const grandTotal = ((pkg?.price || 0) + addOnTotal) * quantity;

  const handleAddToCart = () => {
    if (!pkg) return;
    addItem({
      id: `${pkg.id}_${Date.now()}`,
      productId: pkg.id,
      packageId: pkg.id,
      name: pkg.name,
      image: pkg.image,
      price: grandTotal,
      quantity: quantity,
      type: 'package',
    });
    show('Package added to cart 🎉');
  };

  const handleBookNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const handleWishlistToggle = () => {
    if (!pkg) return;
    const isWishlisted = has(pkg.id);
    toggle(pkg.id);
    show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.gold[400]} />
        <Text style={{ marginTop: 16, color: COLORS.neutral[500], fontFamily: 'Inter-Regular' }}>Loading package...</Text>
      </View>
    );
  }

  if (!pkg) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 16, color: COLORS.neutral[600], fontFamily: 'Inter-Regular' }}>Package not found</Text>
        <TouchableOpacity 
          onPress={handleGoBack} 
          style={{ marginTop: 20, backgroundColor: COLORS.primary[600], paddingHorizontal: 24, paddingVertical: 12, borderRadius: RADIUS.lg }}
        >
          <Text style={{ color: '#FFFFFF', fontFamily: 'Inter-SemiBold', fontSize: 14 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images = pkg.images && pkg.images.length > 0 ? pkg.images : [pkg.image];
  const isWishlisted = has(pkg.id);

  const getTierColors = () => {
    switch(pkg.tier) {
      case 'Platinum':
        return { bg: ['#1a1a2e', '#16213e'] as const, text: '#FFD700', badge: '#FFD700' };
      case 'Gold':
        return { bg: ['#4a3728', '#2d1f14'] as const, text: '#D4A82E', badge: '#D4A82E' };
      case 'Premium':
        return { bg: ['#1a3a5c', '#0d2137'] as const, text: '#4FC3F7', badge: '#4FC3F7' };
      case 'Luxury':
        return { bg: ['#2d1b3d', '#1a0f2e'] as const, text: '#CE93D8', badge: '#CE93D8' };
      default:
        return { bg: ['#1a3a5c', '#0d2137'] as const, text: '#64B5F6', badge: '#64B5F6' };
    }
  };

  const tierColors = getTierColors();

  const renderStars = () => {
    const stars = [];
    const rating = pkg.rating || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <View key={i}>
            <Star size={16} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
          </View>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <View key={i}>
            <Star size={16} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
          </View>
        );
      } else {
        stars.push(
          <View key={i}>
            <Star size={16} color={COLORS.gold[200]} />
          </View>
        );
      }
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 120 }}
        bounces={true}
      >
        {/* Image Gallery */}
        <View style={styles.imageWrap}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => setActiveImage(Math.round(e.nativeEvent.contentOffset.x / width))}
            scrollEventThrottle={16}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
            )}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.6)']}
            style={styles.imageGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          {images.length > 1 && (
            <View style={styles.imageDots}>
              {images.map((_, i) => (
                <View 
                  key={i} 
                  style={[
                    styles.imageDot, 
                    i === activeImage && styles.imageDotActive
                  ]} 
                />
              ))}
            </View>
          )}
          <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
            <TouchableOpacity 
              style={styles.floatBtn} 
              onPress={handleGoBack}
              activeOpacity={0.7}
            >
              <ArrowLeft color={COLORS.neutral[800]} size={22} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.floatBtn} 
              onPress={handleWishlistToggle}
              activeOpacity={0.7}
            >
              <Heart 
                color={isWishlisted ? COLORS.error : COLORS.neutral[800]} 
                size={22} 
                fill={isWishlisted ? COLORS.error : 'transparent'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Tier Badge */}
          <View style={[styles.tierBadgeContainer]}>
            <LinearGradient
              colors={tierColors.bg}
              style={styles.tierBadge}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Crown size={14} color={tierColors.badge} />
              <Text style={[styles.tierText, { color: tierColors.text }]}>
                {String(pkg.tier).toUpperCase()}
              </Text>
            </LinearGradient>
          </View>
          
          <Text style={styles.name}>{String(pkg.name)}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.ratingContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                {renderStars()}
              </View>
              <Text style={styles.ratingText}>
                {String((pkg.rating || 0).toFixed(1))}
              </Text>
            </View>
            <View style={styles.dotSeparator} />
            <Text style={styles.reviewCount}>{String(pkg.reviewCount || 0)} reviews</Text>
            <View style={styles.dotSeparator} />
            <View style={styles.guestBadge}>
              <Users color={COLORS.primary[500]} size={14} />
              <Text style={styles.guestText}>Up to {String(pkg.guestCapacity || 0)} guests</Text>
            </View>
          </View>

          <Text style={styles.description}>{String(pkg.description || '')}</Text>

          {/* Price */}
          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <View>
                <Text style={styles.priceLabel}>Price</Text>
                <Text style={styles.price}>₹{String((pkg.price || 0).toLocaleString('en-IN'))}</Text>
              </View>
              {(pkg.originalPrice || 0) > (pkg.price || 0) && (
                <View style={styles.discountContainer}>
                  <Text style={styles.originalPrice}>₹{String((pkg.originalPrice || 0).toLocaleString('en-IN'))}</Text>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>SAVE {String(pkg.discount || 0)}%</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* What's Included */}
          {(pkg.includes && pkg.includes.length > 0) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>✨ What's Included</Text>
              <View style={styles.includesGrid}>
                {pkg.includes.map((inc, i) => {
                  const includeText = typeof inc === 'string' ? inc : String(inc);
                  return (
                    <View key={i} style={styles.includeItem}>
                      <View style={styles.includeCheck}>
                        <Check color="#22C55E" size={14} />
                      </View>
                      <Text style={styles.includeText}>{includeText}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Add-ons Section - With Price Badge Inside Card */}
          {addOns.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🎯 Customize Your Package</Text>
                <Text style={styles.sectionSubtitle}>Add extra services to make your event perfect</Text>
              </View>
              <View style={styles.addOnsList}>
                {addOns.map((addon) => {
                  const selected = selectedAddOns.includes(addon.id);
                  const IconComponent = iconMap[addon.icon] || Sparkles;
                  const priceText = `+₹${String((addon.price || 0).toLocaleString('en-IN'))}`;
                  
                  return (
                    <TouchableOpacity
                      key={addon.id}
                      style={[styles.addOnCard, selected && styles.addOnCardActive]}
                      onPress={() => toggleAddOn(addon.id)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.addOnIcon, selected && styles.addOnIconActive]}>
                        <IconComponent 
                          size={18} 
                          color={selected ? '#FFFFFF' : COLORS.primary[600]} 
                        />
                      </View>
                      <View style={styles.addOnBody}>
                        <View style={styles.addOnInfo}>
                          <Text style={[styles.addOnName, selected && styles.addOnNameActive]} numberOfLines={1}>
                            {String(addon.name)}
                          </Text>
                          {addon.description && (
                            <Text style={styles.addOnDescription} numberOfLines={1}>
                              {String(addon.description)}
                            </Text>
                          )}
                        </View>
                        <View style={styles.addOnRight}>
                          <View style={[styles.addOnPriceContainer, selected && styles.addOnPriceContainerActive]}>
                            <Text style={[styles.addOnPrice, selected && styles.addOnPriceActive]} numberOfLines={1}>
                              {priceText}
                            </Text>
                          </View>
                          <View style={[styles.addOnCheck, selected && styles.addOnCheckActive]}>
                            {selected ? (
                              <Check color="#FFFFFF" size={12} />
                            ) : (
                              <Plus color="#999999" size={12} />
                            )}
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Quantity Selector */}
          {/* <View style={styles.section}>
            <Text style={styles.sectionTitle}>📦 Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.quantityBtn} 
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus color={COLORS.neutral[600]} size={20} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity 
                style={styles.quantityBtn} 
                onPress={() => setQuantity(quantity + 1)}
              >
                <Plus color={COLORS.neutral[600]} size={20} />
              </TouchableOpacity>
            </View>
          </View> */}

          {/* Price Summary */}
          <View style={styles.priceSummary}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Package Price</Text>
              <Text style={styles.summaryValue}>₹{String((pkg.price || 0).toLocaleString('en-IN'))}</Text>
            </View>
            {addOnTotal > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Add-ons ({String(selectedAddOns.length)})</Text>
                <Text style={styles.summaryValue}>+₹{String(addOnTotal.toLocaleString('en-IN'))}</Text>
              </View>
            )}
            {quantity > 1 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Quantity</Text>
                <Text style={styles.summaryValue}>× {quantity}</Text>
              </View>
            )}
            <View style={styles.summaryDivider} />
            <View style={styles.summaryTotal}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{String(grandTotal.toLocaleString('en-IN'))}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.bottomPrice}>
          <Text style={styles.bottomPriceLabel}>Total</Text>
          <Text style={styles.bottomPriceValue}>₹{String(grandTotal.toLocaleString('en-IN'))}</Text>
        </View>
        <TouchableOpacity 
          onPress={handleAddToCart} 
          style={[styles.actionBtn, styles.outlineBtn]}
          activeOpacity={0.8}
        >
          <ShoppingBag size={18} color={COLORS.primary[600]} />
          <Text style={styles.outlineBtnText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleBookNow} 
          style={[styles.actionBtn, styles.goldBtn]}
          activeOpacity={0.8}
        >
          <Text style={styles.goldBtnText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  imageWrap: { 
    position: 'relative', 
    width: '100%', 
    height: 320 
  },
  image: { 
    width: width, 
    height: 320, 
    resizeMode: 'cover' 
  },
  imageGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageDots: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  imageDot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  imageDotActive: { 
    width: 24, 
    backgroundColor: '#FFFFFF' 
  },
  floatingHeader: { 
    position: 'absolute', 
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  floatBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  content: {
    backgroundColor: '#F8F9FA',
    marginTop: -20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  tierBadgeContainer: {
    marginBottom: 8,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    ...SHADOWS.small,
  },
  tierText: { 
    fontSize: 11, 
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.5,
  },
  name: { 
    fontSize: 24, 
    fontFamily: 'Inter-Bold', 
    color: '#1A1A1A', 
    lineHeight: 30,
    marginBottom: 8,
  },
  metaRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
    color: '#1A1A1A',
    marginLeft: 4,
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CCCCCC',
    marginHorizontal: 8,
  },
  reviewCount: { 
    fontSize: 13, 
    fontFamily: 'Inter-Regular',
    color: '#666666' 
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  guestText: { 
    fontSize: 12, 
    fontFamily: 'Inter-Medium',
    color: COLORS.primary[600] 
  },
  description: { 
    fontSize: 14, 
    fontFamily: 'Inter-Regular',
    color: '#555555', 
    lineHeight: 22,
    marginBottom: 16,
  },
  priceSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.small,
    marginBottom: 8,
  },
  priceRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#888888',
    marginBottom: 2,
  },
  price: { 
    fontSize: 28, 
    fontFamily: 'Inter-Bold', 
    color: '#1A1A1A' 
  },
  discountContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  originalPrice: { 
    fontSize: 14, 
    fontFamily: 'Inter-Regular',
    color: '#999999', 
    textDecorationLine: 'line-through' 
  },
  discountBadge: { 
    backgroundColor: '#FEE2E2', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 6,
  },
  discountText: { 
    fontSize: 11, 
    fontFamily: 'Inter-Bold', 
    color: '#EF4444' 
  },
  section: { 
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.small,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: { 
    fontSize: 17, 
    fontFamily: 'Inter-SemiBold', 
    color: '#1A1A1A',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#888888',
  },
  includesGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8,
    marginTop: 4,
  },
  includeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '48%',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  includeCheck: { 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    backgroundColor: '#DCFCE7', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  includeText: { 
    fontSize: 12, 
    fontFamily: 'Inter-Medium', 
    color: '#333333', 
    flex: 1 
  },
  addOnsList: {
    gap: 10,
  },
  addOnCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: '#EEEEEE',
    minHeight: 60,
    width: '100%',
  },
  addOnCardActive: {
    borderColor: COLORS.primary[500],
    backgroundColor: '#F0F7FF',
  },
  addOnIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8EDF5',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  addOnIconActive: {
    backgroundColor: COLORS.primary[500],
  },
  addOnBody: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 12,
    minWidth: 0,
    flexWrap: 'nowrap',
  },
  addOnInfo: {
    flex: 1,
    marginRight: 8,
    minWidth: 0,
    maxWidth: '55%',
  },
  addOnName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1A1A1A',
  },
  addOnNameActive: {
    color: COLORS.primary[600],
  },
  addOnDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#888888',
    marginTop: 2,
  },
  addOnRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
    marginLeft: 'auto',
  },
  addOnPriceContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    minWidth: 70,
    alignItems: 'center',
  },
  addOnPriceContainerActive: {
    borderColor: COLORS.primary[300],
    backgroundColor: '#F0F7FF',
  },
  addOnPrice: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
    color: '#1A1A1A',
  },
  addOnPriceActive: {
    color: COLORS.primary[600],
  },
  addOnCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  addOnCheckActive: {
    backgroundColor: COLORS.primary[500],
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  quantityBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1A1A1A',
    minWidth: 30,
    textAlign: 'center',
  },
  priceSummary: { 
    marginTop: 20,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.small,
  },
  summaryHeader: {
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1A1A1A',
  },
  summaryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 6,
  },
  summaryLabel: { 
    fontSize: 14, 
    fontFamily: 'Inter-Regular',
    color: '#666666' 
  },
  summaryValue: { 
    fontSize: 14, 
    fontFamily: 'Inter-Medium',
    color: '#1A1A1A' 
  },
  summaryDivider: { 
    height: 1, 
    backgroundColor: '#EEEEEE', 
    marginVertical: 8 
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  totalLabel: { 
    fontSize: 18, 
    fontFamily: 'Inter-Bold', 
    color: '#1A1A1A' 
  },
  totalValue: { 
    fontSize: 20, 
    fontFamily: 'Inter-Bold', 
    color: COLORS.primary[600] 
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    ...SHADOWS.large,
    gap: 8,
  },
  bottomPrice: {
    flexDirection: 'column',
    marginRight: 8,
  },
  bottomPriceLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#888888',
  },
  bottomPriceValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1A1A1A',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
  },
  outlineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary[500],
  },
  outlineBtnText: {
    color: COLORS.primary[600],
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  goldBtn: {
    backgroundColor: COLORS.gold[400],
    ...SHADOWS.small,
  },
  goldBtnText: {
    color: '#1A1A1A',
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
});