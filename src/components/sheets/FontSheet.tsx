import React, { useState } from 'react';
import { AVAILABLE_FONTS, FontOption } from '../../constants/fonts';
import { applyFontFamily } from '../../utils/editorCommands';
import { Search, Type, Check, X, Clock } from 'lucide-react';

interface FontSheetProps {
  currentFont: string;
  onSelectFont: (font: FontOption) => void;
  onClose: () => void;
}

export const FontSheet: React.FC<FontSheetProps> = ({ currentFont, onSelectFont, onClose }) => {
  const [search, setSearch] = useState('');
  const [recentFonts, setRecentFonts] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('docmaster_recent_fonts');
      return stored ? JSON.parse(stored) : ['arial', 'roboto', 'times', 'noto_devanagari'];
    } catch {
      return ['arial', 'roboto', 'times'];
    }
  });

  const filteredFonts = AVAILABLE_FONTS.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase()) ||
    f.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleChoose = (font: FontOption) => {
    applyFontFamily(font.family);
    onSelectFont(font);

    // Update recents
    const updated = [font.id, ...recentFonts.filter((id) => id !== font.id)].slice(0, 5);
    setRecentFonts(updated);
    try {
      localStorage.setItem('docmaster_recent_fonts', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <div className="p-5 max-w-lg mx-auto bg-white rounded-t-2xl shadow-2xl flex flex-col max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Type className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-base">Select Font</h3>
            <p className="text-xs text-slate-500">Choose from 20 professional typefaces</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search fonts (e.g., Arial, Hindi, Serif)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
      </div>

      {/* Recent Fonts Row */}
      {recentFonts.length > 0 && !search && (
        <div className="mb-3">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Recent
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {recentFonts.map((id) => {
              const f = AVAILABLE_FONTS.find((item) => item.id === id);
              if (!f) return null;
              return (
                <button
                  key={id}
                  onClick={() => handleChoose(f)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg whitespace-nowrap transition-colors"
                  style={{ fontFamily: f.family }}
                >
                  {f.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Font List */}
      <div className="overflow-y-auto flex-1 divide-y divide-slate-100 pr-1">
        {filteredFonts.map((font) => {
          const isSelected = currentFont.toLowerCase().includes(font.name.toLowerCase());
          return (
            <button
              key={font.id}
              onClick={() => handleChoose(font)}
              className={`w-full py-3 px-3 flex items-center justify-between text-left rounded-xl transition-all ${
                isSelected ? 'bg-indigo-50/70 text-indigo-900 font-medium' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex-1 pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-base" style={{ fontFamily: font.family }}>
                    {font.name}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded">
                    {font.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{font.description}</p>
              </div>

              {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
            </button>
          );
        })}
      </div>

      <div className="pt-3 border-t border-slate-100 mt-2">
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
