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
    success: '#E7F9F0',
    warning: '#FFF7E6',
    danger: '#FEE2E2',
    offline: '#FEF1E8',
  };

  const color = colorMap[status] || Colors.primary;
  const backgroundColor = bgMap[status] || '#F0F4FF';

  return (
    <View style={[styles.chip, { backgroundColor }]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  label: {
    ...Typography.caption,
    fontWeight: '600',
  },
});
