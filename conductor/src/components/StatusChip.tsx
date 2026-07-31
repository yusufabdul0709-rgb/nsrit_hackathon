import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

interface StatusChipProps {
  label: string;
  status: 'success' | 'warning' | 'danger' | 'offline';
}

export function StatusChip({ label, status }: StatusChipProps) {
  const colorMap = {
    success: Colors.status.success,
    warning: Colors.status.warning,
    danger: Colors.status.danger,
    offline: Colors.status.offline,
  };

  const bgMap = {
    success: Colors.status.successBg,
    warning: Colors.status.warningBg,
    danger: Colors.status.dangerBg,
    offline: Colors.status.offlineBg,
  };

  const color = colorMap[status] || Colors.primary;
  const backgroundColor = bgMap[status] || Colors.primaryLight;

  return (
    <View style={[styles.chip, { backgroundColor }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    ...Typography.caption,
    fontWeight: '600',
  },
});
