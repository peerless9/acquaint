import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff } from 'lucide-react-native';

import { IconButton } from '../components/IconButton';
import { PrimaryButton } from '../components/PrimaryButton';
import { Segmented } from '../components/Segmented';
import { TextAnswer } from '../components/TextAnswer';
import { Wordmark } from '../components/Wordmark';
import { isFormConnected } from '../data/formSubmit';
import { useAppState, type Account } from '../data/store';
import { colors, fonts, sizes } from '../theme';

const METHODS = ['Email', 'Phone'] as const;
const MIN_PASSWORD = 8;

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const isPhone = (v: string) => {
  const digits = v.replace(/\D/g, '').length;
  return digits >= 10 && digits <= 15;
};

export default function SignupScreen() {
  const { setAccount } = useAppState();
  const [method, setMethod] = useState<Account['method']>('email');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [contactTouched, setContactTouched] = useState(false);

  const isEmailMethod = method === 'email';
  const contactValid = isEmailMethod ? isEmail(contact) : isPhone(contact);
  const passwordValid = password.length >= MIN_PASSWORD;
  const canSubmit = contactValid && passwordValid;
  const showContactError = contactTouched && contact.length > 0 && !contactValid;

  const switchMethod = (i: number) => {
    const next = i === 0 ? 'email' : 'phone';
    if (next === method) return;
    setMethod(next);
    setContact('');
    setContactTouched(false);
  };

  const submit = () => {
    if (!canSubmit) return;
    // Prototype: no backend. Keep only the contact in memory; the password is discarded.
    setAccount({ method, contact: contact.trim() });
    router.replace('/quiz');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Wordmark />

          <View style={styles.intro}>
            <Text style={styles.heading} accessibilityRole="header">
              Create your account
            </Text>
            <Text style={styles.sub}>Answer a few questions, then get 3 matches every week. No swiping, no chatting.</Text>
          </View>

          <View style={styles.form}>
            <Segmented
              options={METHODS}
              value={isEmailMethod ? 0 : 1}
              onChange={switchMethod}
              accessibilityLabels={['Sign up with email', 'Sign up with phone number']}
              height={sizes.minTap}
              fontSize={15}
            />

            <View style={styles.field}>
              <Text style={styles.label}>{isEmailMethod ? 'Email' : 'Phone number'}</Text>
              <TextAnswer
                key={method}
                value={contact}
                onChangeText={setContact}
                accessibilityLabel={isEmailMethod ? 'Email' : 'Phone number'}
                placeholder={isEmailMethod ? 'you@example.com' : '(555) 123-4567'}
                keyboardType={isEmailMethod ? 'email-address' : 'phone-pad'}
                inputProps={{
                  autoCapitalize: 'none',
                  autoCorrect: false,
                  autoComplete: isEmailMethod ? 'email' : 'tel',
                  textContentType: isEmailMethod ? 'emailAddress' : 'telephoneNumber',
                  returnKeyType: 'next',
                  onBlur: () => setContactTouched(true),
                }}
              />
              {showContactError ? (
                <Text style={styles.error} accessibilityLiveRegion="polite">
                  {isEmailMethod ? 'Enter a valid email address' : 'Enter a valid phone number'}
                </Text>
              ) : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextAnswer
                value={password}
                onChangeText={setPassword}
                accessibilityLabel="Password"
                placeholder={`At least ${MIN_PASSWORD} characters`}
                onSubmitEditing={submit}
                inputProps={{
                  secureTextEntry: !showPassword,
                  autoCapitalize: 'none',
                  autoCorrect: false,
                  autoComplete: 'new-password',
                  textContentType: 'newPassword',
                  returnKeyType: 'go',
                }}
                accessory={
                  <View style={styles.eye}>
                    <IconButton
                      variant="plain"
                      accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                      onPress={() => setShowPassword((v) => !v)}
                      icon={
                        showPassword ? (
                          <EyeOff size={20} color={colors.muted} strokeWidth={1.75} />
                        ) : (
                          <Eye size={20} color={colors.muted} strokeWidth={1.75} />
                        )
                      }
                    />
                  </View>
                }
              />
              <Text style={[styles.hint, passwordValid && styles.hintOk]}>
                {passwordValid ? 'Looks good' : `${MIN_PASSWORD - password.length} more characters needed`}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton label="Create account" disabled={!canSubmit} onPress={submit} />
          <Text style={styles.note}>
            {isFormConnected()
              ? 'Prototype: your email or phone and quiz answers are sent to the acquaint team. Your password never leaves this device.'
              : 'Prototype: your details stay on this device.'}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  body: { paddingHorizontal: sizes.gutter, paddingTop: 12, paddingBottom: 16, gap: 28 },
  intro: { gap: 8, marginTop: 12 },
  heading: { fontFamily: fonts.heading, fontSize: 30, lineHeight: 34, letterSpacing: -0.6, color: colors.text },
  sub: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.muted },
  form: { gap: 22 },
  field: { gap: 8 },
  label: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text },
  error: { fontFamily: fonts.medium, fontSize: 13, color: colors.error },
  hint: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  hintOk: { color: colors.chipText },
  eye: { marginRight: 6 },
  footer: { alignItems: 'center', gap: 12, paddingHorizontal: sizes.gutter, paddingTop: 16, paddingBottom: 12 },
  note: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, color: colors.muted, textAlign: 'center' },
});
