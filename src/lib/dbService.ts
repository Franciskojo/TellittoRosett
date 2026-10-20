import { Appointment, StaffMember, Article, Service, MediaItem } from '@/types';
import { INITIAL_APPOINTMENTS, INITIAL_STAFF, INITIAL_ARTICLES, INITIAL_SERVICES, INITIAL_MEDIA } from './initialData';
import { connectToDatabase } from './db';
import { AppointmentModel } from './models/Appointment';
import { StaffModel } from './models/Staff';
import { ArticleModel } from './models/Article';
import { InquiryModel } from './models/Inquiry';
import { UserModel } from './models/User';
import bcrypt from 'bcryptjs';
import { isValidObjectId } from 'mongoose';

// Demo accounts/data are only seeded outside production, or when explicitly enabled.
const SEED_ENABLED = process.env.NODE_ENV !== 'production' || process.env.SEED_DEMO_DATA === 'true';

const INITIAL_USERS = [
  {
    name: 'Rosetta N. Boakye',
    email: 'rosetta@tellittorosett.com',
    password: 'demo1234',
    role: 'staff' as const,
    avatar: '/images/rosetta.jpg',
    phone: '+233 24 551 4567',
  },
  {
    name: 'Akosua Otwire',
    email: 'akosua@tellittorosett.com',
    password: 'demo1234',
    role: 'staff' as const,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    phone: '+233 24 551 4568',
  },
  {
    name: 'Ama Serwaa',
    email: 'ama@example.com',
    password: 'demo1234',
    role: 'patient' as const,
    avatar: '',
    phone: '024 123 4567',
  },
];

export class DbService {
  private isInitialized = false;

  /**
   * Initialize the database connection and seed initial collections if empty.
   */
  public async init(): Promise<void> {
    if (this.isInitialized) return;

    await connectToDatabase();

    if (!SEED_ENABLED) {
      this.isInitialized = true;
      return;
    }

    // Seed appointments if empty
    const aptCount = await AppointmentModel.countDocuments();
    if (aptCount === 0) {
      await AppointmentModel.insertMany(INITIAL_APPOINTMENTS);
    }

    // Seed staff if empty
    const staffCount = await StaffModel.countDocuments();
    if (staffCount === 0) {
      await StaffModel.insertMany(INITIAL_STAFF);
    }

    // Seed articles if empty
    const artCount = await ArticleModel.countDocuments();
    if (artCount === 0) {
      await ArticleModel.insertMany(INITIAL_ARTICLES);
    }

    // Seed initial users into MongoDB if empty
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      const hashedUsers = await Promise.all(
        INITIAL_USERS.map(async (u) => {
          const salt = await bcrypt.genSalt(10);
          const passwordHash = await bcrypt.hash(u.password, salt);
          return {
            name: u.name,
            email: u.email.toLowerCase().trim(),
            password: passwordHash,
            role: u.role,
            avatar: u.avatar,
            phone: u.phone,
          };
        })
      );
      await UserModel.insertMany(hashedUsers);
    }

    this.isInitialized = true;
  }

  // APPOINTMENTS
  public async getAppointments(filter: { email?: string } = {}): Promise<Appointment[]> {
    await connectToDatabase();
    const query = filter.email ? { email: filter.email.toLowerCase() } : {};
    const docs = await AppointmentModel.find(query).sort({ createdAt: -1 }).lean();
    return docs.map((d: any) => {
      const appointmentCode =
        d.appointmentCode ||
        (d.id && typeof d.id === 'string' && d.id.startsWith('APT-')
          ? d.id
          : `APT-${d._id.toString().slice(-6).toUpperCase()}`);

      return {
        id: d._id.toString(),
        appointmentCode,
        patientName: d.patientName,
        phone: d.phone,
        email: d.email,
        age: d.age,
        isPregnant: d.isPregnant,
        pregnancyStage: d.pregnancyStage,
        reason: d.reason,
        notes: d.notes,
        serviceId: d.serviceId,
        serviceName: d.serviceName,
        date: d.date,
        time: d.time,
        location: d.location || 'MatraCare Clinic, East Legon',
        fee: d.fee,
        platformFee: d.platformFee || 0,
        total: d.total,
        paymentMethod: d.paymentMethod || 'momo',
        paymentStatus: d.paymentStatus || 'paid',
        status: d.status || 'Confirmed',
        createdAt: d.createdAt?.toISOString?.() || d.createdAt || new Date().toISOString(),
      };
    });
  }

  public async addAppointment(data: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment> {
    await connectToDatabase();

    // Generate clean, readable clinic appointment reference code (e.g. APT-1004)
    let appointmentCode = data.appointmentCode;
    if (!appointmentCode) {
      const count = await AppointmentModel.countDocuments();
      let candidate = `APT-${1001 + count}`;
      const exists = await AppointmentModel.findOne({ appointmentCode: candidate });
      if (exists) {
        candidate = `APT-${Math.floor(1000 + Math.random() * 9000)}`;
      }
      appointmentCode = candidate;
    }

    const doc = await AppointmentModel.create({
      ...data,
      appointmentCode,
      createdAt: new Date(),
    });

    return {
      ...data,
      id: doc._id.toString(),
      appointmentCode,
      createdAt: doc.createdAt.toISOString(),
    };
  }

  public async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment | null> {
    await connectToDatabase();
    const query = isValidObjectId(id) ? { _id: id } : { appointmentCode: id };
    const doc = await AppointmentModel.findOneAndUpdate(query, { status }, { new: true }).lean();

    if (!doc) return null;
    const d: any = doc;
    const appointmentCode =
      d.appointmentCode ||
      (d.id && typeof d.id === 'string' && d.id.startsWith('APT-')
        ? d.id
        : `APT-${d._id.toString().slice(-6).toUpperCase()}`);

    return {
      id: d._id.toString(),
      appointmentCode,
      patientName: d.patientName,
      phone: d.phone,
      email: d.email,
      age: d.age,
      isPregnant: d.isPregnant,
      pregnancyStage: d.pregnancyStage,
      reason: d.reason,
      notes: d.notes,
      serviceId: d.serviceId,
      serviceName: d.serviceName,
      date: d.date,
      time: d.time,
      location: d.location || 'MatraCare Clinic, East Legon',
      fee: d.fee,
      platformFee: d.platformFee || 0,
      total: d.total,
      paymentMethod: d.paymentMethod || 'momo',
      paymentStatus: d.paymentStatus || 'paid',
      status: d.status,
      createdAt: d.createdAt?.toISOString?.() || d.createdAt || new Date().toISOString(),
    };
  }

  // STAFF
  public async getStaff(): Promise<StaffMember[]> {
    await connectToDatabase();
    const docs = await StaffModel.find().lean();
    return docs.map((d: any) => ({
      id: d._id.toString(),
      name: d.name,
      role: d.role,
      status: d.status,
      avatar: d.avatar,
      email: d.email,
      phone: d.phone,
      specialty: d.specialty,
    }));
  }

  public async addStaff(member: Omit<StaffMember, 'id'>): Promise<StaffMember> {
    await connectToDatabase();
    const doc = await StaffModel.create(member);
    return {
      ...member,
      id: doc._id.toString(),
    };
  }

  public async updateStaffStatus(id: string, status: StaffMember['status']): Promise<StaffMember | null> {
    await connectToDatabase();
    if (!isValidObjectId(id)) return null;
    const doc = await StaffModel.findByIdAndUpdate(id, { status }, { new: true }).lean();

    if (!doc) return null;
    const d: any = doc;
    return {
      id: d._id.toString(),
      name: d.name,
      role: d.role,
      status: d.status,
      avatar: d.avatar,
      email: d.email,
      phone: d.phone,
      specialty: d.specialty,
    };
  }

  // ARTICLES
  public async getArticles(opts: { publishedOnly?: boolean } = {}): Promise<Article[]> {
    await connectToDatabase();
    const query = opts.publishedOnly ? { status: 'Published' } : {};
    const docs = await ArticleModel.find(query).sort({ _id: -1 }).lean();
    return docs.map((d: any) => ({
      id: d._id.toString(),
      title: d.title,
      excerpt: d.excerpt,
      content: d.content,
      category: d.category,
      status: d.status,
      date: d.date,
      readTime: d.readTime,
      author: d.author,
      coverImage: d.coverImage,
    }));
  }

  public async addArticle(art: Omit<Article, 'id'>): Promise<Article> {
    await connectToDatabase();
    const doc = await ArticleModel.create(art);
    return {
      ...art,
      id: doc._id.toString(),
    };
  }

  public async updateArticle(id: string, updates: Partial<Article>): Promise<Article | null> {
    await connectToDatabase();
    if (!isValidObjectId(id)) return null;
    const doc = await ArticleModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).lean();

    if (!doc) return null;
    const d: any = doc;
    return {
      id: d._id.toString(),
      title: d.title,
      excerpt: d.excerpt,
      content: d.content,
      category: d.category,
      status: d.status,
      date: d.date,
      readTime: d.readTime,
      author: d.author,
      coverImage: d.coverImage,
    };
  }

  public async deleteArticle(id: string): Promise<boolean> {
    await connectToDatabase();
    if (!isValidObjectId(id)) return false;
    const result = await ArticleModel.findByIdAndDelete(id);
    return result !== null;
  }

  // SERVICES & MEDIA (static catalog data)
  public getServices(): Service[] {
    return INITIAL_SERVICES;
  }

  public getMedia(): MediaItem[] {
    return INITIAL_MEDIA;
  }

  // INQUIRIES
  public async addInquiry(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<{ id: string }> {
    await connectToDatabase();
    const doc = await InquiryModel.create(data);
    return { id: doc._id.toString() };
  }
}

export const dbService = new DbService();
export const dataStore = dbService; // Backwards compatibility alias
