/**
 * 디자인 시스템 컬러 팔레트 (DESIGN_SPEC.md 기준)
 */
export const lightColors = {
  bgPrimary: '#FFFFFF',
  bgSurface: '#F5F5F7',
  bgCard: '#FFFFFF',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textTertiary: '#ADADAD',
  point: '#2563EB',
  border: '#E5E5E5',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  category: {
    ai_news: '#6366F1',
    job_news: '#10B981',
    job_post: '#F59E0B',
    finance: '#EF4444',
  },
  kakao: '#FEE500',
  kakaoText: '#191919',
};

export const darkColors = {
  bgPrimary: '#0F0F10',
  bgSurface: '#1C1C1E',
  bgCard: '#2C2C2E',
  textPrimary: '#F2F2F7',
  textSecondary: '#9B9B9B',
  textTertiary: '#636366',
  point: '#3B82F6',
  border: '#3A3A3C',
  success: '#4ADE80',
  warning: '#FBBF24',
  danger: '#F87171',
  category: {
    ai_news: '#818CF8',
    job_news: '#34D399',
    job_post: '#FBBF24',
    finance: '#F87171',
  },
  kakao: '#FEE500',
  kakaoText: '#191919',
};

export type ThemeColors = typeof lightColors;
