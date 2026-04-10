import cron from 'node-cron';
import { RSS_FEEDS } from './feeds.js';
import { collectFeed } from './parser.js';

/** RSS 수집 크론 시작 (6시간 간격) */
export const startRssCron = () => {
  // 매 6시간: 0시, 6시, 12시, 18시
  cron.schedule('0 */6 * * *', async () => {
    console.log(`[CRON] RSS 수집 시작: ${new Date().toISOString()}`);

    let totalInserted = 0;
    for (const feed of RSS_FEEDS) {
      const count = await collectFeed(feed);
      totalInserted += count;
      console.log(`  [${feed.source}] ${count}건 수집`);
    }

    console.log(`[CRON] RSS 수집 완료: 총 ${totalInserted}건`);
  });

  console.log('[CRON] RSS 수집 스케줄러 등록 (6시간 간격)');
};

/** 수동 RSS 수집 트리거 */
export const collectAllFeeds = async (): Promise<number> => {
  let total = 0;
  for (const feed of RSS_FEEDS) {
    total += await collectFeed(feed);
  }
  return total;
};
