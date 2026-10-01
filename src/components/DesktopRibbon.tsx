import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Table,
  Image,
  Columns,
  Type,
  FileSpreadsheet,
  Palette,
  Shapes,
  Search,
  BarChart3,
  Heading1,
  Heading2,
  RemoveFormatting,
} from 'lucide-react';
import { executeCommand, applyLineSpacing, applyHeadingStyle } from '../utils/editorCommands';
import { ActiveSheet } from '../../types/document';
import { QUICK_FONT_SIZES } from '../../constants/fonts';

interface DesktopRibbonProps {
  onOpenSheet: (sheet: ActiveSheet) => void;
  currentFont: string;
  currentFontSize: number;
  columnCount: number;
}

export const DesktopRibbon: React.FC<DesktopRibbonProps> = ({
  onOpenSheet,
  currentFont,
  currentFontSize,
  columnCount,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'insert' | 'layout' | 'review'>('home');

  return (
    <div className="no-print hidden sm:block bg-white border-b border-slate-200">
      {/* Ribbon Tabs */}
      <div className="flex px-4 border-b border-slate-100 text-xs font-semibold">
        {(['home', 'insert', 'layout', 'review'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === tab
                ? 'border-blue-600 text-blue-700 bg-blue-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="p-2 px-4 flex items-center gap-4 overflow-x-auto no-scrollbar">
        {activeTab === 'home' && (
          <>
            {/* Font & Size */}
            <div className="flex items-center gap-1.5 pr-3 border-r border-slate-200">
              <button
                onClick={() => onOpenSheet('fonts')}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-50 flex items-center gap-1 min-w-[110px] justify-between text-slate-700"
              >
                <span className="truncate">{currentFont || 'Arial'}</span>
                <span className="text-[10px] text-slate-400">▼</span>
              </button>

              <button
                onClick={() => onOpenSheet('fontSize')}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 min-w-[48px] text-slate-700"
              >
                {currentFontSize}px
              </button>
            </div>

            {/* Bold / Italic / Underline / Strike */}
            <div className="flex items-center gap-0.5 pr-3 border-r border-slate-200">
              <button
                onClick={() => executeCommand('bold')}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700"
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('italic')}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700"
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('underline')}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700"
                title="Underline (Ctrl+U)"
              >
                <Underline className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('strikeThrough')}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700"
                title="Strikethrough"
              >
                <Strikethrough className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenSheet('colors')}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-amber-600 mr-1"
                title="12 Colors & Highlight"
              >
                <Palette className="w-4 h-4" />
              </button>

              {/* 12 Quick Colors Swatches */}
              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
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
                      document.execCommand('styleWithCSS', false, 'true');
                      document.execCommand('foreColor', false, c.hex);
                    }}
                    className="w-4 h-4 rounded-full border border-black/10 hover:scale-125 transition-transform shadow-xs"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Alignment & Lists */}
            <div className="flex items-center gap-0.5 pr-3 border-r border-slate-200">
              <button
                onClick={() => executeCommand('justifyLeft')}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700"
                title="Align Left"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('justifyCenter')}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700"
                title="Center"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('justifyRight')}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700"
                title="Align Right"
              >
                <AlignRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('justifyFull')}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700"
                title="Justify"
              >
                <AlignJustify className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('insertUnorderedList')}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700"
                title="Bullets"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('insertOrderedList')}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700"
                title="Numbering"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Headings */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => applyHeadingStyle('p')}
                className="px-2 py-1 text-xs rounded hover:bg-slate-100 text-slate-700"
              >
                Normal
              </button>
              <button
                onClick={() => applyHeadingStyle('h1')}
                className="px-2 py-1 text-xs font-bold rounded hover:bg-slate-100 text-slate-900"
              >
                H1
              </button>
              <button
                onClick={() => applyHeadingStyle('h2')}
                className="px-2 py-1 text-xs font-semibold rounded hover:bg-slate-100 text-slate-800"
              >
                H2
              </button>
            </div>
          </>
        )}

        {activeTab === 'insert' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenSheet('tables')}
              className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-medium flex items-center gap-1.5"
            >
              <Table className="w-4 h-4" /> Insert Table
            </button>
            <button
              onClick={() => onOpenSheet('images')}
              className="px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-800 hover:bg-purple-100 rounded-lg text-xs font-medium flex items-center gap-1.5"
            >
              <Image className="w-4 h-4" /> Insert Picture
            </button>
            <button
              onClick={() => onOpenSheet('shapes')}
              className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 rounded-lg text-xs font-medium flex items-center gap-1.5"
            >
              <Shapes className="w-4 h-4" /> Callouts & Shapes
            </button>
            <button
              onClick={() => onOpenSheet('headerFooter')}
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium"
            >
              Header / Footer
            </button>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="flex items-center gap-2">
            {/* Dedicated Columns Trigger */}
            <button
              onClick={() => onOpenSheet('columns')}
              className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              <Columns className="w-4 h-4" /> Multi-Columns ({columnCount})
            </button>
            <button
              onClick={() => onOpenSheet('pageSetup')}
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" /> Page Margins & Size
            </button>
          </div>
        )}

        {activeTab === 'review' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenSheet('stats')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5"
            >
              <BarChart3 className="w-4 h-4" /> Word Count
            </button>
            <button
              onClick={() => onOpenSheet('findReplace')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" /> Find & Replace
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
