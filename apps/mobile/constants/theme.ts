import { useColorScheme } from 'react-native';
import { darkColors, lightColors, type ThemeColors } from './colors';

export const typography = {
  hero: { fontFamily: 'Pretendard', fontSize: 24, fontWeight: '700' as const, lineHeight: 31 },
  title: { fontFamily: 'Pretendard', fontSize: 18, fontWeight: '600' as const, lineHeight: 25 },
  subtitle: { fontFamily: 'Pretendard', fontSize: 16, fontWeight: '600' as const, lineHeight: 22 },
  body: { fontFamily: 'Pretendard', fontSize: 14, fontWeight: '400' as const, lineHeight: 22 },
  bodySmall: { fontFamily: 'Pretendard', fontSize: 13, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontFamily: 'Pretendard', fontSize: 12, fontWeight: '400' as const, lineHeight: 17 },
};

export const radius = {
  card: 12,
  button: 10,
  pill: 20,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const useTheme = (): ThemeColors => {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkColors : lightColors;
};
