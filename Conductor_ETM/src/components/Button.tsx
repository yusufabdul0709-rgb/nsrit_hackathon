import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export function Button({ 
  title, 
  variant = 'primary', 
  isLoading, 
  icon,
  style, 
  disabled,
  ...props 
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';
  
  return (
    <TouchableOpacity 
      style={[
        styles.button,
        isPrimary && styles.primaryButton,
        isSecondary && styles.secondaryButton,
        isOutline && styles.outlineButton,
        disabled && styles.disabledButton,
        style
      ]}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={isPrimary ? '#FFF' : Colors.primary} />
      ) : (
        <>
          {icon && icon}
          <Text style={[
            styles.text,
            isPrimary && styles.primaryText,
            isSecondary && styles.secondaryText,
            isOutline && styles.outlineText,
            disabled && styles.disabledText
          ]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16, // Matches a modern, premium feel
    gap: 8,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  disabledButton: {
    backgroundColor: Colors.border,
    borderColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    ...Typography.body,
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFF',
  },
  secondaryText: {
    color: '#FFF',
  },
  outlineText: {
    color: Colors.primary,
  },
  disabledText: {
    color: Colors.text.secondary,
  }
});
