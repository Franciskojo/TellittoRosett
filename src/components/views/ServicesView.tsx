'use client';

import React from 'react';
import { ActiveView, Service } from '@/types';
import { INITIAL_SERVICES } from '@/lib/initialData';
import { Stethoscope, HeartHandshake, ShieldCheck, Sparkles, Baby, Activity, Clock, CheckCircle2 } from 'lucide-react';

interface ServicesViewProps {
  onNavigate: (view: ActiveView, serviceId?: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onNavigate }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Stethoscope':
        return <Stethoscope className="w-6 h-6 text-pink-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-pink-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-pink-600" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-pink-600" />;
      case 'Baby':
        return <Baby className="w-6 h-6 text-pink-600" />;
      case 'Activity':
      default:
        return <Activity className="w-6 h-6 text-pink-600" />;
    }
  };

  return (
    <div className="w-full bg-[#FCF8FA] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-3.5 py-1 rounded-full border border-pink-100">
            Professional Care
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-serif-title">
            Our Services
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Quality care and expert advice for every stage of your journey.
          </p>
        </div>

        {/* 6 Services Grid (Matches Screen 3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl p-6 border border-pink-100 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between relative group"
            >
              <div>
                {/* Icon & Title */}
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                    {getIcon(service.icon)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 leading-snug">
                      {service.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                  {service.description}
                </p>
              </div>

              {/* Price & Duration Bar */}
              <div className="mt-6 pt-4 border-t border-pink-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-pink-500" /> {service.duration}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-pink-600 font-bold">
                    {service.currency} {service.price}
                  </span>
                </div>

                <button
                  onClick={() => onNavigate('booking', service.id)}
                  className="px-4 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-full text-xs font-semibold shadow-sm transition"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Reassurance Banner */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Need customized or private home consultation?</h4>
              <p className="text-xs text-slate-500">We offer flexible appointment slots both in-person at East Legon and via secure online video.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="whitespace-nowrap px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-full transition"
          >
            Inquire About Custom Care
          </button>
        </div>

      </div>
    </div>
  );
};
