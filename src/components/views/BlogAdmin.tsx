'use client';

import React, { useState, useMemo } from 'react';
import { ActiveView, Article, Appointment } from '@/types';
import { StaffSidebar } from '@/components/StaffSidebar';
import { 
  FileText, Plus, Edit2, Trash2, CheckCircle, Clock, Eye, 
  Search, Filter
} from 'lucide-react';

import { Session } from 'next-auth';

interface BlogAdminProps {
  articles: Article[];
  appointments?: Appointment[];
  onNavigate: (view: ActiveView, extraParam?: string) => void;
  onOpenNewArticleModal: () => void;
  onDeleteArticle: (id: string) => void;
  onPreviewArticle: (art: Article) => void;
  onLogout?: () => void;
  session?: Session | null;
}

export const BlogAdmin: React.FC<BlogAdminProps> = ({
  articles,
  appointments = [],
  onNavigate,
  onOpenNewArticleModal,
  onDeleteArticle,
  onPreviewArticle,
  onLogout,
  session,
}) => {
  const [filterTab, setFilterTab] = useState<'All' | 'Published' | 'Draft' | 'Scheduled'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const filteredArticles = articles.filter(art => {
    const matchesTab = filterTab === 'All' || art.status === filterTab;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const publishedCount = articles.filter(a => a.status === 'Published').length;
  const draftCount = articles.filter(a => a.status === 'Draft').length;
  const scheduledCount = articles.filter(a => a.status === 'Scheduled').length;

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
            currentView="blog-admin"
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

          {/* Main Blog CMS Content Area */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Header with "+ New Article" button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 font-serif-title">
                  Blog / Health Resources CMS
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Create and manage maternal tips, videos, and educational resources.
                </p>
              </div>

              <button
                onClick={onOpenNewArticleModal}
                className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-full text-xs font-bold shadow-md shadow-pink-200 transition flex items-center gap-2 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ New Article</span>
              </button>
            </div>

            {/* Filter Tabs & Search Bar (Matches Screen 13) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-pink-100 shadow-sm">
              
              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setFilterTab('All')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                    filterTab === 'All'
                      ? 'bg-pink-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-pink-50'
                  }`}
                >
                  All ({articles.length})
                </button>
                <button
                  onClick={() => setFilterTab('Published')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                    filterTab === 'Published'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
                  }`}
                >
                  Published ({publishedCount})
                </button>
                <button
                  onClick={() => setFilterTab('Draft')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                    filterTab === 'Draft'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-amber-50'
                  }`}
                >
                  Drafts ({draftCount})
                </button>
                <button
                  onClick={() => setFilterTab('Scheduled')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                    filterTab === 'Scheduled'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-blue-50'
                  }`}
                >
                  Scheduled ({scheduledCount})
                </button>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

            </div>

            {/* Articles Table (Matches Screen 13) */}
            <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-pink-50/50 text-slate-600 font-bold uppercase tracking-wider border-y border-pink-100">
                    <tr>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredArticles.map((art) => (
                      <tr key={art.id} className="hover:bg-pink-50/30 transition">
                        <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                          <button
                            onClick={() => onPreviewArticle(art)}
                            className="hover:text-pink-600 text-left truncate block"
                          >
                            {art.title}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {art.category}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              art.status === 'Published'
                                ? 'bg-emerald-100 text-emerald-800'
                                : art.status === 'Draft'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {art.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{art.date}</td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => onPreviewArticle(art)}
                            className="text-pink-600 font-bold hover:underline px-2 py-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${art.title}"?`)) {
                                onDeleteArticle(art.id);
                              }
                            }}
                            className="text-rose-500 hover:text-rose-700 px-1 py-1"
                          >
                            <Trash2 className="w-3.5 h-3.5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
