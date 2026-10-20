import { dbService } from '@/lib/dbService';
import { fail, getSessionUser, handleError, ok, parseBody, requireStaff } from '@/lib/api';
import { staffCreateSchema, staffStatusUpdateSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

// Public: the team directory. Contact details are only exposed to signed-in staff.
export async function GET() {
  try {
    await dbService.init();
    const [staff, user] = await Promise.all([dbService.getStaff(), getSessionUser()]);
    const isStaff = user?.role === 'staff';
    return ok(isStaff ? staff : staff.map(({ email, phone, ...publicFields }) => publicFields));
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    await requireStaff();
    await dbService.init();
    const body = await parseBody(req, staffCreateSchema);
    const newStaff = await dbService.addStaff(body);
    return ok(newStaff, 201);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(req: Request) {
  try {
    await requireStaff();
    await dbService.init();
    const { id, status } = await parseBody(req, staffStatusUpdateSchema);
    const updated = await dbService.updateStaffStatus(id, status);
    if (!updated) return fail('Staff member not found', 404);
    return ok(updated);
  } catch (error) {
    return handleError(error);
  }
}
