import { supabaseAdmin } from '../lib/supabase.js';

interface JobArticle {
  title: string;
  url: string;
  summary: string | null;
  thumbnail: string | null;
  source: string;
  category: 'job_post';
  tags: string[];
  is_read: boolean;
  is_bookmarked: boolean;
  created_at: string;
  deadline_at?: string | null;
}

const insertIfNew = async (article: JobArticle): Promise<boolean> => {
  const db = supabaseAdmin();
  const { data: existing } = await db
    .from('scraps')
    .select('id')
    .eq('url', article.url)
    .is('user_id', null)
    .maybeSingle();
  if (existing) return false;
  const { error } = await db.from('scraps').insert(article);
  return !error;
};

/** 원티드 개발 직군 공고 수집 */
export const collectWanted = async (): Promise<number> => {
  try {
    const res = await fetch(
      'https://www.wanted.co.kr/api/v4/jobs?country=kr&tag_type_ids=669&job_sort=job.latest_order&years=-1&locations=all&limit=40',
      { headers: { 'User-Agent': 'Mozilla/5.0' } },
    );
    if (!res.ok) throw new Error(`status ${res.status}`);
    const json = (await res.json()) as { data: WantedJob[] };
    let inserted = 0;
    for (const j of json.data) {
      const tags: string[] = ['채용공고'];
      if (j.address?.location) tags.push(j.address.location);
      const ok = await insertIfNew({
        title: `[${j.company.name}] ${j.position}`,
        url: `https://www.wanted.co.kr/wd/${j.id}`,
        summary: j.company.industry_name ?? null,
        thumbnail: j.title_img?.thumb ?? j.logo_img?.thumb ?? null,
        source: '원티드',
        category: 'job_post',
        tags,
        is_read: false,
        is_bookmarked: false,
        created_at: new Date().toISOString(),
        deadline_at: j.due_time ?? null,
      });
      if (ok) inserted++;
    }
    return inserted;
  } catch (err) {
    console.error('[JOBS] 원티드 수집 실패:', err);
    return 0;
  }
};

interface WantedJob {
  id: number;
  position: string;
  company: { name: string; industry_name?: string };
  address?: { location?: string };
  title_img?: { thumb?: string };
  logo_img?: { thumb?: string };
  due_time?: string | null;
}

interface JumpitPosition {
  id: number;
  title: string;
  companyName: string;
  jobCategory: string;
  techStacks?: string[];
  locations?: string[];
  imagePath?: string;
  logo?: string;
  closedAt?: string | null;
}

/** 점핏 개발자 채용공고 수집 */
export const collectJumpit = async (): Promise<number> => {
  try {
    const res = await fetch(
      'https://jumpit-api.saramin.co.kr/api/positions?sort=rsp_rate&highlight=false&page=1',
      { headers: { 'User-Agent': 'Mozilla/5.0' } },
    );
    if (!res.ok) throw new Error(`status ${res.status}`);
    const json = (await res.json()) as { result: { positions: JumpitPosition[] } };
    let inserted = 0;
    for (const p of json.result.positions) {
      const tags = ['채용공고', p.jobCategory, ...(p.techStacks ?? []).slice(0, 3)].filter(Boolean);
      const ok = await insertIfNew({
        title: `[${p.companyName}] ${p.title}`,
        url: `https://www.jumpit.co.kr/position/${p.id}`,
        summary: (p.locations ?? []).join(', ') || null,
        thumbnail: p.imagePath ?? p.logo ?? null,
        source: '점핏',
        category: 'job_post',
        tags,
        is_read: false,
        is_bookmarked: false,
        created_at: new Date().toISOString(),
        deadline_at: p.closedAt ?? null,
      });
      if (ok) inserted++;
    }
    return inserted;
  } catch (err) {
    console.error('[JOBS] 점핏 수집 실패:', err);
    return 0;
  }
};

export const collectAllJobs = async (): Promise<number> => {
  const [a, b] = await Promise.all([collectWanted(), collectJumpit()]);
  return a + b;
};
