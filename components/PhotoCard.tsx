import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';

import { colors, radii, timing } from '../theme';

const RING_GAP = 3;
const RING_WIDTH = 3;
const RING_OFFSET = RING_GAP + RING_WIDTH;

type Props = {
  photo: string;
  tint: string;
  selected: boolean;
  /** Another card is selected, so this one recedes. */
  dimmed: boolean;
  onPress: () => void;
  accessibilityLabel: string;
};

export function PhotoCard({ photo, tint, selected, dimmed, onPress, accessibilityLabel }: Props) {
  const on = useSharedValue(selected ? 1 : 0);
  const faded = useSharedValue(dimmed ? 1 : 0);

  useEffect(() => {
    on.value = withTiming(selected ? 1 : 0, { duration: timing.base });
  }, [selected, on]);
  useEffect(() => {
    faded.value = withTiming(dimmed ? 1 : 0, { duration: timing.base });
  }, [dimmed, faded]);

  const wrapStyle = useAnimatedStyle(() => ({ opacity: 1 - faded.value * 0.45 }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: on.value,
    transform: [{ scale: 0.985 + on.value * 0.015 }],
  }));
  const badgeStyle = useAnimatedStyle(() => ({
    opacity: on.value,
    transform: [{ scale: 0.5 + on.value * 0.5 }],
  }));

  return (
    <Animated.View style={[styles.wrap, wrapStyle]}>
      <Animated.View pointerEvents="none" style={[styles.ring, ringStyle]} />
      <Pressable
        onPress={onPress}
        accessibilityRole="radio"
        accessibilityState={{ selected }}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={selected ? 'Tap again to deselect' : 'Selects this match'}
        style={({ pressed }) => [styles.card, { backgroundColor: tint }, pressed && styles.pressed]}
      >
        <Image source={{ uri: photo }} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
        <Animated.View style={[styles.badge, badgeStyle]}>
          <Check size={18} color={colors.white} strokeWidth={2.5} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  ring: {
    position: 'absolute',
    top: -RING_OFFSET,
    left: -RING_OFFSET,
    right: -RING_OFFSET,
    bottom: -RING_OFFSET,
    borderRadius: radii.card + RING_OFFSET,
    borderWidth: RING_WIDTH,
    borderColor: colors.accent,
  },
  card: { flex: 1, borderRadius: radii.card, overflow: 'hidden' },
  pressed: { transform: [{ scale: 0.99 }] },
  badge: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
