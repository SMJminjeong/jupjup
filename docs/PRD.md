# PRD — 송줍줍 (→ 줍줍)

**문서 버전:** v1.1  
**작성일:** 2026-04-08  
**상태:** 초안  
**앱 이름:** 송줍줍 (v1 — 개인 브랜드) → 줍줍 (v2 — 서비스 확장 시 리브랜딩)  
**플랫폼:** iOS / Android (React Native + Expo)

---

## 1. 제품 개요

### 1.1 제품 한 줄 정의
AI 뉴스 · 채용 정보 · 재테크 콘텐츠를 한 곳에서 자동 수집하고, 나만의 방식으로 저장·분류·관리하는 개인 지식 창고 앱.

> **브랜드 전략:** v1은 퍼스널 브랜딩 앱 "송줍줍"으로 출시 → MAU 1,000명 이상 검증 후 "줍줍"으로 리브랜딩하여 일반 서비스로 확장

### 1.2 배경 및 문제 정의
- IT 종사자는 AI 트렌드, 채용 시장 변화를 매일 여러 사이트에서 개별적으로 확인해야 함
- 관심 기사를 찾아도 저장하는 도구가 산발적 (카카오톡 나에게 보내기, 메모앱, 브라우저 북마크 등)
- 채용 공고 마감일을 놓치거나, 저장해둔 콘텐츠를 다시 찾기 어려움
- 체계적이고 한 곳으로 모인 "나만의 지식 창고"가 없음

### 1.3 해결책
RSS + 공식 API 기반 자동 수집 + 수동 URL 저장을 결합한 앱으로, 4가지 카테고리(AI 뉴스 / 채용 뉴스 / 채용 공고 / 재테크)를 통합 관리. 카카오 소셜 로그인으로 빠른 온보딩.

---

## 2. 목표 및 성공 지표

### 2.1 비즈니스 목표
- 3개월 이내 iOS · Android 앱스토어 출시
- 6개월 내 MAU 1,000명 달성
- 12개월 내 프리미엄 구독 전환율 5% 이상

### 2.2 핵심 지표 (KPI)

| 지표 | 목표 (6개월) |
|------|------------|
| MAU | 1,000명 |
| 일평균 앱 실행 | 2회 이상 |
| 스크랩 저장 수 / 유저 | 월 20건 이상 |
| D7 리텐션 | 30% 이상 |
| 앱스토어 평점 | 4.0 이상 |

---

## 3. 타겟 사용자

### 3.1 페르소나

**Primary: IT 직장인 / 개발자 · PM (25~35세)**
- 매일 AI 트렌드, 채용 시장 변화를 모니터링해야 함
- 이직 준비 중이거나 사이드 프로젝트를 병행
- 재테크에 관심이 많고 경제 뉴스를 꾸준히 읽고 싶음
- 스마트폰으로 출퇴근 중 콘텐츠를 소비

**Secondary: 취업 준비생 (22~27세)**
- IT 개발자 / PM 채용 공고를 추적해야 함
- AI 트렌드를 파악해 포트폴리오 방향을 잡고 싶음

---

## 4. 기능 요구사항

### 4.1 핵심 기능 (MVP — Phase 1, 3개월)

#### F-01. 카카오 소셜 로그인
- 카카오 OAuth 2.0 연동
- 닉네임 · 프로필 이미지 자동 수집
- JWT 기반 세션 관리 (expo-secure-store 저장)
- 로그아웃 / 계정 탈퇴 지원

#### F-02. 홈 피드
- 4개 카테고리 최신 스크랩 합산 노출 (최신순)
- 카테고리별 탭 필터
- 읽음 / 안 읽음 상태 표시
- 무한 스크롤 (페이지네이션)

#### F-03. AI 뉴스 스크랩
- RSS 자동 수집 (6시간 간격 cron)
- 수집 소스: AI타임스, 지디넷 코리아 AI, MIT Tech Review, The Verge AI
- 저장 데이터: 제목 / 썸네일 / 요약 (contentSnippet) / 원문 링크 / 발행일
- 태그: LLM · 생성AI · 로봇 · 규제 · 연구 (자동 키워드 매칭)

#### F-04. 채용 뉴스 스크랩
- RSS 자동 수집 (6시간 간격 cron)
- 수집 소스: 잡코리아 뉴스, 한국경제 취업 섹션
- 태그: IT · 대기업 · 스타트업 · 경력 · 신입

#### F-05. 채용 공고 스크랩
- 원티드 공식 API 연동
- 사람인 OpenAPI 연동
- 저장 데이터: 회사명 / 포지션 / 경력 조건 / 기술스택 / 마감일 / 공고 URL
- 마감 D-7 / D-3 / D-1 Push 알림 (Expo Push Notification)
- 포지션 필터: 개발자 · PM · 디자이너

#### F-06. 재테크 스크랩
- RSS 자동 수집
- 수집 소스: 한국경제 증권, 머니투데이, 뱅크샐러드 블로그
- 태그: 주식 · ETF · 부동산 · 절세 · 예적금

#### F-07. 수동 URL 저장
- 타 앱 공유하기 → 송줍줍으로 URL 전달
- URL 입력 시 OG 메타데이터 자동 파싱 (제목 · 썸네일 · 설명)
- 카테고리 수동 선택 / 메모 입력

#### F-08. 스크랩 상세 화면
- 제목 / 썸네일 / 요약 / 출처 / 저장일 표시
- "원문 보기" → 인앱 브라우저 (SafariView / Chrome Custom Tab)
- 북마크(중요 표시) 토글
- 메모 추가·수정
- 공유하기 / 삭제

#### F-09. 검색
- 제목 · 요약 · 출처 기준 전문 검색
- 카테고리 · 태그 · 기간 필터
- 최근 검색어 저장 (최대 10개)

#### F-10. 마이페이지
- 프로필 (카카오 연동 이미지 · 닉네임)
- 스크랩 통계 (카테고리별 저장 수)
- 알림 설정 (채용 공고 마감 알림 on/off)
- 관심 키워드 설정 (Push 알림 트리거용)
- 로그아웃 · 계정 탈퇴

### 4.2 추가 기능 (Phase 2 — 출시 후 2~3개월)
- AI 요약 카드 (OpenAI API 연동, 기사 3줄 요약)
- 폴더 / 컬렉션 기능 (스크랩 묶음 관리)
- 키워드 구독 (관심 키워드 등록 → 매칭 기사 Push)
- 읽음 통계 대시보드

### 4.3 추가 기능 (Phase 3 — 6개월 이후)
- 프리미엄 구독 (광고 제거, 무제한 저장, AI 요약)
- 팀 공유 / 링크 공유
- 웹 버전 (반응형 웹앱)

---

## 5. 비기능 요구사항

### 5.1 성능
- 피드 로딩: 첫 화면 렌더링 2초 이내
- 이미지 lazy loading 적용
- 오프라인: 마지막 로드 데이터 캐싱 (AsyncStorage)

### 5.2 보안
- 토큰 저장: expo-secure-store (평문 AsyncStorage 사용 금지)
- HTTPS 통신 강제
- Supabase RLS로 사용자별 데이터 격리

### 5.3 저작권 준수
- 기사 원문 전체 저장 금지
- 저장 데이터: 제목 + 썸네일 + 요약(3줄 이내) + 원문 링크만
- 원문 열람은 반드시 외부 브라우저 / 인앱 브라우저로 연결

### 5.4 플랫폼
- iOS 16.0 이상
- Android 10 (API 29) 이상
- 다크모드 지원

---

## 6. 기술 스택

| 영역 | 기술 |
|------|------|
| 앱 | React Native + Expo (TypeScript) |
| 상태관리 | Zustand |
| 네비게이션 | React Navigation v6 |
| 인증 | Kakao OAuth 2.0 + JWT |
| 백엔드 | Node.js + Express |
| DB | Supabase (PostgreSQL) |
| 스크래퍼 | rss-parser + node-cron |
| 채용 공고 | 원티드 API + 사람인 OpenAPI |
| 푸시 알림 | Expo Push Notification Service |
| 빌드/배포 | Expo EAS Build |
| 인프라 | Railway (서버) + Supabase Cloud |

---

## 7. 데이터 모델

```sql
-- 사용자
users
  id            uuid PK
  kakao_id      bigint UNIQUE
  nickname      text
  avatar_url    text
  email         text
  created_at    timestamp

-- 스크랩
scraps
  id            uuid PK
  user_id       uuid FK → users
  category      enum(ai_news, job_news, job_post, finance)
  title         text
  url           text UNIQUE
  thumbnail     text
  summary       text
  source        text        -- 출처 도메인
  tags          text[]
  is_read       boolean DEFAULT false
  is_bookmarked boolean DEFAULT false
  deadline_at   timestamp   -- 채용 공고 마감일
  memo          text
  created_at    timestamp

-- 관심 키워드
user_keywords
  id            uuid PK
  user_id       uuid FK → users
  keyword       text
  category      enum
  created_at    timestamp
```

---

## 8. 출시 로드맵

| Phase | 기간 | 주요 작업 |
|-------|------|----------|
| Phase 1 | M1 | 프로젝트 세팅, 카카오 로그인, 4탭 UI, 수동 URL 저장 |
| Phase 1 | M2 | RSS 자동 수집, 원티드·사람인 API, 마감 알림, 검색 |
| Phase 1 | M3 | QA, 앱스토어 심사 준비, TestFlight·내부 테스트, 출시 |
| Phase 2 | M4~6 | AI 요약, 폴더 기능, 키워드 Push, 통계 대시보드 |
| Phase 3 | M7~ | 프리미엄 구독, 웹 버전 |

---

## 9. 리스크 및 대응

| 리스크 | 가능성 | 대응 방안 |
|--------|--------|----------|
| RSS 피드 URL 변경 · 중단 | 중 | 소스별 헬스체크 모니터링, 대체 소스 목록 유지 |
| 앱스토어 심사 리젝 | 중 | 콘텐츠 "개인 스크랩 도구" 포지셔닝 강조, 원문 링크 외부 연결 명시 |
| Supabase 무료 티어 초과 | 저 | Pro 플랜($25/월) 전환 기준 MAU 500명으로 사전 설정 |
| 카카오 API 정책 변경 | 저 | 이메일 로그인 fallback 2차 준비 |