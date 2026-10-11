import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PhotoCard } from '../components/PhotoCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { Wordmark } from '../components/Wordmark';
import { matches } from '../data/matches';
import { useAppState } from '../data/store';
import { colors, fonts, sizes } from '../theme';

export default function PicksScreen() {
  const { selectedMatchId, setSelectedMatchId } = useAppState();
  const hasPick = selectedMatchId !== null;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Wordmark />
        <Text style={styles.heading} accessibilityRole="header">
          Your 3 this week
        </Text>
        <Text style={styles.sub}>Pick one. We’ll plan the date — no chatting needed.</Text>
      </View>

      <View style={styles.cards} accessibilityRole="radiogroup">
        {matches.map((m, i) => (
          <PhotoCard
            key={m.id}
            photo={m.photo}
            tint={m.tint}
            selected={selectedMatchId === m.id}
            dimmed={hasPick && selectedMatchId !== m.id}
            onPress={() => setSelectedMatchId(selectedMatchId === m.id ? null : m.id)}
            accessibilityLabel={`Match ${i + 1} of ${matches.length}, profile photo`}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label={hasPick ? 'Plan our date' : 'Choose one to continue'}
          disabled={!hasPick}
          onPress={() => router.push('/date')}
        />
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
