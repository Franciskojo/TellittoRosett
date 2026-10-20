import { dbService } from '@/lib/dbService';
import { handleError, ok } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return ok(dbService.getServices());
  } catch (error) {
    return handleError(error);
  }
}
