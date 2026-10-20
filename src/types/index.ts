export interface Service {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  currency: string;
  icon: string;
  popular?: boolean;
}

export interface Appointment {
  id: string;
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
  date: string; // YYYY-MM-DD
  time: string; // e.g. "9:00 AM"
  location: string;
  fee: number;
  platformFee: number;
  total: number;
  paymentMethod: 'momo' | 'card' | 'bank';
  paymentStatus: 'paid' | 'pending' | 'failed';
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  status: 'Available' | 'On Leave' | 'In Session' | 'Off Duty';
  avatar: string;
  email?: string;
  phone?: string;
  specialty?: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Pregnancy' | 'Newborn Care' | 'Family Planning' | 'Women\'s Health' | 'Nutrition' | 'Labour';
  status: 'Published' | 'Draft' | 'Scheduled';
  date: string;
  readTime: string;
  author: string;
  coverImage: string;
}

export interface MediaItem {
  id: string;
  type: 'tv' | 'radio' | 'event';
  title: string;
  station: string;
  date: string;
  embedUrl?: string;
  duration: string;
  description: string;
  thumbnail: string;
}

export type ActiveView = 
  | 'home' 
  | 'about' 
  | 'services' 
  | 'media' 
  | 'booking' 
  | 'patient-dashboard' 
  | 'staff-dashboard' 
  | 'staff-management' 
  | 'blog-admin' 
  | 'blog-public' 
  | 'contact'
  | 'login'
  | 'register';
