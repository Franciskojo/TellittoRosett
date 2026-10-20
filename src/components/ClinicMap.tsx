'use client';

import React, { useState } from 'react';
import { 
  MapPin, Navigation, Car, Bus, ShieldCheck, Clock, Phone, 
  Copy, Check, ExternalLink, ZoomIn, ZoomOut, RotateCcw, 
  Layers, Compass, Stethoscope, AlertCircle
} from 'lucide-react';

export const ClinicMap: React.FC = () => {
  const [zoom, setZoom] = useState<number>(1);
  const [activeLayer, setActiveLayer] = useState<'roadmap' | 'transit' | 'directions'>('roadmap');
  const [directionTab, setDirectionTab] = useState<'car' | 'trotro' | 'emergency'>('car');
  const [copied, setCopied] = useState<boolean>(false);

  const clinicAddress = "Tell it to Rosett / MatraCare Clinic, 14 Lagos Avenue (off Boundary Road), East Legon, Accra, Ghana";
  const digitalAddress = "GA-342-8821";
  const googleMapsUrl = "https://www.google.com/maps/dir/?api=1&destination=5.6354,-0.1587&destination_place_id=ChIJ-ZqZ-EastLegon";
  const appleMapsUrl = "https://maps.apple.com/?daddr=5.6354,-0.1587&q=Tell+it+to+Rosett+Clinic+East+Legon";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${clinicAddress} (Digital Address: ${digitalAddress})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 1.75));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.9));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-pink-100 shadow-sm flex flex-col justify-between overflow-hidden">
      
      {/* Header Bar */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-slate-900 font-serif-title">Clinic Map & Directions</h3>
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Open Now
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              14 Lagos Avenue, East Legon • Digital Code: <span className="font-mono font-semibold text-slate-700">{digitalAddress}</span>
            </p>
          </div>

          {/* Layer switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveLayer('roadmap')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeLayer === 'roadmap' ? 'bg-white text-pink-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Road Map
            </button>
            <button
              onClick={() => setActiveLayer('transit')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeLayer === 'transit' ? 'bg-white text-pink-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Landmarks
            </button>
            <button
              onClick={() => setActiveLayer('directions')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeLayer === 'directions' ? 'bg-white text-pink-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Route Guide
            </button>
          </div>
        </div>

        {/* Map Canvas Container */}
        <div className="relative rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] bg-[#f8f9fa] border border-slate-200/80 shadow-inner group select-none">
          
          {/* Zoom & Reset Floating Controls */}
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-md">
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 1.75}
              className="p-1.5 rounded-lg text-slate-600 hover:text-pink-600 hover:bg-pink-50 disabled:opacity-40 transition cursor-pointer"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 0.9}
              className="p-1.5 rounded-lg text-slate-600 hover:text-pink-600 hover:bg-pink-50 disabled:opacity-40 transition cursor-pointer"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg text-slate-600 hover:text-pink-600 hover:bg-pink-50 transition cursor-pointer"
              title="Reset View"
              aria-label="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Compass / Scale Badge */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-200 shadow-xs text-[11px] font-semibold text-slate-600">
            <Compass className="w-3.5 h-3.5 text-pink-600 animate-spin-slow" />
            <span>East Legon, Accra</span>
            <span className="text-slate-300">|</span>
            <span className="font-mono text-[10px] text-slate-400">Scale: 500m</span>
          </div>

          {/* SVG Vector Map Canvas */}
          <div 
            className="w-full h-full transition-transform duration-300 ease-out origin-center"
            style={{ transform: `scale(${zoom})` }}
          >
            <svg
              viewBox="0 0 800 480"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background Grid & Land Area */}
              <rect width="800" height="480" fill="#F4F6F8" />
              <defs>
                <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E5E9EE" strokeWidth="0.8" />
                </pattern>
                <linearGradient id="routeGlow" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#db2777" />
                </linearGradient>
                <filter id="shadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
                </filter>
              </defs>
              <rect width="800" height="480" fill="url(#mapGrid)" />

              {/* Green Areas (Gardens & Residential Parks) */}
              <path
                d="M 40 60 Q 140 30 200 90 T 160 210 T 60 180 Z"
                fill="#DCFCE7"
                stroke="#BBF7D0"
                strokeWidth="1.5"
                opacity="0.85"
              />
              <text x="90" y="130" fill="#15803D" fontSize="11" fontWeight="600" opacity="0.8">
                Legon Green Belt
              </text>

              <path
                d="M 620 280 Q 720 260 760 320 T 680 430 T 590 360 Z"
                fill="#DCFCE7"
                stroke="#BBF7D0"
                strokeWidth="1.5"
                opacity="0.85"
              />
              <text x="640" y="350" fill="#15803D" fontSize="11" fontWeight="600" opacity="0.8">
                East Legon Park
              </text>

              {/* Water Stream / Lagoon Arm */}
              <path
                d="M 0 340 Q 180 320 280 370 T 480 440 L 480 480 L 0 480 Z"
                fill="#E0F2FE"
                stroke="#BAE6FD"
                strokeWidth="1.5"
                opacity="0.7"
              />
              <text x="70" y="380" fill="#0284C7" fontSize="11" fontWeight="500" opacity="0.8">
                Airport Valley Reserve
              </text>

              {/* Secondary Roads */}
              <g stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none">
                {/* Mensah Wood Street */}
                <path d="M 220 50 L 290 420" />
                {/* American House connector */}
                <path d="M 520 80 L 760 220" />
                {/* Shiashie link */}
                <path d="M 120 400 L 400 380" />
                {/* Garden Avenue */}
                <path d="M 280 180 L 650 180" />
                {/* Bawa Link */}
                <path d="M 380 100 L 380 450" />
              </g>

              {/* Secondary Road Inner Lines */}
              <g stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M 220 50 L 290 420" />
                <path d="M 520 80 L 760 220" />
                <path d="M 120 400 L 400 380" />
                <path d="M 280 180 L 650 180" />
                <path d="M 380 100 L 380 450" />
              </g>

              {/* Road Labels (Secondary) */}
              <text x="210" y="330" fill="#64748B" fontSize="10" fontWeight="600" transform="rotate(78 210,330)">
                Mensah Wood St
              </text>
              <text x="590" y="172" fill="#64748B" fontSize="10" fontWeight="600">
                Garden Avenue
              </text>

              {/* Major Highway: N1 / Accra - Tema Motorway (Top-Right to Bottom-Left) */}
              <g stroke="#F87171" strokeWidth="14" strokeLinecap="square" strokeLinejoin="round" fill="none" opacity="0.4">
                <path d="M 0 460 Q 240 430 420 370 T 800 120" />
              </g>
              <g stroke="#FCA5A5" strokeWidth="8" strokeLinecap="square" strokeLinejoin="round" fill="none">
                <path d="M 0 460 Q 240 430 420 370 T 800 120" />
              </g>
              <g stroke="#FFFFFF" strokeWidth="2" strokeDasharray="8 6" strokeLinecap="square" fill="none">
                <path d="M 0 460 Q 240 430 420 370 T 800 120" />
              </g>
              <text x="630" y="210" fill="#DC2626" fontSize="11" fontWeight="700">
                Accra - Tema Motorway (N1)
              </text>

              {/* Primary Arterial: Boundary Road (Horizontal spine) */}
              <g stroke="#FDE047" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M 60 260 L 740 260" />
              </g>
              <g stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M 60 260 L 740 260" />
              </g>
              <g stroke="#EAB308" strokeWidth="1.5" strokeDasharray="6 6" fill="none">
                <path d="M 60 260 L 740 260" />
              </g>
              <text x="130" y="254" fill="#854D0E" fontSize="12" fontWeight="700">
                BOUNDARY ROAD
              </text>

              {/* Primary Arterial: Lagos Avenue (Vertical spine - connects to Boundary Rd) */}
              <g stroke="#FDE047" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M 440 20 L 440 460" />
              </g>
              <g stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M 440 20 L 440 460" />
              </g>
              <g stroke="#EAB308" strokeWidth="2" strokeDasharray="8 6" fill="none">
                <path d="M 440 20 L 440 460" />
              </g>
              <text x="448" y="90" fill="#854D0E" fontSize="13" fontWeight="800" transform="rotate(90 448,90)">
                LAGOS AVENUE (East Legon Main)
              </text>

              {/* Active Route Overlay if in 'directions' mode */}
              {activeLayer === 'directions' && (
                <g>
                  {/* Glowing Route path from Tetteh Quarshie / Airport bypass to Clinic */}
                  <path
                    d="M 120 400 L 440 380 L 440 260"
                    fill="none"
                    stroke="url(#routeGlow)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#shadow)"
                  />
                  <path
                    d="M 120 400 L 440 380 L 440 260"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Start Point Pin */}
                  <circle cx="120" cy="400" r="8" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="3" />
                  <rect x="70" y="415" width="105" height="22" rx="6" fill="#1E293B" />
                  <text x="122" y="430" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">
                    From Airport / N1
                  </text>
                </g>
              )}

              {/* Landmarks (Visible on all or 'transit' mode) */}
              {(activeLayer === 'transit' || activeLayer === 'roadmap' || activeLayer === 'directions') && (
                <g>
                  {/* Landmark 1: A&C Mall */}
                  <g transform="translate(620, 230)">
                    <rect x="0" y="0" width="110" height="28" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" filter="url(#shadow)" />
                    <circle cx="14" cy="14" r="6" fill="#F59E0B" />
                    <text x="26" y="18" fill="#1E293B" fontSize="10" fontWeight="bold">
                      A&C Mall (4m)
                    </text>
                  </g>

                  {/* Landmark 2: East Legon Police Station */}
                  <g transform="translate(280, 220)">
                    <rect x="0" y="0" width="125" height="28" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" filter="url(#shadow)" />
                    <circle cx="14" cy="14" r="6" fill="#3B82F6" />
                    <text x="26" y="18" fill="#1E293B" fontSize="10" fontWeight="bold">
                      East Legon Police (3m)
                    </text>
                  </g>

                  {/* Landmark 3: Kotoka Airport Indicator */}
                  <g transform="translate(80, 435)">
                    <rect x="0" y="0" width="130" height="28" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" filter="url(#shadow)" />
                    <circle cx="14" cy="14" r="6" fill="#0EA5E9" />
                    <text x="26" y="18" fill="#1E293B" fontSize="10" fontWeight="bold">
                      Kotoka Airport (12m)
                    </text>
                  </g>

                  {/* Trotro Stop Indicator */}
                  {activeLayer === 'transit' && (
                    <g transform="translate(455, 340)">
                      <circle cx="0" cy="0" r="10" fill="#10B981" stroke="#FFFFFF" strokeWidth="2.5" />
                      <rect x="15" y="-12" width="115" height="24" rx="6" fill="#FFFFFF" stroke="#10B981" strokeWidth="1" />
                      <text x="22" y="4" fill="#065F46" fontSize="10" fontWeight="bold">
                        Trotro: Lagos Ave Junc.
                      </text>
                    </g>
                  )}
                </g>
              )}

              {/* ========================================================= */}
              {/* MAIN CLINIC LOCATION PIN (Tell it to Rosett / MatraCare)  */}
              {/* Positioned at Lagos Avenue / Boundary Road intersection   */}
              {/* ========================================================= */}
              <g transform="translate(440, 260)">
                {/* Outer Radiating Pulse Waves */}
                <circle cx="0" cy="0" r="32" fill="#F43F5E" opacity="0.2" className="animate-ping" />
                <circle cx="0" cy="0" r="22" fill="#F43F5E" opacity="0.35" />
                <circle cx="0" cy="0" r="14" fill="#BE185D" stroke="#FFFFFF" strokeWidth="3" filter="url(#shadow)" />

                {/* Heart / Medical Cross in Center */}
                <path
                  d="M -4 -1 L -1 -1 L -1 -4 L 1 -4 L 1 -1 L 4 -1 L 4 1 L 1 1 L 1 4 L -1 4 L -1 1 L -4 1 Z"
                  fill="#FFFFFF"
                />

                {/* Popover Callout Badge */}
                <g transform="translate(-110, -75)">
                  <rect
                    width="220"
                    height="64"
                    rx="14"
                    fill="#FFFFFF"
                    stroke="#F43F5E"
                    strokeWidth="2"
                    filter="url(#shadow)"
                  />
                  {/* Tail indicator pointing to pin */}
                  <polygon points="102,64 118,64 110,74" fill="#FFFFFF" stroke="#F43F5E" strokeWidth="2" />
                  <polygon points="103,63 117,63 110,72" fill="#FFFFFF" />

                  {/* Callout Content */}
                  <circle cx="24" cy="24" r="12" fill="#FFF1F2" />
                  <text x="24" y="28" fill="#E11D48" fontSize="12" fontWeight="bold" textAnchor="middle">
                    ♥
                  </text>
                  <text x="44" y="22" fill="#0F172A" fontSize="12" fontWeight="800">
                    Tell it to Rosett Clinic
                  </text>
                  <text x="44" y="37" fill="#64748B" fontSize="10" fontWeight="600">
                    14 Lagos Ave • MatraCare Centre
                  </text>
                  <rect x="44" y="44" width="135" height="14" rx="4" fill="#ECFDF5" />
                  <text x="48" y="54" fill="#047857" fontSize="9" fontWeight="bold">
                    ✓ 24/7 Maternity Emergency Gate
                  </text>
                </g>
              </g>
            </svg>
          </div>

          {/* Bottom interactive map bar */}
          <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-200/90 shadow-sm text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-600 animate-ping"></span>
              <span className="font-bold text-slate-800">MatraCare / Tell it to Rosett Clinic</span>
              <span className="hidden sm:inline text-slate-400">•</span>
              <span className="hidden sm:inline text-slate-500 font-medium">Free on-site parking</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-bold text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100/80 px-2.5 py-1 rounded-lg transition"
              >
                <span>Navigate</span>
                <Navigation className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* External Map & Quick Action Navigation Row */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-xs transition"
          >
            <span>Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <a
            href={appleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
          >
            <span>Apple Maps</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <button
            type="button"
            onClick={handleCopyAddress}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 rounded-xl font-bold transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-pink-600" />}
            <span>{copied ? 'Address Copied!' : 'Copy Address'}</span>
          </button>
        </div>

        <a
          href="tel:+233245514567"
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-pink-600 font-semibold py-1.5"
        >
          <Phone className="w-3.5 h-3.5 text-pink-600" />
          <span>Call: +233 24 551 4567</span>
        </a>
      </div>

      {/* Turn-by-Turn Transport & Arrival Guide Accordion/Tabs */}
      <div className="mt-5 bg-pink-50/40 rounded-2xl p-4 border border-pink-100">
        <div className="flex items-center gap-2 pb-3 border-b border-pink-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">How to Reach Us:</span>
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setDirectionTab('car')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                directionTab === 'car' ? 'bg-pink-600 text-white' : 'text-slate-600 hover:bg-white'
              }`}
            >
              <Car className="w-3 h-3" />
              <span>Drive / Uber</span>
            </button>
            <button
              onClick={() => setDirectionTab('trotro')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                directionTab === 'trotro' ? 'bg-pink-600 text-white' : 'text-slate-600 hover:bg-white'
              }`}
            >
              <Bus className="w-3 h-3" />
              <span>Public Transit</span>
            </button>
            <button
              onClick={() => setDirectionTab('emergency')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                directionTab === 'emergency' ? 'bg-pink-600 text-white' : 'text-slate-600 hover:bg-white'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Emergency Entry</span>
            </button>
          </div>
        </div>

        <div className="pt-3 text-xs text-slate-600 leading-relaxed">
          {directionTab === 'car' && (
            <div className="space-y-1.5">
              <p>
                <b>From Accra Mall / Liberation Road:</b> Head north on Tetteh Quarshie Interchange onto Lagos Avenue into East Legon. Continue straight for 1.2km. Clinic is on your right at the Boundary Road intersection, opposite the green plaza.
              </p>
              <p className="text-[11px] text-slate-500">
                • Uber / Bolt destination tag: <b>&quot;MatraCare Clinic East Legon&quot;</b> or <b>&quot;Tell it to Rosett Maternity&quot;</b>
              </p>
            </div>
          )}

          {directionTab === 'trotro' && (
            <div className="space-y-1.5">
              <p>
                <b>From 37 Military Hospital or Madina:</b> Board any trotro bound for <i>American House / East Legon</i>. Request to alight at <b>Lagos Avenue Junction</b> or <b>Boundary Road</b>.
              </p>
              <p className="text-[11px] text-slate-500">
                • Walking distance: 2 minutes south along the paved pedestrian walkway.
              </p>
            </div>
          )}

          {directionTab === 'emergency' && (
            <div className="space-y-1.5 bg-rose-50/70 p-2.5 rounded-xl border border-rose-200">
              <div className="flex items-center gap-1.5 font-bold text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>24/7 Maternity Emergency Triage</span>
              </div>
              <p className="text-rose-900 text-[11px]">
                Patients in active labour or experiencing acute obstetrical concerns should use <b>Gate 1 (Emergency Ramp)</b>. Security guards and triage nurses are on station 24/7. Call our on-duty midwife at <b>+233 24 551 4567</b> before arrival.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
