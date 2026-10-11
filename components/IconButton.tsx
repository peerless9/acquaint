import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { colors, radii, sizes } from '../theme';

type Props = {
  icon: ReactNode;
  accessibilityLabel: string;
  onPress?: () => void;
  disabled?: boolean;
  /** "round" is the bordered 56px circle; "plain" is a bare 44px target. */
  variant?: 'round' | 'plain';
};

export function IconButton({ icon, accessibilityLabel, onPress, disabled, variant = 'round' }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      hitSlop={variant === 'plain' ? 4 : 0}
      style={({ pressed }) => [
        variant === 'round' ? styles.round : styles.plain,
        pressed && (variant === 'round' ? styles.roundPressed : styles.plainPressed),
        disabled && styles.disabled,
      ]}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  round: {
    width: sizes.button,
    height: sizes.button,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundPressed: { backgroundColor: colors.selectedFill },
  plain: {
    width: sizes.minTap,
    height: sizes.minTap,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plainPressed: { backgroundColor: colors.chip },
  disabled: { opacity: 0.4 },
});
