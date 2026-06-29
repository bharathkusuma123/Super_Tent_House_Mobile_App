import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/store/toast';
import { useAuth } from '@/store/auth';

export default function OtpScreen() {
  const router = useRouter();
  const { show } = useToast();
  const { state } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '']);
  const refs = useRef<(TextInput | null)[]>([]);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 4) {
      show('Enter complete OTP', 'error');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    show('Account verified!');
    router.replace('/(tabs)');
  };

  const handleChange = (i: number, val: string) => {
    if (val.length > 1) return;
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);
    if (val && i < 3) refs.current[i + 1]?.focus();
  };

  const handleKeyPress = (i: number, e: any) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Verify Your Account</Text>
        <Text style={styles.subtitle}>Enter the 4-digit code sent to your email</Text>
      </View>

      <View style={styles.otpRow}>
        {otp.map((digit, i) => (
          <Animated.View key={i} entering={FadeIn.delay(i * 80)}>
            <TextInput
              ref={(ref) => { refs.current[i] = ref; }}
              style={[styles.otpInput, digit && styles.otpFilled]}
              value={digit}
              onChangeText={(v) => handleChange(i, v)}
              onKeyPress={(e) => handleKeyPress(i, e)}
              keyboardType="number-pad"
              maxLength={1}
              autoFocus={i === 0}
            />
          </Animated.View>
        ))}
      </View>

      <View style={styles.resendRow}>
        <Text style={styles.resendText}>Didn't receive code? </Text>
        <TouchableOpacity onPress={() => show('OTP resent')}>
          <Text style={styles.resendLink}>Resend</Text>
        </TouchableOpacity>
      </View>

      <Button onPress={handleVerify} loading={loading} fullWidth size="lg">Verify & Continue</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite, paddingHorizontal: SPACING.lg, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: SPACING.xxl },
  title: { fontSize: 24, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  subtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 8, textAlign: 'center' },
  otpRow: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.md, marginBottom: SPACING.xl },
  otpInput: { width: 60, height: 70, borderRadius: RADIUS.lg, backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.neutral[200], fontSize: 28, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], textAlign: 'center' },
  otpFilled: { borderColor: COLORS.primary[600], backgroundColor: COLORS.primary[50] },
  resendRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: SPACING.xl },
  resendText: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
  resendLink: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.primary[600] },
});
