import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { lightColors } from '@/constants/colors';
import { tokenStore, apiJson } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

/**
 * S-01 스플래시 화면
 * SecureStore 토큰 확인 → /auth/me 로 유효성 검증 후 분기.
 */
const SplashScreen = () => {
  const [ready, setReady] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    (async () => {
      try {
        const token = await tokenStore.get();
        if (token) {
          const { user } = await apiJson<{
            user: {
              id: string;
              kakaoId: number;
              nickname: string;
              avatarUrl: string | null;
              email: string | null;
            };
          }>('/api/auth/me');
          setSession(
            {
              id: user.id,
              kakaoId: user.kakaoId,
              nickname: user.nickname,
              avatarUrl: user.avatarUrl,
              email: user.email,
              createdAt: new Date().toISOString(),
            },
            token,
          );
          setHasToken(true);
        }
      } catch {
        await tokenStore.remove();
      } finally {
        setReady(true);
      }
    })();
  }, [setSession]);

  if (ready) {
    return <Redirect href={hasToken ? '/(tabs)' : '/onboarding'} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Text style={styles.iconEmoji}>📦</Text>
      </View>
      <Text style={styles.logo}>송줍줍</Text>
      <View style={styles.dots}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.point,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    width: 88,
    height: 88,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconEmoji: { fontSize: 48 },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 28,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
});

export default SplashScreen;
