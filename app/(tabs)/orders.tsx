import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Package, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { mockApi } from '@/services/api';
import { Order, OrderStatus } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const tabs = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function OrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await mockApi.getOrders();
    setOrders(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const filtered = orders.filter((o) => {
    if (activeTab === 'upcoming') return o.status !== 'completed' && o.status !== 'cancelled';
    if (activeTab === 'completed') return o.status === 'completed';
    return o.status === 'cancelled';
  });

  const statusConfig: Record<OrderStatus, { color: string; bg: string; label: string; icon: any }> = {
    pending: { color: COLORS.warning, bg: COLORS.warning + '20', label: 'Pending', icon: Clock },
    confirmed: { color: COLORS.primary[600], bg: COLORS.primary[100], label: 'Confirmed', icon: CheckCircle },
    team_assigned: { color: COLORS.primary[600], bg: COLORS.primary[100], label: 'Team Assigned', icon: Package },
    in_progress: { color: COLORS.gold[600], bg: COLORS.gold[50], label: 'In Progress', icon: Package },
    completed: { color: COLORS.success, bg: COLORS.success + '20', label: 'Completed', icon: CheckCircle },
    cancelled: { color: COLORS.error, bg: COLORS.error + '20', label: 'Cancelled', icon: XCircle },
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>My Orders</Text>
        <Text style={styles.subtitle}>Track and manage your bookings</Text>
      </View>

      <View style={styles.tabsRow}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary[600]} />}
        renderItem={({ item }) => {
          const cfg = statusConfig[item.status];
          const StatusIcon = cfg.icon;
          return (
            <TouchableOpacity style={styles.orderCard} onPress={() => router.push(`/order-details/${item.id}`)} activeOpacity={0.9}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderNumber}>{item.orderNumber}</Text>
                  <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                  <StatusIcon color={cfg.color} size={14} />
                  <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                </View>
              </View>
              <View style={styles.orderItems}>
                {item.items.slice(0, 2).map((it, i) => (
                  <Text key={i} style={styles.orderItem} numberOfLines={1}>• {it.name} × {it.quantity}</Text>
                ))}
                {item.items.length > 2 && <Text style={styles.orderItem}>+{item.items.length - 2} more</Text>}
              </View>
              <View style={styles.orderFooter}>
                <View>
                  <Text style={styles.orderEventLabel}>Event Date</Text>
                  <Text style={styles.orderEventValue}>{new Date(item.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} • {item.eventType}</Text>
                </View>
                <View style={styles.orderTotalWrap}>
                  <Text style={styles.orderTotalLabel}>Total</Text>
                  <Text style={styles.orderTotalValue}>₹{item.total.toLocaleString('en-IN')}</Text>
                </View>
              </View>
              <View style={styles.orderActionRow}>
                <ChevronRight color={COLORS.neutral[400]} size={20} />
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon={<Package color={COLORS.neutral[400]} size={36} />}
              title="No orders yet"
              message={`No ${activeTab} orders to show`}
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  title: { fontSize: 28, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  subtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
  tabsRow: { flexDirection: 'row', paddingHorizontal: SPACING.md, marginBottom: SPACING.md, gap: SPACING.sm },
  tab: { flex: 1, paddingVertical: 10, borderRadius: RADIUS.lg, alignItems: 'center', backgroundColor: COLORS.white },
  tabActive: { backgroundColor: COLORS.primary[700] },
  tabText: { fontSize: 13, fontFamily: 'Inter-Medium', color: COLORS.neutral[600] },
  tabTextActive: { color: COLORS.white, fontFamily: 'Inter-SemiBold' },
  orderCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.small },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderNumber: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  orderDate: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.sm },
  statusText: { fontSize: 11, fontFamily: 'Inter-SemiBold' },
  orderItems: { marginTop: SPACING.md, paddingLeft: 4 },
  orderItem: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginBottom: 2 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.md, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.neutral[100] },
  orderEventLabel: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
  orderEventValue: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900], marginTop: 2 },
  orderTotalWrap: { alignItems: 'flex-end' },
  orderTotalLabel: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
  orderTotalValue: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.primary[700], marginTop: 2 },
  orderActionRow: { position: 'absolute', right: 16, bottom: 16 },
});
