import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { lightColors } from '@/constants/colors';

/**
 * S-01 스플래시 화면
 * 자동 로그인 토큰 확인 후 분기.
 */
const SplashScreen = () => {
  const [ready, setReady] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // TODO: expo-secure-store에서 토큰 조회
    const t = setTimeout(() => {
      setHasToken(false);
      setReady(true);
    }, 800);
    return () => clearTimeout(t);
  }, []);

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
