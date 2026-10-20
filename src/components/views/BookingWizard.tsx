'use client';

import React, { useState, useEffect } from 'react';
import { ActiveView, Appointment, Service } from '@/types';
import { INITIAL_SERVICES } from '@/lib/initialData';
import { 
  CheckCircle, ArrowLeft, ArrowRight, Calendar, Clock, MapPin, 
  CreditCard, Smartphone, Building2, ShieldCheck, User, Sparkles, ChevronLeft, ChevronRight, Stethoscope, HeartHandshake, Baby, Activity
} from 'lucide-react';

import { Session } from 'next-auth';

interface BookingWizardProps {
  session?: Session | null;
  initialServiceId?: string;
  onNavigate: (view: ActiveView) => void;
  onBookingSuccess: (appointment: Appointment) => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  session,
  initialServiceId = 'antenatal',
  onNavigate,
  onBookingSuccess,
}) => {
  // Step tracker: 1: Service, 2: Date/Time, 3: Patient Details, 4: Payment, 5: Confirmation
  const [step, setStep] = useState<number>(1);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState<string>('9:00 AM');
  
  // Patient details state (dynamically populated from authenticated session)
  const [patientName, setPatientName] = useState<string>(session?.user?.name || '');
  const [phone, setPhone] = useState<string>(session?.user?.phone || '');
  const [email, setEmail] = useState<string>(session?.user?.email || '');
  const [age, setAge] = useState<string>('28');
  const [isPregnant, setIsPregnant] = useState<string>('Yes');
  const [pregnancyStage, setPregnancyStage] = useState<string>('Second Trimester');
  const [reason, setReason] = useState<string>('Routine consultation');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (session?.user) {
      setPatientName(prev => prev || session.user.name || '');
      setEmail(prev => prev || session.user.email || '');
      setPhone(prev => prev || session.user.phone || '');
    }
  }, [session]);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'card' | 'bank'>('momo');
  const [momoProvider, setMomoProvider] = useState<'mtn' | 'telecel' | 'at'>('mtn');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string>('');
  const [stepError, setStepError] = useState<string>('');
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  useEffect(() => {
    if (initialServiceId) {
      setSelectedServiceId(initialServiceId);
    }
  }, [initialServiceId]);

  const currentService = INITIAL_SERVICES.find(s => s.id === selectedServiceId) || INITIAL_SERVICES[0];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '10:30 AM', '11:00 AM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const handleNext = () => {
    setStepError('');
    if (step === 3) {
      if (!patientName.trim()) {
        setStepError('Please enter your full name before continuing.');
        return;
      }
      if (!phone.trim()) {
        setStepError('Please enter your phone number before continuing.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setStepError('Please enter a valid email address before continuing.');
        return;
      }
    }
    if (step < 4) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setStepError('');
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleConfirmPayment = async () => {
    setIsSubmitting(true);
    setBookingError('');
    
    const newAppointment: Omit<Appointment, 'id' | 'createdAt'> = {
      patientName,
      phone,
      email,
      age: parseInt(age) || 28,
      isPregnant: isPregnant === 'Yes',
      pregnancyStage: isPregnant === 'Yes' ? pregnancyStage : undefined,
      reason,
      notes,
      serviceId: currentService.id,
      serviceName: currentService.title,
      date: selectedDate,
      time: selectedTime,
      location: 'MatraCare Clinic, East Legon',
      fee: currentService.price,
      platformFee: 0,
      total: currentService.price,
      paymentMethod,
      paymentStatus: 'paid',
      status: 'Confirmed'
    };

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppointment)
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        setBookingError(
          response.status === 401
            ? 'Please sign in to book an appointment.'
            : result.error || 'We could not complete your booking. Please try again.'
        );
        return;
      }

      setConfirmedBooking(result.data);
      onBookingSuccess(result.data);
      setStep(5); // Show screen 9 confirmation
    } catch {
      setBookingError('Network error. Your booking was not placed — please try again.');
    } finally {
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#FCF8FA] py-8 sm:py-10 min-h-[80vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Top Back Navigation Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate(session?.user?.role === 'staff' ? 'staff-dashboard' : 'patient-dashboard')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-pink-600 bg-white hover:bg-pink-50/80 px-4 py-2.5 rounded-2xl border border-pink-100 shadow-2xs transition group cursor-pointer"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4 text-pink-600 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Dashboard</span>
            </button>

            {step > 1 && step < 5 && (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 px-3.5 py-2.5 rounded-2xl border border-slate-200 shadow-2xs transition cursor-pointer"
                title="Go back to previous step"
              >
                <ChevronLeft className="w-4 h-4 text-slate-500" />
                <span>Previous Step</span>
              </button>
            )}
          </div>

          <span className="text-xs text-slate-500 font-semibold bg-white px-3.5 py-1.5 rounded-full border border-pink-100/60 shadow-2xs">
            {step < 5 ? `Step ${step} of 4 • Appointment Booking` : 'Booking Confirmed'}
          </span>
        </div>

        {/* Step Indicator (Screens 5-8) */}
        {step < 5 && (
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 -z-0"></div>
              
              {[
                { num: 1, label: 'Service' },
                { num: 2, label: 'Date & Time' },
                { num: 3, label: 'Patient Details' },
                { num: 4, label: 'Payment' }
              ].map((s) => {
                const isActive = step === s.num;
                const isPassed = step > s.num;
                return (
                  <div key={s.num} className="flex flex-col items-center relative z-10 bg-[#FCF8FA] px-2">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition ${
                        isActive
                          ? 'bg-pink-600 text-white shadow-md shadow-pink-300 ring-4 ring-pink-100'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isPassed ? '✓' : s.num}
                    </div>
                    <span
                      className={`text-xs mt-1.5 font-medium ${
                        isActive ? 'text-pink-600 font-bold' : isPassed ? 'text-emerald-700' : 'text-slate-500'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 1: SELECT SERVICE (SCREEN 5) */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-pink-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 font-serif-title">Select a Service</h2>
              <p className="text-xs text-slate-500 mt-1">Choose the consultation that best meets your health needs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INITIAL_SERVICES.map((service) => {
                const isSelected = selectedServiceId === service.id;
                return (
                  <div
                    key={service.id}
                    onClick={() => setSelectedServiceId(service.id)}
                    className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-pink-600 bg-pink-50/40 shadow-sm'
                        : 'border-slate-100 bg-white hover:border-pink-200 hover:bg-pink-50/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-900 text-base">{service.title}</h4>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-pink-600 bg-pink-600 text-white' : 'border-slate-300'}`}>
                          {isSelected && <span className="text-xs">✓</span>}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{service.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">{service.duration}</span>
                      <span className="text-pink-600 font-bold">{service.currency} {service.price}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onNavigate(session?.user?.role === 'staff' ? 'staff-dashboard' : 'patient-dashboard')}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-700 hover:text-pink-600 bg-slate-100 hover:bg-pink-50 rounded-xl transition flex items-center justify-center gap-1.5 group cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-pink-600 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to Dashboard</span>
              </button>
              <button
                onClick={handleNext}
                className="w-full sm:w-auto px-7 py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-full shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Next: Date & Time</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DATE & TIME (SCREEN 6) */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-pink-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 font-serif-title">Select Date & Time</h2>
              <p className="text-xs text-slate-500 mt-1">For {currentService.title} ({currentService.duration})</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Calendar Column */}
              <div className="md:col-span-6 bg-pink-50/40 p-5 rounded-2xl border border-pink-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-slate-800">September 2026</h3>
                  <div className="flex items-center space-x-1">
                    <button className="p-1 rounded-lg hover:bg-white text-slate-600"><ChevronLeft className="w-4 h-4" /></button>
                    <button className="p-1 rounded-lg hover:bg-white text-slate-600"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
                  <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {/* Empty offsets for Sept 2026 starting Tuesday */}
                  <span></span><span></span>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((day) => {
                    const dateStr = `2026-09-${day < 10 ? '0' + day : day}`;
                    const isSelected = selectedDate === dateStr;
                    const isWed16 = day === 16;
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`h-9 w-full rounded-xl flex items-center justify-center font-medium transition ${
                          isSelected
                            ? 'bg-pink-600 text-white font-bold shadow-md shadow-pink-300'
                            : isWed16
                            ? 'bg-pink-100 text-pink-700 font-bold border border-pink-300'
                            : 'hover:bg-white text-slate-700'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots Column */}
              <div className="md:col-span-6">
                <h3 className="font-bold text-sm text-slate-800 mb-1">Available Time Slots</h3>
                <p className="text-xs text-slate-500 mb-4">Wednesday, 16 September 2026</p>

                <div className="grid grid-cols-2 gap-2.5">
                  {timeSlots.map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 px-4 rounded-xl text-xs font-bold border transition ${
                          isSelected
                            ? 'bg-pink-600 text-white border-pink-600 shadow-md shadow-pink-200'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-pink-300 hover:bg-pink-50/50'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={handleBack}
                className="px-5 py-2.5 text-xs text-slate-600 font-medium hover:text-slate-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleNext}
                className="px-7 py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-full shadow-md transition flex items-center gap-1.5"
              >
                <span>Next: Patient Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PATIENT DETAILS (SCREEN 7) */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-pink-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 font-serif-title">Your Details</h2>
              <p className="text-xs text-slate-500 mt-1">Please provide your information to complete your booking.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 024 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Age *</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Are you pregnant?</label>
                  <select
                    value={isPregnant}
                    onChange={(e) => setIsPregnant(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm font-medium bg-white"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pregnancy Stage</label>
                  <select
                    value={pregnancyStage}
                    disabled={isPregnant === 'No'}
                    onChange={(e) => setPregnancyStage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm font-medium bg-white disabled:opacity-50"
                  >
                    <option value="First Trimester">First Trimester (1-12 wks)</option>
                    <option value="Second Trimester">Second Trimester (13-26 wks)</option>
                    <option value="Third Trimester">Third Trimester (27-40 wks)</option>
                    <option value="Postpartum">Postpartum</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Visit *</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Any additional information (optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. allergies, previous pregnancy history, medications..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-xs text-slate-700"
                />
              </div>
            </div>

            {stepError && (
              <p role="alert" className="mt-4 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2">
                {stepError}
              </p>
            )}

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={handleBack}
                className="px-5 py-2.5 text-xs text-slate-600 font-medium hover:text-slate-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleNext}
                className="px-7 py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-full shadow-md transition flex items-center gap-1.5"
              >
                <span>Next: Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PAYMENT (SCREEN 8) */}
        {step === 4 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-pink-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 font-serif-title">Payment</h2>
              <p className="text-xs text-slate-500 mt-1">Review your booking summary and choose your payment method.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Appointment Summary Box */}
              <div className="md:col-span-6 bg-pink-50/50 p-6 rounded-2xl border border-pink-100 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider mb-4">
                    Appointment Summary
                  </h3>
                  
                  <div className="space-y-3.5 text-xs text-slate-700">
                    <div className="flex items-start gap-2.5">
                      <Stethoscope className="w-4 h-4 text-pink-600 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{currentService.title}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-pink-600" />
                      <span>{selectedDate} • {selectedTime}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-pink-600" />
                      <span>Clinic / MatraCare Clinic, East Legon</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-pink-600" />
                      <span>{patientName} ({phone})</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-pink-200/60 space-y-2">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Consultation Fee</span>
                    <span>GHC {currentService.price}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Platform Fee</span>
                    <span>GHC 0</span>
                  </div>
                  <div className="pt-2 border-t border-pink-200 flex justify-between font-bold text-slate-900 text-base">
                    <span>Total</span>
                    <span className="text-pink-600">GHC {currentService.price}</span>
                  </div>
                </div>
              </div>

              {/* Choose Payment Method */}
              <div className="md:col-span-6 space-y-4">
                <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">
                  Choose Payment Method
                </h3>

                {/* Mobile Money */}
                <div
                  onClick={() => setPaymentMethod('momo')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                    paymentMethod === 'momo'
                      ? 'border-pink-600 bg-pink-50/40 shadow-sm'
                      : 'border-slate-200 hover:border-pink-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                        MoMo
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">Mobile Money (MoMo)</h4>
                        <p className="text-[11px] text-slate-500">MTN, Telecel, AT Money</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'momo'}
                      onChange={() => setPaymentMethod('momo')}
                      className="accent-pink-600 w-4 h-4"
                    />
                  </div>

                  {paymentMethod === 'momo' && (
                    <div className="mt-3 pt-3 border-t border-pink-100 text-xs text-slate-600">
                      <p className="mb-1 text-[11px] font-semibold text-slate-500">Enter MoMo Wallet Number:</p>
                      <input
                        type="tel"
                        defaultValue={phone}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold"
                        placeholder="e.g. 024 123 4567"
                      />
                    </div>
                  )}
                </div>

                {/* Card */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                    paymentMethod === 'card'
                      ? 'border-pink-600 bg-pink-50/40 shadow-sm'
                      : 'border-slate-200 hover:border-pink-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">Credit/Debit Card</h4>
                        <p className="text-[11px] text-slate-500">Visa, Mastercard, Gh-Link</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="accent-pink-600 w-4 h-4"
                    />
                  </div>
                </div>

                {/* Bank Transfer */}
                <div
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                    paymentMethod === 'bank'
                      ? 'border-pink-600 bg-pink-50/40 shadow-sm'
                      : 'border-slate-200 hover:border-pink-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">Bank Transfer</h4>
                        <p className="text-[11px] text-slate-500">Direct Ghana Bank Account</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bank'}
                      onChange={() => setPaymentMethod('bank')}
                      className="accent-pink-600 w-4 h-4"
                    />
                  </div>
                </div>

                {bookingError && (
                  <p role="alert" className="mt-3 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {bookingError}
                  </p>
                )}

                {/* Pay Button */}
                <button
                  onClick={handleConfirmPayment}
                  disabled={isSubmitting}
                  className="w-full mt-4 py-3.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-pink-200 transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      <span>Pay GHC {currentService.price}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Secure and encrypted payment gateway</span>
                </div>
              </div>

            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center">
              <button
                onClick={handleBack}
                className="px-5 py-2.5 text-xs text-slate-600 font-medium hover:text-slate-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
          </div>
        )}

        {/* STEP 5 / CONFIRMATION (SCREEN 9) */}
        {step === 5 && confirmedBooking && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-pink-100 text-center max-w-xl mx-auto animate-in zoom-in-95 duration-300">
            {/* Green Check Badge */}
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <CheckCircle className="w-12 h-12" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif-title">
              Booking Confirmed!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Your appointment has been successfully booked.
            </p>

            {/* Confirmed Details Card */}
            <div className="bg-pink-50/50 rounded-2xl p-5 border border-pink-100 text-left my-6 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-pink-100">
                <span className="text-xs text-slate-500 font-semibold">Appointment ID:</span>
                <span className="text-xs font-bold font-mono text-pink-600 bg-pink-100/70 px-2 py-0.5 rounded">
                  {confirmedBooking.appointmentCode || confirmedBooking.id}
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <Stethoscope className="w-4 h-4 text-pink-600 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{confirmedBooking.serviceName}</h4>
                  <p className="text-xs text-slate-600">{confirmedBooking.date} • {confirmedBooking.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-600">
                <MapPin className="w-4 h-4 text-pink-600" />
                <span>{confirmedBooking.location}</span>
              </div>

              <p className="text-[11px] text-slate-500 pt-2 border-t border-pink-100">
                Confirmation SMS and email have been sent to <b>{confirmedBooking.phone}</b> and <b>{confirmedBooking.email}</b>.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  alert('Appointment saved to your calendar!');
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Add to Calendar</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate(session?.user?.role === 'staff' ? 'staff-dashboard' : 'patient-dashboard')}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer group"
              >
                <ArrowLeft className="w-4 h-4 text-slate-300 group-hover:-translate-x-0.5 transition-transform" />
                <span>Go to Dashboard</span>
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition"
              >
                Book Another
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
