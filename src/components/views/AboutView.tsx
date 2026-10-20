'use client';

import React from 'react';
import { ActiveView } from '@/types';
import { Award, Tv, Heart, Users, Quote, CheckCircle, ArrowRight, ShieldCheck, Stethoscope } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (view: ActiveView) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="w-full bg-[#FCF8FA] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main About Card Grid (Matching Screen 2) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm border border-pink-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Photo Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-pink-100 aspect-[4/5]">
                  <img
                    src="/images/rosetta.jpg"
                    alt="About Midwife Rosetta"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* Accent Tag */}
                <div className="absolute -bottom-4 right-4 bg-gradient-to-r from-pink-600 to-rose-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                  Registered Midwife (NMC)
                </div>
              </div>
            </div>

            {/* Right Bio & Highlights */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
                  Meet Your Midwife
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-serif-title">
                  About Rosetta <br />
                  <span className="text-pink-600">Ntriwaah Boakye</span>
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 tracking-wide mt-1">
                  Registered Midwife | Maternal Health Advocate | Media Personality
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                I am a passionate midwife committed to improving the health and wellbeing of women, mothers and newborns. Through my work on radio, TV and communities, I educate and empower families with trusted, evidence-based information.
              </p>

              {/* 4 Highlight Stat Cards (Matches Screen 2) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-pink-50/70 p-3.5 rounded-2xl border border-pink-100 text-center">
                  <div className="w-8 h-8 mx-auto rounded-lg bg-pink-600 text-white flex items-center justify-center mb-1.5 shadow-sm">
                    <Award className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">10+</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight">Yrs Experience</p>
                </div>

                <div className="bg-pink-50/70 p-3.5 rounded-2xl border border-pink-100 text-center">
                  <div className="w-8 h-8 mx-auto rounded-lg bg-pink-600 text-white flex items-center justify-center mb-1.5 shadow-sm">
                    <Tv className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">TV & Radio</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight">Personality</p>
                </div>

                <div className="bg-pink-50/70 p-3.5 rounded-2xl border border-pink-100 text-center">
                  <div className="w-8 h-8 mx-auto rounded-lg bg-pink-600 text-white flex items-center justify-center mb-1.5 shadow-sm">
                    <Heart className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Maternal Health</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight">Advocate</p>
                </div>

                <div className="bg-pink-50/70 p-3.5 rounded-2xl border border-pink-100 text-center">
                  <div className="w-8 h-8 mx-auto rounded-lg bg-pink-600 text-white flex items-center justify-center mb-1.5 shadow-sm">
                    <Users className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Thousands</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight">Lives Impacted</p>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => onNavigate('booking')}
                  className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-6 py-3 rounded-full shadow-md transition flex items-center gap-2"
                >
                  <span>Book a Consultation with Rosetta</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Quote Block (Matches bottom of Screen 2) */}
          <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 border border-pink-200/70 text-center relative overflow-hidden">
            <Quote className="w-10 h-10 text-pink-300/40 absolute top-3 left-4 -scale-x-100 pointer-events-none" />
            <Quote className="w-10 h-10 text-pink-300/40 absolute bottom-3 right-4 pointer-events-none" />
            
            <p className="text-lg sm:text-xl font-bold text-slate-800 italic max-w-2xl mx-auto leading-snug">
              “Every mother deserves the right information, support and quality care.”
            </p>
            <p className="text-xs sm:text-sm font-semibold text-pink-700 mt-2 tracking-wide">
              — Rosetta Ntriwaah Boakye
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
