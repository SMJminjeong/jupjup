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
    splash: {
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
        backgroundColor: '#2563EB',
      },
    },
    plugins: ['expo-router', 'expo-secure-store'],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000',
    },
  },
};
