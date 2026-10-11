import { StyleSheet, Text } from 'react-native';

import { colors, fonts } from '../theme';

export function Wordmark({ size = 26 }: { size?: number }) {
  return (
    <Text
      style={[styles.text, { fontSize: size, letterSpacing: -0.03 * size }]}
      accessibilityRole="header"
      accessibilityLabel="acquaint"
    >
      acquaint<Text style={styles.dot}>.</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  text: { fontFamily: fonts.heading, color: colors.text },
  dot: { color: colors.accent },
});
