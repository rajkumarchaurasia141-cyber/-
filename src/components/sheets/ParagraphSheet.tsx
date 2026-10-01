import React from 'react';
import {
  executeCommand,
  applyLineSpacing,
  applyHeadingStyle,
} from '../../utils/editorCommands';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Superscript,
  Subscript,
  Strikethrough,
  RemoveFormatting,
  X,
} from 'lucide-react';

interface ParagraphSheetProps {
  onClose: () => void;
}

export const ParagraphSheet: React.FC<ParagraphSheetProps> = ({ onClose }) => {
  return (
    <div className="p-5 max-w-lg mx-auto bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div>
          <h3 className="font-semibold text-slate-800 text-base">Paragraph & Styles</h3>
          <p className="text-xs text-slate-500">Alignment, lists, headings & spacing</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Alignment */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
          Text Alignment
        </label>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => executeCommand('justifyLeft')}
            className="py-2.5 px-3 flex flex-col items-center justify-center rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-slate-700 transition-colors"
            title="Align Left"
          >
            <AlignLeft className="w-5 h-5 mb-1 text-slate-600" />
            <span className="text-[10px]">Left</span>
          </button>
          <button
            onClick={() => executeCommand('justifyCenter')}
            className="py-2.5 px-3 flex flex-col items-center justify-center rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-slate-700 transition-colors"
            title="Center"
          >
            <AlignCenter className="w-5 h-5 mb-1 text-slate-600" />
            <span className="text-[10px]">Center</span>
          </button>
          <button
            onClick={() => executeCommand('justifyRight')}
            className="py-2.5 px-3 flex flex-col items-center justify-center rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-slate-700 transition-colors"
            title="Align Right"
          >
            <AlignRight className="w-5 h-5 mb-1 text-slate-600" />
            <span className="text-[10px]">Right</span>
          </button>
          <button
            onClick={() => executeCommand('justifyFull')}
            className="py-2.5 px-3 flex flex-col items-center justify-center rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-slate-700 transition-colors"
            title="Justify"
          >
            <AlignJustify className="w-5 h-5 mb-1 text-slate-600" />
            <span className="text-[10px]">Justify</span>
          </button>
        </div>
      </div>

      {/* Headings & Structure */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
          Heading Styles
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => applyHeadingStyle('p')}
            className="py-2 px-3 text-left border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-medium text-slate-700"
          >
            Normal Text
          </button>
          <button
            onClick={() => applyHeadingStyle('h1')}
            className="py-2 px-3 text-left border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-900 flex items-center gap-1.5"
          >
            <Heading1 className="w-3.5 h-3.5 text-blue-600" /> Heading 1
          </button>
          <button
            onClick={() => applyHeadingStyle('h2')}
            className="py-2 px-3 text-left border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-800 flex items-center gap-1.5"
          >
            <Heading2 className="w-3.5 h-3.5 text-blue-600" /> Heading 2
          </button>
          <button
            onClick={() => applyHeadingStyle('h3')}
            className="py-2 px-3 text-left border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
          >
            <Heading3 className="w-3.5 h-3.5 text-blue-600" /> Heading 3
          </button>
          <button
            onClick={() => applyHeadingStyle('blockquote')}
            className="py-2 px-3 text-left border border-slate-200 rounded-xl hover:bg-slate-50 text-xs italic text-slate-600 flex items-center gap-1.5"
          >
            <Quote className="w-3.5 h-3.5 text-amber-600" /> Quote
          </button>
          <button
            onClick={() => applyHeadingStyle('pre')}
            className="py-2 px-3 text-left border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-mono text-slate-700 flex items-center gap-1.5"
          >
            <Code className="w-3.5 h-3.5 text-emerald-600" /> Code Block
          </button>
        </div>
      </div>

      {/* Lists & Indentation */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
          Lists & Indent
        </label>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => executeCommand('insertUnorderedList')}
            className="py-2.5 flex flex-col items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700"
          >
            <List className="w-4 h-4 mb-1 text-slate-600" />
            <span className="text-[10px]">Bullet List</span>
          </button>
          <button
            onClick={() => executeCommand('insertOrderedList')}
            className="py-2.5 flex flex-col items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700"
          >
            <ListOrdered className="w-4 h-4 mb-1 text-slate-600" />
            <span className="text-[10px]">Numbered</span>
          </button>
          <button
            onClick={() => executeCommand('outdent')}
            className="py-2.5 flex flex-col items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700"
          >
            <Outdent className="w-4 h-4 mb-1 text-slate-600" />
            <span className="text-[10px]">Decrease</span>
          </button>
          <button
            onClick={() => executeCommand('indent')}
            className="py-2.5 flex flex-col items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700"
          >
            <Indent className="w-4 h-4 mb-1 text-slate-600" />
            <span className="text-[10px]">Increase</span>
          </button>
        </div>
      </div>

      {/* Line Spacing */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
          Line Spacing
        </label>
        <div className="grid grid-cols-4 gap-2">
          {['1.0', '1.15', '1.5', '2.0'].map((spacing) => (
            <button
              key={spacing}
              onClick={() => applyLineSpacing(spacing)}
              className="py-2 text-xs font-medium rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-slate-700 transition-colors"
            >
              {spacing === '1.0' ? 'Single' : spacing === '2.0' ? 'Double' : `${spacing}x`}
            </button>
          ))}
        </div>
      </div>

      {/* Special Inline Formats */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
          Inline Character Styles
        </label>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => executeCommand('strikeThrough')}
            className="py-2 px-2 flex items-center justify-center gap-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-xs text-slate-700"
          >
            <Strikethrough className="w-3.5 h-3.5" /> Strike
          </button>
          <button
            onClick={() => executeCommand('superscript')}
            className="py-2 px-2 flex items-center justify-center gap-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-xs text-slate-700"
          >
            <Superscript className="w-3.5 h-3.5" /> X²
          </button>
          <button
            onClick={() => executeCommand('subscript')}
            className="py-2 px-2 flex items-center justify-center gap-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-xs text-slate-700"
          >
            <Subscript className="w-3.5 h-3.5" /> X₂
          </button>
          <button
            onClick={() => executeCommand('removeFormat')}
            className="py-2 px-2 flex items-center justify-center gap-1 border border-slate-200 rounded-lg hover:bg-red-50 text-xs text-red-600"
          >
            <RemoveFormatting className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
        >
          Done
        </button>
      </div>
    </div>
  );
};
