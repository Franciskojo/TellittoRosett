import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IAppointment extends Document {
  appointmentCode?: string;
  patientName: string;
  phone: string;
  email: string;
  age?: number;
  isPregnant: boolean;
  pregnancyStage?: string;
  reason: string;
  notes?: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  location: string;
  fee: number;
  platformFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>({
  appointmentCode: { type: String, index: true },
  patientName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number },
  isPregnant: { type: Boolean, default: false },
  pregnancyStage: { type: String },
  reason: { type: String, required: true },
  notes: { type: String },
  serviceId: { type: String, required: true },
  serviceName: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, default: 'MatraCare Clinic, East Legon' },
  fee: { type: Number, required: true },
  platformFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['momo', 'card', 'bank'], default: 'momo' },
  paymentStatus: { type: String, enum: ['paid', 'pending', 'failed'], default: 'paid' },
  status: { type: String, enum: ['Confirmed', 'Pending', 'Completed', 'Cancelled'], default: 'Confirmed' },
  createdAt: { type: Date, default: Date.now }
});

export const AppointmentModel = models.Appointment || model<IAppointment>('Appointment', AppointmentSchema);
