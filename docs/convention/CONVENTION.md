# CONVENTIONS.md — jupjup 개발 컨벤션

> 브랜치 전략, 커밋 메시지, 코드 스타일 규칙 정의  
> AI(Cursor / Claude)에게 개발 요청 시 이 파일을 참고 컨텍스트로 제공할 것

---

## 1. 브랜치 전략

### 브랜치 구조

```
main                    # 항상 배포 가능한 상태 유지
└── feature/기능명       # 기능 개발 브랜치
└── fix/버그명           # 버그 수정 브랜치
└── chore/작업명         # 설정·문서 등 기타 작업
```

### 규칙

- `main` 브랜치에 직접 push 금지 — 반드시 feature 브랜치에서 작업 후 merge
- 브랜치 이름은 **영문 소문자 + 하이픈** 사용
- 작업 완료 후 feature 브랜치는 merge 즉시 삭제

### 브랜치 이름 예시

```bash
feature/kakao-login
feature/rss-scraper
feature/home-feed-ui
feature/job-post-alarm
fix/scrap-card-thumbnail
fix/token-refresh-error
chore/eslint-setup
chore/supabase-schema
```

### 작업 흐름

```bash
# 1. main에서 feature 브랜치 생성
git checkout main
git pull origin main
git checkout -b feature/kakao-login

# 2. 작업 후 커밋
git add .
git commit -m "feat: 카카오 OAuth 로그인 구현"

# 3. push
git push origin feature/kakao-login

# 4. GitHub에서 PR 생성 → main으로 merge
# 5. 브랜치 삭제
git branch -d feature/kakao-login
```

---

## 2. 커밋 메시지 컨벤션

### 형식

```
타입: 한국어로 작업 내용 설명
```

- 타입은 **영어 소문자** (feat / fix / ui / chore 등)
- 설명은 **한국어**
- 마침표 없음
- 50자 이내 권장

### 커밋 타입

| 타입 | 설명 | 예시 |
|------|------|------|
| `feat` | 새로운 기능 추가 | `feat: 카카오 로그인 추가` |
| `fix` | 버그 수정 | `fix: 썸네일 이미지 깨짐 수정` |
| `ui` | UI/스타일 변경 | `ui: 홈 피드 카드 디자인 수정` |
| `refactor` | 코드 리팩토링 (기능 변화 없음) | `refactor: RSS 파서 함수 분리` |
| `chore` | 설정, 패키지, 문서 등 | `chore: ESLint 설정 추가` |
| `test` | 테스트 추가·수정 | `test: 스크랩 저장 API 테스트 추가` |
| `perf` | 성능 개선 | `perf: 피드 무한 스크롤 최적화` |
| `revert` | 이전 커밋 되돌리기 | `revert: feat: 카카오 로그인 추가 되돌림` |

### 커밋 예시

```bash
feat: 홈 피드 카테고리 탭 필터 구현
feat: RSS 자동 수집 cron 스케줄러 추가
feat: 채용 공고 D-Day 마감 알림 푸시 구현
fix: 로그아웃 후 토큰 미삭제 버그 수정
fix: Android 다크모드 배경색 누락 수정
ui: 스크랩 상세 화면 하단 액션 바 레이아웃 수정
refactor: Supabase 클라이언트 싱글톤으로 변경
chore: 환경변수 예시 파일 업데이트
chore: SETUP.md 초기 세팅 가이드 작성
```

### 여러 작업을 한 커밋에 넣지 않기

```bash
# 나쁜 예 — 한 커밋에 여러 작업
git commit -m "feat: 로그인 추가, fix: 버그 수정, ui: 디자인 변경"

# 좋은 예 — 작업 단위로 분리
git commit -m "feat: 카카오 로그인 API 연동"
git commit -m "fix: JWT 토큰 만료 처리 누락 수정"
git commit -m "ui: 로그인 버튼 카카오 공식 컬러 적용"
```

---

## 3. 코드 스타일

### 도구

| 도구 | 역할 |
|------|------|
| ESLint | 코드 품질 검사 |
| Prettier | 코드 포맷 자동 정렬 |

### Prettier 설정 (`.prettierrc`)

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "arrow"
}
```

### 저장 시 자동 포맷 (VS Code)

`.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## 4. TypeScript 규칙

```typescript
// ✅ 타입은 @jupjup/types에서 import
import { Scrap, Category } from '@jupjup/types';

// ✅ 명시적 타입 선언
const fetchScraps = async (category: Category): Promise<Scrap[]> => { ... };

// ❌ any 사용 금지
const data: any = response;   // 금지

// ✅ unknown 사용 후 타입 가드
const data: unknown = response;

// ✅ 컴포넌트 Props 타입 명시
interface ScrapCardProps {
  scrap: Scrap;
  onBookmark: (id: string) => void;
}

// ❌ export default 함수 선언식 금지
export default function ScrapCard() { ... }   // 금지

// ✅ 화살표 함수 + named export 권장
const ScrapCard = ({ scrap, onBookmark }: ScrapCardProps) => { ... };
export default ScrapCard;
```

---

## 5. 파일 · 폴더 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase | `ScrapCard.tsx` |
| 훅 파일 | camelCase + use 접두사 | `useScrapFeed.ts` |
| 유틸 파일 | camelCase | `dateFormatter.ts` |
| 상수 파일 | camelCase | `colors.ts` |
| 라우트 파일 (Expo Router) | kebab-case | `job-detail.tsx` |
| 폴더 | kebab-case | `scrap-card/` |
| 타입명 | PascalCase | `Scrap`, `Category` |
| 변수·함수명 | camelCase | `fetchScraps`, `isBookmarked` |
| 상수 | UPPER_SNAKE_CASE | `MAX_SCRAP_COUNT` |

---

## 6. 컴포넌트 작성 규칙

```typescript
// 순서: import → 타입 → 컴포넌트 → export

// 1. 외부 라이브러리
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// 2. 내부 패키지
import { Scrap } from '@jupjup/types';
import { formatRelativeDate } from '@jupjup/utils';

// 3. 내부 컴포넌트·훅·상수
import { colors } from '@/constants/colors';
import CategoryBadge from '@/components/CategoryBadge';

// 4. 타입 정의
interface ScrapCardProps {
  scrap: Scrap;
  onPress: () => void;
  onBookmark: (id: string) => void;
}

// 5. 컴포넌트
const ScrapCard = ({ scrap, onPress, onBookmark }: ScrapCardProps) => {
  const [bookmarked, setBookmarked] = useState(scrap.isBookmarked);

  return (
    <TouchableOpacity onPress={onPress}>
      {/* ... */}
    </TouchableOpacity>
  );
};

// 6. export
export default ScrapCard;
```

---

## 7. API 응답 처리 규칙

```typescript
// ✅ try-catch로 에러 처리
const fetchScraps = async (category: Category): Promise<Scrap[]> => {
  try {
    const response = await api.get(`/scraps?category=${category}`);
    return response.data;
  } catch (error) {
    console.error('스크랩 조회 실패:', error);
    return [];
  }
};

// ✅ Supabase 에러 처리
const { data, error } = await supabase.from('scraps').select('*');
if (error) throw new Error(error.message);
return data;
```

---

## 8. 환경변수 규칙

```bash
# 앱 (Expo) — EXPO_PUBLIC_ 접두사 필수 (클라이언트에 노출됨)
EXPO_PUBLIC_API_URL=http://localhost:4000
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=

# 서버 — 접두사 없음 (서버에서만 사용)
SUPABASE_SERVICE_ROLE_KEY=
KAKAO_REST_API_KEY=
JWT_SECRET=
```

- `.env` 파일은 절대 Git에 커밋하지 않음 (`.gitignore`에 포함)
- `.env.example`에 키 이름만 남기고 값은 비워두기
- 팀원 추가 시 `.env` 값은 별도 채널(카카오톡 등)로 전달

---

## 9. AI 개발 요청 시 컨텍스트 제공 방법

Cursor 또는 Claude에게 개발 요청할 때 아래 파일들을 참고 컨텍스트로 함께 제공:

```
참고 파일:
- SETUP.md          → 프로젝트 구조, 기술 스택
- CONVENTIONS.md    → 이 파일 (코드 스타일, 커밋 규칙)
- PRD.md            → 기능 요구사항
- 기획안_Figma용.md → 화면 설계, 디자인 시스템
```

요청 예시:
> "SETUP.md, CONVENTIONS.md 참고해서 apps/server/src/scraper/parser.ts 파일 만들어줘. RSS 피드 URL을 받아서 Scrap 타입으로 변환하는 함수 작성해줘."