import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';

import { IconButton } from '../components/IconButton';
import { OptionCard } from '../components/OptionCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { Wordmark } from '../components/Wordmark';
import { formatWhen, planDate } from '../data/matching';
import { useAppState } from '../data/store';
import { useSelectedDate } from '../data/useMatches';
import { colors, fonts, radii, sizes } from '../theme';

const MAX_OPTIONS = 6;

export default function RescheduleScreen() {
  const { answers, importance, setChosenStart, setSelectedMatchId } = useAppState();
  const selected = useSelectedDate();
  const [pick, setPick] = useState<string | null>(null);

  // Every other upcoming time you're both free, each with the plan it would get.
  const options = useMemo(() => {
    if (!selected) return [];
    const current = selected.plan.start.getTime();
    return selected.match.times
      .filter((t) => t.start.getTime() !== current)
      .slice(0, MAX_OPTIONS)
      .map((t) => {
        const plan = planDate(selected.match.candidate, { answers, importance }, t);
        return { iso: t.start.toISOString(), when: formatWhen(t.start), where: `${plan.activity} · ${plan.venue.name}` };
      });
  }, [selected, answers, importance]);

  if (!selected) return <Redirect href="/picks" />;

  const back = () => (router.canGoBack() ? router.back() : router.replace('/date'));

  const confirm = () => {
    if (!pick) return;
    setChosenStart(pick);
    back();
  };

  const chooseSomeoneElse = () => {
    setSelectedMatchId(null);
    router.dismissTo('/picks');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton
          variant="plain"
          icon={<ChevronLeft size={24} color={colors.text} strokeWidth={1.75} />}
          accessibilityLabel="Back to your date"
          onPress={back}
        />
        <Wordmark size={22} />
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Text style={styles.heading} accessibilityRole="header">
            Pick a new time
          </Text>
          <Text style={styles.sub}>
            {options.length
              ? 'These all work for both of you. We’ll let them know and move the booking.'
              : 'There are no other times you’re both free in the next two weeks.'}
          </Text>
          <Text style={styles.current}>Currently {formatWhen(selected.plan.start)}</Text>
        </View>

        <View style={styles.options} accessibilityRole="radiogroup">
          {options.map((o) => (
            <OptionCard key={o.iso} label={o.when} detail={o.where} selected={pick === o.iso} onPress={() => setPick(o.iso)} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label={pick ? 'Confirm new time' : 'Choose a time'}
          disabled={!pick}
          onPress={confirm}
        />
        <Pressable
          onPress={chooseSomeoneElse}
          accessibilityRole="link"
          style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}
        >
          <Text style={styles.linkText}>None of these work? Pick someone else</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerSpacer: { width: sizes.minTap },
  body: { paddingHorizontal: sizes.gutter, paddingTop: 24, paddingBottom: 16, gap: 24 },
  intro: { gap: 8 },
  heading: { fontFamily: fonts.heading, fontSize: 30, lineHeight: 34, letterSpacing: -0.6, color: colors.text },
  sub: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.muted },
  current: { fontFamily: fonts.medium, fontSize: 13, color: colors.chipText, marginTop: 4 },
  options: { gap: 10 },
  footer: { alignItems: 'center', gap: 6, paddingHorizontal: sizes.gutter, paddingTop: 16, paddingBottom: 12 },
  link: { minHeight: sizes.minTap, paddingHorizontal: 12, justifyContent: 'center', borderRadius: radii.pill },
  linkPressed: { backgroundColor: colors.chip },
  linkText: { fontFamily: fonts.medium, fontSize: 14, color: colors.accent },
});
