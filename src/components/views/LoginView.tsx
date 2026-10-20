'use client';

import React, { useState, useEffect } from 'react';
import { signIn, getSession, useSession } from 'next-auth/react';
import { ActiveView } from '@/types';
import { Mail, Lock, Eye, EyeOff, Heart, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

interface LoginViewProps {
  onNavigate: (view: ActiveView) => void;
  onLoginSuccess: (role?: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigate, onLoginSuccess }) => {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, route directly to dashboard
  useEffect(() => {
    if (session?.user?.role) {
      onLoginSuccess(session.user.role);
    }
  }, [session, onLoginSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        const freshSession = await getSession({ broadcast: true });
        const userRole = freshSession?.user?.role || (email.toLowerCase().includes('rosetta') ? 'staff' : 'patient');
        onLoginSuccess(userRole);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-[#FFF5F8] via-[#FDF0F4] to-white py-12 px-4">
      {/* Background decor */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-pink-300/20 via-rose-200/20 to-pink-100/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-400 flex items-center justify-center text-white shadow-lg pulse-glow">
              <Heart className="w-6 h-6 fill-white stroke-none" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-serif-title">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-pink-100/80">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-in fade-in duration-300">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-sm transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-sm transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-pink-200/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">New here?</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Register Link */}
          <button
            onClick={() => onNavigate('register' as ActiveView)}
            className="w-full py-3 border-2 border-pink-200 hover:border-pink-400 hover:bg-pink-50 text-pink-700 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Create an Account
          </button>

          {/* Quick Demo Account Helpers */}
          <div className="mt-5 p-3.5 bg-pink-50/70 border border-pink-100 rounded-2xl">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
              Quick Demo Logins
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('rosetta@tellittorosett.com');
                  setPassword('demo1234');
                }}
                className="py-2 px-2.5 bg-white hover:bg-pink-100/60 text-pink-700 text-xs font-semibold rounded-xl border border-pink-200 transition text-center shadow-sm"
              >
                Staff (Rosetta)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('ama@example.com');
                  setPassword('demo1234');
                }}
                className="py-2 px-2.5 bg-white hover:bg-pink-100/60 text-pink-700 text-xs font-semibold rounded-xl border border-pink-200 transition text-center shadow-sm"
              >
                Patient (Ama Serwaa)
              </button>
            </div>
          </div>
        </div>

        {/* Back to home */}
        <p className="text-center text-sm text-slate-500 mt-6">
          <button
            onClick={() => onNavigate('home')}
            className="text-pink-600 hover:text-pink-700 font-semibold hover:underline transition"
          >
            ← Back to Homepage
          </button>
        </p>
      </div>
    </div>
  );
};
