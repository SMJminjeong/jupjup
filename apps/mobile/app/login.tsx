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
        <Text style={[styles.logo, { color: colors.textPrimary }]}>송줍줍</Text>
        <Text style={[styles.slogan, { color: colors.textSecondary }]}>
          좋은 정보, 줍줍 모아요
        </Text>
        <View style={[styles.illustration, { backgroundColor: colors.bgSurface }]} />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.kakaoButton, { backgroundColor: colors.kakao }]}
          onPress={handleKakaoLogin}
        >
          <Text style={[styles.kakaoText, { color: colors.kakaoText }]}>
            카카오로 계속하기
          </Text>
        </TouchableOpacity>
        <Text style={[styles.terms, { color: colors.textTertiary }]}>
          로그인 시 서비스 이용약관 및 개인정보처리방침에 동의합니다
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  content: { alignItems: 'center', paddingTop: 80 },
  logo: { fontSize: 32, fontWeight: '700' },
  slogan: { fontSize: 16, marginTop: 12 },
  illustration: { width: 200, height: 200, borderRadius: 16, marginTop: 60 },
  footer: { paddingHorizontal: 24, paddingBottom: 32 },
  kakaoButton: {
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kakaoText: { fontSize: 16, fontWeight: '700' },
  terms: { fontSize: 12, textAlign: 'center', marginTop: 16 },
});

export default LoginScreen;
