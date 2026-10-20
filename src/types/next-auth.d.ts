import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'patient' | 'staff';
      avatar: string;
      phone: string;
    } & DefaultSession['user'];
  }

  interface User {
    role: 'patient' | 'staff';
    avatar?: string;
    phone?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'patient' | 'staff';
    avatar: string;
    phone: string;
  }
}
