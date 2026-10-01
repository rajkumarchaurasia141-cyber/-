import React, { useState } from 'react';
import { DocumentData, DocumentTemplate } from '../types/document';
import { DOCUMENT_TEMPLATES } from '../constants/templates';
import {
  FileText,
  Plus,
  Search,
  Settings,
  MoreVertical,
  Clock,
  Sparkles,
  GraduationCap,
  BookOpen,
  Mail,
  UserCheck,
  TrendingUp,
  FolderOpen,
  Copy,
  Trash2,
  Download,
  Share2,
  Edit2,
  ExternalLink,
  Columns,
} from 'lucide-react';
import { exportAsPdf, exportAsDocx, exportAsTxt } from '../services/export';
import confetti from 'canvas-confetti';

interface DashboardProps {
  documents: DocumentData[];
  onOpenDocument: (doc: DocumentData) => void;
  onCreateNew: (templateId?: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onOpenSettings: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  documents,
  onOpenDocument,
  onCreateNew,
  onDuplicate,
  onDelete,
  onRename,
  onOpenSettings,
}) => {
  const [search, setSearch] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [renamingDoc, setRenamingDoc] = useState<{ id: string; title: string } | null>(null);

  // Template icon resolver
  const getTemplateIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-teal-600" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'Mail':
        return <Mail className="w-5 h-5 text-rose-500" />;
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-sky-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-indigo-600" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  const filteredDocs = documents.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleStartRename = (doc: DocumentData, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setRenamingDoc({ id: doc.id, title: doc.title });
  };

  const handleSaveRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (renamingDoc && renamingDoc.title.trim()) {
      onRename(renamingDoc.id, renamingDoc.title.trim());
      setRenamingDoc(null);
    }
  };

  const handleShare = async (doc: DocumentData, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    if (navigator.share) {
      try {
        await navigator.share({
          title: doc.title,
          text: `Check out this document "${doc.title}" created in DocMaster`,
        });
      } catch {
        // user cancelled
      }
    } else {
      alert(`Sharing "${doc.title}" link copied!`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Dashboard Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 leading-none">
                DocMaster
              </h1>
              <span className="text-[10px] text-blue-600 font-semibold tracking-wide uppercase">
                Mobile Office Suite
              </span>
            </div>
          </div>

          {/* Search & Settings */}
          <div className="flex items-center gap-2 flex-1 max-w-xs justify-end">
            <div className="relative w-full hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-100 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl text-xs text-slate-700 outline-none transition-all"
              />
            </div>

            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-2 relative sm:hidden">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-100 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs text-slate-700 outline-none"
          />
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full px-4 py-6 flex-1 flex flex-col gap-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-blue-900/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold">
              Mobile-First Architecture
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-2">Create. Edit. Format. Anywhere.</h2>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-lg">
              Full MS Word-style power optimized for your phone: 1 to 5 dynamic columns, 20 typefaces, tables, and instant PDF/DOCX export.
            </p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onCreateNew('blank');
                confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
              }}
              className="flex-1 sm:flex-none py-2.5 px-4 bg-white hover:bg-blue-50 text-blue-700 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 text-blue-700" />
              New Document
            </button>
          </div>
        </div>

        {/* Template Gallery */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Start from Template
            </h3>
            <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">
              {DOCUMENT_TEMPLATES.length} templates
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {DOCUMENT_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => onCreateNew(tmpl.id)}
                className="p-3.5 bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-400 rounded-2xl text-left transition-all group flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-white flex items-center justify-center mb-2.5 border border-slate-100 group-hover:scale-105 transition-all">
                    {getTemplateIcon(tmpl.icon)}
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{tmpl.title}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                    {tmpl.description}
                  </p>
                </div>

                {tmpl.columnSettings && (tmpl.columnSettings.count || 1) > 1 && (
                  <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center gap-1 text-[9px] font-bold text-blue-600">
                    <Columns className="w-3 h-3" />
                    <span>{tmpl.columnSettings.count} Columns</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Recent Documents */}
        <section className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Recent Documents ({filteredDocs.length})
            </h3>
          </div>

          {filteredDocs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center flex flex-col items-center justify-center flex-1 my-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <FolderOpen className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-700">No documents found</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                {search ? `No results matching "${search}"` : 'Create your first document to get started.'}
              </p>
              <button
                onClick={() => onCreateNew('blank')}
                className="mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
              >
                + Create Blank Document
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredDocs.map((doc) => {
                const updatedDate = new Date(doc.updatedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={doc.id}
                    onClick={() => onOpenDocument(doc)}
                    className="p-4 bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-blue-400 rounded-2xl cursor-pointer transition-all shadow-xs hover:shadow-md relative group flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Row: Icon, Title, More Menu */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                              {doc.title}
                            </h4>
                            <span className="text-[10px] text-slate-400">{updatedDate}</span>
                          </div>
                        </div>

                        {/* More Menu Trigger */}
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() =>
                              setActiveMenuId(activeMenuId === doc.id ? null : doc.id)
                            }
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            aria-label="Document options"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeMenuId === doc.id && (
                            <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-30 text-xs">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(null);
                                  onOpenDocument(doc);
                                }}
                                className="w-full px-3 py-2 flex items-center gap-2 text-slate-700 hover:bg-slate-50 text-left"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-blue-600" /> Open
                              </button>
                              <button
                                onClick={(e) => handleStartRename(doc, e)}
                                className="w-full px-3 py-2 flex items-center gap-2 text-slate-700 hover:bg-slate-50 text-left"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-slate-500" /> Rename
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(null);
                                  onDuplicate(doc.id);
                                }}
                                className="w-full px-3 py-2 flex items-center gap-2 text-slate-700 hover:bg-slate-50 text-left"
                              >
                                <Copy className="w-3.5 h-3.5 text-slate-500" /> Duplicate
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(null);
                                  exportAsDocx(doc);
                                }}
                                className="w-full px-3 py-2 flex items-center gap-2 text-slate-700 hover:bg-slate-50 text-left"
                              >
                                <Download className="w-3.5 h-3.5 text-blue-600" /> Export Word
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(null);
                                  exportAsPdf(doc);
                                }}
                                className="w-full px-3 py-2 flex items-center gap-2 text-slate-700 hover:bg-slate-50 text-left"
                              >
                                <Download className="w-3.5 h-3.5 text-red-600" /> Export PDF
                              </button>
                              <button
                                onClick={(e) => handleShare(doc, e)}
                                className="w-full px-3 py-2 flex items-center gap-2 text-slate-700 hover:bg-slate-50 text-left"
                              >
                                <Share2 className="w-3.5 h-3.5 text-emerald-600" /> Share
                              </button>
                              <div className="border-t border-slate-100 my-1" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(null);
                                  if (confirm(`Delete "${doc.title}"?`)) {
                                    onDelete(doc.id);
                                  }
                                }}
                                className="w-full px-3 py-2 flex items-center gap-2 text-red-600 hover:bg-red-50 text-left"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Metadata Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-2">
                        <span>{doc.wordCount.toLocaleString()} words</span>
                        <span>•</span>
                        <span>{doc.pageCount || 1} {doc.pageCount === 1 ? 'page' : 'pages'}</span>
                      </div>

                      {doc.columnSettings.count > 1 && (
                        <span className="font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[10px]">
                          {doc.columnSettings.count} Cols
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Rename Document Dialog */}
      {renamingDoc && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveRename}
            className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-slate-100"
          >
            <h3 className="text-sm font-bold text-slate-800 mb-2">Rename Document</h3>
            <input
              autoFocus
              type="text"
              value={renamingDoc.title}
              onChange={(e) => setRenamingDoc({ ...renamingDoc, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 mb-4"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRenamingDoc(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
