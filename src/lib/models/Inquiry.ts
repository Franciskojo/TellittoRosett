import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: Date;
}

const InquirySchema = new Schema<IInquiry>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'Unread' },
  createdAt: { type: Date, default: Date.now }
});

export const InquiryModel = models.Inquiry || model<IInquiry>('Inquiry', InquirySchema);
