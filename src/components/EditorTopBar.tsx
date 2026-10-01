import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  MoreVertical,
  Printer,
  Download,
  FileSpreadsheet,
  Search,
  BarChart3,
  Settings,
  Maximize2,
  Minimize2,
  ZoomIn,
  Check,
} from 'lucide-react';
import { executeCommand } from '../utils/editorCommands';
import { ActiveSheet } from '../../types/document';

interface EditorTopBarProps {
  title: string;
  onUpdateTitle: (newTitle: string) => void;
  saveStatus: 'saving' | 'saved' | 'saved_just_now';
  onBack: () => void;
  onOpenSheet: (sheet: ActiveSheet) => void;
  onPrint: () => void;
  onExport: (type: 'pdf' | 'docx' | 'txt' | 'html') => void;
  zoom: number;
  onZoomChange: (val: number) => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
}

export const EditorTopBar: React.FC<EditorTopBarProps> = ({
  title,
  onUpdateTitle,
  saveStatus,
  onBack,
  onOpenSheet,
  onPrint,
  onExport,
  zoom,
  onZoomChange,
  isFocusMode,
  onToggleFocusMode,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempTitle(title);
  }, [title]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMoreMenu]);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (tempTitle.trim()) {
      onUpdateTitle(tempTitle.trim());
    } else {
      setTempTitle(title);
    }
  };

  const zoomOptions = [50, 75, 90, 100, 125, 150, 200];

  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 px-3 py-2 flex items-center justify-between shadow-xs">
      {/* Left: Back & Title */}
      <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
        <button
          onClick={onBack}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          {isEditingTitle ? (
            <input
              autoFocus
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              className="font-bold text-sm text-slate-900 bg-blue-50/50 border border-blue-400 rounded px-1.5 py-0.5 outline-none"
            />
          ) : (
            <div
              onClick={() => setIsEditingTitle(true)}
              className="font-bold text-sm text-slate-900 truncate cursor-pointer hover:bg-slate-50 px-1 rounded transition-colors"
              title="Click to rename"
            >
              {title}
            </div>
          )}

          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                saveStatus === 'saving'
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-emerald-500'
              }`}
            />
            <span>
              {saveStatus === 'saving'
                ? 'Saving...'
                : saveStatus === 'saved_just_now'
                ? 'Saved just now'
                : 'Saved'}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Undo */}
        <button
          onClick={() => executeCommand('undo')}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        {/* Redo */}
        <button
          onClick={() => executeCommand('redo')}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        {/* Zoom Selector (Hidden on tiny screens) */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-100 rounded-lg px-1.5 py-1 text-xs">
          <ZoomIn className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={zoom}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            {zoomOptions.map((z) => (
              <option key={z} value={z}>
                {z}%
              </option>
            ))}
          </select>
        </div>

        {/* Focus Mode Toggle */}
        <button
          onClick={onToggleFocusMode}
          className={`p-2 rounded-lg transition-colors hidden sm:flex ${
            isFocusMode
              ? 'bg-blue-100 text-blue-700'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title={isFocusMode ? 'Exit Focus Mode' : 'Focus Mode'}
        >
          {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* More Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMoreMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs">
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onPrint();
                }}
                className="w-full px-4 py-2.5 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Printer className="w-4 h-4 text-slate-500" /> Print
              </button>

              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onExport('pdf');
                }}
                className="w-full px-4 py-2.5 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Download className="w-4 h-4 text-red-500" /> Export PDF
              </button>

              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onExport('docx');
                }}
                className="w-full px-4 py-2.5 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Download className="w-4 h-4 text-blue-500" /> Export Word (DOCX)
              </button>

              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onExport('txt');
                }}
                className="w-full px-4 py-2.5 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Download className="w-4 h-4 text-slate-500" /> Export Plain Text
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onOpenSheet('pageSetup');
                }}
                className="w-full px-4 py-2.5 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-slate-500" /> Page Setup
              </button>

              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onOpenSheet('findReplace');
                }}
                className="w-full px-4 py-2.5 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Search className="w-4 h-4 text-slate-500" /> Find & Replace
              </button>

              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onOpenSheet('stats');
                }}
                className="w-full px-4 py-2.5 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <BarChart3 className="w-4 h-4 text-slate-500" /> Word Count
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onOpenSheet('settings');
                }}
                className="w-full px-4 py-2.5 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-500" /> Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
