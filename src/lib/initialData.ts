import { Service, StaffMember, Article, MediaItem, Appointment } from '@/types';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'antenatal',
    title: 'Antenatal Consultation',
    description: 'Routine checkups, monitoring and guidance for a healthy pregnancy.',
    duration: '30 mins',
    price: 100,
    currency: 'GHC',
    icon: 'Stethoscope',
    popular: true
  },
  {
    id: 'postnatal',
    title: 'Postnatal Consultation',
    description: 'Recovery support for mothers and newborns.',
    duration: '30 mins',
    price: 100,
    currency: 'GHC',
    icon: 'HeartHandshake'
  },
  {
    id: 'family-planning',
    title: 'Family Planning',
    description: 'Counseling and contraceptive advice tailored to your needs.',
    duration: '30 mins',
    price: 80,
    currency: 'GHC',
    icon: 'ShieldCheck'
  },
  {
    id: 'fertility',
    title: 'Fertility Consultation',
    description: 'Support for conception and reproductive health journeys.',
    duration: '45 mins',
    price: 120,
    currency: 'GHC',
    icon: 'Sparkles'
  },
  {
    id: 'breastfeeding',
    title: 'Breastfeeding Support',
    description: 'Guidance on breastfeeding techniques and newborn nutrition.',
    duration: '30 mins',
    price: 80,
    currency: 'GHC',
    icon: 'Baby'
  },
  {
    id: 'general-womens-health',
    title: 'General Women\'s Health',
    description: 'Comprehensive advice on any women\'s health and wellness concerns.',
    duration: '30 mins',
    price: 100,
    currency: 'GHC',
    icon: 'Activity'
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Rosetta N. Boakye',
    role: 'Lead Midwife & Founder',
    status: 'Available',
    avatar: '/images/rosetta.jpg',
    specialty: 'Maternal Health, Antenatal & Postnatal Care',
    email: 'rosetta@tellittorosett.com',
    phone: '+233 24 551 4567'
  },
  {
    id: 'staff-2',
    name: 'Akosua Otwire',
    role: 'Receptionist & Patient Care',
    status: 'Available',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    specialty: 'Patient Relations & Scheduling',
    email: 'akosua@tellittorosett.com',
    phone: '+233 24 551 4568'
  },
  {
    id: 'staff-3',
    name: 'Kofi Mensah',
    role: 'Clinic Assistant',
    status: 'On Leave',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    specialty: 'Clinical Support & Records',
    email: 'kofi@tellittorosett.com',
    phone: '+233 24 551 4569'
  },
  {
    id: 'staff-4',
    name: 'Edi Addo',
    role: 'Outreach Manager',
    status: 'Available',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    specialty: 'Community Engagement & Media',
    email: 'edi@tellittorosett.com',
    phone: '+233 24 551 4570'
  },
  {
    id: 'staff-5',
    name: 'Yaa Asantewaa',
    role: 'Staff Midwife / Nurse',
    status: 'Available',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80',
    specialty: 'Lactation & Newborn Care',
    email: 'yaa@tellittorosett.com',
    phone: '+233 24 551 4571'
  },
  {
    id: 'staff-6',
    name: 'Nana Akua',
    role: 'Nurse Midwife',
    status: 'Available',
    avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&auto=format&fit=crop&q=80',
    specialty: 'Family Planning & Triage',
    email: 'nana@tellittorosett.com',
    phone: '+233 24 551 4572'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-1001',
    patientName: 'Ama Serwaa',
    phone: '024 123 4567',
    email: 'ama@example.com',
    age: 28,
    isPregnant: true,
    pregnancyStage: 'Second Trimester',
    reason: 'Routine antenatal checkup and ultrasound review',
    notes: 'Mild lower back ache reported. Normal BP.',
    serviceId: 'antenatal',
    serviceName: 'Antenatal Consultation',
    date: '2026-09-16',
    time: '9:00 AM',
    location: 'MatraCare Clinic, East Legon',
    fee: 100,
    platformFee: 0,
    total: 100,
    paymentMethod: 'momo',
    paymentStatus: 'paid',
    status: 'Confirmed',
    createdAt: '2026-09-10T10:00:00Z'
  },
  {
    id: 'APT-1002',
    patientName: 'Kwame Agyei',
    phone: '020 987 6543',
    email: 'kwame.agyei@gmail.com',
    age: 32,
    isPregnant: false,
    reason: 'Postnatal follow up on newborn jaundice',
    notes: 'Bringing 2-week old infant for check.',
    serviceId: 'postnatal',
    serviceName: 'Postnatal Consultation',
    date: '2026-09-16',
    time: '10:30 AM',
    location: 'MatraCare Clinic, East Legon',
    fee: 100,
    platformFee: 0,
    total: 100,
    paymentMethod: 'momo',
    paymentStatus: 'pending',
    status: 'Pending',
    createdAt: '2026-09-11T11:15:00Z'
  },
  {
    id: 'APT-1003',
    patientName: 'Esi Mensah',
    phone: '055 332 1199',
    email: 'esimensah@yahoo.com',
    age: 26,
    isPregnant: false,
    reason: 'Contraceptive counseling after marriage',
    notes: 'Interested in non-hormonal options.',
    serviceId: 'family-planning',
    serviceName: 'Family Planning',
    date: '2026-09-16',
    time: '1:00 PM',
    location: 'Online Consultation (Zoom / WhatsApp)',
    fee: 80,
    platformFee: 0,
    total: 80,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    status: 'Confirmed',
    createdAt: '2026-09-12T09:30:00Z'
  },
  {
    id: 'APT-1004',
    patientName: 'Afia Boateng',
    phone: '027 445 8899',
    email: 'afia.b@outlook.com',
    age: 35,
    isPregnant: false,
    reason: 'Reproductive wellness checkup',
    notes: 'Irregular cycles inquiry.',
    serviceId: 'general-womens-health',
    serviceName: 'General Women\'s Health',
    date: '2026-09-16',
    time: '3:00 PM',
    location: 'MatraCare Clinic, East Legon',
    fee: 100,
    platformFee: 0,
    total: 100,
    paymentMethod: 'momo',
    paymentStatus: 'paid',
    status: 'Confirmed',
    createdAt: '2026-09-13T14:20:00Z'
  },
  {
    id: 'APT-1005',
    patientName: 'Yaa Ampomah',
    phone: '024 887 6622',
    email: 'yaa.amp@gmail.com',
    age: 30,
    isPregnant: true,
    pregnancyStage: 'Third Trimester',
    reason: 'Birth preparation & pain management options',
    notes: 'First time mom seeking reassurance.',
    serviceId: 'fertility',
    serviceName: 'Fertility / Birth Prep',
    date: '2026-09-16',
    time: '4:00 PM',
    location: 'MatraCare Clinic, East Legon',
    fee: 120,
    platformFee: 0,
    total: 120,
    paymentMethod: 'bank',
    paymentStatus: 'pending',
    status: 'Pending',
    createdAt: '2026-09-14T08:45:00Z'
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: '10 Tips for a Healthy Pregnancy',
    excerpt: 'Practical tips to keep you and your baby safe and healthy throughout each trimester.',
    content: `Pregnancy is a miraculous, transformative journey. Taking proactive steps ensures the optimal health of both mother and child:
    
1. **Early Prenatal Care**: Schedule your first visit as soon as you discover you are expecting.
2. **Balanced Nutrition**: Focus on whole grains, fresh vegetables, lean proteins, and iron-rich foods.
3. **Daily Hydration**: Drink at least 8 to 10 glasses of clean water daily to support blood volume and amniotic fluid.
4. **Folic Acid & Micronutrients**: Take your prescribed prenatal vitamins consistently.
5. **Gentle Physical Activity**: Walking, prenatal yoga, and swimming boost stamina and mood.
6. **Restful Sleep**: Sleep on your left side to maximize placental blood flow.
7. **Listen to Your Body**: Never ignore persistent headaches, sudden swelling, or reduced fetal movement.
8. **Mental Wellness**: Engage with support groups and communicate openly with your midwife.
9. **Birth Planning**: Prepare your hospital bag and understand birth stages well ahead of time.
10. **Avoid Harmful Substances**: Steer clear of unpasteurized foods, self-medication, and smoke.`,
    category: 'Pregnancy',
    status: 'Published',
    date: '12 Sept 2026',
    readTime: '5 min read',
    author: 'Rosetta Ntriwaah Boakye',
    coverImage: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'art-2',
    title: 'Newborn Care Essentials',
    excerpt: 'Everything you need to know about caring for your newborn in their first weeks.',
    content: `Welcoming a newborn is joyous yet demanding. Master the core essentials:
    
- **Cord Care**: Keep the umbilical cord clean and dry until it separates naturally.
- **Exclusive Breastfeeding**: Feed on demand (8-12 times in 24 hours). Look for active swallowing and sufficient wet diapers.
- **Safe Sleep**: Always place your baby on their back on a firm surface without pillows or loose blankets.
- **Temperature Regulation**: Dress baby in one more layer than what you find comfortable.`,
    category: 'Newborn Care',
    status: 'Published',
    date: '10 Sept 2026',
    readTime: '4 min read',
    author: 'Rosetta Ntriwaah Boakye',
    coverImage: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'art-3',
    title: 'Understanding Family Planning',
    excerpt: 'Explore different contraceptive options and their specific benefits for your lifestyle.',
    content: `Family planning empowers couples to decide when and how many children to have. We explore modern barrier, hormonal, long-acting reversible, and natural methods so you can make informed, pressure-free choices tailored to your body and future goals.`,
    category: 'Family Planning',
    status: 'Draft',
    date: '9 Sept 2026',
    readTime: '6 min read',
    author: 'Rosetta Ntriwaah Boakye',
    coverImage: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'art-4',
    title: 'Signs of Labour',
    excerpt: 'How to recognize early vs active labour signs and when to head to the maternity clinic.',
    content: `Knowing when true labour begins reduces anxiety. Watch for regular, intensifying contractions, the show (mucus plug release), and rupture of membranes. Contact your midwife as soon as contractions occur every 5 minutes lasting 60 seconds.`,
    category: 'Labour',
    status: 'Published',
    date: '5 Sept 2026',
    readTime: '7 min read',
    author: 'Rosetta Ntriwaah Boakye',
    coverImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'art-5',
    title: 'Nutrition During Pregnancy',
    excerpt: 'The vital nutrients every mother needs during pregnancy for brain and bone development.',
    content: `Optimal prenatal nutrition provides the building blocks for your baby's organs, bones, and brain. Discover rich sources of calcium, DHA, folate, and iron available in local markets and healthy daily meal preparations.`,
    category: 'Nutrition',
    status: 'Scheduled',
    date: '25 Oct 2026',
    readTime: '5 min read',
    author: 'Rosetta Ntriwaah Boakye',
    coverImage: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'media-1',
    type: 'tv',
    title: 'Maternal Health Special: Safe Delivery & Care',
    station: 'GTV Breakfast Show',
    date: '12 Aug 2024',
    duration: '18:42',
    description: 'Rosetta speaks on reducing maternal mortality rates, recognizing early danger signs in pregnancy, and empowering mothers across Ghana with accessible healthcare.',
    thumbnail: '/images/tv_interview.jpg'
  },
  {
    id: 'media-2',
    type: 'tv',
    title: 'Safe Motherhood in Ghana: Bridging the Gap',
    station: 'Joy News Prime',
    date: '5 Oct 2024',
    duration: '24:15',
    description: 'In-depth discussion on postpartum depression, neonatal survival, and community midwifery support with Joy News health correspondents.',
    thumbnail: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'media-3',
    type: 'tv',
    title: 'Family Planning Awareness & Women\'s Health',
    station: 'Adom TV Badwam',
    date: '20 Jun 2024',
    duration: '15:30',
    description: 'Debunking myths around contraceptives and educating young mothers on reproductive health management.',
    thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'media-4',
    type: 'radio',
    title: 'Pregnancy & Newborn Nutrition Masterclass',
    station: 'Citi FM 97.3',
    date: '18 Jul 2024',
    duration: '45:00',
    description: 'Live call-in session addressing maternal dietary needs, gestational diabetes prevention, and infant feeding routines.',
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'media-5',
    type: 'event',
    title: 'Annual Maternal & Child Health Summit 2024',
    station: 'Accra International Conference Centre',
    date: '15 Sep 2024',
    duration: 'Keynote Talk',
    description: 'Keynote address by Rosetta on "The Midwife as the Cornerstone of Community Health".',
    thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80'
  }
];
