'use client';

import React from 'react';
import { Appointment } from '@/types';
import { X, ArrowLeft, Calendar, Clock, MapPin, User, Phone, Mail, CheckCircle, AlertCircle, FileText, Printer, Check, Ban } from 'lucide-react';

interface AppointmentDetailsModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onUpdateStatus?: (id: string, status: Appointment['status']) => void;
  isStaff?: boolean;
}

export const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  appointment,
  onClose,
  onUpdateStatus,
  isStaff = false,
}) => {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-pink-100 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-start gap-3">
            <button
              onClick={onClose}
              className="mt-1 p-2 rounded-xl text-slate-500 hover:text-pink-600 hover:bg-pink-50 border border-slate-200 transition group cursor-pointer"
              title="Go Back"
              aria-label="Go Back"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div>
              <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-pink-600 uppercase tracking-wider bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">
                {appointment.appointmentCode || appointment.id}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                  appointment.status === 'Confirmed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : appointment.status === 'Pending'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {appointment.status}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              {appointment.serviceName}
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer shrink-0"
          title="Close"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

        {/* Details Grid */}
        <div className="space-y-4 text-sm text-slate-700">
          <div className="bg-pink-50/60 p-4 rounded-xl border border-pink-100/60 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-pink-600 shrink-0" />
              <div>
                <p className="text-[11px] text-slate-500 uppercase font-semibold">Date</p>
                <p className="font-semibold text-slate-800">{appointment.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-pink-600 shrink-0" />
              <div>
                <p className="text-[11px] text-slate-500 uppercase font-semibold">Time</p>
                <p className="font-semibold text-slate-800">{appointment.time}</p>
              </div>
            </div>
            <div className="col-span-2 flex items-start gap-2.5 pt-2 border-t border-pink-200/50">
              <MapPin className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] text-slate-500 uppercase font-semibold">Location / Clinic</p>
                <p className="font-semibold text-slate-800">{appointment.location}</p>
              </div>
            </div>
          </div>

          {/* Patient Info */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-2.5">
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider text-slate-400">
              Patient Information
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-slate-500">Name</p>
                <p className="font-medium text-slate-900">{appointment.patientName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Phone Number</p>
                <p className="font-medium text-slate-900">{appointment.phone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Email Address</p>
                <p className="font-medium text-slate-900 text-xs truncate">{appointment.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Pregnancy Status</p>
                <p className="font-medium text-slate-900">
                  {appointment.isPregnant ? `Yes (${appointment.pregnancyStage || 'Active'})` : 'No'}
                </p>
              </div>
            </div>

            {appointment.reason && (
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-500">Reason for Consultation:</p>
                <p className="text-xs text-slate-700 mt-0.5 bg-slate-50 p-2 rounded-lg">{appointment.reason}</p>
              </div>
            )}
          </div>

          {/* Payment Summary */}
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <span>Consultation Fee</span>
              <span>GHC {appointment.fee}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
              <span>Payment Method</span>
              <span className="uppercase font-medium">{appointment.paymentMethod}</span>
            </div>
            <div className="border-t border-slate-100 pt-2 flex items-center justify-between font-bold text-slate-900">
              <span>Total Paid</span>
              <span className="text-pink-600 text-base">GHC {appointment.total}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            <Printer className="w-3.5 h-3.5" /> Print Details
          </button>

          <div className="flex items-center space-x-2">
            {isStaff && onUpdateStatus && (
              <>
                {appointment.status !== 'Confirmed' && (
                  <button
                    onClick={() => onUpdateStatus(appointment.id, 'Confirmed')}
                    className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg font-medium shadow-sm transition"
                  >
                    <Check className="w-3.5 h-3.5" /> Confirm
                  </button>
                )}
                {appointment.status !== 'Cancelled' && (
                  <button
                    onClick={() => onUpdateStatus(appointment.id, 'Cancelled')}
                    className="flex items-center gap-1 text-xs bg-rose-50 text-rose-600 hover:bg-rose-100 px-3 py-2 rounded-lg font-medium transition"
                  >
                    <Ban className="w-3.5 h-3.5" /> Cancel
                  </button>
                )}
              </>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
