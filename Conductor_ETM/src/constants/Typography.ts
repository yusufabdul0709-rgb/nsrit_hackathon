import { TextStyle } from 'react-native';

export const Typography: {
  heading: TextStyle;
  section: TextStyle;
  cardTitle: TextStyle;
  body: TextStyle;
  caption: TextStyle;
  statValue: TextStyle;
  statLabel: TextStyle;
  quickActionLabel: TextStyle;
} = {
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: -0.3,
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
};
