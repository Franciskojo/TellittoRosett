import { dbService } from '@/lib/dbService';
import { ApiError, fail, handleError, ok, parseBody, requireUser } from '@/lib/api';
import {
  appointmentCreateSchema,
  appointmentStatusUpdateSchema,
} from '@/lib/validation';

export const dynamic = 'force-dynamic';

// Staff see every appointment; patients only see their own.
export async function GET() {
  try {
    const user = await requireUser();
    await dbService.init();
    const appointments = await dbService.getAppointments(
      user.role === 'staff' ? {} : { email: user.email ?? '' }
    );
    return ok(appointments);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    await dbService.init();
    const body = await parseBody(req, appointmentCreateSchema);

    // Price comes from the server-side catalog, never from the client.
    const service = dbService.getServices().find((s) => s.id === body.serviceId);
    if (!service) throw new ApiError(400, 'Unknown service');

    const newAppointment = await dbService.addAppointment({
      ...body,
      // Patients can only book for their own account email.
      email: user.role === 'patient' ? (user.email ?? body.email).toLowerCase() : body.email,
      serviceName: service.title,
      location: 'MatraCare Clinic, East Legon',
      fee: service.price,
      platformFee: 0,
      total: service.price,
      paymentStatus: 'paid',
      status: 'Confirmed',
    });
    return ok(newAppointment, 201);
  } catch (error) {
    return handleError(error);
  }
}

// Staff can set any status; patients may only cancel their own appointments.
export async function PATCH(req: Request) {
  try {
    const user = await requireUser();
    await dbService.init();
    const { id, status } = await parseBody(req, appointmentStatusUpdateSchema);

    if (user.role !== 'staff') {
      const own = await dbService.getAppointments({ email: user.email ?? '' });
      if (!own.some((a) => a.id === id || a.appointmentCode === id)) throw new ApiError(403, 'Not allowed');
      if (status !== 'Cancelled') throw new ApiError(403, 'Patients can only cancel appointments');
    }

    const updated = await dbService.updateAppointmentStatus(id, status);
    if (!updated) return fail('Appointment not found', 404);
    return ok(updated);
  } catch (error) {
    return handleError(error);
  }
}
