import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';

import { colors, fonts, radii, timing } from '../theme';

type Props = {
  label: string;
  /** Optional muted second line under the label. */
  detail?: string;
  selected: boolean;
  onPress: () => void;
  /** radio = single choice, checkbox = multi choice, none = compact chip */
  indicator?: 'radio' | 'checkbox' | 'none';
  compact?: boolean;
};

export function OptionCard({ label, detail, selected, onPress, indicator = 'radio', compact = false }: Props) {
  const on = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    on.value = withTiming(selected ? 1 : 0, { duration: timing.base });
  }, [selected, on]);

  const ring = useAnimatedStyle(() => ({ opacity: on.value }));
  const mark = useAnimatedStyle(() => ({ opacity: on.value, transform: [{ scale: 0.6 + on.value * 0.4 }] }));

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={indicator === 'radio' ? 'radio' : 'checkbox'}
      accessibilityState={indicator === 'radio' ? { selected } : { checked: selected }}
      accessibilityLabel={detail ? `${label}, ${detail}` : label}
      style={({ pressed }) => [styles.card, compact && styles.compact, pressed && !selected && styles.pressed]}
    >
      {/* Selected fill + 2px ring fade in over the resting 1px border, so nothing shifts. */}
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.ring, ring]} />

      {detail ? (
        <View style={styles.labelBlock}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.detail}>{detail}</Text>
        </View>
      ) : (
        <Text style={[styles.label, compact && styles.labelCompact]}>{label}</Text>
      )}

      {indicator === 'radio' && (
        <View style={styles.radio}>
          <Animated.View style={[styles.radioOn, mark]}>
            <View style={styles.radioDot} />
          </Animated.View>
        </View>
      )}
      {indicator === 'checkbox' && (
        <View style={styles.checkbox}>
          <Animated.View style={[styles.checkboxOn, mark]}>
            <Check size={14} color={colors.white} strokeWidth={3} />
          </Animated.View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 58,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: radii.option,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  compact: { minHeight: 48, paddingHorizontal: 10, paddingVertical: 10, justifyContent: 'center', flex: 1 },
  pressed: { backgroundColor: colors.background },
  ring: {
    margin: -1,
    borderRadius: radii.option,
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: colors.selectedFill,
  },
  label: { flexShrink: 1, fontFamily: fonts.medium, fontSize: 16, lineHeight: 22, color: colors.text },
  labelBlock: { flexShrink: 1, gap: 2 },
  detail: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, color: colors.muted },
  labelCompact: { fontSize: 15, textAlign: 'center' },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.radioIdle,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.white },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: colors.radioIdle,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 7,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
