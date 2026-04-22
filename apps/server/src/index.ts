import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { loadEnv } from './lib/env.js';
import authenticatePlugin from './plugins/authenticate.js';
import authRoutes from './routes/auth.js';
import scrapRoutes from './routes/scraps.js';
import keywordRoutes from './routes/keywords.js';
import ogRoutes from './routes/og.js';
import { startRssCron } from './scraper/cron.js';

const start = async () => {
  const config = loadEnv();

  const app = Fastify({
    logger: {
      level: config.NODE_ENV === 'production' ? 'info' : 'debug',
      transport:
        config.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
  });

  // 플러그인
  await app.register(cors, {
    origin: config.NODE_ENV === 'production' ? false : true,
  });
  await app.register(sensible);
  await app.register(authenticatePlugin);

  // 헬스체크
  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: config.NODE_ENV,
  }));

  // API 라우트
  await app.register(authRoutes, { prefix: '/api' });
  await app.register(scrapRoutes, { prefix: '/api' });
  await app.register(keywordRoutes, { prefix: '/api' });
  await app.register(ogRoutes, { prefix: '/api' });

  // RSS 크론 시작
  if (config.NODE_ENV === 'production') {
    startRssCron();
  }

  // 서버 시작
  try {
    await app.listen({ port: config.PORT, host: '0.0.0.0' });
    app.log.info(`🚀 서버 시작: http://localhost:${config.PORT}`);
    app.log.info(`📋 헬스체크: http://localhost:${config.PORT}/health`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
