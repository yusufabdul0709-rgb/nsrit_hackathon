import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline';
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Button({ title, onPress, variant = 'primary', icon, style }: ButtonProps) {
  const isOutline = variant === 'outline';
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.button,
        isOutline ? styles.outlineButton : styles.primaryButton,
        style,
      ]}
    >
      {icon}
      <Text style={[styles.text, isOutline ? styles.outlineText : styles.primaryText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  text: {
    ...Typography.body,
    fontWeight: '600',
    fontSize: 15,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: Colors.primary,
  },
});
