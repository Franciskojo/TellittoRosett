import { connectToDatabase } from '@/lib/db';
import { UserModel } from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import { ApiError, clientIp, handleError, ok, parseBody, rateLimit } from '@/lib/api';
import { registerSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    rateLimit(`register:${clientIp(req)}`, 5, 60 * 60 * 1000);
    const { name, email, password, phone } = await parseBody(req, registerSchema);

    await connectToDatabase();

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, 'An account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Public registration always creates a patient. Staff accounts are provisioned by admins.
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'patient',
    });

    return ok(
      { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
      201
    );
  } catch (error) {
    return handleError(error);
  }
}
