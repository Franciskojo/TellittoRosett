import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ZodError, ZodSchema } from 'zod';
import { authOptions } from '@/lib/auth';
import { RateLimitError } from '@/lib/rateLimit';

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role: 'patient' | 'staff';
};

/** Error carrying an HTTP status that is safe to show to the client. */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

/** Converts any thrown value into a safe response. Internals are logged, never returned. */
export function handleError(error: unknown) {
  if (error instanceof ApiError) return fail(error.message, error.status);
  if (error instanceof RateLimitError) return fail(error.message, 429);
  if (error instanceof ZodError) {
    const first = error.issues[0];
    const path = first?.path.join('.');
    return fail(path ? `${path}: ${first.message}` : first?.message ?? 'Invalid input', 400);
  }
  console.error('[api] Unhandled error:', error);
  return fail('Internal server error', 500);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  const user = session?.user as Partial<SessionUser> | undefined;
  if (!user?.id || (user.role !== 'patient' && user.role !== 'staff')) return null;
  return user as SessionUser;
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new ApiError(401, 'Authentication required');
  return user;
}

export async function requireStaff(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== 'staff') throw new ApiError(403, 'Staff access required');
  return user;
}

/** Parses the JSON body and validates it. Throws a 400 on malformed JSON or schema mismatch. */
export async function parseBody<T>(req: Request, schema: ZodSchema<T>): Promise<T> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    throw new ApiError(400, 'Invalid JSON body');
  }
  return schema.parse(raw);
}

export { clientIp, rateLimit } from '@/lib/rateLimit';
