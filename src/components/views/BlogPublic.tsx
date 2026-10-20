'use client';

import React, { useState } from 'react';
import { ActiveView, Article } from '@/types';
import { Search, Calendar, Clock, User, ArrowRight, BookOpen, ChevronRight } from 'lucide-react';

interface BlogPublicProps {
  articles: Article[];
  onReadArticle: (art: Article) => void;
  onNavigate: (view: ActiveView) => void;
}

export const BlogPublic: React.FC<BlogPublicProps> = ({
  articles,
  onReadArticle,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Pregnancy',
    'Newborn Care',
    'Family Planning',
    'Women\'s Health',
    'Nutrition'
  ];

  const filteredArticles = articles.filter(art => {
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && art.status !== 'Draft';
  });

  return (
    <div className="w-full bg-[#FCF8FA] py-12 lg:py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-3.5 py-1 rounded-full border border-pink-100">
            Educational Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-serif-title">
            Health Tips & Resources
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Reliable information for a healthier you, your baby, and your family.
          </p>
        </div>

        {/* Search Bar (Matches Screen 14) */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search health articles, keywords, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-full border border-pink-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
            />
          </div>
        </div>

        {/* Category Pills (Matches Screen 14: All, Pregnancy, Newborn Care, Family Planning, Women's Health, Nutrition) */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition shadow-sm ${
                  isActive
                    ? 'bg-pink-600 text-white shadow-pink-200 ring-2 ring-pink-200'
                    : 'bg-white text-slate-700 border border-pink-100 hover:bg-pink-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Articles Grid (Matches Screen 14: 10 Tips for a Healthy Pregnancy, Newborn Care Essentials, Understanding Family Planning...) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => onReadArticle(article)}
              className="bg-white rounded-2xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-xl transition duration-300 group cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Cover Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-pink-100">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-pink-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {article.category}
                  </div>
                </div>

                {/* Article Info */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                    <span className="flex items-center gap-1 font-medium text-pink-600">
                      <Calendar className="w-3 h-3" /> {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {article.readTime}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 group-hover:text-pink-600 transition leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-pink-600 font-bold">
                  <span>Read Full Guide</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Articles Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-8 py-3 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white text-sm font-bold rounded-full shadow-md transition"
          >
            View All Articles →
          </button>
        </div>

      </div>
    </div>
  );
};
