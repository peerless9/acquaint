import { useEffect, useState, type ReactNode } from 'react';
import { Platform, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors, fonts, radii, timing } from '../theme';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  accessibilityLabel: string;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  autoFocus?: boolean;
  onSubmitEditing?: () => void;
  /** Extra TextInput props, e.g. secureTextEntry or autoComplete for account fields. */
  inputProps?: Omit<TextInputProps, 'value' | 'onChangeText' | 'style'>;
  /** Element on the right edge of the field, such as a show-password button. */
  accessory?: ReactNode;
};

export function TextAnswer({
  value,
  onChangeText,
  accessibilityLabel,
  placeholder,
  multiline,
  keyboardType = 'default',
  autoFocus,
  onSubmitEditing,
  inputProps,
  accessory,
}: Props) {
  const [focused, setFocused] = useState(false);
  const focus = useSharedValue(0);

  useEffect(() => {
    focus.value = withTiming(focused ? 1 : 0, { duration: timing.base });
  }, [focused, focus]);

  const ring = useAnimatedStyle(() => ({ opacity: focus.value }));

  return (
    <View style={styles.wrap}>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.ring, ring]} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        keyboardType={keyboardType}
        autoFocus={autoFocus}
        returnKeyType={multiline ? 'default' : 'done'}
        onSubmitEditing={onSubmitEditing}
        accessibilityLabel={accessibilityLabel}
        selectionColor={colors.accent}
        cursorColor={colors.accent}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...inputProps}
        onFocus={(e) => {
          setFocused(true);
          inputProps?.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          inputProps?.onBlur?.(e);
        }}
        style={[styles.input, multiline && styles.multiline, Platform.OS === 'web' && webNoOutline]}
      />
      {accessory}
    </View>
  );
}

// The animated ring is the focus indicator, so drop the browser's default outline on web.
const webNoOutline = { outlineStyle: 'none' } as object;

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.option,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  ring: { margin: -1, borderRadius: radii.option, borderWidth: 2, borderColor: colors.accent },
  input: {
    flex: 1,
    minHeight: 58,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.text,
  },
  multiline: { minHeight: 140, paddingTop: 16 },
});
