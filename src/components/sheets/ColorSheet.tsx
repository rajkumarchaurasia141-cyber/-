import React, { useState } from 'react';
import { applyTextColor, applyHighlightColor } from '../../utils/editorCommands';
import { Palette, Highlighter, X, Ban, Check } from 'lucide-react';

interface ColorSheetProps {
  onClose: () => void;
}

export interface ColorItem {
  hex: string;
  nameEn: string;
  nameHi: string;
  bgClass?: string;
}

export const TWELVE_DISTINCT_COLORS: ColorItem[] = [
  { hex: '#000000', nameEn: 'Black', nameHi: 'काला' },
  { hex: '#DC2626', nameEn: 'Crimson Red', nameHi: 'लाल' },
  { hex: '#2563EB', nameEn: 'Royal Blue', nameHi: 'नीला' },
  { hex: '#16A34A', nameEn: 'Forest Green', nameHi: 'हरा' },
  { hex: '#EAB308', nameEn: 'Vibrant Yellow', nameHi: 'पीला' },
  { hex: '#EA580C', nameEn: 'Bright Orange', nameHi: 'नारंगी' },
  { hex: '#9333EA', nameEn: 'Deep Purple', nameHi: 'बैंगनी' },
  { hex: '#EC4899', nameEn: 'Rose Pink', nameHi: 'गुलाबी' },
  { hex: '#06B6D4', nameEn: 'Cyan Sky', nameHi: 'आसमानी' },
  { hex: '#78350F', nameEn: 'Warm Brown', nameHi: 'भूरा' },
  { hex: '#1E3A8A', nameEn: 'Navy Indigo', nameHi: 'गहरा नीला' },
  { hex: '#4B5563', nameEn: 'Slate Gray', nameHi: 'सलेटी' },
];

export const ColorSheet: React.FC<ColorSheetProps> = ({ onClose }) => {
  const [tab, setTab] = useState<'text' | 'highlight'>('text');
  const [hexInput, setHexInput] = useState('#2563EB');
  const [selectedColor, setSelectedColor] = useState<string>('#2563EB');

  const highlight12Colors: ColorItem[] = [
    { hex: '#FEF08A', nameEn: 'Light Yellow', nameHi: 'हल्का पीला' },
    { hex: '#BBF7D0', nameEn: 'Soft Green', nameHi: 'हल्का हरा' },
    { hex: '#BAE6FD', nameEn: 'Sky Blue', nameHi: 'हल्का नीला' },
    { hex: '#FED7AA', nameEn: 'Peach Orange', nameHi: 'नारंगी हाइलाइट' },
    { hex: '#FBCFE8', nameEn: 'Baby Pink', nameHi: 'गुलाबी हाइलाइट' },
    { hex: '#E9D5FF', nameEn: 'Lavender', nameHi: 'बैंगनी हाइलाइट' },
    { hex: '#FDE047', nameEn: 'Bright Lemon', nameHi: 'तेज पीला' },
    { hex: '#86EFAC', nameEn: 'Mint Green', nameHi: 'पिस्ता हरा' },
    { hex: '#7DD3FC', nameEn: 'Ice Blue', nameHi: 'बर्फानी नीला' },
    { hex: '#F472B6', nameEn: 'Flamingo', nameHi: 'गहरा गुलाबी' },
    { hex: '#CBD5E1', nameEn: 'Light Slate', nameHi: 'हल्का सलेटी' },
    { hex: 'transparent', nameEn: 'No Highlight', nameHi: 'कोई रंग नहीं' },
  ];

  const handleApplyColor = (color: string) => {
    setSelectedColor(color);
    setHexInput(color === 'transparent' ? '#FFFFFF' : color);
    if (tab === 'text') {
      applyTextColor(color);
    } else {
      applyHighlightColor(color);
    }
  };

  const handleHexSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^#[0-9A-F]{6}$/i.test(hexInput)) {
      handleApplyColor(hexInput);
    }
  };

  return (
    <div className="p-5 max-w-lg mx-auto bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-base">रंग चुनें / Choose Colors</h3>
            <p className="text-xs text-slate-500">12 विशेष रंग (12 Distinct Vibrant Colors)</p>
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

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
        <button
          onClick={() => setTab('text')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            tab === 'text' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Palette className="w-4 h-4" /> टेक्स्ट कलर (Text Color)
        </button>
        <button
          onClick={() => setTab('highlight')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            tab === 'highlight' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Highlighter className="w-4 h-4" /> हाइलाइटर (Highlight)
        </button>
      </div>

      {/* 12 Distinct Colors Grid */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            12 मुख्य रंग (12 Distinct Color Palette)
          </span>
          <span className="text-[11px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
            12 रंग उपलब्ध
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {(tab === 'text' ? TWELVE_DISTINCT_COLORS : highlight12Colors).map((item) => {
            const isSelected = selectedColor.toLowerCase() === item.hex.toLowerCase();
            const isTransparent = item.hex === 'transparent';

            return (
              <button
                key={item.hex}
                onClick={() => handleApplyColor(item.hex)}
                className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {/* Color Swatch Circle */}
                <div
                  className="w-7 h-7 rounded-lg shrink-0 border border-black/10 shadow-xs flex items-center justify-center relative"
                  style={{ backgroundColor: isTransparent ? '#ffffff' : item.hex }}
                >
                  {isTransparent && <Ban className="w-4 h-4 text-red-500" />}
                  {isSelected && !isTransparent && (
                    <Check
                      className={`w-4 h-4 ${
                        ['#EAB308', '#FEF08A', '#BBF7D0', '#BAE6FD', '#FED7AA', '#FBCFE8', '#FDE047'].includes(item.hex)
                          ? 'text-slate-900'
                          : 'text-white'
                      }`}
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-800 block truncate leading-tight">
                    {item.nameHi}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate leading-tight">
                    {item.nameEn}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Color Input & Hex */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 mb-4">
        <span className="text-xs font-semibold text-slate-600 block mb-2">
          कस्टम कलर पिकर (Custom Color & Hex)
        </span>
        <form onSubmit={handleHexSubmit} className="flex items-center gap-2">
          <input
            type="color"
            value={hexInput}
            onChange={(e) => handleApplyColor(e.target.value)}
            className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent shrink-0"
          />
          <input
            type="text"
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value)}
            placeholder="#000000"
            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-700 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium shrink-0"
          >
            Apply
          </button>
        </form>
      </div>

      <div className="pt-2 border-t border-slate-100 flex gap-2">
        <button
          onClick={() => {
            if (tab === 'text') handleApplyColor('#000000');
            else handleApplyColor('transparent');
          }}
          className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium"
        >
          Reset to Default
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
        >
          Done
        </button>
      </div>
    </div>
  );
};
