'use client';

import React from 'react';
import { Session } from 'next-auth';
import { ActiveView } from '@/types';
import { 
  Heart,
  Activity, 
  Calendar, 
  Users, 
  UserCheck, 
  FileText, 
  Clock, 
  DollarSign, 
  LogOut, 
  X,
  ChevronDown, 
  ChevronUp,
  Globe,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export type StaffTab = 'overview' | 'appointments' | 'patients' | 'payments' | 'media';

interface StaffSidebarProps {
  currentView: ActiveView;
  currentTab?: StaffTab;
  onNavigate: (view: ActiveView, extraParam?: string) => void;
  onTabChange?: (tab: StaffTab) => void;
  appointmentsCount?: number;
  patientsCount?: number;
  totalRevenue?: number;
  isMobileOpen: boolean;
  onToggleMobile: () => void;
  onCloseMobile: () => void;
  onLogout?: () => void;
  session?: Session | null;
}

export const StaffSidebar: React.FC<StaffSidebarProps> = ({
  currentView,
  currentTab = 'overview',
  onNavigate,
  onTabChange,
  appointmentsCount,
  patientsCount,
  totalRevenue,
  isMobileOpen,
  onToggleMobile,
  onCloseMobile,
  onLogout,
  session,
}) => {
  const handleItemClick = (targetView: ActiveView, targetTab?: StaffTab) => {
    onCloseMobile();
    if (targetView === currentView) {
      if (targetTab && onTabChange) {
        onTabChange(targetTab);
      }
    } else {
      onNavigate(targetView, targetTab);
    }
  };

  const displayName = session?.user?.name || 'Rosetta N. Boakye';
  const displayRole = session?.user?.role === 'staff' ? 'Lead Midwife & Admin' : 'Clinic Staff';

  return (
    <>
      {/* Mobile Staff Top Bar (< lg) */}
      <div className="block lg:hidden mb-4 sticky top-0 z-30 bg-[#FCF8FA]/90 backdrop-blur-md pb-2">
        <div className="bg-white rounded-2xl p-3 border border-pink-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-400 flex items-center justify-center text-white shadow-xs">
              <Heart className="w-4 h-4 fill-white stroke-none" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-pink-600 block leading-tight">Tell it to Rosett</span>
              <span className="text-[10px] text-teal-700 font-bold block leading-tight">Staff Portal</span>
            </div>
          </div>
          
          <button
            type="button"
            onClick={onToggleMobile}
            className="flex items-center gap-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-pink-200 transition cursor-pointer"
            aria-expanded={isMobileOpen}
          >
            <span>{isMobileOpen ? 'Close Menu' : 'Staff Menu'}</span>
            {isMobileOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Staff Left Sidebar (Collapsible on Mobile, Fixed column on Desktop) */}
      <div className={`lg:col-span-3 ${isMobileOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm space-y-5 sticky top-6">
          
          {/* Mobile Close Button (< lg) */}
          <div className="lg:hidden flex items-center justify-between pb-3 border-b border-pink-100">
            <span className="text-xs font-bold text-slate-700">Staff Portal Navigation</span>
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-xs flex items-center gap-1 font-semibold cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          </div>

          {/* Pure Full-Screen Brand Header */}
          <div className="pb-4 border-b border-pink-100/80">
            <div 
              onClick={() => handleItemClick('staff-dashboard', 'overview')}
              className="flex items-center gap-3 cursor-pointer group select-none"
              title="Staff Dashboard"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-400 flex items-center justify-center text-white shadow-md shadow-pink-200 group-hover:scale-105 transition transform">
                <Heart className="w-5 h-5 fill-white stroke-none" />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-extrabold text-base tracking-tight text-pink-600">Tell it to</span>
                  <span className="font-extrabold text-base tracking-tight text-slate-800">Rosett</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                    <ShieldCheck className="w-3 h-3 text-teal-600" />
                    Staff Portal
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lead Midwife Profile Card */}
          <div className="flex items-center gap-3 p-3 bg-pink-50/50 rounded-2xl border border-pink-100/60">
            <img
              src="/images/rosetta.jpg"
              alt="Staff Lead"
              className="w-11 h-11 rounded-xl object-cover border border-pink-200 shadow-xs"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-slate-900 text-xs truncate">{displayName}</h3>
              <p className="text-[10px] text-pink-600 font-semibold truncate">{displayRole}</p>
            </div>
          </div>

          {/* Section Header */}
          <div className="px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Clinical Operations
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-semibold text-slate-600">
            
            {/* 1. Dashboard Overview */}
            {(() => {
              const isActive = currentView === 'staff-dashboard' && currentTab === 'overview';
              return (
                <button 
                  onClick={() => handleItemClick('staff-dashboard', 'overview')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                    isActive 
                      ? 'bg-pink-600 text-white font-bold shadow-md shadow-pink-200' 
                      : 'hover:bg-pink-50/70 hover:text-pink-600 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Activity className={`w-4 h-4 ${isActive ? 'text-white' : 'text-pink-600'}`} />
                    <span>Dashboard Overview</span>
                  </div>
                </button>
              );
            })()}

            {/* 2. Appointments */}
            {(() => {
              const isActive = currentView === 'staff-dashboard' && currentTab === 'appointments';
              return (
                <button 
                  onClick={() => handleItemClick('staff-dashboard', 'appointments')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                    isActive 
                      ? 'bg-pink-600 text-white font-bold shadow-md shadow-pink-200' 
                      : 'hover:bg-pink-50/70 hover:text-pink-600 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className={`w-4 h-4 ${isActive ? 'text-white' : 'text-pink-600'}`} />
                    <span>Appointments</span>
                  </div>
                  {appointmentsCount !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-pink-100 text-pink-700'
                    }`}>
                      {appointmentsCount}
                    </span>
                  )}
                </button>
              );
            })()}

            {/* 3. Patients List */}
            {(() => {
              const isActive = currentView === 'staff-dashboard' && currentTab === 'patients';
              return (
                <button 
                  onClick={() => handleItemClick('staff-dashboard', 'patients')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                    isActive 
                      ? 'bg-pink-600 text-white font-bold shadow-md shadow-pink-200' 
                      : 'hover:bg-pink-50/70 hover:text-pink-600 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className={`w-4 h-4 ${isActive ? 'text-white' : 'text-pink-600'}`} />
                    <span>Patients List</span>
                  </div>
                  {patientsCount !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-pink-100 text-pink-700'
                    }`}>
                      {patientsCount}
                    </span>
                  )}
                </button>
              );
            })()}

            {/* 4. Staff Management */}
            {(() => {
              const isActive = currentView === 'staff-management';
              return (
                <button 
                  onClick={() => handleItemClick('staff-management')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                    isActive 
                      ? 'bg-pink-600 text-white font-bold shadow-md shadow-pink-200' 
                      : 'hover:bg-pink-50/70 hover:text-pink-600 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserCheck className={`w-4 h-4 ${isActive ? 'text-white' : 'text-teal-600'}`} />
                    <span>Staff Management</span>
                  </div>
                </button>
              );
            })()}

            {/* 5. Content / Blog CMS */}
            {(() => {
              const isActive = currentView === 'blog-admin';
              return (
                <button 
                  onClick={() => handleItemClick('blog-admin')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                    isActive 
                      ? 'bg-pink-600 text-white font-bold shadow-md shadow-pink-200' 
                      : 'hover:bg-pink-50/70 hover:text-pink-600 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className={`w-4 h-4 ${isActive ? 'text-white' : 'text-rose-500'}`} />
                    <span>Content / Blog CMS</span>
                  </div>
                </button>
              );
            })()}

            {/* 6. Media Requests */}
            {(() => {
              const isActive = currentView === 'staff-dashboard' && currentTab === 'media';
              return (
                <button 
                  onClick={() => handleItemClick('staff-dashboard', 'media')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                    isActive 
                      ? 'bg-pink-600 text-white font-bold shadow-md shadow-pink-200' 
                      : 'hover:bg-pink-50/70 hover:text-pink-600 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Clock className={`w-4 h-4 ${isActive ? 'text-white' : 'text-pink-600'}`} />
                    <span>Media Requests</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-pink-100 text-pink-700'
                  }`}>
                    4
                  </span>
                </button>
              );
            })()}

            {/* 7. Payments & Accounts */}
            {(() => {
              const isActive = currentView === 'staff-dashboard' && currentTab === 'payments';
              return (
                <button 
                  onClick={() => handleItemClick('staff-dashboard', 'payments')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                    isActive 
                      ? 'bg-pink-600 text-white font-bold shadow-md shadow-pink-200' 
                      : 'hover:bg-pink-50/70 hover:text-pink-600 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <DollarSign className={`w-4 h-4 ${isActive ? 'text-white' : 'text-pink-600'}`} />
                    <span>Payments & Accounts</span>
                  </div>
                  {totalRevenue !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      GHC {totalRevenue}
                    </span>
                  )}
                </button>
              );
            })()}
          </nav>

          {/* Workspace Footer Actions: View Website & Sign Out */}
          <div className="pt-4 border-t border-slate-100 space-y-1.5">
            <button
              onClick={() => handleItemClick('home')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-pink-600 hover:bg-pink-50 transition cursor-pointer group"
              title="Return to the public marketing site"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-slate-400 group-hover:text-pink-600" />
                <span>View Public Website</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-600" />
            </button>

            <button
              onClick={() => {
                onCloseMobile();
                onLogout?.();
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
