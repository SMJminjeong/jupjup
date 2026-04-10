import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { verifyToken } from '../middleware/auth.js';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: typeof verifyToken;
  }
}

export default fp(async (app: FastifyInstance) => {
  app.decorate('authenticate', verifyToken);
});
