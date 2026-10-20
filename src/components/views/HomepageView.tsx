'use client';

import React from 'react';
import { ActiveView } from '@/types';
import { Calendar, Play, Users, Tv, Award, Heart, CheckCircle2, Star, Sparkles, ArrowRight } from 'lucide-react';

interface HomepageViewProps {
  onNavigate: (view: ActiveView, serviceId?: string) => void;
  onOpenVideo?: () => void;
}

export const HomepageView: React.FC<HomepageViewProps> = ({ onNavigate, onOpenVideo }) => {
  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F8] via-[#FDF0F4] to-white pt-8 pb-16 lg:pt-14 lg:pb-24">
        {/* Soft background decor */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-pink-300/20 via-rose-200/20 to-pink-100/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/80 border border-pink-200 text-pink-700 text-xs font-semibold tracking-wide shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                <span>Empowering Ghanaian Mothers & Families</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Better Mothers <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-pink-700">
                  Brighter Futures
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="text-lg sm:text-xl font-semibold text-slate-800">
                Trusted Midwife, Health Educator, <br className="hidden sm:inline" />
                Your Partner Through Motherhood.
              </p>

              <p className="text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Expert advice on pregnancy, childbirth, newborn care, family planning and women&apos;s health with compassionate, personalized support.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate('booking')}
                  className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-bold text-base px-8 py-3.5 rounded-full shadow-lg shadow-pink-300/50 hover:shadow-xl hover:shadow-pink-400/50 transition duration-200 flex items-center justify-center gap-2.5 transform hover:-translate-y-0.5"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book a Consultation</span>
                </button>

                <button
                  onClick={() => {
                    if (onOpenVideo) onOpenVideo();
                    else onNavigate('media');
                  }}
                  className="w-full sm:w-auto bg-white hover:bg-pink-50/80 text-pink-600 font-semibold text-base px-6 py-3.5 rounded-full border border-pink-200 shadow-sm transition duration-200 flex items-center justify-center gap-2 hover:border-pink-300"
                >
                  <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 fill-pink-600 text-pink-600 ml-0.5" />
                  </div>
                  <span>Watch My TV Appearance</span>
                </button>
              </div>

              {/* Midwife Signature & Title */}
              <div className="pt-6 border-t border-pink-100/80 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <div>
                  <div className="font-signature text-3xl sm:text-4xl text-pink-700 font-bold tracking-wide">
                    Rosetta Ntriwaah Boakye
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Registered Midwife & Maternal Health Advocate
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Image Column */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                
                {/* Floating Quote Badge (Matches reference) */}
                <div className="absolute -top-4 -right-2 sm:-right-4 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-pink-100/80 max-w-[190px] animate-bounce-subtle">
                  <div className="flex items-center gap-2 text-pink-600 mb-1">
                    <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-pink-600">Motto</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 leading-snug">
                    “Healthy Mothers Keep Families”
                  </p>
                </div>

                {/* Main Rosetta Portrait Image Container */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-pink-100/50 aspect-[4/4.8] group">
                  <img
                    src="/images/rosetta.jpg"
                    alt="Rosetta Ntriwaah Boakye - Midwife"
                    className="w-full h-full object-cover object-top group-hover:scale-102 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-900/40 via-transparent to-transparent"></div>
                  
                  {/* Verified Badge */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-xl p-2.5 shadow-lg border border-pink-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-xs font-bold text-slate-800">Accepting Consultations</span>
                    </div>
                    <span className="text-[11px] font-semibold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
                      Accra Clinic & Online
                    </span>
                  </div>
                </div>

                {/* Decorative Pink Glow underneath */}
                <div className="absolute -bottom-6 -left-6 -right-6 h-12 bg-pink-400/20 blur-xl rounded-full -z-10"></div>
              </div>
            </div>

          </div>

          {/* Bottom 4 Highlights Banner (Matches reference: 10K+ Mothers Reached, TV & Radio, Registered Midwife, Community Advocate) */}
          <div className="mt-14 pt-8 border-t border-pink-200/60 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3.5 bg-white p-4 rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-pink-100/80 text-pink-600 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-slate-900">10K+</h4>
                <p className="text-xs text-slate-500 font-medium">Mothers Reached</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-white p-4 rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-pink-100/80 text-pink-600 flex items-center justify-center shrink-0">
                <Tv className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">TV & Radio</h4>
                <p className="text-xs text-slate-500 font-medium">Health Educator</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-white p-4 rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-pink-100/80 text-pink-600 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">Registered</h4>
                <p className="text-xs text-slate-500 font-medium">Professional Midwife</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-white p-4 rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-pink-100/80 text-pink-600 flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">Community</h4>
                <p className="text-xs text-slate-500 font-medium">Maternal Advocate</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* QUICK PREVIEW SECTIONS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
                Featured Care
              </span>
              <h2 className="text-3xl font-bold text-slate-900 mt-2">Comprehensive Maternal Services</h2>
              <p className="text-slate-500 text-sm mt-1">Book personalized consultations with Midwife Rosetta</p>
            </div>
            <button
              onClick={() => onNavigate('services')}
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-pink-600 hover:text-pink-700"
            >
              View All 6 Services <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-b from-pink-50/60 to-white p-6 rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-pink-600 text-white flex items-center justify-center mb-4 font-bold text-lg">
                🤰
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Antenatal Consultation</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Routine checkups, monitoring and expert guidance for a healthy pregnancy.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-pink-100">
                <span className="text-sm font-bold text-slate-800">30 mins | GHC 100</span>
                <button
                  onClick={() => onNavigate('booking', 'antenatal')}
                  className="px-4 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-full text-xs font-semibold"
                >
                  Book Now
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-b from-pink-50/60 to-white p-6 rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-pink-600 text-white flex items-center justify-center mb-4 font-bold text-lg">
                👶
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Postnatal Consultation</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Recovery support, postpartum health assessment, and dedicated care for newborns.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-pink-100">
                <span className="text-sm font-bold text-slate-800">30 mins | GHC 100</span>
                <button
                  onClick={() => onNavigate('booking', 'postnatal')}
                  className="px-4 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-full text-xs font-semibold"
                >
                  Book Now
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-b from-pink-50/60 to-white p-6 rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-pink-600 text-white flex items-center justify-center mb-4 font-bold text-lg">
                🌿
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Family Planning</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Empowering counseling and contraceptive options tailored to your family goals.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-pink-100">
                <span className="text-sm font-bold text-slate-800">30 mins | GHC 80</span>
                <button
                  onClick={() => onNavigate('booking', 'family-planning')}
                  className="px-4 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-full text-xs font-semibold"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
