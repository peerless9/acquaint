import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radii } from '../theme';

export function Chip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.chip,
  },
  text: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    letterSpacing: 0.72,
    textTransform: 'uppercase',
    color: colors.chipText,
  },
});
