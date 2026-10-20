'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession, signOut, getSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import { Loader2 } from 'lucide-react';
import { ActiveView, Appointment, StaffMember, Article, MediaItem } from '@/types';
import { INITIAL_MEDIA, INITIAL_APPOINTMENTS, INITIAL_STAFF, INITIAL_ARTICLES } from '@/lib/initialData';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// Views
import { HomepageView } from '@/components/views/HomepageView';
import { AboutView } from '@/components/views/AboutView';
import { ServicesView } from '@/components/views/ServicesView';
import { MediaView } from '@/components/views/MediaView';
import { BookingWizard } from '@/components/views/BookingWizard';
import { PatientDashboard } from '@/components/views/PatientDashboard';
import { StaffDashboard } from '@/components/views/StaffDashboard';
import { StaffManagement } from '@/components/views/StaffManagement';
import { BlogAdmin } from '@/components/views/BlogAdmin';
import { BlogPublic } from '@/components/views/BlogPublic';
import { ContactView } from '@/components/views/ContactView';
import { LoginView } from '@/components/views/LoginView';
import { RegisterView } from '@/components/views/RegisterView';

// Modals
import { VideoModal } from '@/components/Modals/VideoModal';
import { ArticleModal } from '@/components/Modals/ArticleModal';
import { AddStaffModal } from '@/components/Modals/AddStaffModal';
import { NewArticleModal } from '@/components/Modals/NewArticleModal';
import { AppointmentDetailsModal } from '@/components/Modals/AppointmentDetailsModal';

// Views that require authentication
const PROTECTED_VIEWS: ActiveView[] = [
  'booking',
  'patient-dashboard',
  'staff-dashboard',
  'staff-management',
  'blog-admin',
];

// Views that require staff role
const STAFF_ONLY_VIEWS: ActiveView[] = [
  'staff-dashboard',
  'staff-management',
  'blog-admin',
];

// Views that should hide the public marketing website footer (dashboards, wizards, auth)
const NO_FOOTER_VIEWS: ActiveView[] = [
  'patient-dashboard',
  'staff-dashboard',
  'staff-management',
  'blog-admin',
  'booking',
  'login',
  'register',
];

// Views that should hide the top header completely (Pure Full-Screen Workspace)
const NO_HEADER_VIEWS: ActiveView[] = [
  'staff-dashboard',
  'staff-management',
  'blog-admin',
  'patient-dashboard',
];

export default function Home() {
  const { data: sessionData, status } = useSession();
  const [activeSession, setActiveSession] = useState<Session | null>(null);

  // Sync activeSession whenever next-auth sessionData updates
  useEffect(() => {
    if (sessionData) {
      setActiveSession(sessionData);
    } else if (status === 'unauthenticated') {
      setActiveSession(null);
    }
  }, [sessionData, status]);

  const session = activeSession || sessionData;
  const [currentView, setCurrentView] = useState<ActiveView>('home');
  const [selectedServiceIdForBooking, setSelectedServiceIdForBooking] = useState<string>('antenatal');
  const [staffDashboardTab, setStaffDashboardTab] = useState<'overview' | 'appointments' | 'patients' | 'payments' | 'media'>('overview');

  // Application Data States
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState<boolean>(false);
  const [isNewArticleModalOpen, setIsNewArticleModalOpen] = useState<boolean>(false);

  // Fetch public catalog on mount
  useEffect(() => {
    async function loadCatalog() {
      try {
        const [staffRes, artRes] = await Promise.all([
          fetch('/api/staff').then(r => r.json()),
          fetch('/api/articles').then(r => r.json())
        ]);

        if (staffRes?.data) setStaffList(staffRes.data);
        if (artRes?.data) setArticles(artRes.data);
      } catch (err) {
        console.error('Failed to load catalog from MongoDB:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCatalog();
  }, []);

  // Fetch user-scoped appointments whenever authentication changes
  useEffect(() => {
    async function loadAppointments() {
      if (!session) {
        setAppointments([]);
        return;
      }
      try {
        const aptRes = await fetch('/api/appointments').then(r => r.json());
        if (aptRes?.data) {
          setAppointments(aptRes.data);
        } else {
          setAppointments([]);
        }
      } catch (err) {
        console.error('Failed to load appointments:', err);
        setAppointments([]);
      }
    }
    loadAppointments();
  }, [session]);

  // Restore persisted view on page refresh if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedView = sessionStorage.getItem('tellitto_current_view') as ActiveView | null;
      if (savedView && savedView !== 'login' && savedView !== 'register') {
        setCurrentView(savedView);
      }
    }
  }, []);

  // Protect routes if user becomes unauthenticated or patient tries to access staff views
  useEffect(() => {
    if (status === 'loading') return;
    if (PROTECTED_VIEWS.includes(currentView) && !session) {
      setCurrentView('login');
    } else if (STAFF_ONLY_VIEWS.includes(currentView) && session?.user?.role !== 'staff') {
      setCurrentView('patient-dashboard');
    }
  }, [currentView, session, status]);

  // Auth-aware navigation handler
  const handleNavigate = (view: ActiveView, extraParam?: string) => {
    if (view === 'booking' && extraParam) {
      setSelectedServiceIdForBooking(extraParam);
    }
    if (view === 'staff-dashboard' && extraParam) {
      setStaffDashboardTab(extraParam as any);
    }

    // If authenticated user navigates to login or register, route directly to their dashboard
    if ((view === 'login' || view === 'register') && session) {
      const targetDashboard: ActiveView = session.user?.role === 'staff' ? 'staff-dashboard' : 'patient-dashboard';
      setCurrentView(targetDashboard);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('tellitto_current_view', targetDashboard);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Check if the view requires authentication
    if (PROTECTED_VIEWS.includes(view) && !session) {
      setCurrentView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Check if the view requires staff role
    if (STAFF_ONLY_VIEWS.includes(view) && session?.user?.role !== 'staff') {
      // Patient trying to access staff views — redirect to patient dashboard
      setCurrentView('patient-dashboard');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('tellitto_current_view', 'patient-dashboard');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentView(view);
    if (typeof window !== 'undefined' && view !== 'login' && view !== 'register') {
      sessionStorage.setItem('tellitto_current_view', view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // After successful login, redirect directly to appropriate dashboard
  const handleLoginSuccess = useCallback(async (roleOverride?: string) => {
    let freshSession: Session | null = null;
    try {
      freshSession = await getSession({ broadcast: true });
      if (freshSession) {
        setActiveSession(freshSession);
      }
    } catch (e) {
      console.error('Failed to get fresh session:', e);
    }

    const role = roleOverride || freshSession?.user?.role || session?.user?.role;
    const targetDashboard: ActiveView = role === 'staff' ? 'staff-dashboard' : 'patient-dashboard';

    setCurrentView(targetDashboard);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('tellitto_current_view', targetDashboard);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [session]);

  // Handle logout
  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('tellitto_current_view');
    }
    setActiveSession(null);
    await signOut({ redirect: false });
    setCurrentView('home');
  };

  // Appointment Created
  const handleBookingSuccess = (newApt: Appointment) => {
    setAppointments(prev => [newApt, ...prev]);
  };

  // Update Appointment Status
  const handleUpdateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    try {
      await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
    } catch (e) {}
    if (selectedAppointment && selectedAppointment.id === id) {
      setSelectedAppointment(prev => prev ? { ...prev, status } : null);
    }
  };

  // Staff Management Handlers
  const handleAddStaff = async (newStaffData: Omit<StaffMember, 'id'>) => {
    const tempStaff: StaffMember = {
      ...newStaffData,
      id: `staff-${staffList.length + 1}`
    };
    setStaffList(prev => [...prev, tempStaff]);

    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaffData)
      });
      const result = await res.json();
      if (res.ok && result.data) {
        setStaffList(prev => prev.map(s => s.id === tempStaff.id ? result.data : s));
      } else {
        setStaffList(prev => prev.filter(s => s.id !== tempStaff.id));
      }
    } catch (e) {
      setStaffList(prev => prev.filter(s => s.id !== tempStaff.id));
    }
  };

  const handleUpdateStaffStatus = async (id: string, status: StaffMember['status']) => {
    setStaffList(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    try {
      await fetch('/api/staff', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
    } catch (e) {}
  };

  // Article CMS Handlers
  const handleSaveArticle = async (newArtData: Omit<Article, 'id'>) => {
    const tempArt: Article = {
      ...newArtData,
      id: `art-${articles.length + 1}`
    };
    setArticles(prev => [tempArt, ...prev]);

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArtData)
      });
      const result = await res.json();
      if (res.ok && result.data) {
        setArticles(prev => prev.map(a => a.id === tempArt.id ? result.data : a));
      } else {
        setArticles(prev => prev.filter(a => a.id !== tempArt.id));
      }
    } catch (e) {
      setArticles(prev => prev.filter(a => a.id !== tempArt.id));
    }
  };

  const handleDeleteArticle = async (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
    try {
      await fetch(`/api/articles?id=${id}`, { method: 'DELETE' });
    } catch (e) {}
  };

  // Derive user info from session
  const isAuthenticated = !!session;
  const userRole = session?.user?.role || null;
  const userName = session?.user?.name || '';
  const isStaffUser = userRole === 'staff';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Universal Header (hidden on pure full-screen staff workspaces) */}
      {!NO_HEADER_VIEWS.includes(currentView) && (
        <Header
          currentView={currentView}
          onNavigate={handleNavigate}
          session={session}
          onLogout={handleLogout}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HomepageView
              onNavigate={handleNavigate}
              onOpenVideo={() => setSelectedVideo(INITIAL_MEDIA[0])}
            />
            {/* Embedded sections for smooth scrolling on public landing */}
            <div id="about-section">
              <AboutView onNavigate={handleNavigate} />
            </div>
            <div id="services-section">
              <ServicesView onNavigate={handleNavigate} />
            </div>
            <div id="media-section">
              <MediaView onPlayVideo={(item) => setSelectedVideo(item)} />
            </div>
            <div id="blog-section">
              <BlogPublic
                articles={articles}
                onReadArticle={(art) => setSelectedArticle(art)}
                onNavigate={handleNavigate}
              />
            </div>
            <div id="contact-section">
              <ContactView />
            </div>
          </>
        )}

        {currentView === 'about' && <AboutView onNavigate={handleNavigate} />}
        {currentView === 'services' && <ServicesView onNavigate={handleNavigate} />}
        {currentView === 'media' && <MediaView onPlayVideo={(item) => setSelectedVideo(item)} />}
        
        {/* Auth Views */}
        {currentView === 'login' && (
          <LoginView onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
        )}
        {currentView === 'register' && (
          <RegisterView onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
        )}

        {/* Protected: Patient Views */}
        {currentView === 'booking' && isAuthenticated && (
          <BookingWizard
            session={session}
            initialServiceId={selectedServiceIdForBooking}
            onNavigate={handleNavigate}
            onBookingSuccess={handleBookingSuccess}
          />
        )}

        {currentView === 'patient-dashboard' && (
          isAuthenticated ? (
            <PatientDashboard
              session={session}
              appointments={appointments}
              onNavigate={handleNavigate}
              onViewAppointmentDetails={(apt) => setSelectedAppointment(apt)}
              onReadArticle={(art) => setSelectedArticle(art)}
              onLogout={handleLogout}
            />
          ) : (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
              <p className="text-sm font-medium text-slate-500">Opening Patient Dashboard...</p>
            </div>
          )
        )}

        {/* Protected: Staff-Only Views */}
        {currentView === 'staff-dashboard' && (
          isAuthenticated && isStaffUser ? (
            <StaffDashboard
              appointments={appointments}
              initialTab={staffDashboardTab}
              onNavigate={handleNavigate}
              onViewAppointmentDetails={(apt) => setSelectedAppointment(apt)}
              onUpdateStatus={handleUpdateAppointmentStatus}
              onLogout={handleLogout}
              session={session}
            />
          ) : (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
              <p className="text-sm font-medium text-slate-500">Opening Staff Dashboard...</p>
            </div>
          )
        )}

        {currentView === 'staff-management' && isAuthenticated && isStaffUser && (
          <StaffManagement
            staffList={staffList}
            appointments={appointments}
            onNavigate={handleNavigate}
            onOpenAddStaffModal={() => setIsAddStaffModalOpen(true)}
            onUpdateStatus={handleUpdateStaffStatus}
            onLogout={handleLogout}
            session={session}
          />
        )}

        {currentView === 'blog-admin' && isAuthenticated && isStaffUser && (
          <BlogAdmin
            articles={articles}
            appointments={appointments}
            onNavigate={handleNavigate}
            onOpenNewArticleModal={() => setIsNewArticleModalOpen(true)}
            onDeleteArticle={handleDeleteArticle}
            onPreviewArticle={(art) => setSelectedArticle(art)}
            onLogout={handleLogout}
            session={session}
          />
        )}

        {currentView === 'blog-public' && (
          <BlogPublic
            articles={articles}
            onReadArticle={(art) => setSelectedArticle(art)}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'contact' && <ContactView />}
      </main>

      {/* Public Marketing Footer (hidden on dashboards, booking flow, and auth views) */}
      {!NO_FOOTER_VIEWS.includes(currentView) && (
        <Footer onNavigate={handleNavigate} />
      )}

      {/* Modals */}
      <VideoModal
        item={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />

      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      <AddStaffModal
        isOpen={isAddStaffModalOpen}
        onClose={() => setIsAddStaffModalOpen(false)}
        onAddStaff={handleAddStaff}
      />

      <NewArticleModal
        isOpen={isNewArticleModalOpen}
        onClose={() => setIsNewArticleModalOpen(false)}
        onSaveArticle={handleSaveArticle}
      />

      <AppointmentDetailsModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onUpdateStatus={handleUpdateAppointmentStatus}
        isStaff={currentView === 'staff-dashboard' || currentView === 'staff-management' || currentView === 'blog-admin'}
      />
    </div>
  );
}
