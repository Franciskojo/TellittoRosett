import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db';
import { UserModel } from '@/lib/models/User';
import { dbService } from '@/lib/dbService';
import { rateLimit } from '@/lib/rateLimit';

// Pre-computed hash so unknown emails cost the same time as wrong passwords (prevents timing enumeration).
const DUMMY_HASH = bcrypt.hashSync('timing-equalisation-placeholder', 12);
const INVALID_CREDENTIALS = 'Invalid email or password';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }

        const emailLower = credentials.email.toLowerCase().trim();

        // Brute-force protection: 10 attempts per email per 15 minutes.
        try {
          rateLimit(`login:${emailLower}`, 10, 15 * 60 * 1000);
        } catch {
          throw new Error('Too many login attempts. Please try again later.');
        }

        await dbService.init();
        await connectToDatabase();

        const user = await UserModel.findOne({ email: emailLower });
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user?.password ?? DUMMY_HASH
        );
        if (!user || !isPasswordValid) {
          throw new Error(INVALID_CREDENTIALS);
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar || '',
          phone: user.phone || ''
        };
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar ?? '';
        token.phone = user.phone ?? '';
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.avatar = token.avatar;
        session.user.phone = token.phone;
      }
      return session;
    }
  },

  pages: {
    signIn: '/auth/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};
