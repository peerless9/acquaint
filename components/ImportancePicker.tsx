import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Segmented } from './Segmented';
import { IMPORTANCE_LEVELS, type Importance } from '../data/questions';
import { colors, fonts } from '../theme';

type Props = { value?: Importance; onChange: (value: Importance) => void };

export function ImportancePicker({ value, onChange }: Props) {
  return (
    <Animated.View entering={FadeIn.duration(220)} style={styles.wrap}>
      <View style={styles.rule} />
      <Text style={styles.label}>
        How important is this to you?
      </Text>
      <Segmented
        options={IMPORTANCE_LEVELS}
        value={value === undefined ? undefined : value - 1}
        onChange={(i) => onChange((i + 1) as Importance)}
        accessibilityLabels={IMPORTANCE_LEVELS.map((l) => `${l} important`)}
        height={48}
        fontSize={15}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  rule: { height: 1, backgroundColor: colors.borderSoft, marginBottom: 8 },
  label: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
});
