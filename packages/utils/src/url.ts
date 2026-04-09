/**
 * URL에서 도메인(호스트) 추출. 실패 시 원본 반환.
 */
export const extractDomain = (url: string): string => {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

/**
 * URL 유효성 검사 (http/https만 허용)
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

export interface OgMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

/**
 * OG 메타데이터 파싱 (HTML 문자열 → OgMetadata).
 * 서버에서 fetch한 HTML을 받아 정규식으로 추출. RN 환경에서도 동작.
 */
export const parseOgMetadata = (html: string): OgMetadata => {
  const pick = (prop: string): string | undefined => {
    const re = new RegExp(
      `<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`,
      'i',
    );
    const m = html.match(re);
    return m?.[1];
  };
  return {
    title: pick('og:title'),
    description: pick('og:description'),
    image: pick('og:image'),
    siteName: pick('og:site_name'),
  };
};
