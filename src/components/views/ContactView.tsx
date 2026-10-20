'use client';

import React, { useState } from 'react';
import { MapPin, Phone, MessageSquare, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { ClinicMap } from '@/components/ClinicMap';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Consultation Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message })
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setError(result.error || 'Could not send your message. Please try again.');
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#FCF8FA] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-3.5 py-1 rounded-full border border-pink-100">
            Reach Out
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-serif-title">
            Get in Touch
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            We&apos;re here to help. Reach out online or visit our clinic in Accra.
          </p>
        </div>

        {/* 5 Contact Info Badges (Matches Screen 15) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          
          {/* Location */}
          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">Our Location</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Labone Polyclinic, East Legon, Accra, Ghana</p>
            </div>
          </div>

          {/* Call Us */}
          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">Call Us</h4>
              <a href="tel:+233245514567" className="text-[11px] text-pink-600 font-semibold hover:underline block mt-0.5">
                +233 24 551 4567
              </a>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">WhatsApp</h4>
              <a 
                href="https://wa.me/233245514567?text=Hello%20Midwife%20Rosetta" 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] text-emerald-600 font-semibold hover:underline block mt-0.5"
              >
                Chat with us
              </a>
            </div>
          </div>

          {/* Email Us */}
          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">Email Us</h4>
              <a href="mailto:info@tellittorosett.com" className="text-[11px] text-pink-600 font-semibold hover:underline block mt-0.5 truncate max-w-[140px]">
                info@tellittorosett.com
              </a>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm flex items-start gap-3 sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">Working Hours</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Mon - Fri: 8:00 AM - 5:00 PM <br />
                Sat: 9:00 AM - 1:00 PM
              </p>
            </div>
          </div>

        </div>

        {/* Map Preview & Contact Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Clinic Location Map Preview & Interactive Directions */}
          <div className="lg:col-span-6 flex flex-col">
            <ClinicMap />
          </div>

          {/* Interactive Send Message Form */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 mb-1">Send a Message</h3>
            <p className="text-xs text-slate-500 mb-6">
              Have a question about maternity care, bookings, or speaking engagements?
            </p>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center text-emerald-800 space-y-2 animate-in zoom-in-95">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base">Message Sent Successfully!</h4>
                <p className="text-xs text-emerald-700">
                  Thank you, <b>{name}</b>. Midwife Rosetta and our team will get back to you shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Abena Mensah"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="abena@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="+233 24 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800 bg-white"
                  >
                    <option value="General Consultation Inquiry">General Consultation Inquiry</option>
                    <option value="Antenatal Care Question">Antenatal Care Question</option>
                    <option value="Media & Speaking Engagement">Media & Speaking Engagement</option>
                    <option value="Community Workshop">Community Workshop</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can Midwife Rosetta assist you?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800 text-xs sm:text-sm"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
