# Supabase 설정 가이드

## 1. 프로젝트 생성

1. [supabase.com](https://supabase.com) 접속 → New Project
2. 프로젝트 이름: `jupjup` (또는 `songjupjup`)
3. 리전: `Northeast Asia (Seoul)` 권장
4. 비밀번호 설정 후 생성

## 2. 스키마 실행

1. Supabase Dashboard → SQL Editor
2. `schema.sql` 내용 전체 복사 → 실행
3. Table Editor에서 `users`, `scraps`, `user_keywords` 3개 테이블 생성 확인

## 3. 환경변수 복사

Dashboard → Settings → API에서:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

루트 `.env` 파일에 붙여넣기.

## 4. Phase 2: pgvector (임베딩 추천)

나중에 필요할 때 실행:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE scraps
  ADD COLUMN IF NOT EXISTS embedding vector(1536);

CREATE INDEX IF NOT EXISTS scraps_embedding_idx
  ON scraps USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
```
