import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/constants/theme';

/**
 * S-03 로그인 화면 — 카카오 OAuth
 */
const LoginScreen = () => {
  const colors = useTheme();

  const handleKakaoLogin = async () => {
    // TODO: Kakao OAuth 연동 (expo-auth-session)
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <View style={styles.content}>
        <View style={[styles.iconBox, { backgroundColor: colors.point }]}>
          <Text style={styles.iconEmoji}>📦</Text>
        </View>
        <Text style={[styles.logo, { color: colors.textPrimary }]}>송줍줍</Text>
        <Text style={[styles.slogan, { color: colors.textSecondary }]}>
          좋은 정보, 줍줍 모아요
        </Text>
        <Text style={styles.illustration}>🗄️</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.kakaoButton, { backgroundColor: colors.kakao }]}
          onPress={handleKakaoLogin}
        >
          <Text style={[styles.kakaoIcon, { color: colors.kakaoText }]}>💬</Text>
          <Text style={[styles.kakaoText, { color: colors.kakaoText }]}>
            카카오로 계속하기
          </Text>
        </TouchableOpacity>
        <Text style={[styles.terms, { color: colors.textTertiary }]}>
          로그인 시{' '}
          <Text style={[styles.termsLink, { color: colors.textSecondary }]}>
            서비스 이용약관
          </Text>
          {' 및 '}
          <Text style={[styles.termsLink, { color: colors.textSecondary }]}>
            개인정보처리방침
          </Text>
          에 동의합니다
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  content: { alignItems: 'center', paddingTop: 60 },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconEmoji: { fontSize: 36 },
  logo: { fontSize: 28, fontWeight: '700' },
  slogan: { fontSize: 15, marginTop: 8 },
  illustration: { fontSize: 110, marginTop: 64 },
  footer: { paddingHorizontal: 24, paddingBottom: 32 },
  kakaoButton: {
    height: 54,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  kakaoIcon: { fontSize: 18 },
  kakaoText: { fontSize: 16, fontWeight: '700' },
  terms: { fontSize: 12, textAlign: 'center', marginTop: 16 },
  termsLink: { textDecorationLine: 'underline' },
});

export default LoginScreen;
