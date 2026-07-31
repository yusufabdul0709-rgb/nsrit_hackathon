import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

type StatusType = 'success' | 'warning' | 'danger' | 'offline' | 'default';

interface StatusChipProps {
  label: string;
  status?: StatusType;
}

export function StatusChip({ label, status = 'default' }: StatusChipProps) {
  
  const getColors = () => {
    switch (status) {
      case 'success':
        return { bg: '#E7F9F0', text: Colors.status.success };
      case 'warning':
        return { bg: '#FFF7E6', text: Colors.status.warning };
      case 'danger':
        return { bg: '#FDECEB', text: Colors.status.danger };
      case 'offline':
        return { bg: '#FEF1E8', text: Colors.status.offline };
      default:
        return { bg: Colors.border, text: Colors.text.secondary };
    }
  };

  const { bg, text } = getColors();

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* Optional dot indicator could go here */}
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999, // Pill shape
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...Typography.caption,
    fontWeight: '600',
  },
});
