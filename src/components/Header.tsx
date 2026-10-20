'use client';

import React, { useState } from 'react';
import { Session } from 'next-auth';
import { ActiveView } from '@/types';
import { 
  Heart, 
  Calendar, 
  Menu, 
  X, 
  User, 
  ShieldCheck, 
  Sparkles, 
  ChevronDown, 
  LogOut, 
  LogIn,
  Globe,
  LayoutDashboard,
  Layers
} from 'lucide-react';

interface HeaderProps {
  currentView: ActiveView;
  onNavigate: (view: ActiveView, serviceId?: string) => void;
  session?: Session | null;
  onLogout?: () => void;
}

const PORTAL_VIEWS: ActiveView[] = [
  'staff-dashboard',
  'staff-management',
  'blog-admin',
  'patient-dashboard',
];

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  session,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isAuthenticated = !!session;
  const userRole = session?.user?.role;
  const userName = session?.user?.name || '';
  const isStaff = userRole === 'staff';
  const isPortalView = PORTAL_VIEWS.includes(currentView);

  const navLinks: { label: string; view: ActiveView }[] = [
    { label: 'Home', view: 'home' },
    { label: 'About', view: 'about' },
    { label: 'Services', view: 'services' },
    { label: 'Media', view: 'media' },
    { label: 'Blog', view: 'blog-public' },
    { label: 'Contact', view: 'contact' },
  ];

  const handleNavClick = (view: ActiveView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setPortalDropdownOpen(false);
    setUserDropdownOpen(false);
  };

  // -------------------------------------------------------------
  // 1. MINIMAL PORTAL APP HEADER (Staff & Patient Dashboards)
  // -------------------------------------------------------------
  if (isPortalView) {
    return (
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-pink-100/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand & Portal Badge & Exit Button */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div 
                onClick={() => handleNavClick(isStaff ? 'staff-dashboard' : 'patient-dashboard')}
                className="flex items-center gap-2.5 cursor-pointer group select-none"
                title="Go to Dashboard Home"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-400 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition transform">
                  <Heart className="w-5 h-5 fill-white stroke-none" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-extrabold text-lg tracking-tight text-pink-600">Tell it to</span>
                  <span className="font-extrabold text-lg tracking-tight text-slate-800">Rosett</span>
                </div>
              </div>

              {/* Portal Badge */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                isStaff 
                  ? 'bg-teal-50 text-teal-800 border-teal-200' 
                  : 'bg-pink-50 text-pink-700 border-pink-200'
              }`}>
                {isStaff ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                    <span>Staff Portal</span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-pink-600" />
                    <span>Patient Portal</span>
                  </>
                )}
              </span>

              {/* View Website Button (Clean exit link) */}
              <button
                onClick={() => handleNavClick('home')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-pink-600 hover:bg-pink-50 border border-slate-200 hover:border-pink-200 transition"
                title="Return to public marketing website"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-500" />
                <span>View Website</span>
              </button>
            </div>

            {/* Right: Status Indicator, Switch Portal, and User Profile */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Live Status Indicator (Desktop) */}
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {isStaff ? 'Clinical Console Active' : 'Care Team Active'}
              </span>

              {/* Switch Portal Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-pink-600 hover:bg-pink-50 border border-slate-200 hover:border-pink-200 transition"
                >
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>Switch Portal</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {portalDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-pink-100 py-2 z-50 text-slate-700 animate-in fade-in slide-in-from-top-2"
                    onClick={() => setPortalDropdownOpen(false)}
                  >
                    <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Portal Navigation
                    </div>

                    {isStaff ? (
                      <>
                        <button
                          onClick={() => handleNavClick('staff-dashboard')}
                          className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-pink-50 ${currentView === 'staff-dashboard' ? 'text-pink-600 font-bold bg-pink-50/50' : ''}`}
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-pink-600" /> Staff Dashboard
                        </button>
                        <button
                          onClick={() => handleNavClick('staff-management')}
                          className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-pink-50 ${currentView === 'staff-management' ? 'text-teal-600 font-bold bg-pink-50/50' : ''}`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Staff Management
                        </button>
                        <button
                          onClick={() => handleNavClick('blog-admin')}
                          className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-pink-50 ${currentView === 'blog-admin' ? 'text-rose-600 font-bold bg-pink-50/50' : ''}`}
                        >
                          <Layers className="w-3.5 h-3.5 text-rose-500" /> Content CMS
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleNavClick('patient-dashboard')}
                          className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-pink-50 ${currentView === 'patient-dashboard' ? 'text-pink-600 font-bold bg-pink-50/50' : ''}`}
                        >
                          <User className="w-3.5 h-3.5 text-pink-600" /> Patient Dashboard
                        </button>
                        <button
                          onClick={() => handleNavClick('booking')}
                          className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-pink-50 ${currentView === 'booking' ? 'text-pink-600 font-bold bg-pink-50/50' : ''}`}
                        >
                          <Calendar className="w-3.5 h-3.5 text-pink-600" /> Book Consultation
                        </button>
                      </>
                    )}

                    <div className="border-t border-slate-100 my-1.5"></div>
                    <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Website
                    </div>
                    <button
                      onClick={() => handleNavClick('home')}
                      className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-pink-50 text-slate-600"
                    >
                      <Globe className="w-3.5 h-3.5 text-slate-400" /> Public Website
                    </button>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-pink-200 hover:border-pink-300 hover:bg-pink-50/50 transition bg-white shadow-xs"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-bold text-slate-800 max-w-[90px] truncate">{userName}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-pink-100 py-2 z-50 text-slate-700 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-bold text-sm text-slate-900 truncate">{userName}</p>
                      <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
                      <span className={`inline-block mt-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isStaff ? 'bg-teal-100 text-teal-700' : 'bg-pink-100 text-pink-700'
                      }`}>
                        {isStaff ? 'Staff Admin' : 'Patient'}
                      </span>
                    </div>

                    <button
                      onClick={() => { handleNavClick(isStaff ? 'staff-dashboard' : 'patient-dashboard'); }}
                      className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-pink-50 flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-pink-600" /> My Workspace
                    </button>

                    <button
                      onClick={() => handleNavClick('home')}
                      className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-pink-50 flex items-center gap-2 text-slate-600"
                    >
                      <Globe className="w-4 h-4 text-slate-400" /> View Public Site
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => { setUserDropdownOpen(false); onLogout?.(); }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 sm:hidden rounded-lg text-slate-600 hover:text-pink-600 hover:bg-pink-50 focus:outline-none"
                aria-label="Toggle portal menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Portal Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white border-b border-pink-100 px-4 pt-3 pb-5 space-y-3 shadow-xl">
            <div className="flex items-center gap-3 px-3 py-2 bg-pink-50/50 rounded-xl">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {userName ? userName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{userName}</p>
                <span className={`text-[10px] font-bold uppercase ${isStaff ? 'text-teal-600' : 'text-pink-600'}`}>
                  {isStaff ? 'Staff Admin' : 'Patient'}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              {isStaff ? (
                <>
                  <button
                    onClick={() => handleNavClick('staff-dashboard')}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-pink-50 rounded-lg"
                  >
                    <LayoutDashboard className="w-4 h-4 text-pink-600" /> Staff Dashboard
                  </button>
                  <button
                    onClick={() => handleNavClick('staff-management')}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-pink-50 rounded-lg"
                  >
                    <ShieldCheck className="w-4 h-4 text-teal-600" /> Staff Management
                  </button>
                  <button
                    onClick={() => handleNavClick('blog-admin')}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-pink-50 rounded-lg"
                  >
                    <Layers className="w-4 h-4 text-rose-500" /> Content CMS
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavClick('patient-dashboard')}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-pink-50 rounded-lg"
                  >
                    <User className="w-4 h-4 text-pink-600" /> Patient Dashboard
                  </button>
                  <button
                    onClick={() => handleNavClick('booking')}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-pink-50 rounded-lg"
                  >
                    <Calendar className="w-4 h-4 text-pink-600" /> Book Consultation
                  </button>
                </>
              )}

              <button
                onClick={() => handleNavClick('home')}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                <Globe className="w-4 h-4 text-slate-400" /> View Public Website
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => { setMobileMenuOpen(false); onLogout?.(); }}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        )}
      </header>
    );
  }

  // -------------------------------------------------------------
  // 2. PUBLIC MARKETING HEADER (Home, About, Services, Blog, etc.)
  // -------------------------------------------------------------
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-pink-100/80 shadow-sm transition-all">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-500 to-pink-700 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-white/20 px-2 py-0.5 rounded-full font-medium text-[11px] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-pink-200" />
              {isAuthenticated ? (
                <span>{isStaff ? 'Staff' : 'Patient'} Portal</span>
              ) : (
                <span>Welcome</span>
              )}
            </span>
            <span className="hidden sm:inline text-pink-100">
              Trusted Midwife & Maternal Health Advocate • Accra, Ghana
            </span>
          </div>

          {/* Portal Quick Switch (only visible when authenticated) */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                className="flex items-center gap-1.5 bg-white text-pink-700 hover:bg-pink-50 font-semibold px-2.5 py-0.5 rounded-full shadow-sm text-xs transition"
              >
                <span>Switch View</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {portalDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-pink-100 py-2 z-50 text-slate-700 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setPortalDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Public Pages
                  </div>
                  {navLinks.map((link) => (
                    <button
                      key={link.view}
                      onClick={() => handleNavClick(link.view)}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-pink-50 ${currentView === link.view ? 'text-pink-600 font-semibold bg-pink-50/50' : ''}`}
                    >
                      <span className="w-2 h-2 rounded-full bg-pink-500"></span> {link.label}
                    </button>
                  ))}

                  <div className="border-t border-slate-100 my-1"></div>
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    My Portal
                  </div>

                  {/* Patient views — visible to patients */}
                  {!isStaff && (
                    <>
                      <button
                        onClick={() => handleNavClick('booking')}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-pink-50 ${currentView === 'booking' ? 'text-pink-600 font-semibold bg-pink-50/50' : ''}`}
                      >
                        <Calendar className="w-3.5 h-3.5 text-pink-500" /> Book Consultation
                      </button>
                      <button
                        onClick={() => handleNavClick('patient-dashboard')}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-pink-50 ${currentView === 'patient-dashboard' ? 'text-pink-600 font-semibold bg-pink-50/50' : ''}`}
                      >
                        <User className="w-3.5 h-3.5 text-pink-500" /> Patient Dashboard
                      </button>
                    </>
                  )}

                  {/* Staff views — only visible to staff */}
                  {isStaff && (
                    <>
                      <div className="border-t border-slate-100 my-1"></div>
                      <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Staff Admin
                      </div>
                      <button
                        onClick={() => handleNavClick('staff-dashboard')}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-pink-50 ${currentView === 'staff-dashboard' ? 'text-pink-600 font-semibold bg-pink-50/50' : ''}`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-pink-600" /> Staff Dashboard
                      </button>
                      <button
                        onClick={() => handleNavClick('staff-management')}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-pink-50 ${currentView === 'staff-management' ? 'text-teal-600 font-semibold bg-pink-50/50' : ''}`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Staff Management
                      </button>
                      <button
                        onClick={() => handleNavClick('blog-admin')}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-pink-50 ${currentView === 'blog-admin' ? 'text-pink-600 font-semibold bg-pink-50/50' : ''}`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-rose-500" /> Blog CMS
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-400 flex items-center justify-center text-white shadow-md shadow-pink-200 group-hover:scale-105 transition transform">
              <Heart className="w-6 h-6 fill-white stroke-none" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-extrabold text-xl tracking-tight text-pink-600">Tell it to</span>
                <span className="font-extrabold text-xl tracking-tight text-slate-800">Rosett</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 -mt-0.5 tracking-wide">
                Healthy Mothers, Brighter Futures
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.view)}
                  className={`text-sm font-medium transition-colors hover:text-pink-600 relative py-1 ${
                    isActive ? 'text-pink-600 font-semibold' : 'text-slate-600'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {!isStaff && (
                  <button
                    onClick={() => handleNavClick('booking')}
                    className="bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md shadow-pink-200 hover:shadow-lg hover:shadow-pink-300 transition duration-200 flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book</span>
                  </button>
                )}

                {/* User Avatar & Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-pink-200 hover:border-pink-400 hover:bg-pink-50 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {userName ? userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">{userName}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-pink-100 py-2 z-50 text-slate-700 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="font-semibold text-sm text-slate-800">{userName}</p>
                        <p className="text-xs text-slate-500">{session?.user?.email}</p>
                        <span className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isStaff ? 'bg-teal-100 text-teal-700' : 'bg-pink-100 text-pink-700'
                        }`}>
                          {isStaff ? 'Staff' : 'Patient'}
                        </span>
                      </div>

                      <button
                        onClick={() => { handleNavClick(isStaff ? 'staff-dashboard' : 'patient-dashboard'); }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-pink-50 flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-slate-400" /> My Dashboard
                      </button>

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={() => { setUserDropdownOpen(false); onLogout?.(); }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick('login')}
                  className="text-sm font-semibold text-slate-700 hover:text-pink-600 px-4 py-2.5 rounded-full transition flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('booking')}
                  className="bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md shadow-pink-200 hover:shadow-lg hover:shadow-pink-300 transition duration-200 flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            {!isStaff && (
              <button
                onClick={() => handleNavClick('booking')}
                className="bg-pink-600 text-white text-xs font-semibold px-3 py-2 rounded-full"
              >
                Book
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-pink-600 hover:bg-pink-50 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-pink-100 px-4 pt-2 pb-6 space-y-3 shadow-xl">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.view)}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  currentView === link.view
                    ? 'bg-pink-50 text-pink-600 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                {/* Logged in user info */}
                <div className="flex items-center gap-3 px-3 py-2 bg-pink-50/50 rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{userName}</p>
                    <span className={`text-[10px] font-bold uppercase ${isStaff ? 'text-teal-600' : 'text-pink-600'}`}>
                      {isStaff ? 'Staff' : 'Patient'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleNavClick(isStaff ? 'staff-dashboard' : 'patient-dashboard')}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-pink-50 rounded-lg"
                >
                  <User className="w-4 h-4 text-pink-500" /> My Dashboard
                </button>

                {isStaff && (
                  <button
                    onClick={() => handleNavClick('staff-management')}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-pink-50 rounded-lg"
                  >
                    <ShieldCheck className="w-4 h-4 text-teal-600" /> Staff Management
                  </button>
                )}

                <button
                  onClick={() => { setMobileMenuOpen(false); onLogout?.(); }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick('login')}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-pink-600 hover:bg-pink-50 rounded-lg"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-pink-50 rounded-lg"
                >
                  <User className="w-4 h-4 text-slate-500" /> Create Account
                </button>
              </>
            )}

            {!isStaff && (
              <button
                onClick={() => handleNavClick('booking')}
                className="w-full mt-2 bg-pink-600 text-white py-2.5 rounded-xl font-semibold text-sm text-center shadow-md"
              >
                Book Consultation Now
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
