import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, MapPin, Edit3, Trash2, Check, X } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { Address } from '@/types';
import { sampleAddresses } from '@/mock/data';
import { useToast } from '@/store/toast';
import { Button } from '@/components/ui/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddressesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { show } = useToast();
  const [addresses, setAddresses] = useState<Address[]>(sampleAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [form, setForm] = useState({ label: '', fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' });

  const openAdd = () => {
    setEditing(null);
    setForm({ label: '', fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' });
    setShowForm(true);
  };

  const openEdit = (addr: Address) => {
    setEditing(addr);
    setForm({ label: addr.label, fullName: addr.fullName, phone: addr.phone, line1: addr.line1, line2: addr.line2 || '', city: addr.city, state: addr.state, pincode: addr.pincode });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.label || !form.fullName || !form.line1 || !form.city || !form.pincode) {
      show('Please fill required fields', 'error');
      return;
    }
    if (editing) {
      setAddresses(addresses.map(a => a.id === editing.id ? { ...editing, ...form } : a));
      show('Address updated');
    } else {
      setAddresses([...addresses, { ...form, id: 'addr' + Date.now(), isDefault: addresses.length === 0 }]);
      show('Address added');
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Address', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { setAddresses(addresses.filter(a => a.id !== id)); show('Address deleted', 'info'); } },
    ]);
  };

  const setDefault = (id: string) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
    show('Default address updated');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color={COLORS.neutral[800]} size={24} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Saved Addresses</Text>
          <Text style={styles.subtitle}>{addresses.length} addresses</Text>
        </View>
      </View>

      <FlatList
        data={addresses}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.addrCard}>
            <View style={styles.addrHeader}>
              <View style={styles.addrLabelWrap}>
                <Text style={styles.addrLabel}>{item.label}</Text>
                {item.isDefault && <View style={styles.defaultBadge}><Text style={styles.defaultText}>DEFAULT</Text></View>}
              </View>
              <View style={styles.addrActions}>
                <TouchableOpacity style={styles.addrAction} onPress={() => openEdit(item)}>
                  <Edit3 color={COLORS.primary[600]} size={16} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.addrAction} onPress={() => handleDelete(item.id)}>
                  <Trash2 color={COLORS.error} size={16} />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.addrName}>{item.fullName} • {item.phone}</Text>
            <Text style={styles.addrText}>{item.line1}{item.line2 ? `, ${item.line2}` : ''}, {item.city}, {item.state} - {item.pincode}</Text>
            {!item.isDefault && (
              <TouchableOpacity style={styles.setDefaultBtn} onPress={() => setDefault(item.id)}>
                <Check color={COLORS.primary[600]} size={14} />
                <Text style={styles.setDefaultText}>Set as Default</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.addBtnWrap}>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Plus color={COLORS.white} size={24} />
          <Text style={styles.addBtnText}>Add New Address</Text>
        </TouchableOpacity>
      </View>

      {/* Form Modal */}
      <Modal visible={showForm} animationType="slide" transparent>
        <View style={styles.formOverlay}>
          <View style={styles.formSheet}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>{editing ? 'Edit Address' : 'Add Address'}</Text>
              <TouchableOpacity onPress={() => setShowForm(false)}>
                <X color={COLORS.neutral[600]} size={24} />
              </TouchableOpacity>
            </View>
            <View style={styles.formBody}>
              <View style={styles.formRow}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Label</Text>
                  <TextInput style={styles.formInput} placeholder="Home, Office..." placeholderTextColor={COLORS.neutral[400]} value={form.label} onChangeText={(v) => setForm({ ...form, label: v })} />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Pincode</Text>
                  <TextInput style={styles.formInput} placeholder="560001" placeholderTextColor={COLORS.neutral[400]} value={form.pincode} onChangeText={(v) => setForm({ ...form, pincode: v })} keyboardType="number-pad" />
                </View>
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Full Name</Text>
                <TextInput style={styles.formInput} placeholder="John Doe" placeholderTextColor={COLORS.neutral[400]} value={form.fullName} onChangeText={(v) => setForm({ ...form, fullName: v })} />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone</Text>
                <TextInput style={styles.formInput} placeholder="+91 98765 43210" placeholderTextColor={COLORS.neutral[400]} value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} keyboardType="phone-pad" />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Address Line 1</Text>
                <TextInput style={styles.formInput} placeholder="House no, Street" placeholderTextColor={COLORS.neutral[400]} value={form.line1} onChangeText={(v) => setForm({ ...form, line1: v })} />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Address Line 2 (Optional)</Text>
                <TextInput style={styles.formInput} placeholder="Area, Landmark" placeholderTextColor={COLORS.neutral[400]} value={form.line2} onChangeText={(v) => setForm({ ...form, line2: v })} />
              </View>
              <View style={styles.formRow}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>City</Text>
                  <TextInput style={styles.formInput} placeholder="Bengaluru" placeholderTextColor={COLORS.neutral[400]} value={form.city} onChangeText={(v) => setForm({ ...form, city: v })} />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>State</Text>
                  <TextInput style={styles.formInput} placeholder="Karnataka" placeholderTextColor={COLORS.neutral[400]} value={form.state} onChangeText={(v) => setForm({ ...form, state: v })} />
                </View>
              </View>
              <Button onPress={handleSave} fullWidth size="lg" style={{ marginTop: SPACING.md }}>{editing ? 'Update Address' : 'Save Address'}</Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, gap: SPACING.sm },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
  title: { fontSize: 22, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  subtitle: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
  addrCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.small },
  addrHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addrLabelWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  addrLabel: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  defaultBadge: { backgroundColor: COLORS.gold[100], paddingHorizontal: 6, paddingVertical: 2, borderRadius: RADIUS.sm },
  defaultText: { fontSize: 9, fontFamily: 'Inter-Bold', color: COLORS.gold[600] },
  addrActions: { flexDirection: 'row', gap: 8 },
  addrAction: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.neutral[100], justifyContent: 'center', alignItems: 'center' },
  addrName: { fontSize: 13, fontFamily: 'Inter-Medium', color: COLORS.neutral[700], marginTop: 8 },
  addrText: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 4, lineHeight: 18 },
  setDefaultBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: SPACING.sm, alignSelf: 'flex-start' },
  setDefaultText: { fontSize: 12, fontFamily: 'Inter-SemiBold', color: COLORS.primary[600] },
  addBtnWrap: { position: 'absolute', bottom: 30, left: SPACING.lg, right: SPACING.lg },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.primary[700], paddingVertical: SPACING.md, borderRadius: RADIUS.xl, ...SHADOWS.medium },
  addBtnText: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.white },
  formOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  formSheet: { backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, maxHeight: '90%', paddingBottom: 40 },
  formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
  formTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  formBody: { padding: SPACING.lg },
  formRow: { flexDirection: 'row', gap: SPACING.md },
  formGroup: { flex: 1, marginBottom: SPACING.md },
  formLabel: { fontSize: 13, fontFamily: 'Inter-Medium', color: COLORS.neutral[700], marginBottom: 6 },
  formInput: { backgroundColor: COLORS.neutral[50], borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, height: 48, fontSize: 15, fontFamily: 'Inter-Regular', color: COLORS.neutral[900], borderWidth: 1, borderColor: COLORS.neutral[200] },
});
