'use client';

import React from 'react';
import { ActiveView } from '@/types';
import { Heart, Facebook, Instagram, Youtube, Linkedin, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: ActiveView, serviceId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-white mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-400 flex items-center justify-center text-white shadow-md">
                <Heart className="w-5 h-5 fill-white stroke-none" />
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight text-pink-400">Tell it to </span>
                <span className="font-bold text-xl tracking-tight text-white">Rosett</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering mothers and families across Ghana with compassionate, evidence-based midwifery, maternal guidance, and reproductive health care.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-pink-400 hover:bg-pink-600 hover:text-white transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-pink-400 hover:bg-pink-600 hover:text-white transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-pink-400 hover:bg-pink-600 hover:text-white transition">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-pink-400 hover:bg-pink-600 hover:text-white transition">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-pink-400 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-pink-400 transition">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-pink-400 transition">
                  About Rosetta
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-pink-400 transition">
                  Midwifery Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('media')} className="hover:text-pink-400 transition">
                  Media & TV Shows
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog-public')} className="hover:text-pink-400 transition">
                  Health Resources & Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-pink-400 mb-4">
              Specialized Care
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button onClick={() => onNavigate('booking', 'antenatal')} className="hover:text-pink-400 transition text-left">
                  Antenatal Care & Ultrasound Review
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('booking', 'postnatal')} className="hover:text-pink-400 transition text-left">
                  Postnatal Recovery & Newborn
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('booking', 'family-planning')} className="hover:text-pink-400 transition text-left">
                  Family Planning Counseling
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('booking', 'breastfeeding')} className="hover:text-pink-400 transition text-left">
                  Lactation & Breastfeeding Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('booking', 'fertility')} className="hover:text-pink-400 transition text-left">
                  Fertility & Reproductive Health
                </button>
              </li>
            </ul>
          </div>

          {/* Clinic & Contacts */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-pink-400 mb-4">
              Clinic Contact
            </h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                <span>Labone Polyclinic / MatraCare, East Legon, Accra, Ghana</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-pink-400 shrink-0" />
                <span>+233 24 551 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-pink-400 shrink-0" />
                <span>info@tellittorosett.com</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-xs bg-pink-600/30 text-pink-300 border border-pink-500/40 px-3 py-1.5 rounded-lg hover:bg-pink-600 hover:text-white transition"
                >
                  Visit Contact Page →
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Tell it to Rosett. All rights reserved.</p>
          <div className="flex space-x-6 mt-3 sm:mt-0">
            <span className="text-slate-400">Rosetta Ntriwaah Boakye - Registered Midwife</span>
            <button onClick={() => onNavigate('staff-dashboard')} className="hover:text-pink-400 underline">
              Staff Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
