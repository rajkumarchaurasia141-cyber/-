import React, { useState, useEffect } from 'react';
import {
  Search,
  Bold,
  Italic,
  Underline,
  Columns,
  Table,
  Image,
  FileSpreadsheet,
  Type,
  Printer,
  Download,
  BarChart3,
  Shapes,
  Palette,
  X,
} from 'lucide-react';
import { executeCommand } from '../../utils/editorCommands';
import { ActiveSheet } from '../../types/document';

interface CommandPaletteProps {
  onOpenSheet: (sheet: ActiveSheet) => void;
  onPrint: () => void;
  onExport: (type: 'pdf' | 'docx' | 'txt' | 'html') => void;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  onOpenSheet,
  onPrint,
  onExport,
  onClose,
}) => {
  const [query, setQuery] = useState('');

  const commands = [
    { id: 'bold', title: 'Bold Text', category: 'Format', icon: Bold, action: () => executeCommand('bold') },
    { id: 'italic', title: 'Italic Text', category: 'Format', icon: Italic, action: () => executeCommand('italic') },
    { id: 'underline', title: 'Underline Text', category: 'Format', icon: Underline, action: () => executeCommand('underline') },
    { id: 'columns', title: 'Page Columns (1–5 cols)', category: 'Layout', icon: Columns, action: () => onOpenSheet('columns') },
    { id: 'table', title: 'Insert Table (up to 10x10)', category: 'Insert', icon: Table, action: () => onOpenSheet('tables') },
    { id: 'image', title: 'Insert Image or Photo', category: 'Insert', icon: Image, action: () => onOpenSheet('images') },
    { id: 'shapes', title: 'Insert Callout / Divider', category: 'Insert', icon: Shapes, action: () => onOpenSheet('shapes') },
    { id: 'font', title: 'Change Font Family (20 fonts)', category: 'Typography', icon: Type, action: () => onOpenSheet('fonts') },
    { id: 'color', title: 'Text Color & Highlights', category: 'Typography', icon: Palette, action: () => onOpenSheet('colors') },
    { id: 'pagesetup', title: 'Page Setup (A4, Margins)', category: 'Layout', icon: FileSpreadsheet, action: () => onOpenSheet('pageSetup') },
    { id: 'find', title: 'Find & Replace', category: 'Edit', icon: Search, action: () => onOpenSheet('findReplace') },
    { id: 'stats', title: 'Word Count & Statistics', category: 'Review', icon: BarChart3, action: () => onOpenSheet('stats') },
    { id: 'print', title: 'Print Document', category: 'File', icon: Printer, action: onPrint },
    { id: 'export-pdf', title: 'Export as PDF', category: 'File', icon: Download, action: () => onExport('pdf') },
    { id: 'export-docx', title: 'Export as Word (DOCX)', category: 'File', icon: Download, action: () => onExport('docx') },
    { id: 'export-txt', title: 'Export as Plain Text (TXT)', category: 'File', icon: Download, action: () => onExport('txt') },
  ];

  const filtered = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center p-4 pt-12 sm:pt-20">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[75vh]">
        {/* Search header */}
        <div className="p-3 border-b border-slate-100 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or action (e.g. Columns, Table, Font)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 py-1 px-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command list */}
        <div className="overflow-y-auto flex-1 divide-y divide-slate-50 p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">No commands matching "{query}"</div>
          ) : (
            filtered.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  className="w-full p-2.5 flex items-center gap-3 rounded-xl hover:bg-slate-50 text-left transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-slate-800">{cmd.title}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">{cmd.category}</div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
