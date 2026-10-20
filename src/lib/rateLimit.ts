export class RateLimitError extends Error {
  constructor(message = 'Too many requests. Please try again later.') {
    super(message);
  }
}

// In-memory, per-instance limiter. Use a shared store (e.g. Redis) when running multiple instances.
const buckets = new Map<string, { count: number; resetAt: number }>();

export function clientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

/** Allows `limit` hits per `windowMs` for `key`; throws RateLimitError beyond that. */
export function rateLimit(key: string, limit: number, windowMs: number): void {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 5000) {
      buckets.forEach((b, k) => {
        if (b.resetAt <= now) buckets.delete(k);
      });
    }
    return;
  }
  bucket.count += 1;
  if (bucket.count > limit) throw new RateLimitError();
}

/** Test helper. */
export function resetRateLimits(): void {
  buckets.clear();
}
