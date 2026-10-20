import { dbService } from '@/lib/dbService';
import { clientIp, handleError, ok, parseBody, rateLimit } from '@/lib/api';
import { contactSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    rateLimit(`contact:${clientIp(req)}`, 5, 60 * 60 * 1000);
    await dbService.init();
    const body = await parseBody(req, contactSchema);
    const inquiry = await dbService.addInquiry(body);
    return ok(inquiry, 201);
  } catch (error) {
    return handleError(error);
  }
}
