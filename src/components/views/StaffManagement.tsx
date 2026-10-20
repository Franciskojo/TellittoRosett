'use client';

import React, { useState, useMemo } from 'react';
import { ActiveView, StaffMember, Appointment } from '@/types';
import { StaffSidebar } from '@/components/StaffSidebar';
import { 
  UserPlus, UserCheck, ShieldCheck, Mail, Phone, Clock, 
  CheckCircle, MoreVertical
} from 'lucide-react';

import { Session } from 'next-auth';

interface StaffManagementProps {
  staffList: StaffMember[];
  appointments?: Appointment[];
  onNavigate: (view: ActiveView, extraParam?: string) => void;
  onOpenAddStaffModal: () => void;
  onUpdateStatus: (id: string, status: StaffMember['status']) => void;
  onLogout?: () => void;
  session?: Session | null;
}

export const StaffManagement: React.FC<StaffManagementProps> = ({
  staffList,
  appointments = [],
  onNavigate,
  onOpenAddStaffModal,
  onUpdateStatus,
  onLogout,
  session,
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Compute stats for unified sidebar badges
  const patientsCount = useMemo(() => {
    const set = new Set<string>();
    appointments.forEach(a => {
      const key = a.email || a.phone || a.patientName;
      if (key) set.add(key.toLowerCase());
    });
    return set.size;
  }, [appointments]);

  const totalRevenue = useMemo(() => {
    return appointments
      .filter(a => a.paymentStatus === 'paid')
      .reduce((acc, curr) => acc + (curr.total || curr.fee || 0), 0);
  }, [appointments]);

  return (
    <div className="w-full bg-[#FCF8FA] min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Unified Staff Sidebar */}
          <StaffSidebar
            currentView="staff-management"
            onNavigate={onNavigate}
            appointmentsCount={appointments.length}
            patientsCount={patientsCount}
            totalRevenue={totalRevenue}
            isMobileOpen={isMobileSidebarOpen}
            onToggleMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            onLogout={onLogout}
            session={session}
          />

          {/* Main Staff Management Content */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Header with "+ Add Staff" button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 font-serif-title">
                  Staff Management
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage clinic staff, shifts, and their availability roles.
                </p>
              </div>

              <button
                onClick={onOpenAddStaffModal}
                className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-full text-xs font-bold shadow-md shadow-pink-200 transition flex items-center gap-2 self-start sm:self-auto"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Add Staff</span>
              </button>
            </div>

            {/* 6 Staff Cards Grid (Matches Screen 12: Rosetta, Akosua, Kofi, Edi, Yaa, Nana) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {staffList.map((staff) => (
                <div
                  key={staff.id}
                  className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    {/* Avatar Container */}
                    <div className="relative w-20 h-20 mx-auto rounded-2xl overflow-hidden border-2 border-pink-100 shadow-sm mb-3">
                      <img
                        src={staff.avatar}
                        alt={staff.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="text-center">
                      <h3 className="font-bold text-sm text-slate-900">{staff.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{staff.role}</p>
                      {staff.specialty && (
                        <p className="text-[11px] text-pink-600 font-semibold mt-1">
                          {staff.specialty}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status Toggle Bar */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">Status:</span>
                    
                    <select
                      value={staff.status}
                      onChange={(e) => onUpdateStatus(staff.id, e.target.value as StaffMember['status'])}
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border focus:outline-none transition cursor-pointer ${
                        staff.status === 'Available'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : staff.status === 'On Leave'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <option value="Available">Available</option>
                      <option value="On Leave">On Leave</option>
                      <option value="In Session">In Session</option>
                      <option value="Off Duty">Off Duty</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
