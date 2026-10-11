import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PhotoCard } from '../components/PhotoCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { Wordmark } from '../components/Wordmark';
import { useAppState } from '../data/store';
import { useMatches } from '../data/useMatches';
import { colors, fonts, sizes } from '../theme';

export default function PicksScreen() {
  const { selectedMatchId, setSelectedMatchId } = useAppState();
  const matches = useMatches();
  const hasPick = matches.some((m) => m.candidate.id === selectedMatchId);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Wordmark />
        <Text style={styles.heading} accessibilityRole="header">
          {matches.length ? `Your ${matches.length} this week` : 'No matches this week'}
        </Text>
        <Text style={styles.sub}>
          {matches.length
            ? 'Pick one. We’ll plan the date — no chatting needed.'
            : 'Nobody fits all of your non-negotiables and free times yet. Try loosening a deal-breaker or adding times you’re free.'}
        </Text>
      </View>

      <View style={styles.cards} accessibilityRole="radiogroup">
        {matches.map((m, i) => (
          <PhotoCard
            key={m.candidate.id}
            photo={m.candidate.photo}
            tint={colors.photoTints[i % colors.photoTints.length]}
            selected={selectedMatchId === m.candidate.id}
            dimmed={hasPick && selectedMatchId !== m.candidate.id}
            onPress={() => setSelectedMatchId(selectedMatchId === m.candidate.id ? null : m.candidate.id)}
            accessibilityLabel={`Match ${i + 1} of ${matches.length}, profile photo`}
          />
        ))}
      </View>

      <View style={styles.footer}>
        {matches.length ? (
          <PrimaryButton
            label={hasPick ? 'Plan our date' : 'Choose one to continue'}
            disabled={!hasPick}
            onPress={() => router.push('/date')}
          />
        ) : (
          <PrimaryButton label="Edit my answers" onPress={() => router.replace('/quiz')} />
        )}
        <Text style={styles.note}>New matches every Monday</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: sizes.gutter, paddingTop: 12, paddingBottom: 20, gap: 8 },
  heading: {
    marginTop: 12,
    fontFamily: fonts.heading,
    fontSize: 30,
    lineHeight: 33,
    letterSpacing: -0.6,
    color: colors.text,
  },
  sub: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.muted },
  cards: { flex: 1, paddingHorizontal: sizes.gutter, paddingVertical: 6, gap: 14 },
  footer: { alignItems: 'center', gap: 12, paddingHorizontal: sizes.gutter, paddingTop: 20, paddingBottom: 12 },
  note: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
});
