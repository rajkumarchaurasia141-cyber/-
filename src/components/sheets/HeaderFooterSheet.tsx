import React from 'react';
import { HeaderFooterSettings, PageNumberPosition } from '../../types/document';
import { PanelTop, PanelBottom, Hash, Calendar, X, Check } from 'lucide-react';

interface HeaderFooterSheetProps {
  settings: HeaderFooterSettings;
  onUpdate: (newSettings: HeaderFooterSettings) => void;
  onClose: () => void;
}

export const HeaderFooterSheet: React.FC<HeaderFooterSheetProps> = ({ settings, onUpdate, onClose }) => {
  const numberPositions: { label: string; value: PageNumberPosition }[] = [
    { label: 'None', value: 'none' },
    { label: 'Bottom Center', value: 'bottom-center' },
    { label: 'Bottom Right', value: 'bottom-right' },
    { label: 'Bottom Left', value: 'bottom-left' },
    { label: 'Top Center', value: 'top-center' },
    { label: 'Top Right', value: 'top-right' },
    { label: 'Top Left', value: 'top-left' },
  ];

  return (
    <div className="p-5 max-w-lg mx-auto bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <PanelTop className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-base">Header & Footer</h3>
            <p className="text-xs text-slate-500">Configure page numbers, titles and dates</p>
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

      {/* Header Section */}
      <div className="mb-5 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
            <PanelTop className="w-4 h-4 text-slate-500" /> Document Header
          </span>
          <button
            onClick={() => onUpdate({ ...settings, showHeader: !settings.showHeader })}
            className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
              settings.showHeader ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                settings.showHeader ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {settings.showHeader && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Header title / organization name..."
              value={settings.headerText}
              onChange={(e) => onUpdate({ ...settings, headerText: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <div className="flex gap-2">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => onUpdate({ ...settings, headerAlign: align })}
                  className={`flex-1 py-1.5 text-xs capitalize rounded-lg border ${
                    settings.headerAlign === align
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="mb-5 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
            <PanelBottom className="w-4 h-4 text-slate-500" /> Document Footer
          </span>
          <button
            onClick={() => onUpdate({ ...settings, showFooter: !settings.showFooter })}
            className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
              settings.showFooter ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                settings.showFooter ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {settings.showFooter && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Custom footer text (e.g., Confidential)..."
              value={settings.footerText}
              onChange={(e) => onUpdate({ ...settings, footerText: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-600 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Show Date in Footer
              </span>
              <input
                type="checkbox"
                checked={settings.showDateInFooter}
                onChange={(e) => onUpdate({ ...settings, showDateInFooter: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>
          </div>
        )}
      </div>

      {/* Page Numbering */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1">
          <Hash className="w-3.5 h-3.5" /> Page Number Position
        </label>
        <div className="grid grid-cols-2 gap-2">
          {numberPositions.map((pos) => {
            const isSelected = settings.pageNumberPosition === pos.value;
            return (
              <button
                key={pos.value}
                onClick={() => onUpdate({ ...settings, pageNumberPosition: pos.value })}
                className={`py-2 px-3 text-xs rounded-xl border text-left flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{pos.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
        >
          Done
        </button>
      </div>
    </div>
  );
};
