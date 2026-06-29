import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Phone, MessageCircle, Download, Clock, CheckCircle, Package, Truck, XCircle } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { mockApi } from '@/services/api';
import { Order, OrderStatus } from '@/types';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/store/toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const statusIcons: Record<OrderStatus, any> = {
  pending: Clock,
  confirmed: CheckCircle,
  team_assigned: Package,
  in_progress: Truck,
  completed: CheckCircle,
  cancelled: XCircle,
};

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { show } = useToast();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    mockApi.getOrders().then((orders) => {
      setOrder(orders.find((o) => o.id === id) || orders[0]);
    });
  }, [id]);

  if (!order) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color={COLORS.neutral[800]} size={24} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Order Details</Text>
          <Text style={styles.orderNum}>{order.orderNumber}</Text>
        </View>
      </View>

      {/* Status Banner */}
      <View style={styles.statusBanner}>
        <View style={styles.statusIconWrap}>
          {(() => { const Icon = statusIcons[order.status]; return <Icon color={COLORS.white} size={28} />; })()}
        </View>
        <View>
          <Text style={styles.statusTitle}>{order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}</Text>
          <Text style={styles.statusDesc}>Event on {new Date(order.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
        </View>
      </View>

      {/* Timeline */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Timeline</Text>
        <View style={styles.timeline}>
          {order.timeline.map((step, i) => {
            const Icon = statusIcons[step.status];
            return (
              <View key={i} style={styles.timelineItem}>
                <View style={[styles.timelineIcon, step.done && styles.timelineIconDone]}>
                  <Icon color={step.done ? COLORS.white : COLORS.neutral[400]} size={16} />
                </View>
                {i < order.timeline.length - 1 && <View style={[styles.timelineLine, step.done && styles.timelineLineDone]} />}
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineLabel, step.done && styles.timelineLabelDone]}>{step.label}</Text>
                  {step.date ? <Text style={styles.timelineDate}>{step.date}</Text> : <Text style={styles.timelinePending}>Pending</Text>}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Event Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Event Details</Text>
        <View style={styles.detailCard}>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Event Type</Text><Text style={styles.detailValue}>{order.eventType}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Date & Time</Text><Text style={styles.detailValue}>{order.eventDate} • {order.eventTime}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Venue</Text><Text style={styles.detailValue}>{order.venue}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Guests</Text><Text style={styles.detailValue}>{order.guestCount}</Text></View>
          {order.specialInstructions && <View style={styles.detailRow}><Text style={styles.detailLabel}>Instructions</Text><Text style={styles.detailValue}>{order.specialInstructions}</Text></View>}
        </View>
      </View>

      {/* Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items ({order.items.length})</Text>
        {order.items.map((item, i) => (
          <View key={i} style={styles.itemCard}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemBody}>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
              <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Payment Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Summary</Text>
        <View style={styles.detailCard}>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Subtotal</Text><Text style={styles.detailValue}>₹{order.subtotal.toLocaleString('en-IN')}</Text></View>
          {order.discount > 0 && <View style={styles.detailRow}><Text style={styles.detailLabel}>Discount</Text><Text style={[styles.detailValue, { color: COLORS.success }]}>-₹{order.discount.toLocaleString('en-IN')}</Text></View>}
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Delivery</Text><Text style={styles.detailValue}>{order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>GST</Text><Text style={styles.detailValue}>₹{order.gst.toLocaleString('en-IN')}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Payment Method</Text><Text style={styles.detailValue}>{order.paymentMethod}</Text></View>
          <View style={styles.totalRow}><Text style={styles.totalLabel}>Total Paid</Text><Text style={styles.totalValue}>₹{order.total.toLocaleString('en-IN')}</Text></View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => show('Invoice downloaded')}>
          <Download color={COLORS.primary[600]} size={20} />
          <Text style={styles.actionText}>Download Invoice</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/support')}>
          <Phone color={COLORS.primary[600]} size={20} />
          <Text style={styles.actionText}>Contact Support</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, gap: SPACING.sm },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
  title: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  orderNum: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
  statusBanner: { flexDirection: 'row', alignItems: 'center', gap: 16, marginHorizontal: SPACING.md, backgroundColor: COLORS.primary[800], borderRadius: RADIUS.xxl, padding: SPACING.lg, ...SHADOWS.medium },
  statusIconWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  statusTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.white },
  statusDesc: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[300], marginTop: 2 },
  section: { marginTop: SPACING.lg, paddingHorizontal: SPACING.md },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], marginBottom: SPACING.md },
  timeline: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.lg, ...SHADOWS.small },
  timelineItem: { flexDirection: 'row', alignItems: 'flex-start', minHeight: 60 },
  timelineIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.neutral[100], justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  timelineIconDone: { backgroundColor: COLORS.success },
  timelineLine: { position: 'absolute', left: 15, top: 32, width: 2, height: '100%', backgroundColor: COLORS.neutral[200] },
  timelineLineDone: { backgroundColor: COLORS.success },
  timelineContent: { flex: 1, marginLeft: 12, paddingBottom: SPACING.lg },
  timelineLabel: { fontSize: 14, fontFamily: 'Inter-Medium', color: COLORS.neutral[400] },
  timelineLabelDone: { color: COLORS.neutral[900], fontFamily: 'Inter-SemiBold' },
  timelineDate: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
  timelinePending: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], marginTop: 2, fontStyle: 'italic' },
  detailCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, ...SHADOWS.small },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
  detailLabel: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
  detailValue: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900], flex: 1, textAlign: 'right' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: SPACING.md, marginTop: 4 },
  totalLabel: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  totalValue: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
  itemCard: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.small },
  itemImage: { width: 70, height: 70, borderRadius: RADIUS.md, resizeMode: 'cover' },
  itemBody: { flex: 1, marginLeft: SPACING.md },
  itemName: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  itemQty: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 4 },
  itemPrice: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.primary[700], marginTop: 4 },
  actions: { flexDirection: 'row', gap: SPACING.md, paddingHorizontal: SPACING.md, marginTop: SPACING.lg },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.white, paddingVertical: SPACING.md, borderRadius: RADIUS.lg, ...SHADOWS.small },
  actionText: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: COLORS.primary[700] },
});
