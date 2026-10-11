import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { LocateFixed } from 'lucide-react-native';

import { OptionCard } from './OptionCard';
import { nearestArea, SERVICE_RADIUS_MILES } from '../data/places';
import { colors, fonts, radii, sizes } from '../theme';

type Props = { options: string[]; value?: string; onChange: (area: string) => void };

type Status = { kind: 'idle' } | { kind: 'locating' } | { kind: 'found' | 'far' | 'error'; message: string };

export function LocationAnswer({ options, value, onChange }: Props) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const useMyLocation = async () => {
    setStatus({ kind: 'locating' });
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) {
        setStatus({ kind: 'error', message: 'Location access is off. Pick your neighborhood below instead.' });
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { area, miles } = nearestArea([pos.coords.latitude, pos.coords.longitude]);
      if (miles > SERVICE_RADIUS_MILES) {
        setStatus({
          kind: 'far',
          message: `You're about ${Math.round(miles).toLocaleString('en-US')} miles from San Francisco. Pick the neighborhood you'd go on dates in.`,
        });
        return;
      }
      onChange(area);
      setStatus({ kind: 'found', message: `Closest neighborhood: ${area}. Change it below if that's not right.` });
    } catch {
      setStatus({ kind: 'error', message: "We couldn't get your location. Pick your neighborhood below instead." });
    }
  };

  const locating = status.kind === 'locating';

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={useMyLocation}
        disabled={locating}
        accessibilityRole="button"
        accessibilityLabel="Use my current location"
        accessibilityState={{ busy: locating }}
        style={({ pressed }) => [styles.locate, pressed && styles.locatePressed]}
      >
        {locating ? (
          <ActivityIndicator color={colors.accent} />
        ) : (
          <LocateFixed size={18} color={colors.accent} strokeWidth={1.75} />
        )}
        <Text style={styles.locateText}>{locating ? 'Finding you…' : 'Use my current location'}</Text>
      </Pressable>

      {status.kind === 'found' || status.kind === 'far' || status.kind === 'error' ? (
        <Text style={[styles.status, status.kind === 'found' && styles.statusOk]} accessibilityLiveRegion="polite">
          {status.message}
        </Text>
      ) : null}

      <View style={styles.options} accessibilityRole="radiogroup">
        {options.map((opt) => (
          <OptionCard key={opt} label={opt} selected={value === opt} onPress={() => onChange(opt)} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  locate: {
    height: 48,
    minHeight: sizes.minTap,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  locatePressed: { backgroundColor: colors.selectedFill },
  locateText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.accent },
  status: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, color: colors.muted },
  statusOk: { color: colors.chipText },
  options: { gap: 10, marginTop: 4 },
});
