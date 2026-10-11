import { StyleSheet, Text, View } from 'react-native';

import { Segmented } from './Segmented';
import type { GroupQuestion } from '../data/questions';
import { colors, fonts, sizes } from '../theme';

type Props = {
  items: GroupQuestion['items'];
  values: Record<string, unknown>;
  onChange: (id: string, value: string) => void;
};

export function GroupAnswer({ items, values, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      {items.map((item) => {
        const current = values[item.id];
        const index = typeof current === 'string' ? item.options.indexOf(current) : -1;
        return (
          <View key={item.id} style={styles.row}>
            <Text style={styles.label}>{item.label}</Text>
            <Segmented
              options={item.options}
              value={index < 0 ? undefined : index}
              onChange={(i) => onChange(item.id, item.options[i])}
              accessibilityLabels={item.options.map((o) => `${item.label} ${o}`)}
              height={sizes.minTap}
              fontSize={15}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 20 },
  row: { gap: 10 },
  label: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
});
