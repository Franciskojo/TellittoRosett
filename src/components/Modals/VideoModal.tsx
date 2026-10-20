'use client';

import React from 'react';
import { MediaItem } from '@/types';
import { X, Play, Tv, Calendar, Clock, Share2 } from 'lucide-react';

interface VideoModalProps {
  item: MediaItem | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl relative text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-black/60 hover:bg-pink-600 rounded-full flex items-center justify-center text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Player Mockup / Stream */}
        <div className="relative aspect-video bg-black flex items-center justify-center group overflow-hidden">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
          
          <div className="absolute flex flex-col items-center text-center px-6">
            <div className="w-16 h-16 rounded-full bg-pink-600/90 text-white flex items-center justify-center shadow-lg shadow-pink-600/50 group-hover:scale-110 transition cursor-pointer mb-3">
              <Play className="w-7 h-7 fill-white translate-x-0.5" />
            </div>
            <span className="text-xs tracking-wider uppercase bg-black/60 px-3 py-1 rounded-full text-pink-300 font-semibold border border-pink-500/30">
              Broadcasting Live via {item.station}
            </span>
          </div>

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5"><Tv className="w-4 h-4 text-pink-400" /> {item.station}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-pink-400" /> {item.duration}</span>
          </div>
        </div>

        {/* Video Info Body */}
        <div className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs text-pink-400 font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Broadcast Date: {item.date}</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            {item.title}
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {item.description}
          </p>
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Speaker: Rosetta Ntriwaah Boakye (Registered Midwife)</span>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: item.title, text: item.description, url: window.location.href });
                } else {
                  alert('Link copied to clipboard!');
                }
              }}
              className="flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300"
            >
              <Share2 className="w-4 h-4" /> Share Episode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
