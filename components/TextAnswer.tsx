import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors, fonts, radii, timing } from '../theme';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  accessibilityLabel: string;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'number-pad';
  autoFocus?: boolean;
  onSubmitEditing?: () => void;
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
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={accessibilityLabel}
        selectionColor={colors.accent}
        cursorColor={colors.accent}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[styles.input, multiline && styles.multiline]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.option,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  ring: { margin: -1, borderRadius: radii.option, borderWidth: 2, borderColor: colors.accent },
  input: {
    minHeight: 58,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.text,
  },
  multiline: { minHeight: 140, paddingTop: 16 },
});
