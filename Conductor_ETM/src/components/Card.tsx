import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Colors } from '../constants/Colors';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  padding?: number;
}

export function Card({ children, padding = 24, style, ...props }: CardProps) {
  return (
    <View style={[styles.card, { padding }, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3, // For Android
  },
});
