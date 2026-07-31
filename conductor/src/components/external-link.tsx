import React from 'react';
import { Link } from 'expo-router';
import { Platform } from 'react-native';

type Props = Omit<React.ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href as any}
      onPress={(event) => {
        if (Platform.OS !== 'web') {
          event.preventDefault();
        }
      }}
    />
  );
}
