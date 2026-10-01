import React, { useState } from 'react';
import { insertTable } from '../../utils/editorCommands';
import { Table, Plus, Trash2, X } from 'lucide-react';

interface TableSheetProps {
  onClose: () => void;
}

export const TableSheet: React.FC<TableSheetProps> = ({ onClose }) => {
  const [selectedRows, setSelectedRows] = useState(3);
  const [selectedCols, setSelectedCols] = useState(3);

  const presets = [
    { label: '2 × 2', r: 2, c: 2 },
    { label: '2 × 3', r: 2, c: 3 },
    { label: '3 × 3', r: 3, c: 3 },
    { label: '3 × 4', r: 3, c: 4 },
    { label: '4 × 4', r: 4, c: 4 },
    { label: '5 × 5', r: 5, c: 5 },
    { label: '6 × 6', r: 6, c: 6 },
    { label: '8 × 8', r: 8, c: 8 },
    { label: '10 × 10', r: 10, c: 10 },
  ];

  const handleInsert = (rows: number, cols: number) => {
    insertTable(rows, cols);
    onClose();
  };

  // Table manipulation on existing active table
  const executeTableAction = (action: 'addRow' | 'deleteRow' | 'addCol' | 'deleteCol' | 'deleteTable') => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const node = sel.anchorNode;
    const cell = node instanceof Element ? node.closest('td, th') : node?.parentElement?.closest('td, th');
    if (!cell) {
      alert('Please tap inside an existing table cell first!');
      return;
    }
    const row = cell.closest('tr');
    const table = cell.closest('table');
    if (!row || !table) return;

    if (action === 'addRow') {
      const newRow = row.cloneNode(true) as HTMLTableRowElement;
      Array.from(newRow.cells).forEach((c) => (c.innerHTML = 'New cell'));
      row.after(newRow);
    } else if (action === 'deleteRow') {
      row.remove();
    } else if (action === 'addCol') {
      const colIndex = Array.from(row.cells).indexOf(cell as HTMLTableCellElement);
      Array.from(table.rows).forEach((r) => {
        const newCell = document.createElement(r.parentElement?.tagName === 'THEAD' ? 'th' : 'td');
        newCell.style.border = '1px solid #cbd5e1';
        newCell.style.padding = '8px';
        newCell.innerHTML = 'Col';
        if (colIndex >= 0 && colIndex < r.cells.length) {
          r.cells[colIndex].after(newCell);
        } else {
          r.appendChild(newCell);
        }
      });
    } else if (action === 'deleteCol') {
      const colIndex = Array.from(row.cells).indexOf(cell as HTMLTableCellElement);
      if (colIndex >= 0) {
        Array.from(table.rows).forEach((r) => {
          if (r.cells[colIndex]) r.cells[colIndex].remove();
        });
      }
    } else if (action === 'deleteTable') {
      table.remove();
    }
    onClose();
  };

  return (
    <div className="p-5 max-w-lg mx-auto bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-base">Insert & Edit Table</h3>
            <p className="text-xs text-slate-500">Add responsive data grids up to 10×10</p>
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

      {/* Interactive Grid Chooser */}
      <div className="mb-5 bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center">
        <div className="text-xs font-semibold text-slate-700 mb-2">
          Select Dimensions: <span className="text-emerald-600 font-bold">{selectedRows} Rows × {selectedCols} Columns</span>
        </div>
        <div className="grid grid-cols-10 gap-1 p-2 bg-white rounded-lg border border-slate-200 shadow-inner">
          {Array.from({ length: 10 }).map((_, r) =>
            Array.from({ length: 10 }).map((_, c) => {
              const active = r < selectedRows && c < selectedCols;
              return (
                <div
                  key={`${r}-${c}`}
                  onMouseEnter={() => {
                    setSelectedRows(r + 1);
                    setSelectedCols(c + 1);
                  }}
                  onClick={() => handleInsert(r + 1, c + 1)}
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-xs cursor-pointer transition-colors ${
                    active ? 'bg-emerald-500' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                />
              );
            })
          )}
        </div>
        <button
          onClick={() => handleInsert(selectedRows, selectedCols)}
          className="mt-3 py-2 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          Insert {selectedRows} × {selectedCols} Table
        </button>
      </div>

      {/* Quick Presets */}
      <div className="mb-5">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
          Quick Dimension Presets
        </label>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => handleInsert(p.r, p.c)}
              className="py-2 px-3 bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-lg text-xs font-medium text-slate-700 transition-colors"
            >
              {p.label} Table
            </button>
          ))}
        </div>
      </div>

      {/* Modify Active Table */}
      <div className="border-t border-slate-200 pt-4 mb-2">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">
          Modify Current Table (Click cell first)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => executeTableAction('addRow')}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" /> Add Row
          </button>
          <button
            onClick={() => executeTableAction('addCol')}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" /> Add Column
          </button>
          <button
            onClick={() => executeTableAction('deleteRow')}
            className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Row
          </button>
          <button
            onClick={() => executeTableAction('deleteCol')}
            className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Column
          </button>
        </div>
        <button
          onClick={() => executeTableAction('deleteTable')}
          className="w-full mt-2 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete Entire Table
        </button>
      </div>
    </div>
  );
};
