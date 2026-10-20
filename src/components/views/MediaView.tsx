'use client';

import React, { useState } from 'react';
import { MediaItem } from '@/types';
import { INITIAL_MEDIA } from '@/lib/initialData';
import { Play, Tv, Radio, Mic, Calendar, Clock, ExternalLink } from 'lucide-react';

interface MediaViewProps {
  onPlayVideo: (item: MediaItem) => void;
}

export const MediaView: React.FC<MediaViewProps> = ({ onPlayVideo }) => {
  const [activeTab, setActiveTab] = useState<'tv' | 'radio' | 'event'>('tv');

  const filteredMedia = INITIAL_MEDIA.filter(item => {
    if (activeTab === 'tv') return item.type === 'tv';
    if (activeTab === 'radio') return item.type === 'radio' || item.type === 'tv';
    return item.type === 'event' || item.type === 'tv';
  });

  return (
    <div className="w-full bg-[#FCF8FA] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-3.5 py-1 rounded-full border border-pink-100">
            Broadcasting & Advocacy
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-serif-title">
            In the Media
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Watch my TV interviews, listen to radio discussions and explore recent public engagements.
          </p>
        </div>

        {/* Media Filter Tabs (Matches Screen 4) */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 rounded-2xl bg-white border border-pink-100 shadow-sm">
            <button
              onClick={() => setActiveTab('tv')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === 'tv'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-pink-600'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>TV Appearances</span>
            </button>

            <button
              onClick={() => setActiveTab('radio')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === 'radio'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-pink-600'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Radio Interviews</span>
            </button>

            <button
              onClick={() => setActiveTab('event')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === 'event'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-pink-600'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Events & Talks</span>
            </button>
          </div>
        </div>

        {/* Media Video Cards Grid (Matches GTV, Joy News, Adom TV in Screen 4) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => onPlayVideo(item)}
              className="bg-white rounded-2xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-xl transition duration-300 group cursor-pointer flex flex-col"
            >
              {/* Thumbnail Container with Play Overlay */}
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Play Button Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-pink-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-pink-600 transition">
                    <Play className="w-5 h-5 fill-white translate-x-0.5" />
                  </div>
                </div>

                {/* Duration Tag */}
                <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3 text-pink-400" />
                  <span>{item.duration}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span className="font-bold text-pink-600 uppercase tracking-wide">
                      {item.station}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> {item.date}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-pink-600 transition line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-pink-600 font-semibold">
                  <span>Watch Broadcast</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Videos Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => alert('Loading additional archive broadcasts...')}
            className="px-8 py-3 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white text-sm font-bold rounded-full shadow-md hover:shadow-lg transition"
          >
            View More Videos →
          </button>
        </div>

      </div>
    </div>
  );
};
