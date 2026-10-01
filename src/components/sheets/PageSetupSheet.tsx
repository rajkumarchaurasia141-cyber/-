import React from 'react';
import { PageSettings, PageSize, PageOrientation, MarginType } from '../../types/document';
import { FileSpreadsheet, Compass, Margin, X } from 'lucide-react';

interface PageSetupSheetProps {
  settings: PageSettings;
  onUpdate: (newSettings: PageSettings) => void;
  onClose: () => void;
}

export const PageSetupSheet: React.FC<PageSetupSheetProps> = ({ settings, onUpdate, onClose }) => {
  const paperSizes: PageSize[] = ['A4', 'Letter', 'A5', 'Legal'];

  const handleSizeChange = (size: PageSize) => {
    onUpdate({ ...settings, size });
  };

  const handleOrientationChange = (orientation: PageOrientation) => {
    onUpdate({ ...settings, orientation });
  };

  const handleMarginPreset = (type: MarginType) => {
    let margins = { top: 25.4, bottom: 25.4, left: 25.4, right: 25.4 };
    if (type === 'narrow') {
      margins = { top: 12.7, bottom: 12.7, left: 12.7, right: 12.7 };
    } else if (type === 'moderate') {
      margins = { top: 25.4, bottom: 25.4, left: 19.0, right: 19.0 };
    } else if (type === 'wide') {
      margins = { top: 25.4, bottom: 25.4, left: 38.1, right: 38.1 };
    }
    onUpdate({
      ...settings,
      marginType: type,
      margins,
    });
  };

  const handleCustomMargin = (key: keyof PageSettings['margins'], val: number) => {
    onUpdate({
      ...settings,
      marginType: 'custom',
      margins: {
        ...settings.margins,
        [key]: Math.max(0, val),
      },
    });
  };

  return (
    <div className="p-5 max-w-lg mx-auto bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-base">Page Setup</h3>
            <p className="text-xs text-slate-500">Configure paper size, orientation & margins</p>
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

      {/* Paper Size */}
      <div className="mb-5">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
          Paper Size
        </label>
        <div className="grid grid-cols-4 gap-2">
          {paperSizes.map((sz) => (
            <button
              key={sz}
              onClick={() => handleSizeChange(sz)}
              className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                settings.size === sz
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Orientation */}
      <div className="mb-5">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
          Orientation
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleOrientationChange('portrait')}
            className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              settings.orientation === 'portrait'
                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="w-3.5 h-5 border-2 border-current rounded-xs" />
            Portrait
          </button>
          <button
            onClick={() => handleOrientationChange('landscape')}
            className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              settings.orientation === 'landscape'
                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="w-5 h-3.5 border-2 border-current rounded-xs" />
            Landscape
          </button>
        </div>
      </div>

      {/* Margins */}
      <div className="mb-5">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
          Margins
        </label>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {(['normal', 'narrow', 'moderate', 'wide'] as MarginType[]).map((m) => (
            <button
              key={m}
              onClick={() => handleMarginPreset(m)}
              className={`py-2 px-1 text-xs font-semibold capitalize rounded-xl border text-center transition-all ${
                settings.marginType === m
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Custom Margin Inputs */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-600 block mb-2">Custom Dimensions (mm)</span>
          <div className="grid grid-cols-4 gap-2">
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Top</span>
              <input
                type="number"
                value={Math.round(settings.margins.top)}
                onChange={(e) => handleCustomMargin('top', Number(e.target.value))}
                className="w-full py-1 px-2 text-center text-xs font-medium bg-white border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Bottom</span>
              <input
                type="number"
                value={Math.round(settings.margins.bottom)}
                onChange={(e) => handleCustomMargin('bottom', Number(e.target.value))}
                className="w-full py-1 px-2 text-center text-xs font-medium bg-white border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Left</span>
              <input
                type="number"
                value={Math.round(settings.margins.left)}
                onChange={(e) => handleCustomMargin('left', Number(e.target.value))}
                className="w-full py-1 px-2 text-center text-xs font-medium bg-white border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Right</span>
              <input
                type="number"
                value={Math.round(settings.margins.right)}
                onChange={(e) => handleCustomMargin('right', Number(e.target.value))}
                className="w-full py-1 px-2 text-center text-xs font-medium bg-white border border-slate-200 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
        >
          Apply Page Setup
        </button>
      </div>
    </div>
  );
};
