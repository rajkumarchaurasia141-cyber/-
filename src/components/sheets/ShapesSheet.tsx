import React from 'react';
import { insertShapeHtml } from '../../utils/editorCommands';
import { Shapes, Minus, Info, CheckCircle2, AlertTriangle, Quote, Tag, X } from 'lucide-react';

interface ShapesSheetProps {
  onClose: () => void;
}

export const ShapesSheet: React.FC<ShapesSheetProps> = ({ onClose }) => {
  const handleInsert = (type: 'divider' | 'callout-info' | 'callout-success' | 'callout-warning' | 'quote' | 'badge') => {
    insertShapeHtml(type);
    onClose();
  };

  return (
    <div className="p-5 max-w-lg mx-auto bg-white rounded-t-2xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <Shapes className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-base">Shapes & Callouts</h3>
            <p className="text-xs text-slate-500">Insert visual dividers, callouts, and quote cards</p>
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

      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <button
          onClick={() => handleInsert('divider')}
          className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left flex items-start gap-2.5 transition-colors"
        >
          <Minus className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-semibold text-slate-800 block">Gradient Divider</span>
            <span className="text-[10px] text-slate-500">Section separator line</span>
          </div>
        </button>

        <button
          onClick={() => handleInsert('callout-info')}
          className="p-3 bg-blue-50/50 hover:bg-blue-50 border border-blue-200 rounded-xl text-left flex items-start gap-2.5 transition-colors"
        >
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-semibold text-blue-900 block">Info Callout</span>
            <span className="text-[10px] text-blue-600">Highlighted note block</span>
          </div>
        </button>

        <button
          onClick={() => handleInsert('callout-success')}
          className="p-3 bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200 rounded-xl text-left flex items-start gap-2.5 transition-colors"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-semibold text-emerald-900 block">Success Box</span>
            <span className="text-[10px] text-emerald-600">Approved milestone notice</span>
          </div>
        </button>

        <button
          onClick={() => handleInsert('callout-warning')}
          className="p-3 bg-amber-50/50 hover:bg-amber-50 border border-amber-200 rounded-xl text-left flex items-start gap-2.5 transition-colors"
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-semibold text-amber-900 block">Warning Box</span>
            <span className="text-[10px] text-amber-600">Attention caution callout</span>
          </div>
        </button>

        <button
          onClick={() => handleInsert('quote')}
          className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left flex items-start gap-2.5 transition-colors"
        >
          <Quote className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-semibold text-slate-800 block">Stylized Quote</span>
            <span className="text-[10px] text-slate-500">Elegant blockquote text</span>
          </div>
        </button>

        <button
          onClick={() => handleInsert('badge')}
          className="p-3 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-200 rounded-xl text-left flex items-start gap-2.5 transition-colors"
        >
          <Tag className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-semibold text-indigo-900 block">Status Pill</span>
            <span className="text-[10px] text-indigo-600">Confidential / Draft pill</span>
          </div>
        </button>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
};
