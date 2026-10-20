'use client';

import React from 'react';
import Image from 'next/image';
import { Article } from '@/types';
import { X, Calendar, Clock, User, Bookmark, Share2 } from 'lucide-react';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white max-w-3xl w-full rounded-2xl shadow-2xl overflow-hidden my-8 relative border border-pink-100 flex flex-col max-h-[90vh]">
        {/* Header Image */}
        <div className="relative h-64 sm:h-72 w-full shrink-0">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 bg-black/50 hover:bg-pink-600 rounded-full flex items-center justify-center text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="px-3 py-1 bg-pink-600 text-white rounded-full text-xs font-semibold uppercase tracking-wider">
              {article.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2 font-serif-title leading-tight">
              {article.title}
            </h2>
          </div>
        </div>

        {/* Meta Bar */}
        <div className="px-6 py-3 bg-pink-50/50 border-b border-pink-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <User className="w-3.5 h-3.5 text-pink-600" /> {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-pink-500" /> {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-pink-500" /> {article.readTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:text-pink-600 text-slate-400">
              <Bookmark className="w-4 h-4" />
            </button>
            <button 
              onClick={() => alert('Link copied to share!')}
              className="p-1.5 hover:text-pink-600 text-slate-400"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
          <p className="text-lg font-medium text-slate-800 border-l-4 border-pink-500 pl-4 italic bg-pink-50/30 py-2 rounded-r-lg">
            {article.excerpt}
          </p>

          <div className="prose max-w-none pt-4 whitespace-pre-line text-slate-700">
            {article.content}
          </div>

          <div className="mt-8 p-5 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-100 flex items-center gap-4">
            <Image
              src="/images/rosetta.jpg"
              alt="Rosetta"
              width={56}
              height={56}
              className="w-14 h-14 rounded-full object-cover border-2 border-pink-400 shrink-0"
            />
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Advice from Midwife Rosetta</h4>
              <p className="text-xs text-slate-600">
                Every pregnancy is unique. If you experience unusual symptoms or have questions, please reach out for personalized care.
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
          >
            Close Article
          </button>
        </div>
      </div>
    </div>
  );
};
