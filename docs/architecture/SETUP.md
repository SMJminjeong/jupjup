# SETUP.md — jupjup 모노레포 세팅 가이드

> **앱 이름:** 송줍줍 (v1) → 줍줍 (v2 리브랜딩)  
> **레포:** github.com/SMJminjeong/jupjup  
> **패키지 매니저:** pnpm  
> **모노레포 툴:** Turborepo

---

## 1. 기술 스택 요약

| 영역 | 기술 | 버전 |
|------|------|------|
| 앱 | React Native + Expo | SDK 51+ |
| 언어 | TypeScript | 5.x |
| 상태관리 | Zustand | 4.x |
| 네비게이션 | Expo Router (파일 기반) | 3.x |
| 백엔드 | Node.js + Express | 20 LTS |
| DB | Supabase (PostgreSQL) | - |
| 스크래퍼 | rss-parser + node-cron | - |
| 인증 | Kakao OAuth 2.0 + JWT | - |
| 푸시 알림 | Expo Push Notification | - |
| 빌드 | Expo EAS Build | - |
| 인프라 | Railway (서버) + Supabase Cloud | - |
| 패키지 매니저 | pnpm | 9.x |
| 모노레포 | Turborepo | 2.x |

---

## 2. 디렉토리 구조

```
jupjup/
├── apps/
│   ├── mobile/                  # React Native + Expo 앱
│   │   ├── app/                 # Expo Router 파일 기반 라우팅
│   │   │   ├── (tabs)/          # 하단 탭 네비게이션
│   │   │   │   ├── index.tsx    # 홈 피드 (S-04)
│   │   │   │   ├── ai.tsx       # AI 뉴스 (S-05)
│   │   │   │   ├── jobs.tsx     # 채용 (S-06)
│   │   │   │   ├── finance.tsx  # 재테크 (S-07)
│   │   │   │   └── my.tsx       # 마이페이지 (S-11)
│   │   │   ├── scrap/
│   │   │   │   └── [id].tsx     # 스크랩 상세 (S-08)
│   │   │   ├── search.tsx       # 검색 (S-09)
│   │   │   ├── add.tsx          # URL 저장 (S-10)
│   │   │   ├── login.tsx        # 로그인 (S-03)
│   │   │   └── _layout.tsx      # 루트 레이아웃
│   │   ├── components/          # 공통 컴포넌트
│   │   │   ├── ScrapCard.tsx    # 뉴스 카드
│   │   │   ├── JobCard.tsx      # 채용 공고 카드
│   │   │   └── CategoryBadge.tsx
│   │   ├── hooks/               # 커스텀 훅
│   │   ├── stores/              # Zustand 스토어
│   │   ├── constants/           # 색상, 폰트 등
│   │   ├── app.json             # Expo 설정
│   │   └── package.json
│   │
│   └── server/                  # Node.js + Express 백엔드
│       ├── src/
│       │   ├── routes/          # API 라우터
│       │   │   ├── auth.ts      # 카카오 로그인
│       │   │   ├── scraps.ts    # 스크랩 CRUD
│       │   │   └── keywords.ts  # 관심 키워드
│       │   ├── scraper/         # RSS 수집 엔진
│       │   │   ├── feeds.ts     # RSS 피드 목록
│       │   │   ├── parser.ts    # rss-parser 래퍼
│       │   │   └── cron.ts      # node-cron 스케줄러
│       │   ├── middleware/      # 인증 미들웨어 등
│       │   ├── lib/             # Supabase 클라이언트
│       │   └── index.ts         # 서버 진입점
│       └── package.json
│
├── packages/
│   ├── types/                   # 공통 TypeScript 타입 (앱·서버 공유)
│   │   ├── src/
│   │   │   ├── scrap.ts         # Scrap, Category 타입
│   │   │   ├── user.ts          # User 타입
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── utils/                   # 공통 유틸 함수
│       ├── src/
│       │   ├── date.ts          # 날짜 포맷 (N분 전, D-Day 등)
│       │   ├── url.ts           # OG 메타데이터 파싱
│       │   └── index.ts
│       └── package.json
│
├── turbo.json                   # Turborepo 파이프라인 설정
├── package.json                 # 루트 워크스페이스 정의
├── pnpm-workspace.yaml          # pnpm 워크스페이스
├── .env.example                 # 환경변수 예시
├── .gitignore
├── SETUP.md                     # 이 파일
└── CONVENTIONS.md               # 브랜치·커밋 컨벤션
```

---

## 3. 초기 세팅 순서

### 3.1 사전 요구사항

```bash
# Node.js 20 LTS 이상 확인
node -v

# pnpm 설치 (없으면)
npm install -g pnpm

# pnpm 버전 확인
pnpm -v
```

### 3.2 레포 클론 & 의존성 설치

```bash
git clone https://github.com/SMJminjeong/jupjup.git
cd jupjup
pnpm install        # 전체 워크스페이스 의존성 한 번에 설치
```

### 3.3 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일에 아래 값 채우기:

```env
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# 카카오 OAuth
KAKAO_REST_API_KEY=
KAKAO_NATIVE_APP_KEY=

# JWT
JWT_SECRET=

# 서버
PORT=4000
```

### 3.4 개발 서버 실행

```bash
# 루트에서 앱 + 서버 동시 실행
pnpm dev

# 앱만 실행
pnpm dev --filter=mobile

# 서버만 실행
pnpm dev --filter=server
```

### 3.5 Expo 앱 실행

```bash
cd apps/mobile
pnpm start          # Expo 개발 서버
# → QR 코드 스캔 (Expo Go 앱) 또는
# → i 입력 (iOS 시뮬레이터) / a 입력 (Android 에뮬레이터)
```

---

## 4. 공통 타입 사용법

`packages/types`에 정의된 타입을 앱·서버 양쪽에서 import해서 사용.

```typescript
// 어디서든 동일하게
import { Scrap, Category } from '@jupjup/types';

// 사용 예시
const scrap: Scrap = {
  id: 'uuid',
  category: 'ai_news',
  title: '...',
  // ...
};
```

타입 변경 시 앱·서버 양쪽에서 즉시 TypeScript 에러로 감지됨.

---

## 5. 주요 패키지 내 참조 방법

`pnpm-workspace.yaml`에 워크스페이스가 등록되어 있어서 로컬 패키지를 npm 패키지처럼 import 가능.

```json
// apps/mobile/package.json
{
  "dependencies": {
    "@jupjup/types": "workspace:*",
    "@jupjup/utils": "workspace:*"
  }
}
```

---

## 6. 빌드

```bash
# 전체 빌드
pnpm build

# 서버만 빌드
pnpm build --filter=server

# EAS 앱 빌드 (iOS)
cd apps/mobile && eas build --platform ios

# EAS 앱 빌드 (Android)
cd apps/mobile && eas build --platform android
```

---

## 7. 환경별 구분

| 환경 | 설명 |
|------|------|
| `development` | 로컬 개발 (Expo Go / 시뮬레이터) |
| `preview` | TestFlight / 구글 내부 테스트 배포 |
| `production` | 앱스토어 / 플레이스토어 출시 버전 |