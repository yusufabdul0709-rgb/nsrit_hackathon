import React from 'react';
import { Text, TextProps, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '../constants/theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'small' | 'smallBold' | 'link' | 'title';
  themeColor?: keyof typeof Colors.light;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? Colors.dark : Colors.light;
  const color = themeColor ? theme[themeColor] : theme.text;

  return (
    <Text
      style={[
        { color },
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'link' && styles.link,
        type === 'title' && styles.title,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontSize: 12,
  },
  smallBold: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  link: {
    fontSize: 14,
    color: '#2563EB',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
