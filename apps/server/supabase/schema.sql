-- ============================================
-- 송줍줍 DB 스키마 (Supabase PostgreSQL)
-- Supabase SQL Editor에서 한 번에 실행
-- ============================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  kakao_id    bigint UNIQUE NOT NULL,
  nickname    text NOT NULL DEFAULT '사용자',
  avatar_url  text,
  email       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 3. 스크랩 테이블
CREATE TABLE IF NOT EXISTS scraps (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       uuid REFERENCES users(id) ON DELETE CASCADE,
  category      text NOT NULL CHECK (category IN ('ai_news', 'job_news', 'job_post', 'finance')),
  title         text NOT NULL,
  url           text NOT NULL,
  thumbnail     text,
  summary       text,
  source        text,
  tags          text[] NOT NULL DEFAULT '{}',
  is_read       boolean NOT NULL DEFAULT false,
  is_bookmarked boolean NOT NULL DEFAULT false,
  deadline_at   timestamptz,
  memo          text,
  created_at    timestamptz NOT NULL DEFAULT now(),

  -- RSS 수집 스크랩은 user_id가 NULL (공유 풀)
  -- 수동 저장 스크랩은 user_id + url 유니크
  UNIQUE (url, user_id)
);

-- URL 단독 유니크 (RSS 공유 풀용, user_id가 NULL인 행)
CREATE UNIQUE INDEX IF NOT EXISTS scraps_url_shared_idx
  ON scraps (url) WHERE user_id IS NULL;

-- 4. 관심 키워드 테이블
CREATE TABLE IF NOT EXISTS user_keywords (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  keyword     text NOT NULL,
  category    text NOT NULL CHECK (category IN ('ai_news', 'job_news', 'job_post', 'finance')),
  created_at  timestamptz NOT NULL DEFAULT now(),

  UNIQUE (user_id, keyword, category)
);

-- ============================================
-- 인덱스
-- ============================================

-- 스크랩: 유저별 최신순 조회 최적화
CREATE INDEX IF NOT EXISTS scraps_user_created_idx
  ON scraps (user_id, created_at DESC);

-- 스크랩: 카테고리 필터
CREATE INDEX IF NOT EXISTS scraps_user_category_idx
  ON scraps (user_id, category);

-- 스크랩: 마감일 알림용 (채용 공고)
CREATE INDEX IF NOT EXISTS scraps_deadline_idx
  ON scraps (deadline_at)
  WHERE deadline_at IS NOT NULL AND category = 'job_post';

-- 스크랩: 전문 검색 (제목 + 요약)
CREATE INDEX IF NOT EXISTS scraps_search_idx
  ON scraps USING gin (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(summary, '')));

-- 키워드: 유저별 조회
CREATE INDEX IF NOT EXISTS keywords_user_idx
  ON user_keywords (user_id);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraps ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_keywords ENABLE ROW LEVEL SECURITY;

-- users: 본인만 읽기/수정
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id);

-- scraps: 본인 스크랩 + 공유 풀(user_id IS NULL) 읽기
CREATE POLICY "scraps_select_own_or_shared" ON scraps
  FOR SELECT USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "scraps_insert_own" ON scraps
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "scraps_update_own" ON scraps
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "scraps_delete_own" ON scraps
  FOR DELETE USING (user_id = auth.uid());

-- user_keywords: 본인만
CREATE POLICY "keywords_select_own" ON user_keywords
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "keywords_insert_own" ON user_keywords
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "keywords_delete_own" ON user_keywords
  FOR DELETE USING (user_id = auth.uid());

-- ============================================
-- 서비스 역할 전용 정책 (서버에서 service_role_key 사용 시 RLS 우회)
-- Supabase는 service_role_key로 접근하면 RLS 자동 우회
-- 따라서 서버(RSS 수집 등)는 별도 정책 불필요
-- ============================================
