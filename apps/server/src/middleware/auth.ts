import type { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { env } from '../lib/env.js';

export interface JwtPayload {
  userId: string;
  kakaoId: number;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload;
  }
}

export const verifyToken = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const header = request.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return reply.unauthorized('토큰이 필요합니다');
  }

  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, env().JWT_SECRET) as JwtPayload;
    request.user = payload;
  } catch {
    return reply.unauthorized('유효하지 않은 토큰입니다');
  }
};

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env().JWT_SECRET, { expiresIn: '30d' });
};
