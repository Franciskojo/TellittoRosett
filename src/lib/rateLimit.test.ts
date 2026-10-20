import { beforeEach, describe, expect, it } from 'vitest';
import { RateLimitError, rateLimit, resetRateLimits } from './rateLimit';

describe('rateLimit', () => {
  beforeEach(() => resetRateLimits());

  it('allows requests up to the limit', () => {
    for (let i = 0; i < 3; i++) expect(() => rateLimit('k', 3, 1000)).not.toThrow();
  });

  it('blocks requests beyond the limit', () => {
    for (let i = 0; i < 3; i++) rateLimit('k', 3, 1000);
    expect(() => rateLimit('k', 3, 1000)).toThrow(RateLimitError);
  });

  it('tracks keys independently', () => {
    rateLimit('a', 1, 1000);
    expect(() => rateLimit('b', 1, 1000)).not.toThrow();
  });
});
