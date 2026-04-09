export interface User {
  id: string;
  kakaoId: number;
  nickname: string;
  avatarUrl?: string | null;
  email?: string | null;
  createdAt: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
}
