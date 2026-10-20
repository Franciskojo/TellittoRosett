'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Session } from 'next-auth';
import { ActiveView, Appointment, Article } from '@/types';
import { 
  Calendar, Clock, MapPin, User, FileText, CreditCard, MessageSquare, 
  PlusCircle, ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, LogOut, Activity, Heart,
  AlertCircle, Phone, ShieldCheck, Baby, Sparkles, Download, ExternalLink,
  Search, Filter, Check, X, Printer, Receipt, Stethoscope, CalendarPlus,
  Compass, ChevronDown, ChevronUp
} from 'lucide-react';

interface PatientDashboardProps {
  session?: Session | null;
  appointments: Appointment[];
  onNavigate: (view: ActiveView, serviceId?: string) => void;
  onViewAppointmentDetails: (apt: Appointment) => void;
  onReadArticle: (art: Article) => void;
}

type TabKey = 'overview' | 'appointments' | 'billing' | 'care-team';
type StatusFilter = 'ALL' | 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  session,
  appointments,
  onNavigate,
  onViewAppointmentDetails,
  onReadArticle,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<Appointment | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
  };

  // Maternal checklist interactive state
  const [checklist, setChecklist] = useState<{ id: string; text: string; done: boolean }[]>([
    { id: '1', text: 'Daily Prenatal / Iron & Folic Acid supplements taken', done: true },
    { id: '2', text: 'Hydration goal: 2.5 Litres of water today', done: true },
    { id: '3', text: 'Log fetal movement & kick count (Target: 10 kicks / 2 hrs)', done: false },
    { id: '4', text: 'Prepare questions for Midwife Rosetta consultation', done: false },
  ]);

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const userName = session?.user?.name || 'Patient';
  const userEmail = session?.user?.email || '';
  const userPhone = session?.user?.phone || '024 123 4567';

  // Dynamic greeting based on current time
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Active appointments (confirmed or pending)
  const activeApts = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending');
  const upcomingApt = activeApts[0] || appointments.find(a => a.status !== 'Cancelled') || null;

  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(a => a.status === 'Completed').length;
  const pendingAppointments = appointments.filter(a => a.status === 'Pending').length;
  const confirmedAppointments = appointments.filter(a => a.status === 'Confirmed').length;
  const cancelledAppointments = appointments.filter(a => a.status === 'Cancelled').length;

  const totalSpent = appointments
    .filter(a => a.status !== 'Cancelled')
    .reduce((sum, a) => sum + (Number(a.total) || Number(a.fee) || 0), 0);

  // Helper: Format calendar tear-off badge
  const calendarDate = useMemo(() => {
    if (!upcomingApt?.date) return { month: 'APT', day: '–' };
    try {
      const parts = upcomingApt.date.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return {
          month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
          day: d.getDate()
        };
      }
      return { month: 'APT', day: '–' };
    } catch {
      return { month: 'APT', day: '–' };
    }
  }, [upcomingApt]);

  // Helper: Relative countdown string
  const countdownLabel = useMemo(() => {
    if (!upcomingApt?.date) return '';
    try {
      const parts = upcomingApt.date.split('-');
      if (parts.length === 3) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const target = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        target.setHours(0, 0, 0, 0);
        const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays > 1) return `In ${diffDays} days`;
        if (diffDays < 0) return 'Past';
      }
      return 'Upcoming';
    } catch {
      return 'Upcoming';
    }
  }, [upcomingApt]);

  // Filtered appointments list
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchesStatus = statusFilter === 'ALL' || apt.status === statusFilter;
      const ref = (apt.appointmentCode || apt.id || '').toLowerCase();
      const service = (apt.serviceName || '').toLowerCase();
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || ref.includes(query) || service.includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [appointments, statusFilter, searchQuery]);

  return (
    <div className="w-full bg-[#FCF8FA] min-h-[90vh] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Header Bar & Quick Tabs (< lg) */}
        <div className="block lg:hidden mb-5 space-y-3">
          {/* Collapsible Bar */}
          <div className="bg-white rounded-2xl p-3.5 border border-pink-100 shadow-soft flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-rose-400 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                🌸
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block leading-tight">{userName}</span>
                <span className="text-[10px] text-brand-600 font-semibold block leading-tight">Maternal Care Portal</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="flex items-center gap-1.5 bg-pink-50 hover:bg-pink-100 text-brand-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-pink-200 transition cursor-pointer"
              aria-expanded={isMobileSidebarOpen}
            >
              <span>{isMobileSidebarOpen ? 'Hide Menu' : 'Portal Menu'}</span>
              {isMobileSidebarOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Sticky Horizontal Quick Tab Switcher */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
            <button
              type="button"
              onClick={() => handleTabChange('overview')}
              className={`flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all shadow-2xs cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-brand-600 to-rose-500 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-pink-100 hover:bg-pink-50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('appointments')}
              className={`flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all shadow-2xs cursor-pointer ${
                activeTab === 'appointments'
                  ? 'bg-gradient-to-r from-brand-600 to-rose-500 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-pink-100 hover:bg-pink-50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Consultations</span>
              {totalAppointments > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === 'appointments' ? 'bg-white/25 text-white' : 'bg-pink-100 text-brand-700'}`}>
                  {totalAppointments}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('billing')}
              className={`flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all shadow-2xs cursor-pointer ${
                activeTab === 'billing'
                  ? 'bg-gradient-to-r from-brand-600 to-rose-500 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-pink-100 hover:bg-pink-50'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Billing</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('care-team')}
              className={`flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all shadow-2xs cursor-pointer ${
                activeTab === 'care-team'
                  ? 'bg-gradient-to-r from-brand-600 to-rose-500 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-pink-100 hover:bg-pink-50'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Care Team</span>
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ========================================================= */}
          {/* LEFT SIDEBAR NAVIGATION & PROFILE (Collapsible on Mobile) */}
          {/* ========================================================= */}
          <aside className={`lg:col-span-3 lg:sticky lg:top-6 self-start space-y-4 ${isMobileSidebarOpen ? 'block' : 'hidden lg:block'}`}>
            
            {/* 1. Main Navigation & Patient Profile Card */}
            <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-soft space-y-5">
              
              {/* Mobile Close Button (< lg) */}
              <div className="lg:hidden flex items-center justify-between pb-3 border-b border-pink-100">
                <span className="text-xs font-bold text-slate-700">Navigation Menu</span>
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-xs flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Close</span>
                </button>
              </div>
              
              {/* Clinic Branding Header */}
              <div className="flex items-center justify-between pb-4 border-b border-pink-100/70">
                <div 
                  onClick={() => onNavigate('home')} 
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-rose-400 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                    <Heart className="w-4 h-4 fill-white stroke-none" />
                  </div>
                  <div>
                    <span className="font-bold text-xs tracking-tight text-brand-600 block leading-tight">Tell it to Rosett</span>
                    <span className="text-[10px] text-slate-400 font-semibold block leading-tight">Maternal Portal</span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>

              {/* Navigation Menu Groups */}
              <div className="space-y-4">
                
                {/* Group 1: CLINICAL DASHBOARD */}
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400 px-3 block">
                    Clinical Portal
                  </span>

                  <button 
                    onClick={() => handleTabChange('overview')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === 'overview'
                        ? 'bg-gradient-to-r from-brand-600 to-rose-500 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:bg-pink-50/70 hover:text-brand-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Activity className="w-4 h-4" />
                      <span>Overview</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleTabChange('appointments')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === 'appointments'
                        ? 'bg-gradient-to-r from-brand-600 to-rose-500 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:bg-pink-50/70 hover:text-brand-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4" />
                      <span>My Consultations</span>
                    </div>
                    {totalAppointments > 0 && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        activeTab === 'appointments' ? 'bg-white/20 text-white' : 'bg-pink-100 text-brand-700'
                      }`}>
                        {totalAppointments}
                      </span>
                    )}
                  </button>

                  <button 
                    onClick={() => {
                      setIsMobileSidebarOpen(false);
                      onNavigate('booking');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-brand-600 hover:bg-pink-50 transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <PlusCircle className="w-4 h-4 text-brand-600 group-hover:rotate-90 transition-transform" />
                      <span>Book Consultation</span>
                    </div>
                    <span className="text-[10px] bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded-md border border-pink-200">
                      New
                    </span>
                  </button>

                  <button 
                    onClick={() => handleTabChange('billing')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === 'billing'
                        ? 'bg-gradient-to-r from-brand-600 to-rose-500 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:bg-pink-50/70 hover:text-brand-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Receipt className="w-4 h-4" />
                      <span>Billing & Receipts</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      activeTab === 'billing' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      GHC {totalSpent.toLocaleString()}
                    </span>
                  </button>
                </div>

                {/* Group 2: CARE & SUPPORT */}
                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400 px-3 block">
                    Care & Support
                  </span>

                  <button 
                    onClick={() => handleTabChange('care-team')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === 'care-team'
                        ? 'bg-gradient-to-r from-brand-600 to-rose-500 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:bg-pink-50/70 hover:text-brand-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Heart className="w-4 h-4" />
                      <span>Midwife Care Team</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => {
                      setIsMobileSidebarOpen(false);
                      onNavigate('contact');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-pink-50/70 hover:text-brand-600 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                      <span>Send Clinic Inquiry</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => {
                      setIsMobileSidebarOpen(false);
                      onNavigate('blog-public');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-pink-50/70 hover:text-brand-600 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <Compass className="w-4 h-4 text-slate-400" />
                      <span>Maternal Guides</span>
                    </div>
                  </button>
                </div>

              </div>

              {/* Portal Utilities & Exit */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => onNavigate('home')}
                  className="w-full flex items-center gap-2.5 text-xs text-slate-500 hover:text-brand-600 px-3 py-2 rounded-xl hover:bg-pink-50/50 font-medium transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Exit to Clinic Website</span>
                </button>
              </div>

            </div>

            {/* 2. Emergency & Midwife On-Call Card */}
            <div className="bg-gradient-to-br from-rose-500 to-brand-600 text-white rounded-3xl p-5 shadow-soft space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />

              <div className="relative z-10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
                      <Phone className="w-3.5 h-3.5 text-white" />
                    </div>
                    <h4 className="font-bold text-xs">24/7 Midwife On-Call</h4>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>

                <p className="text-[11px] text-pink-100 leading-snug">
                  Immediate guidance for urgent labour questions, bleeding, or emergencies.
                </p>

                <div className="space-y-1.5 pt-1">
                  <a 
                    href="tel:+233245514567"
                    className="block text-center bg-white text-brand-700 hover:bg-pink-50 font-bold text-xs py-2 rounded-xl shadow-xs transition"
                  >
                    📞 Call +233 24 551 4567
                  </a>

                  <a 
                    href="https://wa.me/233245514567?text=Hello%20Midwife%20Rosetta%2C%20I%20am%20messaging%20from%20my%20Patient%20Portal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-xl shadow-xs transition"
                  >
                    💬 WhatsApp Consultation
                  </a>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-pink-200 justify-center pt-0.5">
                  <MapPin className="w-3 h-3 text-pink-300" />
                  <span>MatraCare Clinic • East Legon</span>
                </div>
              </div>
            </div>

            {/* Privacy & Health Data Shield Note */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 text-center px-2">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Confidential Midwifery Records</span>
            </div>

          </aside>

          {/* ========================================================= */}
          {/* MAIN CONTENT AREA                                         */}
          {/* ========================================================= */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* ========================================================= */}
            {/* TAB: OVERVIEW (REDESIGNED)                                */}
            {/* ========================================================= */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* 1. HERO BANNER WITH MATERNAL JOURNEY PROGRESS */}
                <div className="relative overflow-hidden bg-gradient-to-br from-white via-pink-50/60 to-rose-50/80 p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-soft">
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-pink-200/40 to-rose-300/30 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10 space-y-4">
                    
                    {/* Top Row: Pill Tag & Quick Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-2 bg-pink-100 text-brand-700 px-3.5 py-1 rounded-full text-xs font-bold shadow-2xs">
                        <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                        <span>Ghana Maternal Health & Midwifery Portal</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 bg-white/80 px-3 py-1 rounded-full border border-pink-100 font-medium">
                          Primary Midwife: <b>Rosetta N. Boakye</b>
                        </span>
                      </div>
                    </div>

                    {/* Greeting & Title */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif-title tracking-tight">
                          {greeting}, {userName} <span className="inline-block animate-pulse">🌸</span>
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                          Every step of your maternal journey is supported with compassionate, evidence-based Ghanaian midwifery care.
                        </p>
                      </div>

                      <button
                        onClick={() => onNavigate('booking')}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 via-rose-600 to-pink-500 hover:from-brand-700 hover:to-pink-600 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-md shadow-pink-300 transition-all transform hover:-translate-y-0.5 shrink-0 self-start sm:self-auto"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Book Consultation</span>
                      </button>
                    </div>

                    {/* Maternal Milestone Bar */}
                    <div className="pt-3 border-t border-pink-100/80">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5">
                          <Baby className="w-4 h-4 text-brand-600" />
                          <span>Maternal Care Roadmap</span>
                        </span>
                        <span className="text-brand-600 font-bold bg-pink-100/70 px-2.5 py-0.5 rounded-full text-[11px]">
                          {upcomingApt?.pregnancyStage || 'Active Care Plan'}
                        </span>
                      </div>

                      {/* 3 Trimester Progress Pills */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-2.5 text-center">
                          <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">1st Trimester</div>
                          <div className="text-[11px] font-semibold text-emerald-700 mt-0.5 flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Complete
                          </div>
                        </div>

                        <div className="bg-brand-50 border-2 border-brand-500 rounded-xl p-2.5 text-center shadow-xs">
                          <div className="text-[10px] font-bold text-brand-800 uppercase tracking-wider">2nd Trimester</div>
                          <div className="text-[11px] font-extrabold text-brand-600 mt-0.5 flex items-center justify-center gap-1">
                            <Sparkles className="w-3 h-3 text-brand-600 animate-spin" /> Active Stage
                          </div>
                        </div>

                        <div className="bg-white/80 border border-slate-200 rounded-xl p-2.5 text-center">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">3rd Trimester</div>
                          <div className="text-[11px] font-semibold text-slate-400 mt-0.5">
                            Birth Prep
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* 2. NEXT APPOINTMENT SPOTLIGHT HERO */}
                <div className="bg-white rounded-3xl border border-pink-100 shadow-soft overflow-hidden">
                  <div className="bg-gradient-to-r from-brand-600 via-rose-600 to-pink-600 text-white p-6 sm:p-7 relative">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                      
                      <div className="flex items-start gap-4">
                        {/* Tear-Off Calendar Date Badge */}
                        <div className="w-16 h-18 sm:w-20 sm:h-20 bg-white rounded-2xl shadow-md text-center overflow-hidden shrink-0 flex flex-col border border-white/20">
                          <div className="bg-brand-700 text-white text-[11px] font-extrabold py-1 uppercase tracking-wider">
                            {calendarDate.month}
                          </div>
                          <div className="flex-1 flex items-center justify-center text-slate-900 font-extrabold text-2xl sm:text-3xl leading-none">
                            {calendarDate.day}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider">
                              {upcomingApt ? (upcomingApt.appointmentCode || upcomingApt.id) : 'NO BOOKING'}
                            </span>
                            {countdownLabel && (
                              <span className="bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                                {countdownLabel}
                              </span>
                            )}
                            {upcomingApt && (
                              <span className="bg-emerald-400/90 text-slate-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                                {upcomingApt.status}
                              </span>
                            )}
                          </div>

                          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            {upcomingApt ? upcomingApt.serviceName : 'No Upcoming Consultations'}
                          </h2>

                          {upcomingApt ? (
                            <div className="flex flex-wrap items-center gap-3 text-xs text-pink-100">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-pink-200" />
                                {upcomingApt.time}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-pink-200" />
                                {upcomingApt.location || 'MatraCare Clinic, East Legon'}
                              </span>
                            </div>
                          ) : (
                            <p className="text-xs text-pink-100">
                              Schedule your next routine visit, antenatal ultrasound review, or postpartum wellness check.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="shrink-0 flex items-center gap-2">
                        {upcomingApt ? (
                          <button
                            onClick={() => onViewAppointmentDetails(upcomingApt)}
                            className="w-full sm:w-auto bg-white hover:bg-pink-50 text-brand-700 text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-sm transition flex items-center justify-center gap-2"
                          >
                            <span>View Full Slip</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onNavigate('booking')}
                            className="w-full sm:w-auto bg-white hover:bg-pink-50 text-brand-700 text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-sm transition flex items-center justify-center gap-2"
                          >
                            <span>Book Visit Now</span>
                            <PlusCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Consultation Preparation Notice */}
                  {upcomingApt && (
                    <div className="bg-pink-50/50 p-4 sm:px-7 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 border-t border-pink-100">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-brand-600 shrink-0" />
                        <span><b>Clinic Preparation:</b> Please arrive 10 minutes before your slot. Bring your maternal health pink book.</span>
                      </div>
                      <span className="font-bold text-brand-600 bg-white px-2.5 py-1 rounded-lg border border-pink-100 text-[11px] self-start sm:self-auto shrink-0">
                        Paid: GHC {upcomingApt.total || upcomingApt.fee}
                      </span>
                    </div>
                  )}
                </div>

                {/* 3. FOUR QUICK ACTION TILES */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div 
                    onClick={() => onNavigate('booking')}
                    className="bg-white rounded-2xl p-4 border border-pink-100/90 hover:border-pink-300 shadow-soft hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CalendarPlus className="w-5 h-5" />
                    </div>
                    <div className="mt-3">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition">Book Consultation</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">East Legon clinic visit</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => onNavigate('contact')}
                    className="bg-white rounded-2xl p-4 border border-pink-100/90 hover:border-pink-300 shadow-soft hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="mt-3">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition">Ask Midwife</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Send private message</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTab('billing')}
                    className="bg-white rounded-2xl p-4 border border-pink-100/90 hover:border-pink-300 shadow-soft hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div className="mt-3">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition">Invoices & Receipts</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Print paid slips</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => onNavigate('blog-public')}
                    className="bg-white rounded-2xl p-4 border border-pink-100/90 hover:border-pink-300 shadow-soft hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div className="mt-3">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">Maternal Guides</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Advice by Rosetta</p>
                    </div>
                  </div>
                </div>

                {/* 5. RECENT CONSULTATIONS LIST */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-soft">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Recent Consultations</h3>
                      <p className="text-xs text-slate-500">Your latest clinic bookings and status</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('appointments')}
                      className="text-xs text-brand-600 font-bold hover:underline"
                    >
                      View All ({totalAppointments}) →
                    </button>
                  </div>

                  {appointments.length === 0 ? (
                    <div className="text-center py-10 px-4 border border-dashed border-pink-200 rounded-3xl bg-pink-50/20">
                      <Calendar className="w-10 h-10 text-pink-300 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-700">No consultations yet</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        You haven’t booked any consultations yet. Click below to schedule your visit with Midwife Rosetta.
                      </p>
                      <button
                        onClick={() => onNavigate('booking')}
                        className="mt-4 inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-sm transition"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Book Your First Consultation</span>
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {appointments.slice(0, 4).map((apt) => (
                        <div
                          key={apt.id}
                          className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-pink-50/30 px-3 rounded-2xl transition"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono font-bold text-brand-600 bg-pink-50 px-2.5 py-0.5 rounded-md border border-pink-100">
                                {apt.appointmentCode || apt.id}
                              </span>
                              <h4 className="text-sm font-bold text-slate-900">{apt.serviceName}</h4>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                apt.status === 'Confirmed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : apt.status === 'Pending'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : apt.status === 'Completed'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {apt.status}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                {apt.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {apt.time}
                              </span>
                              <span className="font-semibold text-brand-600">
                                GHC {apt.total || apt.fee}
                              </span>
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onViewAppointmentDetails(apt)}
                              className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-pink-50 hover:bg-pink-100 px-3.5 py-1.5 rounded-xl transition"
                            >
                              View Details →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ========================================================= */}
            {/* TAB: MY APPOINTMENTS FULL VIEW                            */}
            {/* ========================================================= */}
            {activeTab === 'appointments' && (
              <div className="space-y-5">
                
                {/* Header & Search / Filter Controls */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-soft space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab('overview')}
                        className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-pink-50 hover:bg-pink-100 text-brand-600 border border-pink-200 text-xs font-bold flex items-center gap-1.5 transition group cursor-pointer shadow-2xs"
                        title="Back to Overview"
                      >
                        <ArrowLeft className="w-4 h-4 text-brand-600 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Back</span>
                      </button>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 font-serif-title">
                          All Consultations ({appointments.length})
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Track, filter, and inspect your full booking history
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('booking')}
                      className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-sm transition cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Book New Appointment</span>
                    </button>
                  </div>

                  {/* Filter Tabs & Search Bar */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text"
                        placeholder="Search by ID (e.g. APT-1001) or service..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 transition"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                      {(['ALL', 'Confirmed', 'Pending', 'Completed', 'Cancelled'] as StatusFilter[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => setStatusFilter(st)}
                          className={`text-xs px-3 py-2 rounded-xl font-semibold transition whitespace-nowrap ${
                            statusFilter === st
                              ? 'bg-brand-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-pink-50 hover:text-brand-600'
                          }`}
                        >
                          {st === 'ALL' ? 'All' : st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Filtered Appointments List */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-soft">
                  {filteredAppointments.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                      <h4 className="text-sm font-bold text-slate-700">No matching appointments found</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Try clearing your search or switching the status filter tab.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          className="bg-pink-50/20 hover:bg-pink-50/50 p-5 rounded-2xl border border-pink-100 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-mono font-bold text-brand-600 bg-white px-2.5 py-0.5 rounded-md border border-pink-200 shadow-2xs">
                                {apt.appointmentCode || apt.id}
                              </span>
                              <h4 className="text-base font-bold text-slate-900">{apt.serviceName}</h4>
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                apt.status === 'Confirmed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : apt.status === 'Pending'
                                  ? 'bg-amber-100 text-amber-800'
                                  : apt.status === 'Completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {apt.status}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                              <span className="flex items-center gap-1.5 font-medium">
                                <Calendar className="w-4 h-4 text-brand-500" />
                                {apt.date}
                              </span>
                              <span className="flex items-center gap-1.5 font-medium">
                                <Clock className="w-4 h-4 text-brand-500" />
                                {apt.time}
                              </span>
                              <span className="flex items-center gap-1.5 text-slate-500">
                                <MapPin className="w-4 h-4 text-brand-500" />
                                {apt.location || 'MatraCare Clinic, East Legon'}
                              </span>
                              <span className="font-bold text-brand-600 bg-pink-100/60 px-2 py-0.5 rounded">
                                GHC {apt.total || apt.fee}
                              </span>
                            </div>

                            {apt.notes && (
                              <p className="text-xs text-slate-500 italic bg-white/60 p-2 rounded-lg border border-pink-100/50">
                                Note: {apt.notes}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => setSelectedReceipt(apt)}
                              className="text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl transition"
                            >
                              Receipt
                            </button>
                            <button
                              onClick={() => onViewAppointmentDetails(apt)}
                              className="text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-xl transition shadow-xs"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ========================================================= */}
            {/* TAB: BILLING & RECEIPTS                                   */}
            {/* ========================================================= */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                
                {/* Billing Summary Banner */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-soft">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab('overview')}
                        className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-pink-50 hover:bg-pink-100 text-brand-600 border border-pink-200 text-xs font-bold flex items-center gap-1.5 transition group cursor-pointer shadow-2xs"
                        title="Back to Overview"
                      >
                        <ArrowLeft className="w-4 h-4 text-brand-600 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Back</span>
                      </button>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 font-serif-title">
                          Billing & Payment History
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          All payments are processed securely in Ghanaian Cedis (GHC)
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Total Settled
                      </span>
                      <span className="text-2xl sm:text-3xl font-extrabold text-brand-600">
                        GHC {totalSpent.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Payment Methods Notice */}
                  <div className="pt-4 flex items-center gap-3 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Accepted channels: MTN Mobile Money, Telecel Cash, AT Money, and Visa/Mastercard.</span>
                  </div>
                </div>

                {/* Itemized Transactions Table */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-soft">
                  <h3 className="font-bold text-base text-slate-900 mb-4">Itemized Consultation Receipts</h3>

                  {appointments.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs">
                      No invoices recorded yet.
                    </div>
                  ) : (
                    <>
                      {/* Mobile Card View (< sm) */}
                      <div className="block sm:hidden space-y-3">
                        {appointments.map((apt) => (
                          <div key={apt.id} className="p-4 rounded-2xl bg-pink-50/30 border border-pink-100 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-xs text-brand-600 bg-white px-2 py-0.5 rounded border border-pink-100">
                                {apt.appointmentCode || apt.id}
                              </span>
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {apt.paymentStatus || 'paid'}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">{apt.serviceName}</h4>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {apt.date} • <span className="uppercase font-semibold">{apt.paymentMethod || 'momo'}</span>
                              </p>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-pink-100/60">
                              <span className="text-xs font-bold text-slate-900">
                                GHC {apt.total || apt.fee}
                              </span>
                              <button
                                type="button"
                                onClick={() => setSelectedReceipt(apt)}
                                className="text-xs font-bold text-brand-600 bg-white hover:bg-pink-50 px-3 py-1.5 rounded-xl border border-pink-200 transition cursor-pointer"
                              >
                                View Receipt →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop / Tablet Table View (>= sm) */}
                      <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full text-left text-xs min-w-[550px]">
                          <thead className="bg-pink-50/50 text-slate-600 font-bold uppercase tracking-wider border-y border-pink-100">
                            <tr>
                              <th className="py-3 px-4">Receipt Ref</th>
                              <th className="py-3 px-4">Service</th>
                              <th className="py-3 px-4">Date</th>
                              <th className="py-3 px-4">Payment Method</th>
                              <th className="py-3 px-4">Amount</th>
                              <th className="py-3 px-4">Status</th>
                              <th className="py-3 px-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {appointments.map((apt) => (
                              <tr key={apt.id} className="hover:bg-pink-50/20 transition">
                                <td className="py-3.5 px-4 font-mono font-bold text-brand-600">
                                  {apt.appointmentCode || apt.id}
                                </td>
                                <td className="py-3.5 px-4 font-semibold text-slate-900">
                                  {apt.serviceName}
                                </td>
                                <td className="py-3.5 px-4 text-slate-600">
                                  {apt.date}
                                </td>
                                <td className="py-3.5 px-4 text-slate-600 uppercase font-semibold">
                                  {apt.paymentMethod || 'momo'}
                                </td>
                                <td className="py-3.5 px-4 font-bold text-slate-900">
                                  GHC {apt.total || apt.fee}
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {apt.paymentStatus || 'paid'}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <button
                                    onClick={() => setSelectedReceipt(apt)}
                                    className="text-xs font-bold text-brand-600 hover:underline"
                                  >
                                    View Receipt
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>

              </div>
            )}

            {/* ========================================================= */}
            {/* TAB: CARE TEAM & CONTACT MIDWIFE                          */}
            {/* ========================================================= */}
            {activeTab === 'care-team' && (
              <div className="space-y-6">
                
                {/* Midwife Rosetta Bio Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-soft space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveTab('overview')}
                      className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-pink-50 hover:bg-pink-100 text-brand-600 border border-pink-200 text-xs font-bold flex items-center gap-1.5 transition group cursor-pointer shadow-2xs"
                      title="Back to Overview"
                    >
                      <ArrowLeft className="w-4 h-4 text-brand-600 group-hover:-translate-x-1 transition-transform" />
                      <span className="hidden sm:inline">Back</span>
                    </button>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 font-serif-title">
                        Your Care Team
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Direct connection to your certified midwifery team
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <Image 
                      src="/images/rosetta.jpg"
                      alt="Midwife Rosetta N. Boakye"
                      width={112}
                      height={112}
                      className="w-28 h-28 rounded-3xl object-cover border-4 border-pink-100 shadow-md shrink-0"
                    />
                    
                    <div className="space-y-2 text-center sm:text-left flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h2 className="text-xl font-bold text-slate-900">Midwife Rosetta N. Boakye</h2>
                          <p className="text-xs text-brand-600 font-semibold">Senior Midwife & Founder, Tell it to Rosett</p>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full self-center sm:self-auto">
                          Accepting Consultations
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        With over a decade of clinical midwifery experience across Ghana, Midwife Rosetta specializes in antenatal monitoring, safe labour planning, breastfeeding coaching, and reproductive health wellness.
                      </p>

                      <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                        <a 
                          href="tel:+233245514567"
                          className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-sm transition"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call: +233 24 551 4567</span>
                        </a>

                        <button 
                          onClick={() => onNavigate('contact')}
                          className="inline-flex items-center gap-1.5 bg-pink-50 hover:bg-pink-100 text-brand-700 text-xs font-bold px-4 py-2.5 rounded-full transition"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Send Clinic Message</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clinic Location & Hours */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-soft space-y-3">
                    <div className="flex items-center gap-2 text-brand-600 font-bold text-sm">
                      <MapPin className="w-4 h-4" />
                      <h4>Clinic Address</h4>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                      MatraCare Clinic
                    </p>
                    <p className="text-xs text-slate-500">
                      East Legon, Accra, Ghana
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Located close to American House. Secure parking and wheelchair accessible entrance available.
                    </p>
                  </div>

                  <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-soft space-y-3">
                    <div className="flex items-center gap-2 text-brand-600 font-bold text-sm">
                      <Clock className="w-4 h-4" />
                      <h4>Consultation Hours</h4>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Monday – Friday:</span>
                        <span className="font-semibold text-slate-900">8:00 AM – 5:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday:</span>
                        <span className="font-semibold text-slate-900">9:00 AM – 2:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Emergency Midwife:</span>
                        <span className="font-semibold text-brand-600">24/7 on call</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* RECEIPT PREVIEW MODAL                                     */}
      {/* ========================================================= */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-pink-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-12 h-12 bg-pink-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Official Clinic Receipt</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Ref: {selectedReceipt.appointmentCode || selectedReceipt.id}
              </p>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-bold text-slate-900">{selectedReceipt.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold text-slate-900">{selectedReceipt.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="text-slate-700">{selectedReceipt.date} • {selectedReceipt.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Channel:</span>
                <span className="font-semibold uppercase text-slate-900">{selectedReceipt.paymentMethod}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-bold">
                <span className="text-slate-900">Total Paid:</span>
                <span className="text-brand-600">GHC {selectedReceipt.total || selectedReceipt.fee}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
