import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IStaff extends Document {
  name: string;
  role: string;
  status: string;
  avatar: string;
  email?: string;
  phone?: string;
  specialty?: string;
}

const StaffSchema = new Schema<IStaff>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, enum: ['Available', 'On Leave', 'In Session', 'Off Duty'], default: 'Available' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
  email: { type: String },
  phone: { type: String },
  specialty: { type: String }
});

export const StaffModel = models.Staff || model<IStaff>('Staff', StaffSchema);
