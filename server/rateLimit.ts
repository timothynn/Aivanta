import type { FastifyReply, FastifyRequest } from 'fastify';

type Bucket = {
  count: number;
  resetAt: number;
};

export function createRateLimit(maxRequests: number, windowMs: number) {
  const buckets = new Map<string, Bucket>();

  return async function rateLimit(request: FastifyRequest, reply: FastifyReply) {
    const key = request.ip;
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return;
    }

    bucket.count += 1;

    if (bucket.count > maxRequests) {
      await reply.code(429).send({
        ok: false,
        message: 'Too many requests. Please try again later.',
      });
    }
  };
}
