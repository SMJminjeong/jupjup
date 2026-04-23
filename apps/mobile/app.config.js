const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  expo: {
    name: '송줍줍',
    slug: 'songjupjup',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'songjupjup',
    userInterfaceStyle: 'automatic',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#2563EB',
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.songmj.songjupjup',
      deploymentTarget: '16.0',
    },
    android: {
      package: 'com.songmj.songjupjup',
      minSdkVersion: 29,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#2563EB',
      },
    },
    updates: {
      url: 'https://u.expo.dev/9a2c5a64-adec-4092-bea6-24ca4a5e095b',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    plugins: ['expo-router', 'expo-secure-store'],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000',
      kakaoRestApiKey: process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY || '',
      eas: {
        projectId: '9a2c5a64-adec-4092-bea6-24ca4a5e095b',
      },
    },
  },
};
