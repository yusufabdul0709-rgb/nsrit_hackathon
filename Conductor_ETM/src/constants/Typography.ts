import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'sans-serif',
});

export const Typography = {
  heading: {
    fontFamily,
    fontSize: 32,
    fontWeight: 'bold' as const,
  },
  section: {
    fontFamily,
    fontSize: 22,
    fontWeight: '600' as const,
  },
  cardTitle: {
    fontFamily,
    fontSize: 18,
    fontWeight: '500' as const,
  },
  body: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400' as const,
  },
  caption: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400' as const,
  },
  numbers: {
    fontFamily,
    fontWeight: 'bold' as const,
  }
};
