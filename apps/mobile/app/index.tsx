import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
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
      <Text style={styles.logo}>송줍줍</Text>
      <ActivityIndicator color="#FFFFFF" style={{ marginTop: 24 }} />
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
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default SplashScreen;
