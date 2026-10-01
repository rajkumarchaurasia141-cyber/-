import React from 'react';
import {
  Type,
  Bold,
  Italic,
  Underline,
  Palette,
  Columns,
  Table,
  Image,
  AlignLeft,
  Shapes,
  Search,
  Heading,
  Download,
} from 'lucide-react';
import { executeCommand, saveSelection } from '../utils/editorCommands';
import { ActiveSheet } from '../../types/document';

interface MobileBottomBarProps {
  onOpenSheet: (sheet: ActiveSheet) => void;
  onOpenDownloadModal: () => void;
  activeSheet: ActiveSheet;
  activeFontName: string;
  activeFontSize: number;
  columnCount: number;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  onOpenSheet,
  onOpenDownloadModal,
  activeSheet,
  activeFontName,
  activeFontSize,
  columnCount,
}) => {
  const handleOpen = (sheet: ActiveSheet) => {
    saveSelection();
    onOpenSheet(sheet);
  };

  const handleCommand = (cmd: string) => {
    saveSelection();
    executeCommand(cmd);
  };

  return (
    <div className="no-print mobile-toolbar fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg">
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
        {/* DIRECT DOWNLOAD BUTTON ON MOBILE */}
        <button
          onClick={onOpenDownloadModal}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shrink-0 shadow-xs active:scale-95 transition-all"
          title="दस्तावेज़ डाउनलोड करें (PDF / DOCX)"
        >
          <Download className="w-4 h-4" />
          <span>डाउनलोड</span>
        </button>

        {/* SPECIAL HIGHLIGHTED COLUMNS BUTTON */}
        <button
          onClick={() => handleOpen('columns')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeSheet === 'columns'
              ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 hover:bg-blue-100'
          }`}
        >
          <Columns className="w-4 h-4 text-blue-600" />
          <span>Columns ({columnCount})</span>
        </button>

        {/* Font Selector Trigger */}
        <button
          onClick={() => handleOpen('fonts')}
          className="flex items-center gap-1 px-2.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shrink-0"
        >
          <Type className="w-4 h-4 text-indigo-500" />
          <span className="max-w-[70px] truncate">{activeFontName || 'Font'}</span>
        </button>

        {/* Font Size Trigger */}
        <button
          onClick={() => handleOpen('fontSize')}
          className="flex items-center justify-center px-2.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shrink-0 min-w-[36px]"
        >
          {activeFontSize}px
        </button>

        <div className="w-[1px] h-6 bg-slate-200 shrink-0 mx-0.5" />

        {/* Bold */}
        <button
          onClick={() => handleCommand('bold')}
          className="p-2.5 rounded-xl hover:bg-slate-100 active:bg-blue-50 text-slate-700 shrink-0 transition-colors"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        {/* Italic */}
        <button
          onClick={() => handleCommand('italic')}
          className="p-2.5 rounded-xl hover:bg-slate-100 active:bg-blue-50 text-slate-700 shrink-0 transition-colors"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        {/* Underline */}
        <button
          onClick={() => handleCommand('underline')}
          className="p-2.5 rounded-xl hover:bg-slate-100 active:bg-blue-50 text-slate-700 shrink-0 transition-colors"
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>

        {/* Colors & Highlight */}
        <button
          onClick={() => handleOpen('colors')}
          className={`p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 shrink-0 transition-colors ${
            activeSheet === 'colors' ? 'bg-amber-100 text-amber-800' : ''
          }`}
          title="Color & Highlight"
        >
          <Palette className="w-4 h-4 text-amber-500" />
        </button>

        {/* 12 Quick Color Swatches on Mobile */}
        <div className="flex items-center gap-1.5 shrink-0 px-1 bg-slate-50 py-1 rounded-xl border border-slate-200">
          {[
            { hex: '#000000', name: 'Black / काला' },
            { hex: '#DC2626', name: 'Red / लाल' },
            { hex: '#2563EB', name: 'Blue / नीला' },
            { hex: '#16A34A', name: 'Green / हरा' },
            { hex: '#EAB308', name: 'Yellow / पीला' },
            { hex: '#EA580C', name: 'Orange / नारंगी' },
            { hex: '#9333EA', name: 'Purple / बैंगनी' },
            { hex: '#EC4899', name: 'Pink / गुलाबी' },
            { hex: '#06B6D4', name: 'Cyan / आसमानी' },
            { hex: '#78350F', name: 'Brown / भूरा' },
            { hex: '#1E3A8A', name: 'Navy / गहरा नीला' },
            { hex: '#4B5563', name: 'Gray / सलेटी' },
          ].map((c) => (
            <button
              key={c.hex}
              onClick={() => {
                saveSelection();
                document.execCommand('styleWithCSS', false, 'true');
                document.execCommand('foreColor', false, c.hex);
              }}
              className="w-4 h-4 rounded-full border border-black/10 hover:scale-125 active:scale-95 transition-transform shadow-2xs shrink-0"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>

        <div className="w-[1px] h-6 bg-slate-200 shrink-0 mx-0.5" />

        {/* Paragraph & Headings */}
        <button
          onClick={() => handleOpen('paragraph')}
          className={`p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 shrink-0 transition-colors ${
            activeSheet === 'paragraph' ? 'bg-blue-100 text-blue-800' : ''
          }`}
          title="Paragraph formatting"
        >
          <AlignLeft className="w-4 h-4" />
        </button>

        {/* Tables */}
        <button
          onClick={() => handleOpen('tables')}
          className={`p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 shrink-0 transition-colors ${
            activeSheet === 'tables' ? 'bg-emerald-100 text-emerald-800' : ''
          }`}
          title="Insert Table"
        >
          <Table className="w-4 h-4 text-emerald-600" />
        </button>

        {/* Images */}
        <button
          onClick={() => handleOpen('images')}
          className={`p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 shrink-0 transition-colors ${
            activeSheet === 'images' ? 'bg-purple-100 text-purple-800' : ''
          }`}
          title="Insert Image"
        >
          <Image className="w-4 h-4 text-purple-600" />
        </button>

        {/* Shapes & Callouts */}
        <button
          onClick={() => handleOpen('shapes')}
          className={`p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 shrink-0 transition-colors ${
            activeSheet === 'shapes' ? 'bg-amber-100 text-amber-800' : ''
          }`}
          title="Insert Shapes"
        >
          <Shapes className="w-4 h-4 text-amber-600" />
        </button>

        {/* Find & Replace */}
        <button
          onClick={() => handleOpen('findReplace')}
          className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 shrink-0 transition-colors"
          title="Find & Replace"
        >
          <Search className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    </div>
  );
};
