import { TextStyle } from 'react-native';

export const Typography: {
  heading: TextStyle;
  section: TextStyle;
  cardTitle: TextStyle;
  body: TextStyle;
  caption: TextStyle;
} = {
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  body: {
    fontSize: 14,
  },
  caption: {
    fontSize: 12,
  },
};
