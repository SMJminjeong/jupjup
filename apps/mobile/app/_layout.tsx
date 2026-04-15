import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '@/components/Toast';

const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="login" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="search" options={{ presentation: 'modal' }} />
          <Stack.Screen name="add" options={{ presentation: 'modal' }} />
          <Stack.Screen name="scrap/[id]" options={{ headerShown: true, title: '' }} />
          <Stack.Screen name="settings/notifications" options={{ headerShown: true, title: '알림 설정' }} />
          <Stack.Screen name="settings/keywords" options={{ headerShown: true, title: '관심 키워드' }} />
        </Stack>
      </ToastProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;
