import React from 'react';
import { ColumnSettings } from '../../types/document';
import { Columns, Split, Sliders, X, Check } from 'lucide-react';
import { insertColumnBreak } from '../../utils/editorCommands';

interface ColumnSheetProps {
  settings: ColumnSettings;
  onUpdate: (newSettings: ColumnSettings) => void;
  onClose: () => void;
}

export const ColumnSheet: React.FC<ColumnSheetProps> = ({ settings, onUpdate, onClose }) => {
  const columnCounts: Array<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5];

  const handleSelectCount = (count: 1 | 2 | 3 | 4 | 5) => {
    onUpdate({
      ...settings,
      count,
    });
  };

  const handleSpacingChange = (gap: number) => {
    onUpdate({
      ...settings,
      gap,
    });
  };

  const handleRuleToggle = () => {
    onUpdate({
      ...settings,
      showRule: !settings.showRule,
    });
  };

  const handleApplyTo = (applyTo: 'whole-document' | 'selection') => {
    onUpdate({
      ...settings,
      applyTo,
    });
  };

  return (
    <div className="p-5 max-w-lg mx-auto bg-white rounded-t-2xl shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Columns className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-base">Page Columns</h3>
            <p className="text-xs text-slate-500">Flow text across multiple columns</p>
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

      {/* Column Count Selection Buttons */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
          Number of Columns
        </label>
        <div className="grid grid-cols-5 gap-2">
          {columnCounts.map((num) => {
            const isSelected = settings.count === num;
            return (
              <button
                key={num}
                onClick={() => handleSelectCount(num)}
                className={`flex flex-col items-center justify-center py-3 px-1 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 text-blue-700 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex gap-0.5 h-6 mb-1.5 items-stretch">
                  {Array.from({ length: num }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 rounded-sm ${isSelected ? 'bg-blue-600' : 'bg-slate-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold">{num}</span>
                <span className="text-[10px] text-slate-500">{num === 1 ? 'Col' : 'Cols'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Column Spacing Slider */}
      {settings.count > 1 && (
        <div className="mb-5 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-slate-500" /> Column Spacing
            </span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700">
              {settings.gap} mm
            </span>
          </div>
          <input
            type="range"
            min="4"
            max="30"
            step="1"
            value={settings.gap}
            onChange={(e) => handleSpacingChange(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>Tight (4mm)</span>
            <span>Standard (15mm)</span>
            <span>Wide (30mm)</span>
          </div>

          {/* Column Rule Divider Line */}
          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-700 block">Vertical Divider Line</span>
              <span className="text-[11px] text-slate-500">Draw subtle rule between columns</span>
            </div>
            <button
              onClick={handleRuleToggle}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.showRule ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.showRule ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Apply To */}
      <div className="mb-5">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
          Apply Layout To
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleApplyTo('whole-document')}
            className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors flex items-center justify-center gap-1.5 ${
              settings.applyTo === 'whole-document'
                ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {settings.applyTo === 'whole-document' && <Check className="w-3.5 h-3.5" />}
            Whole Document
          </button>
          <button
            onClick={() => handleApplyTo('selection')}
            className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors flex items-center justify-center gap-1.5 ${
              settings.applyTo === 'selection'
                ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {settings.applyTo === 'selection' && <Check className="w-3.5 h-3.5" />}
            Current Section
          </button>
        </div>
      </div>

      {/* Insert Column Break */}
      <div className="pt-2 border-t border-slate-100 flex gap-2">
        <button
          onClick={() => {
            insertColumnBreak();
            onClose();
          }}
          className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
        >
          <Split className="w-4 h-4 text-slate-600" />
          Insert Column Break
        </button>

        <button
          onClick={onClose}
          className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};
