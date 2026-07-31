import React from 'react';
import { View, ViewProps, useColorScheme } from 'react-native';
import { Colors } from '../constants/theme';

export type ThemedViewProps = ViewProps & {
  type?: keyof typeof Colors.light;
};

export function ThemedView({ style, type = 'backgroundElement', ...rest }: ThemedViewProps) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? Colors.dark : Colors.light;
  const backgroundColor = theme[type] || theme.backgroundElement;

  return <View style={[{ backgroundColor }, style]} {...rest} />;
}
