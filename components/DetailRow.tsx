import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radii } from '../theme';

type Props = { icon: ReactNode; label: string; value: string; detail?: string; last?: boolean };

export function DetailRow({ icon, label, value, detail, last }: Props) {
  return (
    <View
      style={[styles.row, !last && styles.divider]}
      accessible
      accessibilityLabel={[label, value, detail].filter(Boolean).join(', ')}
    >
      <View style={styles.tile}>{icon}</View>
      <View style={styles.text}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
        {detail ? <Text style={styles.detail}>{detail}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  tile: {
    width: 40,
    height: 40,
    borderRadius: radii.tile,
    backgroundColor: colors.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: 2 },
  label: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
  value: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 21, color: colors.text },
  detail: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
});
