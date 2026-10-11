import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors, fonts, radii, timing } from '../theme';

type SegmentProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
  height: number;
  fontSize: number;
};

function Segment({ label, selected, onPress, accessibilityLabel, height, fontSize }: SegmentProps) {
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
      accessibilityLabel={accessibilityLabel ?? label}
      style={styles.press}
    >
      <Animated.View style={[styles.segment, { height }, box]}>
        <Animated.Text style={[styles.text, { fontSize }, text]} numberOfLines={1}>
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

type Props = {
  options: readonly string[];
  /** Index of the selected option, or undefined for none. */
  value?: number;
  onChange: (index: number) => void;
  accessibilityLabels?: string[];
  height?: number;
  fontSize?: number;
};

export function Segmented({ options, value, onChange, accessibilityLabels, height = 56, fontSize = 17 }: Props) {
  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {options.map((label, i) => (
        <Segment
          key={label}
          label={label}
          selected={value === i}
          onPress={() => onChange(i)}
          accessibilityLabel={accessibilityLabels?.[i]}
          height={height}
          fontSize={fontSize}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  press: { flex: 1 },
  segment: { borderRadius: radii.pill, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  text: { fontFamily: fonts.semibold },
});
