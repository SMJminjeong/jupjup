import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useCallback } from 'react';
import { tokenStore } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

// api.ts와 동일한 소스에서 가져옴
import Constants from 'expo-constants';

const API_URL =
  Constants.expoConfig?.extra?.apiUrl ??
  process.env.EXPO_PUBLIC_API_URL ??
  'http://localhost:4000';
const KAKAO_REST_API_KEY = '9c60e499183ab85d6f457e992e02e2ce';

WebBrowser.maybeCompleteAuthSession();

export const useKakaoAuth = () => {
  const { setSession, setLoading, clear } = useAuthStore();

  const login = useCallback(async () => {
    setLoading(true);
    try {
      // 앱으로 돌아올 deep link URL
      const returnUrl = Linking.createURL('login');

      // 서버 콜백 URL (카카오에 등록한 redirect URI)
      const callbackUrl = `${API_URL}/api/auth/kakao/callback`;

      // 카카오 인증 페이지 URL
      const authUrl =
        `https://kauth.kakao.com/oauth/authorize` +
        `?client_id=${KAKAO_REST_API_KEY}` +
        `&redirect_uri=${encodeURIComponent(callbackUrl)}` +
        `&response_type=code` +
        `&scope=profile_nickname,profile_image` +
        `&state=${encodeURIComponent(returnUrl)}`;

      console.log('[KakaoAuth] callbackUrl:', callbackUrl);
      console.log('[KakaoAuth] returnUrl:', returnUrl);

      // 브라우저 열기 → 카카오 로그인 → 서버 콜백 → 앱으로 redirect
      const result = await WebBrowser.openAuthSessionAsync(authUrl, returnUrl);
      console.log('[KakaoAuth] result:', JSON.stringify(result));

      if (result.type !== 'success' || !result.url) {
        throw new Error('카카오 로그인이 취소되었습니다');
      }

      // redirect URL에서 토큰/유저 정보 파싱
      const parsed = Linking.parse(result.url);
      const token = parsed.queryParams?.token as string | undefined;
      const nickname = parsed.queryParams?.nickname as string | undefined;
      const userId = parsed.queryParams?.userId as string | undefined;
      const kakaoId = parsed.queryParams?.kakaoId as string | undefined;
      const avatarUrl = parsed.queryParams?.avatarUrl as string | undefined;

      if (!token || !userId) {
        throw new Error('로그인 응답이 올바르지 않습니다');
      }

      // 토큰 저장 + 스토어 업데이트
      await tokenStore.set(token);
      setSession(
        {
          id: userId,
          kakaoId: Number(kakaoId),
          nickname: nickname ?? '사용자',
          avatarUrl: avatarUrl || null,
          email: null,
          createdAt: new Date().toISOString(),
        },
        token,
      );

      return true;
    } catch (err) {
      console.error('카카오 로그인 실패:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setSession, setLoading]);

  const logout = useCallback(async () => {
    await tokenStore.remove();
    clear();
  }, [clear]);

  return { login, logout, isReady: true };
};
