import { useEffect, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors, fonts, radii, sizes, timing } from '../theme';

type Props = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  /** "outline" is the quieter confirmed state, e.g. "Added to calendar". */
  variant?: 'solid' | 'outline';
  icon?: ReactNode;
  accessibilityHint?: string;
};

export function PrimaryButton({ label, onPress, disabled = false, variant = 'solid', icon, accessibilityHint }: Props) {
  // 0 = disabled, 1 = solid, 2 = outline
  const mode = useSharedValue(disabled ? 0 : variant === 'outline' ? 2 : 1);
  const pressed = useSharedValue(0);

  useEffect(() => {
    mode.value = withTiming(disabled ? 0 : variant === 'outline' ? 2 : 1, { duration: timing.base });
  }, [disabled, variant, mode]);

  const containerStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(mode.value, [0, 1, 2], [colors.disabled, colors.accent, colors.surface]);
    return {
      backgroundColor: interpolateColor(pressed.value, [0, 1], [bg, mode.value > 1.5 ? colors.selectedFill : colors.accentPressed]),
      borderColor: interpolateColor(mode.value, [0, 1, 2], [colors.disabled, colors.accent, colors.accent]),
      transform: [{ scale: 1 - pressed.value * 0.02 }],
    };
  });

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(mode.value, [0, 1, 2], [colors.disabledText, colors.white, colors.accent]),
  }));

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => (pressed.value = withTiming(1, { duration: timing.fast }))}
      onPressOut={() => (pressed.value = withTiming(0, { duration: timing.base }))}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      style={styles.pressable}
    >
      <Animated.View style={[styles.button, containerStyle]}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <Animated.Text style={[styles.label, labelStyle]} numberOfLines={1}>
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: { alignSelf: 'stretch', flexGrow: 1 },
  button: {
    height: sizes.button,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  icon: { marginLeft: -4 },
  label: { fontFamily: fonts.semibold, fontSize: 16 },
});
