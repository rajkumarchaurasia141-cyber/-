import React from 'react';
import { QUICK_FONT_SIZES } from '../../constants/fonts';
import { applyFontSize } from '../../utils/editorCommands';
import { Minus, Plus, X } from 'lucide-react';

interface FontSizeSheetProps {
  currentSize: number;
  onSelectSize: (size: number) => void;
  onClose: () => void;
}

export const FontSizeSheet: React.FC<FontSizeSheetProps> = ({ currentSize, onSelectSize, onClose }) => {
  const handleApply = (size: number) => {
    const clamped = Math.max(1, Math.min(100, Math.round(size)));
    applyFontSize(clamped);
    onSelectSize(clamped);
  };

  return (
    <div className="p-5 max-w-lg mx-auto bg-white rounded-t-2xl shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div>
          <h3 className="font-semibold text-slate-800 text-base">Font Size</h3>
          <p className="text-xs text-slate-500">Scale typography from 1px to 100px</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Stepper & Numeric Input */}
      <div className="flex items-center justify-center gap-3 mb-5">
        <button
          onClick={() => handleApply(currentSize - 1)}
          disabled={currentSize <= 1}
          className="w-11 h-11 flex items-center justify-center bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-xl transition-colors disabled:opacity-40"
          aria-label="Decrease size"
        >
          <Minus className="w-5 h-5" />
        </button>

        <div className="relative">
          <input
            type="number"
            min="1"
            max="100"
            value={currentSize}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val >= 1 && val <= 100) {
                handleApply(val);
              }
            }}
            className="w-24 h-11 text-center font-bold text-xl bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-600"
          />
          <span className="text-[10px] text-slate-400 absolute right-2 bottom-1.5 pointer-events-none">
            px
          </span>
        </div>

        <button
          onClick={() => handleApply(currentSize + 1)}
          disabled={currentSize >= 100}
          className="w-11 h-11 flex items-center justify-center bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-xl transition-colors disabled:opacity-40"
          aria-label="Increase size"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Size Grid */}
      <div className="mb-4">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
          Preset Sizes
        </span>
        <div className="grid grid-cols-7 gap-1.5 max-h-48 overflow-y-auto pr-1">
          {QUICK_FONT_SIZES.map((sz) => {
            const isSelected = currentSize === sz;
            return (
              <button
                key={sz}
                onClick={() => handleApply(sz)}
                className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};
