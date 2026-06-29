import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, CheckCheck } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { mockApi } from '@/services/api';
import { AppNotification } from '@/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const iconMap: Record<string, any> = {
  'check-circle': CheckCheck,
  'credit-card': Bell,
  'users': Bell,
  'calendar': Bell,
  'tag': Bell,
  'sparkles': Bell,
};

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await mockApi.getNotifications();
    setNotifications(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color={COLORS.neutral[800]} size={24} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>{notifications.filter(n => !n.read).length} unread</Text>
        </View>
        <TouchableOpacity style={styles.markReadBtn} onPress={markAllRead}>
          <CheckCheck color={COLORS.primary[600]} size={20} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary[600]} />}
        renderItem={({ item }) => {
          const Icon = iconMap[item.icon] || Bell;
          return (
            <TouchableOpacity
              style={[styles.notifCard, !item.read && styles.notifCardUnread]}
              onPress={() => setNotifications(notifications.map(n => n.id === item.id ? { ...n, read: true } : n))}
            >
              <View style={[styles.notifIcon, !item.read && styles.notifIconActive]}>
                <Icon color={!item.read ? COLORS.white : COLORS.primary[600]} size={20} />
              </View>
              <View style={styles.notifBody}>
                <View style={styles.notifHeader}>
                  <Text style={styles.notifTitle}>{item.title}</Text>
                  {!item.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notifMessage}>{item.message}</Text>
                <Text style={styles.notifDate}>{item.date}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, gap: SPACING.sm },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
  title: { fontSize: 22, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  subtitle: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
  markReadBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary[50], justifyContent: 'center', alignItems: 'center' },
  notifCard: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.small },
  notifCardUnread: { backgroundColor: COLORS.primary[50] },
  notifIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.neutral[100], justifyContent: 'center', alignItems: 'center' },
  notifIconActive: { backgroundColor: COLORS.primary[700] },
  notifBody: { flex: 1, marginLeft: SPACING.md },
  notifHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  notifTitle: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error },
  notifMessage: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginTop: 4, lineHeight: 18 },
  notifDate: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], marginTop: 4 },
});
