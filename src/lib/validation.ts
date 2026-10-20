import { z } from 'zod';

const trimmed = (max: number, label = 'Field') =>
  z.string().trim().min(1, `${label} is required`).max(max, `${label} is too long`);

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128)
  .regex(/[a-zA-Z]/, 'Password must contain a letter')
  .regex(/[0-9]/, 'Password must contain a number');

export const registerSchema = z.object({
  name: trimmed(100, 'Name'),
  email: z.string().trim().toLowerCase().email('Invalid email address').max(254),
  password: passwordSchema,
  phone: z.string().trim().max(30).optional().default(''),
});

export const appointmentCreateSchema = z.object({
  patientName: trimmed(100, 'Patient name'),
  phone: z.string().trim().min(1, 'Phone number is required').max(30, 'Phone number is too long'),
  email: z.string().trim().toLowerCase().email('Invalid email address').max(254),
  age: z.number().int().min(0).max(120).optional(),
  isPregnant: z.boolean().default(false),
  pregnancyStage: z.string().trim().max(50).optional(),
  reason: trimmed(500, 'Reason for consultation'),
  notes: z.string().trim().max(2000).optional(),
  serviceId: trimmed(50, 'Service'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  time: trimmed(20, 'Time slot'),
  paymentMethod: z.enum(['momo', 'card', 'bank']).default('momo'),
});

export const APPOINTMENT_STATUSES = ['Confirmed', 'Pending', 'Completed', 'Cancelled'] as const;
export const STAFF_STATUSES = ['Available', 'On Leave', 'In Session', 'Off Duty'] as const;

export const appointmentStatusUpdateSchema = z.object({
  id: trimmed(64),
  status: z.enum(APPOINTMENT_STATUSES),
});

export const staffStatusUpdateSchema = z.object({
  id: trimmed(64),
  status: z.enum(STAFF_STATUSES),
});

export const staffCreateSchema = z.object({
  name: trimmed(100),
  role: trimmed(100),
  status: z.enum(STAFF_STATUSES).default('Available'),
  avatar: z.string().trim().max(500).default(''),
  email: z.string().trim().toLowerCase().email().max(254).optional(),
  phone: z.string().trim().max(30).optional(),
  specialty: z.string().trim().max(100).optional(),
});

export const ARTICLE_CATEGORIES = [
  'Pregnancy',
  'Newborn Care',
  'Family Planning',
  "Women's Health",
  'Nutrition',
  'Labour',
] as const;

export const articleSchema = z.object({
  title: trimmed(200),
  excerpt: z.string().trim().max(500).default(''),
  content: z.string().max(50000).default(''),
  category: z.enum(ARTICLE_CATEGORIES),
  status: z.enum(['Published', 'Draft', 'Scheduled']).default('Draft'),
  date: z.string().trim().max(50).default(''),
  readTime: z.string().trim().max(30).default(''),
  author: z.string().trim().max(100).default(''),
  coverImage: z.string().trim().max(1000).default(''),
});

export const articleUpdateSchema = articleSchema.partial().extend({ id: trimmed(64) });

export const contactSchema = z.object({
  name: trimmed(100),
  email: z.string().trim().toLowerCase().email().max(254),
  phone: z.string().trim().max(30).optional(),
  subject: z.string().trim().max(200).optional().default('General Inquiry'),
  message: trimmed(5000),
});
