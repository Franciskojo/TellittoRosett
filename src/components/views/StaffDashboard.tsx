'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ActiveView, Appointment } from '@/types';
import { StaffSidebar, StaffTab } from '@/components/StaffSidebar';
import { 
  Calendar, Users, DollarSign, Clock, ShieldCheck, UserCheck, 
  FileText, Activity, LogOut, CheckCircle, AlertCircle, Eye, Search, Plus,
  ChevronDown, ChevronUp, X, Filter, Phone, Mail, MapPin, Stethoscope, 
  Baby, Sparkles, Check, ArrowRight, RefreshCw, Printer
} from 'lucide-react';

import { Session } from 'next-auth';

interface StaffDashboardProps {
  appointments: Appointment[];
  initialTab?: StaffTab;
  onNavigate: (view: ActiveView, serviceId?: string) => void;
  onViewAppointmentDetails: (apt: Appointment) => void;
  onUpdateStatus?: (id: string, status: Appointment['status']) => void;
  onLogout?: () => void;
  session?: Session | null;
}

type StatusFilter = 'ALL' | 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  appointments,
  initialTab = 'overview',
  onNavigate,
  onViewAppointmentDetails,
  onUpdateStatus,
  onLogout,
  session,
}) => {
  const [activeTab, setActiveTab] = useState<StaffTab>(initialTab);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  
  // Appointments tab filters
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceFilter, setSelectedServiceFilter] = useState('ALL');

  // Status counts
  const confirmedCount = useMemo(() => appointments.filter(a => a.status === 'Confirmed').length, [appointments]);
  const pendingCount = useMemo(() => appointments.filter(a => a.status === 'Pending').length, [appointments]);
  const completedCount = useMemo(() => appointments.filter(a => a.status === 'Completed').length, [appointments]);
  const cancelledCount = useMemo(() => appointments.filter(a => a.status === 'Cancelled').length, [appointments]);

  // Total collected revenue
  const totalRevenue = useMemo(() => {
    return appointments
      .filter(a => a.paymentStatus === 'paid')
      .reduce((acc, curr) => acc + (curr.total || curr.fee || 0), 0);
  }, [appointments]);

  const pendingRevenue = useMemo(() => {
    return appointments
      .filter(a => a.paymentStatus === 'pending')
      .reduce((acc, curr) => acc + (curr.total || curr.fee || 0), 0);
  }, [appointments]);

  // Unique service titles from appointments
  const availableServices = useMemo(() => {
    const set = new Set<string>();
    appointments.forEach(a => {
      if (a.serviceName) set.add(a.serviceName);
    });
    return Array.from(set);
  }, [appointments]);

  // Filtered appointments list
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      // Status filter
      if (statusFilter !== 'ALL' && apt.status !== statusFilter) {
        return false;
      }
      // Service filter
      if (selectedServiceFilter !== 'ALL' && apt.serviceName !== selectedServiceFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const code = (apt.appointmentCode || apt.id || '').toLowerCase();
        const name = (apt.patientName || '').toLowerCase();
        const phone = (apt.phone || '').toLowerCase();
        const email = (apt.email || '').toLowerCase();
        const service = (apt.serviceName || '').toLowerCase();
        const reason = (apt.reason || '').toLowerCase();

        return code.includes(q) || name.includes(q) || phone.includes(q) || email.includes(q) || service.includes(q) || reason.includes(q);
      }
      return true;
    });
  }, [appointments, statusFilter, selectedServiceFilter, searchQuery]);

  // Unique patients derived from appointments
  const uniquePatients = useMemo(() => {
    const map = new Map<string, {
      name: string;
      email: string;
      phone: string;
      age?: number;
      isPregnant: boolean;
      pregnancyStage?: string;
      totalAppointments: number;
      lastVisitDate: string;
      lastService: string;
      recentStatus: Appointment['status'];
      latestAppointment: Appointment;
    }>();

    appointments.forEach(apt => {
      const key = (apt.email || apt.phone || apt.patientName).toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          name: apt.patientName,
          email: apt.email,
          phone: apt.phone,
          age: apt.age,
          isPregnant: apt.isPregnant,
          pregnancyStage: apt.pregnancyStage,
          totalAppointments: 1,
          lastVisitDate: apt.date,
          lastService: apt.serviceName,
          recentStatus: apt.status,
          latestAppointment: apt,
        });
      } else {
        const item = map.get(key)!;
        item.totalAppointments += 1;
        if (apt.date > item.lastVisitDate) {
          item.lastVisitDate = apt.date;
          item.lastService = apt.serviceName;
          item.recentStatus = apt.status;
          item.latestAppointment = apt;
        }
      }
    });

    return Array.from(map.values());
  }, [appointments]);

  // Patient Directory filters & search
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [patientFilter, setPatientFilter] = useState<'ALL' | 'PREGNANT' | 'ROUTINE'>('ALL');

  const pregnantPatientsCount = useMemo(() => uniquePatients.filter(p => p.isPregnant).length, [uniquePatients]);
  const routinePatientsCount = useMemo(() => uniquePatients.filter(p => !p.isPregnant).length, [uniquePatients]);

  const filteredPatients = useMemo(() => {
    return uniquePatients.filter(p => {
      if (patientFilter === 'PREGNANT' && !p.isPregnant) return false;
      if (patientFilter === 'ROUTINE' && p.isPregnant) return false;

      if (patientSearchQuery.trim()) {
        const q = patientSearchQuery.toLowerCase().trim();
        const name = (p.name || '').toLowerCase();
        const phone = (p.phone || '').toLowerCase();
        const email = (p.email || '').toLowerCase();
        const service = (p.lastService || '').toLowerCase();
        const stage = (p.pregnancyStage || '').toLowerCase();

        return name.includes(q) || phone.includes(q) || email.includes(q) || service.includes(q) || stage.includes(q);
      }
      return true;
    });
  }, [uniquePatients, patientFilter, patientSearchQuery]);

  // Handler for navigation from tabs
  const handleTabChange = (tab: StaffTab) => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="w-full bg-[#FCF8FA] min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Unified Staff Sidebar */}
          <StaffSidebar
            currentView="staff-dashboard"
            currentTab={activeTab}
            onNavigate={onNavigate}
            onTabChange={handleTabChange}
            appointmentsCount={appointments.length}
            patientsCount={uniquePatients.length}
            totalRevenue={totalRevenue}
            isMobileOpen={isMobileSidebarOpen}
            onToggleMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            onLogout={onLogout}
            session={session}
          />

          {/* Main Dashboard Content Area */}
          <div className="lg:col-span-9 space-y-6">

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <>
                {/* Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 font-serif-title">
                      Clinic Dashboard
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Overview of clinic operations & schedule
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Clinic Active
                    </span>
                    <button
                      onClick={() => handleTabChange('appointments')}
                      className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Appointments Schedule ({appointments.length})
                    </button>
                  </div>
                </div>

                {/* 4 Stat Metric Cards (Clickable) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div 
                    onClick={() => handleTabChange('appointments')}
                    className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm hover:border-pink-300 hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        All Appointments
                      </span>
                      <Calendar className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 mt-1">
                      {appointments.length}
                    </div>
                    <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                      ● {confirmedCount} confirmed, {pendingCount} pending
                    </p>
                  </div>

                  <div 
                    onClick={() => handleTabChange('patients')}
                    className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm hover:border-pink-300 hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Active Patients
                      </span>
                      <Users className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 mt-1">
                      {uniquePatients.length}
                    </div>
                    <p className="text-[10px] text-pink-600 font-semibold mt-1">
                      Patients in record
                    </p>
                  </div>

                  <div 
                    onClick={() => handleTabChange('payments')}
                    className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm hover:border-pink-300 hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Total Collections
                      </span>
                      <DollarSign className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-3xl font-extrabold text-pink-600 mt-1">
                      GHC {totalRevenue}
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1">
                      {appointments.filter(a => a.paymentStatus === 'paid').length} paid consultations
                    </p>
                  </div>

                  <div 
                    onClick={() => {
                      setStatusFilter('Pending');
                      handleTabChange('appointments');
                    }}
                    className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm hover:border-pink-300 hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Pending Follow-ups
                      </span>
                      <Clock className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-3xl font-extrabold text-rose-600 mt-1">
                      {pendingCount}
                    </div>
                    <p className="text-[10px] text-amber-600 font-semibold mt-1">
                      Awaiting confirmation
                    </p>
                  </div>
                </div>

                {/* Recent Appointments Table */}
                <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-base text-slate-900">Recent Appointments</h3>
                      <p className="text-xs text-slate-500">Latest scheduled patient consultations</p>
                    </div>
                    <button
                      onClick={() => handleTabChange('appointments')}
                      className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 hover:underline"
                    >
                      <span>View All ({appointments.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Appointments Table */}
                  {appointments.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <Calendar className="w-10 h-10 mx-auto text-pink-300 mb-2" />
                      <p className="text-sm font-semibold text-slate-600">No appointments scheduled yet.</p>
                      <p className="text-xs mt-1">When patients book consultations, they will appear here live.</p>
                    </div>
                  ) : (
                    <>
                      {/* Mobile Cards */}
                      <div className="block md:hidden space-y-3">
                        {appointments.slice(0, 5).map((apt) => (
                          <div key={apt.id} className="p-4 rounded-2xl bg-pink-50/20 border border-pink-100 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-xs text-pink-600 bg-white px-2.5 py-0.5 rounded border border-pink-100">
                                {apt.appointmentCode || apt.id}
                              </span>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  apt.status === 'Confirmed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : apt.status === 'Pending'
                                    ? 'bg-amber-100 text-amber-800'
                                    : apt.status === 'Completed'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {apt.status}
                              </span>
                            </div>

                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xs shrink-0">
                                {apt.patientName ? apt.patientName.charAt(0) : 'P'}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm font-bold text-slate-900 truncate">{apt.patientName}</h4>
                                <p className="text-xs text-slate-500 truncate">{apt.serviceName}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-pink-100/60 text-xs text-slate-600">
                              <span className="flex items-center gap-1 font-medium text-slate-500">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                {apt.date}, {apt.time}
                              </span>
                              <button
                                type="button"
                                onClick={() => onViewAppointmentDetails(apt)}
                                className="px-3.5 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold rounded-xl text-xs transition cursor-pointer"
                              >
                                View Details →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop Table */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-xs min-w-[650px]">
                          <thead className="bg-pink-50/50 text-slate-600 font-bold uppercase tracking-wider border-y border-pink-100">
                            <tr>
                              <th className="py-3 px-4">Ref ID</th>
                              <th className="py-3 px-4">Patient</th>
                              <th className="py-3 px-4">Service</th>
                              <th className="py-3 px-4">Date & Time</th>
                              <th className="py-3 px-4">Status</th>
                              <th className="py-3 px-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {appointments.slice(0, 5).map((apt) => (
                              <tr key={apt.id} className="hover:bg-pink-50/30 transition">
                                <td className="py-3.5 px-4 font-mono font-bold text-pink-600 text-[11px]">
                                  {apt.appointmentCode || apt.id}
                                </td>
                                <td className="py-3.5 px-4 font-semibold text-slate-900">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-[10px]">
                                      {apt.patientName ? apt.patientName.charAt(0) : 'P'}
                                    </div>
                                    <span>{apt.patientName}</span>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 text-slate-600">{apt.serviceName}</td>
                                <td className="py-3.5 px-4 text-slate-600">
                                  {apt.date}, {apt.time}
                                </td>
                                <td className="py-3.5 px-4">
                                  <span
                                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                      apt.status === 'Confirmed'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : apt.status === 'Pending'
                                        ? 'bg-amber-100 text-amber-800'
                                        : apt.status === 'Completed'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-rose-100 text-rose-800'
                                    }`}
                                  >
                                    {apt.status}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <button
                                    onClick={() => onViewAppointmentDetails(apt)}
                                    className="px-3 py-1 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold rounded-lg transition"
                                  >
                                    View
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
              </>
            )}

            {/* TAB 2: APPOINTMENTS MASTER VIEW (When staff clicks Appointments) */}
            {activeTab === 'appointments' && (
              <div className="space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold text-slate-900 font-serif-title">
                        Appointments Master List
                      </h1>
                      <span className="text-xs bg-pink-100 text-pink-700 font-bold px-2.5 py-0.5 rounded-full">
                        {appointments.length} Total
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Filter, manage, review details and update clinical consultation statuses
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => {
                        setStatusFilter('ALL');
                        setSearchQuery('');
                        setSelectedServiceFilter('ALL');
                      }}
                      className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold border border-slate-200 transition flex items-center gap-1.5"
                      title="Reset filters"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-3.5 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl text-xs font-bold border border-pink-200 transition flex items-center gap-1.5 cursor-pointer"
                      title="Print Master Schedule"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Schedule</span>
                    </button>
                  </div>
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {(['ALL', 'Confirmed', 'Pending', 'Completed', 'Cancelled'] as StatusFilter[]).map((st) => {
                    const count = st === 'ALL' 
                      ? appointments.length 
                      : st === 'Confirmed' ? confirmedCount 
                      : st === 'Pending' ? pendingCount 
                      : st === 'Completed' ? completedCount 
                      : cancelledCount;

                    const isActive = statusFilter === st;

                    return (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
                          isActive
                            ? 'bg-pink-600 text-white shadow-sm'
                            : 'bg-white text-slate-600 hover:bg-pink-50/70 border border-pink-100'
                        }`}
                      >
                        <span>{st === 'ALL' ? 'All Appointments' : st}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-pink-100 text-pink-700'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Search & Service Filter Bar */}
                <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by patient name, phone, email, appointment code..."
                      className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {availableServices.length > 0 && (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                      <select
                        value={selectedServiceFilter}
                        onChange={(e) => setSelectedServiceFilter(e.target.value)}
                        className="w-full sm:w-auto py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none focus:border-pink-500"
                      >
                        <option value="ALL">All Services</option>
                        {availableServices.map((svc) => (
                          <option key={svc} value={svc}>{svc}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Master Appointments Table */}
                <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm">
                  {filteredAppointments.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500 mx-auto mb-3">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">No appointments found</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                        {searchQuery || statusFilter !== 'ALL' || selectedServiceFilter !== 'ALL'
                          ? 'No appointments matched your current filter criteria. Try clearing filters or searching for another term.'
                          : 'There are currently no appointments registered in the clinic database.'}
                      </p>
                      {(searchQuery || statusFilter !== 'ALL' || selectedServiceFilter !== 'ALL') && (
                        <button
                          onClick={() => {
                            setStatusFilter('ALL');
                            setSearchQuery('');
                            setSelectedServiceFilter('ALL');
                          }}
                          className="mt-4 px-4 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl text-xs font-bold transition"
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Mobile Cards View (< md) */}
                      <div className="block md:hidden space-y-3.5">
                        {filteredAppointments.map((apt) => (
                          <div 
                            key={apt.id} 
                            className="p-4 rounded-2xl bg-white border border-pink-100 shadow-xs space-y-3 hover:border-pink-200 transition"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-xs text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded border border-pink-100">
                                {apt.appointmentCode || apt.id}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  apt.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                  GHC {apt.total || apt.fee} • {apt.paymentStatus}
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                  apt.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                  apt.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                  'bg-rose-100 text-rose-800'
                                }`}>
                                  {apt.status}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-sm shrink-0">
                                {apt.patientName ? apt.patientName.charAt(0) : 'P'}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm font-bold text-slate-900 truncate">{apt.patientName}</h4>
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  <span>{apt.phone}</span>
                                </p>
                              </div>
                            </div>

                            <div className="p-2.5 rounded-xl bg-slate-50 text-xs space-y-1">
                              <div className="font-semibold text-slate-800">{apt.serviceName}</div>
                              <div className="text-slate-500 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                <span>{apt.date} at {apt.time}</span>
                              </div>
                              {apt.reason && (
                                <p className="text-[11px] text-slate-500 italic truncate">&quot;{apt.reason}&quot;</p>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                              {onUpdateStatus && (
                                <select
                                  value={apt.status}
                                  onChange={(e) => onUpdateStatus(apt.id, e.target.value as Appointment['status'])}
                                  className="text-[11px] font-semibold py-1 px-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700"
                                >
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Pending">Pending</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              )}
                              <button
                                onClick={() => onViewAppointmentDetails(apt)}
                                className="flex-1 py-1.5 px-3 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold rounded-xl text-xs text-center transition"
                              >
                                View Details →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop Table View (>= md) */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-xs min-w-[750px]">
                          <thead className="bg-pink-50/50 text-slate-600 font-bold uppercase tracking-wider border-y border-pink-100">
                            <tr>
                              <th className="py-3.5 px-4">Ref Code</th>
                              <th className="py-3.5 px-4">Patient</th>
                              <th className="py-3.5 px-4">Consultation</th>
                              <th className="py-3.5 px-4">Date & Time</th>
                              <th className="py-3.5 px-4">Payment</th>
                              <th className="py-3.5 px-4">Status</th>
                              <th className="py-3.5 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredAppointments.map((apt) => (
                              <tr key={apt.id} className="hover:bg-pink-50/20 transition group">
                                <td className="py-3.5 px-4">
                                  <span className="font-mono font-bold text-pink-600 text-xs bg-pink-50/60 px-2.5 py-1 rounded-md border border-pink-100">
                                    {apt.appointmentCode || apt.id}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xs shrink-0">
                                      {apt.patientName ? apt.patientName.charAt(0) : 'P'}
                                    </div>
                                    <div>
                                      <p className="font-bold text-slate-900">{apt.patientName}</p>
                                      <p className="text-[11px] text-slate-500">{apt.phone}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <p className="font-semibold text-slate-800">{apt.serviceName}</p>
                                  <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{apt.location}</p>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="font-semibold text-slate-800">{apt.date}</div>
                                  <div className="text-[11px] text-slate-500">{apt.time}</div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="font-bold text-slate-900">GHC {apt.total || apt.fee}</div>
                                  <span className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                    apt.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                  }`}>
                                    {apt.paymentStatus}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4">
                                  {onUpdateStatus ? (
                                    <select
                                      value={apt.status}
                                      onChange={(e) => onUpdateStatus(apt.id, e.target.value as Appointment['status'])}
                                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border-0 cursor-pointer focus:ring-2 focus:ring-pink-500/20 ${
                                        apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                        apt.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                        apt.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                        'bg-rose-100 text-rose-800'
                                      }`}
                                    >
                                      <option value="Confirmed">Confirmed</option>
                                      <option value="Pending">Pending</option>
                                      <option value="Completed">Completed</option>
                                      <option value="Cancelled">Cancelled</option>
                                    </select>
                                  ) : (
                                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                      apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                      apt.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                      apt.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                      'bg-rose-100 text-rose-800'
                                    }`}>
                                      {apt.status}
                                    </span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <button
                                    onClick={() => onViewAppointmentDetails(apt)}
                                    className="px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold rounded-lg transition"
                                  >
                                    View
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

            {/* TAB 3: PATIENTS LIST (Patient Directory Master List) */}
            {activeTab === 'patients' && (
              <div className="space-y-6">
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-bold text-slate-900 font-serif-title">
                        Patient Directory Master List
                      </h1>
                      <span className="bg-pink-100 text-pink-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        {uniquePatients.length} Total Patients
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Roster of registered patients, maternal health stages, and clinical consultation history
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setPatientFilter('ALL');
                        setPatientSearchQuery('');
                      }}
                      className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                      title="Reset filters"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-3.5 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl text-xs font-bold border border-pink-200 transition flex items-center gap-1.5 cursor-pointer"
                      title="Print Patient Registry"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Directory</span>
                    </button>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {[
                    { id: 'ALL', label: 'All Patients', count: uniquePatients.length },
                    { id: 'PREGNANT', label: 'Maternal / Expectant', count: pregnantPatientsCount },
                    { id: 'ROUTINE', label: 'General / Routine Care', count: routinePatientsCount },
                  ].map((filter) => {
                    const isActive = patientFilter === filter.id;
                    return (
                      <button
                        key={filter.id}
                        onClick={() => setPatientFilter(filter.id as any)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
                          isActive
                            ? 'bg-pink-600 text-white shadow-sm'
                            : 'bg-white text-slate-600 hover:bg-pink-50/70 border border-pink-100'
                        }`}
                      >
                        <span>{filter.label}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-pink-100 text-pink-700'
                        }`}>
                          {filter.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm flex items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={patientSearchQuery}
                      onChange={(e) => setPatientSearchQuery(e.target.value)}
                      placeholder="Search patients by name, phone, email, pregnancy stage, or attended service..."
                      className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition"
                    />
                    {patientSearchQuery && (
                      <button
                        onClick={() => setPatientSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Master Patients Table */}
                <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm">
                  {filteredPatients.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500 mx-auto mb-3">
                        <Users className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">No patients found</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                        {patientSearchQuery || patientFilter !== 'ALL'
                          ? 'No patients matched your current filter criteria. Try clearing search or switching categories.'
                          : 'There are currently no patients registered in the clinic database.'}
                      </p>
                      {(patientSearchQuery || patientFilter !== 'ALL') && (
                        <button
                          onClick={() => {
                            setPatientFilter('ALL');
                            setPatientSearchQuery('');
                          }}
                          className="mt-4 px-4 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl text-xs font-bold transition"
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Mobile Cards View (< md) */}
                      <div className="block md:hidden space-y-3.5">
                        {filteredPatients.map((p, idx) => (
                          <div 
                            key={idx} 
                            className="p-4 rounded-2xl bg-white border border-pink-100 shadow-xs space-y-3 hover:border-pink-200 transition"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-sm shrink-0">
                                  {p.name ? p.name.charAt(0).toUpperCase() : 'P'}
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                                  <p className="text-xs text-slate-500 flex items-center gap-1">
                                    <Phone className="w-3 h-3 text-slate-400" />
                                    <span>{p.phone}</span>
                                  </p>
                                </div>
                              </div>
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-pink-100 text-pink-800">
                                {p.totalAppointments} {p.totalAppointments === 1 ? 'Visit' : 'Visits'}
                              </span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-slate-50 text-xs space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">Maternal Profile:</span>
                                {p.isPregnant ? (
                                  <span className="font-semibold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full text-[11px] border border-pink-200">
                                    Pregnant • {p.pregnancyStage || 'Active'}
                                  </span>
                                ) : (
                                  <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full text-[11px]">
                                    Routine Care
                                  </span>
                                )}
                              </div>
                              <div className="flex justify-between items-center pt-1">
                                <span className="text-slate-400">Last Service:</span>
                                <span className="font-semibold text-slate-800">{p.lastService}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">Last Visit Date:</span>
                                <span className="text-slate-600 font-medium">{p.lastVisitDate}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                p.recentStatus === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                p.recentStatus === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                p.recentStatus === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-rose-100 text-rose-800'
                              }`}>
                                Recent: {p.recentStatus}
                              </span>

                              <button
                                onClick={() => {
                                  setSearchQuery(p.name);
                                  setStatusFilter('ALL');
                                  setActiveTab('appointments');
                                }}
                                className="py-1 px-3 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold rounded-xl text-xs flex items-center gap-1 transition"
                              >
                                <span>Appointments</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop Table View (>= md) */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-xs min-w-[780px]">
                          <thead className="bg-pink-50/50 text-slate-600 font-bold uppercase tracking-wider border-y border-pink-100">
                            <tr>
                              <th className="py-3.5 px-4">Patient</th>
                              <th className="py-3.5 px-4">Contact</th>
                              <th className="py-3.5 px-4">Maternal / Health Profile</th>
                              <th className="py-3.5 px-4">Visits</th>
                              <th className="py-3.5 px-4">Last Consultation</th>
                              <th className="py-3.5 px-4">Recent Status</th>
                              <th className="py-3.5 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredPatients.map((p, idx) => (
                              <tr key={idx} className="hover:bg-pink-50/20 transition group">
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                                      {p.name ? p.name.charAt(0).toUpperCase() : 'P'}
                                    </div>
                                    <div>
                                      <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                                      {p.age && (
                                        <p className="text-[11px] text-slate-400">Age: {p.age}</p>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                <td className="py-3.5 px-4">
                                  <div className="space-y-0.5">
                                    <p className="font-semibold text-slate-800 flex items-center gap-1">
                                      <Phone className="w-3 h-3 text-slate-400" />
                                      <span>{p.phone}</span>
                                    </p>
                                    {p.email && (
                                      <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate max-w-[170px]">
                                        <Mail className="w-3 h-3 text-slate-400" />
                                        <span>{p.email}</span>
                                      </p>
                                    )}
                                  </div>
                                </td>

                                <td className="py-3.5 px-4">
                                  {p.isPregnant ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-pink-50 text-pink-700 border border-pink-200">
                                      <Baby className="w-3 h-3 text-pink-600" />
                                      <span>Pregnant • {p.pregnancyStage || 'Active'}</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                                      <span>Routine Healthcare</span>
                                    </span>
                                  )}
                                </td>

                                <td className="py-3.5 px-4">
                                  <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-pink-100 text-pink-800">
                                    {p.totalAppointments} {p.totalAppointments === 1 ? 'Visit' : 'Visits'}
                                  </span>
                                </td>

                                <td className="py-3.5 px-4">
                                  <p className="font-semibold text-slate-800">{p.lastService}</p>
                                  <p className="text-[11px] text-slate-400">{p.lastVisitDate}</p>
                                </td>

                                <td className="py-3.5 px-4">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                    p.recentStatus === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                    p.recentStatus === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                    p.recentStatus === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                    'bg-rose-100 text-rose-800'
                                  }`}>
                                    {p.recentStatus}
                                  </span>
                                </td>

                                <td className="py-3.5 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => {
                                        setSearchQuery(p.name);
                                        setStatusFilter('ALL');
                                        setActiveTab('appointments');
                                      }}
                                      className="px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold rounded-xl text-xs transition flex items-center gap-1"
                                      title="Filter appointments for this patient"
                                    >
                                      <span>Appointments</span>
                                      <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                    {p.latestAppointment && (
                                      <button
                                        onClick={() => onViewAppointmentDetails(p.latestAppointment)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-pink-600 hover:bg-pink-50 transition"
                                        title="View latest appointment details"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
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

            {/* TAB 4: PAYMENTS & ACCOUNTS */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 font-serif-title">
                      Clinic Financial Ledger
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Consultation receipts, Mobile Money reconciliation, and revenue breakdown
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-semibold block">Total Revenue</span>
                    <span className="text-2xl font-extrabold text-pink-600">GHC {totalRevenue}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
                    <span className="text-xs font-bold text-slate-400 uppercase">Paid Consultations</span>
                    <div className="text-2xl font-extrabold text-emerald-600 mt-1">GHC {totalRevenue}</div>
                    <p className="text-[11px] text-slate-500 mt-1">Verified collections</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
                    <span className="text-xs font-bold text-slate-400 uppercase">Pending MoMo</span>
                    <div className="text-2xl font-extrabold text-amber-600 mt-1">GHC {pendingRevenue}</div>
                    <p className="text-[11px] text-slate-500 mt-1">Awaiting confirmation</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
                    <span className="text-xs font-bold text-slate-400 uppercase">Payment Channels</span>
                    <div className="text-sm font-bold text-slate-800 mt-1">MTN MoMo, Telecel Cash</div>
                    <p className="text-[11px] text-slate-500 mt-1">Merchant ID: MatraCare</p>
                  </div>
                </div>

                {/* Ledger Transactions */}
                <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm">
                  <h3 className="font-bold text-sm text-slate-900 mb-4">Payment Receipts</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[650px]">
                      <thead className="bg-pink-50/50 text-slate-600 font-bold uppercase tracking-wider border-y border-pink-100">
                        <tr>
                          <th className="py-3 px-4">Ref Code</th>
                          <th className="py-3 px-4">Patient</th>
                          <th className="py-3 px-4">Service</th>
                          <th className="py-3 px-4">Amount</th>
                          <th className="py-3 px-4">Channel</th>
                          <th className="py-3 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {appointments.map((apt) => (
                          <tr key={apt.id} className="hover:bg-pink-50/20">
                            <td className="py-3 px-4 font-mono font-bold text-pink-600">{apt.appointmentCode || apt.id}</td>
                            <td className="py-3 px-4 font-semibold text-slate-900">{apt.patientName}</td>
                            <td className="py-3 px-4 text-slate-600">{apt.serviceName}</td>
                            <td className="py-3 px-4 font-bold text-slate-900">GHC {apt.total || apt.fee}</td>
                            <td className="py-3 px-4 font-semibold uppercase text-slate-500">{apt.paymentMethod || 'momo'}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                apt.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {apt.paymentStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: MEDIA REQUESTS */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 font-serif-title">
                      Media & Outreach Requests
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      TV appearances, radio health talk requests, and community speaking invitations
                    </p>
                  </div>
                  <span className="text-xs bg-pink-100 text-pink-700 font-bold px-3 py-1.5 rounded-full self-start sm:self-auto">
                    4 Upcoming
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      channel: 'GTV Breakfast Show',
                      topic: 'Preventing Postpartum Haemorrhage in Ghana',
                      date: 'Oct 2, 2026 • 7:30 AM',
                      type: 'Live TV Interview',
                      status: 'Confirmed',
                      contact: 'Kweku Baako (Producer)'
                    },
                    {
                      channel: 'Joy Prime / Health Check',
                      topic: 'Exclusive Breastfeeding & Neonatal Nutrition',
                      date: 'Oct 8, 2026 • 10:00 AM',
                      type: 'Studio Panel',
                      status: 'Scheduled',
                      contact: 'Maame Dufie'
                    },
                    {
                      channel: 'Citi FM Eyewitness News Health Spotlight',
                      topic: 'Midwifery Training and Maternal Mortality Goals',
                      date: 'Oct 14, 2026 • 5:00 PM',
                      type: 'Radio Interview',
                      status: 'In Review',
                      contact: 'Bernard Avle'
                    },
                    {
                      channel: 'Peace FM Clinic Hour',
                      topic: 'Early Antenatal Care Awareness',
                      date: 'Oct 20, 2026 • 2:00 PM',
                      type: 'Akan Health Segment',
                      status: 'Confirmed',
                      contact: 'Nana Yaa'
                    }
                  ].map((req, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">
                          {req.type}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          req.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                          req.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{req.channel}</h3>
                        <p className="text-xs text-slate-600 mt-1 font-medium">&quot;{req.topic}&quot;</p>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {req.date}
                        </span>
                        <span>{req.contact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
