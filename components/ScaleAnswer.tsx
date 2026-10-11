import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors, fonts, radii, timing } from '../theme';

const STEPS = [1, 2, 3, 4, 5];

function Step({ n, selected, onPress, label }: { n: number; selected: boolean; onPress: () => void; label: string }) {
  const on = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    on.value = withTiming(selected ? 1 : 0, { duration: timing.base });
  }, [selected, on]);

  const box = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(on.value, [0, 1], [colors.surface, colors.accent]),
    borderColor: interpolateColor(on.value, [0, 1], [colors.border, colors.accent]),
  }));
  const text = useAnimatedStyle(() => ({
    color: interpolateColor(on.value, [0, 1], [colors.text, colors.white]),
  }));

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={styles.stepPress}
    >
      <Animated.View style={[styles.step, box]}>
        <Animated.Text style={[styles.stepText, text]}>{n}</Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

type Props = { value?: number; onChange: (n: number) => void; minLabel: string; maxLabel: string };

export function ScaleAnswer({ value, onChange, minLabel, maxLabel }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row} accessibilityRole="radiogroup">
        {STEPS.map((n) => (
          <Step
            key={n}
            n={n}
            selected={value === n}
            onPress={() => onChange(n)}
            label={n === 1 ? `1, ${minLabel}` : n === 5 ? `5, ${maxLabel}` : `${n} of 5`}
          />
        ))}
      </View>
      <View style={styles.labels} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
        <Text style={styles.label}>{minLabel}</Text>
        <Text style={[styles.label, styles.right]}>{maxLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14 },
  row: { flexDirection: 'row', gap: 8 },
  stepPress: { flex: 1 },
  step: {
    height: 56,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: { fontFamily: fonts.semibold, fontSize: 17 },
  labels: { flexDirection: 'row', justifyContent: 'space-between', gap: 24 },
  label: { flex: 1, fontFamily: fonts.body, fontSize: 13, lineHeight: 18, color: colors.muted },
  right: { textAlign: 'right' },
});
