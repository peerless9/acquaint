import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Calendar from 'expo-calendar/legacy';
import { CalendarDays, Check, ChevronLeft, Coffee, MapPin } from 'lucide-react-native';

import { DetailRow } from '../components/DetailRow';
import { IconButton } from '../components/IconButton';
import { PrimaryButton } from '../components/PrimaryButton';
import { Wordmark } from '../components/Wordmark';
import { formatWhen, getDateTimes, getMatch } from '../data/matches';
import { useAppState } from '../data/store';
import { colors, fonts, radii, sizes } from '../theme';

const ICON = { size: 20, color: colors.chipText, strokeWidth: 1.75 };

export default function DateScreen() {
  const { selectedMatchId, calendarAdded, setCalendarAdded } = useAppState();
  const [busy, setBusy] = useState(false);
  const match = getMatch(selectedMatchId);
  const times = useMemo(() => (match ? getDateTimes(match.date) : null), [match]);

  if (!match || !times) return <Redirect href="/picks" />;

  const backToPicks = () => (router.canGoBack() ? router.back() : router.replace('/picks'));

  const addToCalendar = async () => {
    if (busy) return;
    if (calendarAdded) {
      setCalendarAdded(false);
      return;
    }
    setBusy(true);
    try {
      // System "New Event" sheet: works in Expo Go and needs no calendar permission.
      const result = await Calendar.createEventInCalendarAsync({
        title: 'Date via acquaint',
        startDate: times.start,
        endDate: times.end,
        location: `${match.date.venue}, ${match.date.address}`,
        notes: match.date.plan,
      });
      if (result.action === 'saved' || result.action === 'done') setCalendarAdded(true);
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

      <View style={styles.main}>
        <Animated.View entering={FadeIn.duration(400)} style={styles.avatarRing}>
          <View style={[styles.avatar, { backgroundColor: match.tint }]}>
            <Image
              source={{ uri: match.photo }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              accessibilityLabel="Your match's profile photo"
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(80)} style={styles.titleBlock}>
          <Text style={styles.heading} accessibilityRole="header">
            It’s a date.
          </Text>
          <Text style={styles.sub}>We picked a time and place that works for you both. Just show up.</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(160)} style={styles.card}>
          <DetailRow icon={<CalendarDays {...ICON} />} label="When" value={formatWhen(times.start)} />
          <DetailRow icon={<MapPin {...ICON} />} label="Where" value={match.date.venue} detail={match.date.address} />
          <DetailRow icon={<Coffee {...ICON} />} label="Plan" value={match.date.plan} last />
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label={calendarAdded ? 'Added to calendar' : 'Add to calendar'}
          variant={calendarAdded ? 'outline' : 'solid'}
          icon={calendarAdded ? <Check size={18} color={colors.accent} strokeWidth={2.5} /> : undefined}
          onPress={addToCalendar}
          accessibilityHint={calendarAdded ? 'Marks the date as not added' : 'Opens your calendar to save the date'}
        />
        <Pressable
          onPress={backToPicks}
          accessibilityRole="link"
          style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}
        >
          <Text style={styles.linkText}>Can’t make it? Reschedule</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const AVATAR = 132;

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
  main: { flex: 1, alignItems: 'center', paddingHorizontal: sizes.gutter, paddingTop: 28, gap: 24 },
  avatarRing: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    borderWidth: 2,
    borderColor: colors.accent,
    padding: 5,
  },
  avatar: { flex: 1, borderRadius: AVATAR / 2, overflow: 'hidden' },
  titleBlock: { alignItems: 'center', gap: 8 },
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
  footer: { alignItems: 'center', gap: 6, paddingHorizontal: sizes.gutter, paddingTop: 20, paddingBottom: 12 },
  link: { minHeight: sizes.minTap, paddingHorizontal: 12, justifyContent: 'center', borderRadius: radii.pill },
  linkPressed: { backgroundColor: colors.chip },
  linkText: { fontFamily: fonts.medium, fontSize: 14, color: colors.accent },
});
