import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import {
  CalendarDays,
  Check,
  ChevronLeft,
  Coffee,
  Landmark,
  MapPin,
  Mountain,
  Music,
  Trees,
  UtensilsCrossed,
  Wine,
} from 'lucide-react-native';

import { DetailRow } from '../components/DetailRow';
import { IconButton } from '../components/IconButton';
import { PrimaryButton } from '../components/PrimaryButton';
import { Wordmark } from '../components/Wordmark';
import { formatWhen } from '../data/matching';
import type { DateType } from '../data/places';
import { useAppState } from '../data/store';
import { useSelectedDate } from '../data/useMatches';
import { addToCalendar } from '../utils/addToCalendar';
import { colors, fonts, radii, sizes } from '../theme';

const ICON = { size: 20, color: colors.chipText, strokeWidth: 1.75 };

const ACTIVITY_ICON: Record<DateType, typeof Coffee> = {
  Coffee,
  Drinks: Wine,
  'A meal out': UtensilsCrossed,
  'A walk outdoors': Trees,
  'Something active': Mountain,
  'Museum or gallery': Landmark,
  'Live music or a show': Music,
};

const AVATAR = 104;

export default function DateScreen() {
  const { calendarAdded, setCalendarAdded } = useAppState();
  const [busy, setBusy] = useState(false);
  const selected = useSelectedDate();

  if (!selected) return <Redirect href="/picks" />;
  const { match, plan } = selected;
  const ActivityIcon = ACTIVITY_ICON[plan.activity];

  const backToPicks = () => (router.canGoBack() ? router.back() : router.replace('/picks'));

  const onAddToCalendar = async () => {
    if (busy) return;
    if (calendarAdded) {
      setCalendarAdded(false);
      return;
    }
    setBusy(true);
    try {
      const saved = await addToCalendar({
        title: 'Date via acquaint',
        start: plan.start,
        end: plan.end,
        location: `${plan.venue.name}, ${plan.venue.address}, ${plan.venue.area}`,
        notes: plan.venue.plan,
      });
      if (saved) setCalendarAdded(true);
    } catch {
      Alert.alert('Calendar unavailable', "We couldn't open your calendar on this device.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton
          variant="plain"
          icon={<ChevronLeft size={24} color={colors.text} strokeWidth={1.75} />}
          accessibilityLabel="Back to this week's matches"
          onPress={backToPicks}
        />
        <Wordmark size={22} />
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.main} showsVerticalScrollIndicator={false}>
        <Animated.View
          entering={FadeIn.duration(400)}
          style={styles.matchRow}
          accessible
          accessibilityLabel={`Your match, ${match.score} percent compatible with you`}
        >
          <View style={styles.avatarRing}>
            <View style={[styles.avatar, { backgroundColor: colors.photoTints[0] }]}>
              <Image source={{ uri: match.candidate.photo }} style={StyleSheet.absoluteFill} contentFit="cover" />
            </View>
          </View>
          <View style={styles.score}>
            <Text style={styles.scoreValue}>{match.score}%</Text>
            <Text style={styles.scoreLabel}>compatible with you</Text>
          </View>
        </Animated.View>

        {match.reasons.length ? (
          <Animated.View entering={FadeIn.duration(400).delay(60)} style={styles.reasons}>
            {match.reasons.map((r) => (
              <View key={r} style={styles.reason}>
                <Text style={styles.reasonText}>{r}</Text>
              </View>
            ))}
          </Animated.View>
        ) : null}

        <Animated.View entering={FadeInDown.duration(400).delay(80)} style={styles.titleBlock}>
          <Text style={styles.heading} accessibilityRole="header">
            It’s a date.
          </Text>
          <Text style={styles.sub}>We picked a time and place that works for you both. Just show up.</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(160)} style={styles.card}>
          <DetailRow icon={<CalendarDays {...ICON} />} label="When" value={formatWhen(plan.start)} />
          <DetailRow
            icon={<MapPin {...ICON} />}
            label="Where"
            value={plan.venue.name}
            detail={`${plan.venue.address}, ${plan.venue.area}${plan.travelMin ? ` · about ${plan.travelMin} min from you` : ''}`}
          />
          <DetailRow icon={<ActivityIcon {...ICON} />} label="Plan" value={plan.venue.plan} last />
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label={calendarAdded ? 'Added to calendar' : 'Add to calendar'}
          variant={calendarAdded ? 'outline' : 'solid'}
          icon={calendarAdded ? <Check size={18} color={colors.accent} strokeWidth={2.5} /> : undefined}
          onPress={onAddToCalendar}
          accessibilityHint={calendarAdded ? 'Marks the date as not added' : 'Opens your calendar to save the date'}
        />
        <Pressable
          onPress={() => router.push('/reschedule')}
          accessibilityRole="link"
          accessibilityHint="Shows other times you're both free"
          style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}
        >
          <Text style={styles.linkText}>Can’t make it? Reschedule</Text>
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
  main: { alignItems: 'center', paddingHorizontal: sizes.gutter, paddingTop: 24, paddingBottom: 8, gap: 20 },
  matchRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  avatarRing: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    borderWidth: 2,
    borderColor: colors.accent,
    padding: 4,
  },
  avatar: { flex: 1, borderRadius: AVATAR / 2, overflow: 'hidden' },
  score: { gap: 2 },
  scoreValue: { fontFamily: fonts.heading, fontSize: 44, lineHeight: 48, letterSpacing: -1, color: colors.accent },
  scoreLabel: { fontFamily: fonts.medium, fontSize: 14, color: colors.muted },
  reasons: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  reason: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: radii.pill, backgroundColor: colors.chip },
  reasonText: { fontFamily: fonts.medium, fontSize: 13, color: colors.chipText },
  titleBlock: { alignItems: 'center', gap: 8, marginTop: 4 },
  heading: { fontFamily: fonts.heading, fontSize: 34, letterSpacing: -0.7, color: colors.text },
  sub: {
    maxWidth: 290,
    textAlign: 'center',
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
  },
  card: {
    alignSelf: 'stretch',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
  },
  footer: { alignItems: 'center', gap: 6, paddingHorizontal: sizes.gutter, paddingTop: 16, paddingBottom: 12 },
  link: { minHeight: sizes.minTap, paddingHorizontal: 12, justifyContent: 'center', borderRadius: radii.pill },
  linkPressed: { backgroundColor: colors.chip },
  linkText: { fontFamily: fonts.medium, fontSize: 14, color: colors.accent },
});
