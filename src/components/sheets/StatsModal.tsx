import React from 'react';
import { DocumentStats } from '../../types/document';
import { BarChart3, Clock, FileText, AlignLeft, BookOpen, X } from 'lucide-react';

interface StatsModalProps {
  stats: DocumentStats;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 border border-slate-100">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-800 text-base">Document Statistics</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5 mb-5">
          <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
            <span className="text-xs text-slate-600 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" /> Words
            </span>
            <span className="text-sm font-bold text-slate-800 font-mono">{stats.words.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
            <span className="text-xs text-slate-600 flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-slate-400" /> Characters (with spaces)
            </span>
            <span className="text-sm font-bold text-slate-800 font-mono">{stats.characters.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
            <span className="text-xs text-slate-600 flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-slate-400" /> Characters (no spaces)
            </span>
            <span className="text-sm font-bold text-slate-800 font-mono">{stats.charactersWithoutSpaces.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
            <span className="text-xs text-slate-600 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-400" /> Paragraphs
            </span>
            <span className="text-sm font-bold text-slate-800 font-mono">{stats.paragraphs}</span>
          </div>

          <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
            <span className="text-xs text-slate-600 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" /> Estimated Reading Time
            </span>
            <span className="text-sm font-bold text-indigo-600 font-mono">
              ~{Math.max(1, Math.round(stats.readingTimeMinutes))} min
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
};
