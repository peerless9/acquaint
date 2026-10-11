import { StyleSheet, Text, View } from 'react-native';

import { Segmented } from './Segmented';
import { colors, fonts } from '../theme';

const STEPS = ['1', '2', '3', '4', '5'];

type Props = { value?: number; onChange: (n: number) => void; minLabel: string; maxLabel: string };

export function ScaleAnswer({ value, onChange, minLabel, maxLabel }: Props) {
  return (
    <View style={styles.wrap}>
      <Segmented
        options={STEPS}
        value={value === undefined ? undefined : value - 1}
        onChange={(i) => onChange(i + 1)}
        accessibilityLabels={STEPS.map((n, i) => (i === 0 ? `1, ${minLabel}` : i === 4 ? `5, ${maxLabel}` : `${n} of 5`))}
      />
      <View style={styles.labels} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
        <Text style={styles.label}>{minLabel}</Text>
        <Text style={[styles.label, styles.right]}>{maxLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14 },
  labels: { flexDirection: 'row', justifyContent: 'space-between', gap: 24 },
  label: { flex: 1, fontFamily: fonts.body, fontSize: 13, lineHeight: 18, color: colors.muted },
  right: { textAlign: 'right' },
});
