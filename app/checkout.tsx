import { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Modal, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { SlideInRight, FadeIn } from 'react-native-reanimated';
import {
  ArrowLeft, Check, MapPin, Calendar, CreditCard, ShoppingBag,
  Smartphone, Wallet, Banknote, ChevronLeft, ChevronRight, Clock, X,
} from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/store/cart';
import { useToast } from '@/store/toast';
import { sampleAddresses } from '@/mock/data';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// ─── helpers ─────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function firstWeekday(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function pad(n: number) {
  return String(n).padStart(2, '0');
}
function formatDisplay(d: Date) {
  return `${pad(d.getDate())} ${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
}

// ─── Calendar Modal ───────────────────────────────────────────────────────────
type CalendarModalProps = {
  visible: boolean;
  onClose: () => void;
  selected: Date | null;
  onSelect: (d: Date) => void;
  minDate?: Date;
};

function CalendarModal({ visible, onClose, selected, onSelect, minDate }: CalendarModalProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const min = minDate ?? today;

  const cells = useMemo(() => {
    const first = firstWeekday(viewYear, viewMonth);
    const total = daysInMonth(viewYear, viewMonth);
    const arr: (number | null)[] = Array(first).fill(null);
    for (let d = 1; d <= total; d++) arr.push(d);
    // pad to full grid rows
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [viewYear, viewMonth]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const isDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    const m = new Date(min);
    m.setHours(0, 0, 0, 0);
    return d < m;
  };
  const isSelected = (day: number) => {
    if (!selected) return false;
    return selected.getFullYear() === viewYear &&
      selected.getMonth() === viewMonth &&
      selected.getDate() === day;
  };
  const isToday = (day: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === day;

  const handleDay = (day: number) => {
    if (isDisabled(day)) return;
    onSelect(new Date(viewYear, viewMonth, day));
    onClose();
  };

  // prevent going back before current month
  const canGoPrev = !(viewYear === today.getFullYear() && viewMonth <= today.getMonth());

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={cm.overlay}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
        <Animated.View entering={FadeIn.duration(200)} style={cm.sheet}>
          {/* Handle */}
          <View style={cm.handle} />

          {/* Month navigation */}
          <View style={cm.navRow}>
            <TouchableOpacity
              onPress={prevMonth}
              style={[cm.navBtn, !canGoPrev && { opacity: 0.3 }]}
              disabled={!canGoPrev}
            >
              <ChevronLeft color={COLORS.primary[700]} size={22} />
            </TouchableOpacity>

            <View style={cm.navCenter}>
              <Text style={cm.monthText}>{MONTH_NAMES[viewMonth]}</Text>
              <Text style={cm.yearText}>{viewYear}</Text>
            </View>

            <TouchableOpacity onPress={nextMonth} style={cm.navBtn}>
              <ChevronRight color={COLORS.primary[700]} size={22} />
            </TouchableOpacity>
          </View>

          {/* Day-of-week header */}
          <View style={cm.weekRow}>
            {DAY_LABELS.map(d => (
              <Text key={d} style={cm.weekLabel}>{d}</Text>
            ))}
          </View>

          {/* Grid */}
          <View style={cm.grid}>
            {cells.map((day, idx) => {
              if (day === null) return <View key={idx} style={cm.cell} />;
              const disabled = isDisabled(day);
              const sel = isSelected(day);
              const tod = isToday(day);
              return (
                <TouchableOpacity
                  key={idx}
                  style={cm.cell}
                  onPress={() => handleDay(day)}
                  activeOpacity={disabled ? 1 : 0.7}
                >
                  <View style={[
                    cm.dayInner,
                    sel && cm.daySelected,
                    !sel && tod && cm.dayToday,
                  ]}>
                    <Text style={[
                      cm.dayText,
                      disabled && cm.dayDisabled,
                      sel && cm.dayTextSelected,
                      !sel && tod && cm.dayTextToday,
                    ]}>
                      {day}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Selected label + confirm */}
          <View style={cm.footer}>
            <Text style={cm.footerLabel}>
              {selected ? formatDisplay(selected) : 'No date selected'}
            </Text>
            <TouchableOpacity style={cm.confirmBtn} onPress={onClose}>
              <Text style={cm.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const CELL = (width - SPACING.lg * 2 - SPACING.md * 2) / 7;

const cm = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(10,18,36,0.55)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: SPACING.lg, paddingBottom: 36,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: COLORS.neutral[300], alignSelf: 'center', marginTop: 12, marginBottom: 8,
  },
  navRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: SPACING.md,
  },
  navBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.primary[50], justifyContent: 'center', alignItems: 'center',
  },
  navCenter: { alignItems: 'center' },
  monthText: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  yearText: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 1 },
  weekRow: {
    flexDirection: 'row', borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100], paddingBottom: SPACING.sm, marginBottom: SPACING.sm,
  },
  weekLabel: {
    width: CELL, textAlign: 'center',
    fontSize: 12, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[400],
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: CELL, height: CELL + 6, alignItems: 'center', justifyContent: 'center' },
  dayInner: { width: CELL - 4, height: CELL - 4, borderRadius: (CELL - 4) / 2, justifyContent: 'center', alignItems: 'center' },
  daySelected: { backgroundColor: COLORS.primary[700] },
  dayToday: { backgroundColor: COLORS.gold[50], borderWidth: 1.5, borderColor: COLORS.gold[400] },
  dayText: { fontSize: 14, fontFamily: 'Inter-Medium', color: COLORS.neutral[800] },
  dayTextSelected: { color: COLORS.white, fontFamily: 'Inter-Bold' },
  dayTextToday: { color: COLORS.gold[600], fontFamily: 'Inter-Bold' },
  dayDisabled: { color: COLORS.neutral[300] },
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: SPACING.md, paddingTop: SPACING.md,
    borderTopWidth: 1, borderTopColor: COLORS.neutral[100],
  },
  footerLabel: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[700] },
  confirmBtn: {
    backgroundColor: COLORS.primary[700], paddingHorizontal: SPACING.xl,
    paddingVertical: 12, borderRadius: RADIUS.xl,
  },
  confirmText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.white },
});

// ─── Time Picker Modal ────────────────────────────────────────────────────────
type TimePickerModalProps = {
  visible: boolean;
  onClose: () => void;
  hour: number;
  minute: number;
  meridiem: 'AM' | 'PM';
  onChange: (h: number, m: number, mer: 'AM' | 'PM') => void;
};

function TimePickerModal({ visible, onClose, hour, minute, meridiem, onChange }: TimePickerModalProps) {
  const [h, setH] = useState(hour);
  const [m, setM] = useState(minute);
  const [mer, setMer] = useState<'AM' | 'PM'>(meridiem);

  const adjustH = (delta: number) => {
    setH(prev => {
      const next = prev + delta;
      if (next > 12) return 1;
      if (next < 1) return 12;
      return next;
    });
  };
  const adjustM = (delta: number) => {
    setM(prev => {
      const next = prev + delta;
      if (next >= 60) return 0;
      if (next < 0) return 55;
      return next;
    });
  };

  const confirm = () => {
    onChange(h, m, mer);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={tp.overlay}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
        <Animated.View entering={FadeIn.duration(200)} style={tp.sheet}>
          <View style={tp.handle} />
          <View style={tp.headerRow}>
            <Text style={tp.title}>Select Time</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <X color={COLORS.neutral[500]} size={22} />
            </TouchableOpacity>
          </View>

          <View style={tp.pickerRow}>
            {/* Hour */}
            <View style={tp.spinnerCol}>
              <TouchableOpacity style={tp.arrowBtn} onPress={() => adjustH(1)}>
                <ChevronLeft color={COLORS.primary[700]} size={22} style={{ transform: [{ rotate: '90deg' }] }} />
              </TouchableOpacity>
              <View style={tp.valueBox}>
                <Text style={tp.valueText}>{pad(h)}</Text>
              </View>
              <TouchableOpacity style={tp.arrowBtn} onPress={() => adjustH(-1)}>
                <ChevronLeft color={COLORS.primary[700]} size={22} style={{ transform: [{ rotate: '-90deg' }] }} />
              </TouchableOpacity>
              <Text style={tp.unitLabel}>Hour</Text>
            </View>

            <Text style={tp.colon}>:</Text>

            {/* Minute */}
            <View style={tp.spinnerCol}>
              <TouchableOpacity style={tp.arrowBtn} onPress={() => adjustM(5)}>
                <ChevronLeft color={COLORS.primary[700]} size={22} style={{ transform: [{ rotate: '90deg' }] }} />
              </TouchableOpacity>
              <View style={tp.valueBox}>
                <Text style={tp.valueText}>{pad(m)}</Text>
              </View>
              <TouchableOpacity style={tp.arrowBtn} onPress={() => adjustM(-5)}>
                <ChevronLeft color={COLORS.primary[700]} size={22} style={{ transform: [{ rotate: '-90deg' }] }} />
              </TouchableOpacity>
              <Text style={tp.unitLabel}>Min</Text>
            </View>

            {/* AM / PM */}
            <View style={tp.meridiemCol}>
              {(['AM', 'PM'] as const).map(v => (
                <TouchableOpacity
                  key={v}
                  style={[tp.meridiemBtn, mer === v && tp.meridiemActive]}
                  onPress={() => setMer(v)}
                >
                  <Text style={[tp.meridiemText, mer === v && tp.meridiemTextActive]}>{v}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={tp.confirmBtn} onPress={confirm}>
            <Text style={tp.confirmText}>Set Time</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const tp = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(10,18,36,0.55)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: SPACING.lg, paddingBottom: 36,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: COLORS.neutral[300], alignSelf: 'center', marginTop: 12, marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  title: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  pickerRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: SPACING.md, paddingVertical: SPACING.lg,
  },
  spinnerCol: { alignItems: 'center', gap: SPACING.sm },
  arrowBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.primary[50], justifyContent: 'center', alignItems: 'center',
  },
  valueBox: {
    width: 72, height: 72, borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary[700], justifyContent: 'center', alignItems: 'center',
    ...SHADOWS.medium,
  },
  valueText: { fontSize: 28, fontFamily: 'Inter-Bold', color: COLORS.white },
  unitLabel: { fontSize: 11, fontFamily: 'Inter-Medium', color: COLORS.neutral[400], marginTop: 2 },
  colon: { fontSize: 32, fontFamily: 'Inter-Bold', color: COLORS.neutral[400], marginBottom: 20 },
  meridiemCol: { gap: SPACING.sm, marginLeft: SPACING.sm },
  meridiemBtn: {
    width: 60, paddingVertical: 14, borderRadius: RADIUS.lg,
    backgroundColor: COLORS.neutral[100], alignItems: 'center',
  },
  meridiemActive: { backgroundColor: COLORS.primary[700] },
  meridiemText: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.neutral[500] },
  meridiemTextActive: { color: COLORS.white },
  confirmBtn: {
    backgroundColor: COLORS.primary[700], paddingVertical: 14,
    borderRadius: RADIUS.xl, alignItems: 'center', marginTop: SPACING.sm,
  },
  confirmText: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.white },
});

// ─── Main checkout screen ─────────────────────────────────────────────────────
const steps = ['Address', 'Event', 'Summary', 'Payment'];

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, subtotal, deliveryCharge, gst, grandTotal, clearCart } = useCart();
  const { show } = useToast();

  const [step, setStep] = useState(0);
  const [selectedAddr, setSelectedAddr] = useState(0);

  // Date picker state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCal, setShowCal] = useState(false);

  // Time picker state
  const [timeHour, setTimeHour] = useState(6);
  const [timeMin, setTimeMin] = useState(0);
  const [timeMer, setTimeMer] = useState<'AM' | 'PM'>('PM');
  const [showTime, setShowTime] = useState(false);

  const [eventType, setEventType] = useState('Wedding');
  const [venue, setVenue] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);

  const eventDateDisplay = selectedDate ? formatDisplay(selectedDate) : '';
  const eventTimeDisplay = `${pad(timeHour)}:${pad(timeMin)} ${timeMer}`;

  const eventTypes = ['Wedding', 'Reception', 'Birthday', 'Corporate', 'Festival', 'Other'];
  const paymentMethods = [
    { key: 'upi',    label: 'UPI',                  icon: Smartphone, desc: 'GPay, PhonePe, Paytm' },
    { key: 'card',   label: 'Credit / Debit Card',  icon: CreditCard,  desc: 'Visa, Mastercard, RuPay' },
    { key: 'wallet', label: 'Wallet',               icon: Wallet,      desc: 'Paytm, Amazon Pay' },
    { key: 'cod',    label: 'Cash on Confirmation', icon: Banknote,    desc: 'Pay after booking' },
  ];

  const handleNext = () => {
    if (step === 1) {
      if (!selectedDate || !venue || !guestCount) {
        show('Please fill all event details', 'error');
        return;
      }
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        clearCart();
        router.replace('/order-success');
      }, 2000);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => (step > 0 ? setStep(step - 1) : router.back())}
        >
          <ArrowLeft color={COLORS.neutral[800]} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Step indicator */}
      <View style={styles.stepsRow}>
        {steps.map((s, i) => (
          <View key={s} style={styles.stepItem}>
            <View style={[styles.stepCircle, i <= step && styles.stepCircleActive]}>
              {i < step
                ? <Check color={COLORS.white} size={14} />
                : <Text style={[styles.stepNum, i <= step && styles.stepNumActive]}>{i + 1}</Text>}
            </View>
            <Text style={[styles.stepLabel, i <= step && styles.stepLabelActive]}>{s}</Text>
            {i < steps.length - 1 && (
              <View style={[styles.stepLine, i < step && styles.stepLineActive]} />
            )}
          </View>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* ── Step 0: Address ── */}
        {step === 0 && (
          <Animated.View entering={SlideInRight} style={styles.stepContent}>
            <Text style={styles.stepTitle}>Shipping Address</Text>
            {sampleAddresses.map((addr, i) => (
              <TouchableOpacity
                key={addr.id}
                style={[styles.addressCard, selectedAddr === i && styles.addressCardActive]}
                onPress={() => setSelectedAddr(i)}
              >
                <View style={styles.addressRadio}>
                  {selectedAddr === i && <View style={styles.addressRadioDot} />}
                </View>
                <View style={styles.addressBody}>
                  <View style={styles.addressHeader}>
                    <Text style={styles.addressLabel}>{addr.label}</Text>
                    {addr.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultText}>DEFAULT</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.addressName}>{addr.fullName} • {addr.phone}</Text>
                  <Text style={styles.addressText}>
                    {addr.line1}, {addr.line2}, {addr.city}, {addr.state} - {addr.pincode}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.addAddrBtn} onPress={() => router.push('/addresses')}>
              <Text style={styles.addAddrText}>+ Add New Address</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* ── Step 1: Event Details ── */}
        {step === 1 && (
          <Animated.View entering={SlideInRight} style={styles.stepContent}>
            <Text style={styles.stepTitle}>Event Details</Text>

            {/* Event Date */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Event Date <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity
                style={[styles.pickerField, selectedDate && styles.pickerFieldFilled]}
                onPress={() => setShowCal(true)}
                activeOpacity={0.8}
              >
                <View style={[styles.pickerIcon, selectedDate && styles.pickerIconFilled]}>
                  <Calendar
                    color={selectedDate ? COLORS.white : COLORS.primary[600]}
                    size={18}
                  />
                </View>
                <Text style={[styles.pickerText, !selectedDate && styles.pickerPlaceholder]}>
                  {selectedDate ? formatDisplay(selectedDate) : 'Tap to choose a date'}
                </Text>
                <ChevronRight
                  color={selectedDate ? COLORS.primary[600] : COLORS.neutral[400]}
                  size={18}
                />
              </TouchableOpacity>
            </View>

            {/* Event Time */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Event Time</Text>
              <TouchableOpacity
                style={[styles.pickerField, styles.pickerFieldFilled]}
                onPress={() => setShowTime(true)}
                activeOpacity={0.8}
              >
                <View style={[styles.pickerIcon, styles.pickerIconFilled]}>
                  <Clock color={COLORS.white} size={18} />
                </View>
                <Text style={styles.pickerText}>{eventTimeDisplay}</Text>
                <ChevronRight color={COLORS.primary[600]} size={18} />
              </TouchableOpacity>
            </View>

            {/* Event Type */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Event Type</Text>
              <View style={styles.chipRow}>
                {eventTypes.map(t => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.chip, eventType === t && styles.chipActive]}
                    onPress={() => setEventType(t)}
                  >
                    <Text style={[styles.chipText, eventType === t && styles.chipTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Venue */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Venue Address <Text style={styles.required}>*</Text></Text>
              <View style={styles.formInput}>
                <MapPin color={COLORS.neutral[400]} size={20} />
                <TextInput
                  style={styles.formInputText}
                  placeholder="Enter venue address"
                  placeholderTextColor={COLORS.neutral[400]}
                  value={venue}
                  onChangeText={setVenue}
                  multiline
                />
              </View>
            </View>

            {/* Guest Count */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Guest Count <Text style={styles.required}>*</Text></Text>
              <View style={styles.formInput}>
                <ShoppingBag color={COLORS.neutral[400]} size={20} />
                <TextInput
                  style={styles.formInputText}
                  placeholder="Number of guests"
                  placeholderTextColor={COLORS.neutral[400]}
                  value={guestCount}
                  onChangeText={setGuestCount}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            {/* Special Instructions */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Special Instructions</Text>
              <View style={[styles.formInput, { height: 80, alignItems: 'flex-start', paddingTop: 12 }]}>
                <TextInput
                  style={[styles.formInputText, { textAlignVertical: 'top' }]}
                  placeholder="Any special requests..."
                  placeholderTextColor={COLORS.neutral[400]}
                  value={instructions}
                  onChangeText={setInstructions}
                  multiline
                />
              </View>
            </View>
          </Animated.View>
        )}

        {/* ── Step 2: Order Summary ── */}
        {step === 2 && (
          <Animated.View entering={SlideInRight} style={styles.stepContent}>
            <Text style={styles.stepTitle}>Order Summary</Text>
            {state.items.map(item => (
              <View key={item.id} style={styles.summaryItem}>
                <View style={styles.summaryItemInfo}>
                  <Text style={styles.summaryItemName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.summaryItemQty}>Qty: {item.quantity}</Text>
                </View>
                <Text style={styles.summaryItemPrice}>
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </Text>
              </View>
            ))}
            <View style={styles.summaryDivider} />
            <Row label="Subtotal" value={`₹${subtotal.toLocaleString('en-IN')}`} />
            {state.couponDiscount > 0 && (
              <Row label="Discount" value={`-₹${state.couponDiscount.toLocaleString('en-IN')}`} green />
            )}
            <Row label="Delivery" value={deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`} />
            <Row label="GST (18%)" value={`₹${gst.toLocaleString('en-IN')}`} />

            {/* Event info pill */}
            {selectedDate && (
              <View style={styles.eventPill}>
                <Calendar color={COLORS.primary[600]} size={16} />
                <Text style={styles.eventPillText}>
                  {formatDisplay(selectedDate)} • {eventTimeDisplay} • {eventType}
                </Text>
              </View>
            )}

            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>₹{grandTotal.toLocaleString('en-IN')}</Text>
            </View>
          </Animated.View>
        )}

        {/* ── Step 3: Payment ── */}
        {step === 3 && (
          <Animated.View entering={SlideInRight} style={styles.stepContent}>
            <Text style={styles.stepTitle}>Payment Method</Text>
            {paymentMethods.map(pm => {
              const Icon = pm.icon;
              const active = paymentMethod === pm.key;
              return (
                <TouchableOpacity
                  key={pm.key}
                  style={[styles.paymentCard, active && styles.paymentCardActive]}
                  onPress={() => setPaymentMethod(pm.key)}
                >
                  <View style={[styles.paymentIconWrap, active && styles.paymentIconWrapActive]}>
                    <Icon color={active ? COLORS.white : COLORS.primary[600]} size={22} />
                  </View>
                  <View style={styles.paymentBody}>
                    <Text style={styles.paymentLabel}>{pm.label}</Text>
                    <Text style={styles.paymentDesc}>{pm.desc}</Text>
                  </View>
                  <View style={[styles.paymentRadio, active && styles.paymentRadioActive]}>
                    {active && <View style={styles.paymentRadioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
            <View style={styles.secureNote}>
              <Check color={COLORS.success} size={16} />
              <Text style={styles.secureText}>Your payment information is secure and encrypted</Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomTotalLabel}>Total</Text>
          <Text style={styles.bottomTotalValue}>₹{grandTotal.toLocaleString('en-IN')}</Text>
        </View>
        <Button
          onPress={handleNext}
          loading={processing}
          variant={step === 3 ? 'gold' : 'primary'}
          size="lg"
          style={{ flex: 1, marginLeft: SPACING.md }}
        >
          {step === 3 ? (processing ? 'Processing...' : 'Pay Now') : 'Continue'}
        </Button>
      </View>

      {/* Pickers */}
      <CalendarModal
        visible={showCal}
        onClose={() => setShowCal(false)}
        selected={selectedDate}
        onSelect={setSelectedDate}
      />
      <TimePickerModal
        visible={showTime}
        onClose={() => setShowTime(false)}
        hour={timeHour}
        minute={timeMin}
        meridiem={timeMer}
        onChange={(h, m, mer) => { setTimeHour(h); setTimeMin(m); setTimeMer(mer); }}
      />
    </View>
  );
}

// tiny helper row
function Row({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, green && { color: COLORS.success }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', ...SHADOWS.small,
  },
  title: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },

  stepsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  stepItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.neutral[200], justifyContent: 'center', alignItems: 'center' },
  stepCircleActive: { backgroundColor: COLORS.primary[700] },
  stepNum: { fontSize: 12, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[500] },
  stepNumActive: { color: COLORS.white },
  stepLabel: { fontSize: 11, fontFamily: 'Inter-Medium', color: COLORS.neutral[400], marginLeft: 6 },
  stepLabelActive: { color: COLORS.neutral[800] },
  stepLine: { flex: 1, height: 2, backgroundColor: COLORS.neutral[200], marginHorizontal: 4 },
  stepLineActive: { backgroundColor: COLORS.primary[700] },

  stepContent: { padding: SPACING.lg },
  stepTitle: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], marginBottom: SPACING.md },

  // Address
  addressCard: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 2, borderColor: 'transparent', ...SHADOWS.small },
  addressCardActive: { borderColor: COLORS.primary[600] },
  addressRadio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: COLORS.neutral[300], justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md, marginTop: 2 },
  addressRadioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary[700] },
  addressBody: { flex: 1 },
  addressHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  addressLabel: { fontSize: 14, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  defaultBadge: { backgroundColor: COLORS.gold[100], paddingHorizontal: 6, paddingVertical: 2, borderRadius: RADIUS.sm },
  defaultText: { fontSize: 9, fontFamily: 'Inter-Bold', color: COLORS.gold[600] },
  addressName: { fontSize: 13, fontFamily: 'Inter-Medium', color: COLORS.neutral[700], marginTop: 4 },
  addressText: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2, lineHeight: 16 },
  addAddrBtn: { paddingVertical: SPACING.md, borderRadius: RADIUS.lg, borderWidth: 1.5, borderColor: COLORS.primary[300], borderStyle: 'dashed', alignItems: 'center' },
  addAddrText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.primary[700] },

  // Event form
  formGroup: { marginBottom: SPACING.md },
  formLabel: { fontSize: 13, fontFamily: 'Inter-Medium', color: COLORS.neutral[700], marginBottom: 8 },
  required: { color: COLORS.error },
  // tappable picker fields
  pickerField: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md, paddingVertical: 14,
    borderWidth: 1.5, borderColor: COLORS.neutral[200], ...SHADOWS.small,
  },
  pickerFieldFilled: { borderColor: COLORS.primary[400], backgroundColor: COLORS.primary[50] },
  pickerIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.primary[50], justifyContent: 'center', alignItems: 'center',
  },
  pickerIconFilled: { backgroundColor: COLORS.primary[700] },
  pickerText: { flex: 1, fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  pickerPlaceholder: { fontFamily: 'Inter-Regular', color: COLORS.neutral[400] },
  // regular input
  formInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, height: 52, borderWidth: 1, borderColor: COLORS.neutral[200], gap: 10 },
  formInputText: { flex: 1, fontSize: 15, fontFamily: 'Inter-Regular', color: COLORS.neutral[900] },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.lg, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.neutral[200] },
  chipActive: { backgroundColor: COLORS.primary[700], borderColor: COLORS.primary[700] },
  chipText: { fontSize: 13, fontFamily: 'Inter-Medium', color: COLORS.neutral[700] },
  chipTextActive: { color: COLORS.white },

  // Summary
  summaryItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
  summaryItemInfo: { flex: 1 },
  summaryItemName: { fontSize: 14, fontFamily: 'Inter-Medium', color: COLORS.neutral[900] },
  summaryItemQty: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
  summaryItemPrice: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  summaryDivider: { height: 1, backgroundColor: COLORS.neutral[200], marginVertical: SPACING.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  summaryLabel: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[600] },
  summaryValue: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  totalLabel: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  totalValue: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
  eventPill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.primary[50], borderRadius: RADIUS.lg, padding: SPACING.md, marginTop: SPACING.sm,
  },
  eventPillText: { fontSize: 13, fontFamily: 'Inter-Medium', color: COLORS.primary[700], flex: 1 },

  // Payment
  paymentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 2, borderColor: 'transparent', ...SHADOWS.small },
  paymentCardActive: { borderColor: COLORS.primary[600] },
  paymentIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primary[50], justifyContent: 'center', alignItems: 'center' },
  paymentIconWrapActive: { backgroundColor: COLORS.primary[700] },
  paymentBody: { flex: 1, marginLeft: SPACING.md },
  paymentLabel: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  paymentDesc: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
  paymentRadio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: COLORS.neutral[300], justifyContent: 'center', alignItems: 'center' },
  paymentRadioActive: { borderColor: COLORS.primary[700] },
  paymentRadioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary[700] },
  secureNote: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: SPACING.md },
  secureText: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },

  // Bottom bar
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md, paddingBottom: 30,
    borderTopWidth: 1, borderTopColor: COLORS.neutral[100], ...SHADOWS.large,
  },
  bottomTotalLabel: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
  bottomTotalValue: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
});
