import React, { useState } from 'react';
import { Search, Replace, ChevronDown, ChevronUp, X, Check } from 'lucide-react';

interface FindReplaceModalProps {
  onClose: () => void;
}

export const FindReplaceModal: React.FC<FindReplaceModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const performSearch = (term: string) => {
    if (!term) {
      setMatchCount(null);
      return;
    }
    const editor = document.querySelector('.editable-content');
    if (!editor) return;

    const text = editor.textContent || '';
    const flags = matchCase ? 'g' : 'gi';
    try {
      const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
      const matches = text.match(regex);
      setMatchCount(matches ? matches.length : 0);
      setCurrentIndex(matches && matches.length > 0 ? 1 : 0);
    } catch {
      setMatchCount(0);
    }
  };

  const handleNext = () => {
    if (window.find) {
      window.find(searchTerm, matchCase, false, true, false, false, false);
      if (matchCount && matchCount > 0) {
        setCurrentIndex((prev) => (prev % matchCount) + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (window.find) {
      window.find(searchTerm, matchCase, true, true, false, false, false);
      if (matchCount && matchCount > 0) {
        setCurrentIndex((prev) => (prev === 1 ? matchCount : prev - 1));
      }
    }
  };

  const handleReplace = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      document.execCommand('insertText', false, replaceTerm);
      handleNext();
    } else {
      handleNext();
    }
  };

  const handleReplaceAll = () => {
    const editor = document.querySelector('.editable-content');
    if (!editor || !searchTerm) return;

    const flags = matchCase ? 'g' : 'gi';
    const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    editor.innerHTML = editor.innerHTML.replace(regex, replaceTerm);
    performSearch(searchTerm);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-5 border border-slate-100">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Search className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-800 text-sm">Find & Replace</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Find Input */}
        <div className="space-y-3 mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Find in document..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                performSearch(e.target.value);
              }}
              className="w-full px-3 py-2 pr-20 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {matchCount !== null && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-medium px-1.5 py-0.5 bg-slate-200 rounded text-slate-600">
                {matchCount === 0 ? 'No match' : `${currentIndex}/${matchCount}`}
              </span>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Replace with..."
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={matchCase}
              onChange={(e) => {
                setMatchCase(e.target.checked);
                performSearch(searchTerm);
              }}
              className="w-3.5 h-3.5 text-blue-600 rounded"
            />
            Match case sensitive
          </label>
        </div>

        {/* Navigation & Replace Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={handlePrevious}
            disabled={!searchTerm}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium flex items-center justify-center gap-1 disabled:opacity-40"
          >
            <ChevronUp className="w-3.5 h-3.5" /> Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!searchTerm}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium flex items-center justify-center gap-1 disabled:opacity-40"
          >
            <ChevronDown className="w-3.5 h-3.5" /> Next
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleReplace}
            disabled={!searchTerm}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold disabled:opacity-40"
          >
            Replace
          </button>
          <button
            onClick={handleReplaceAll}
            disabled={!searchTerm}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold disabled:opacity-40"
          >
            Replace All
          </button>
        </div>
      </div>
    </div>
  );
};
