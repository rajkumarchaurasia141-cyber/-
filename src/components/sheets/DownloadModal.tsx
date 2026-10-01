import React, { useState } from 'react';
import { Download, FileText, Printer, FileCode, Check, X, Sparkles } from 'lucide-react';
import { DocumentData } from '../../types/document';
import { exportAsPdf, exportAsDocx, exportAsTxt, exportAsHtml } from '../../services/export';
import confetti from 'canvas-confetti';

interface DownloadModalProps {
  document: DocumentData;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ document: doc, onClose }) => {
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  const handleDownload = (format: 'pdf' | 'docx' | 'txt' | 'html' | 'print') => {
    setDownloadingFormat(format);
    setTimeout(() => {
      if (format === 'pdf') {
        exportAsPdf(doc);
      } else if (format === 'docx') {
        exportAsDocx(doc);
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      } else if (format === 'txt') {
        exportAsTxt(doc);
      } else if (format === 'html') {
        exportAsHtml(doc);
      } else if (format === 'print') {
        exportAsPdf(doc);
      }
      setDownloadingFormat(null);
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-5 sm:p-6 border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">दस्तावेज़ डाउनलोड करें</h3>
              <p className="text-xs text-slate-500">Download &amp; Export Options (A4 Standard)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Info Pill */}
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs font-bold text-slate-800 truncate">{doc.title}</span>
          </div>
          <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full shrink-0">
            A4 Size
          </span>
        </div>

        {/* Download Formats Grid */}
        <div className="space-y-2.5 mb-5">
          {/* PDF */}
          <button
            onClick={() => handleDownload('pdf')}
            className="w-full p-3.5 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border border-red-200/80 rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.99] group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                PDF
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-red-700 transition-colors">
                  PDF फ़ाइल डाउनलोड करें (PDF Document)
                </h4>
                <p className="text-[10px] text-slate-500">
                  प्रिंट और शेयर करने के लिए सबसे उपयुक्त (A4 Layout)
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-red-600 shrink-0 group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* Word DOCX */}
          <button
            onClick={() => handleDownload('docx')}
            className="w-full p-3.5 bg-gradient-to-r from-blue-50 to-sky-50 hover:from-blue-100 hover:to-sky-100 border border-blue-200/80 rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.99] group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                DOCX
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                  Word (.docx) फ़ाइल डाउनलोड करें
                </h4>
                <p className="text-[10px] text-slate-500">
                  Microsoft Word और Google Docs में एडिट करने योग्य
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-blue-600 shrink-0 group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* Plain Text TXT */}
          <button
            onClick={() => handleDownload('txt')}
            className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.99] group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                TXT
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  सादा टेक्स्ट (.txt) डाउनलोड करें
                </h4>
                <p className="text-[10px] text-slate-500">
                  बिना फ़ॉर्मैटिंग का शुद्ध टेक्स्ट फ़ाइल
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-600 shrink-0" />
          </button>

          {/* Print */}
          <button
            onClick={() => handleDownload('print')}
            className="w-full p-3.5 bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200 rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.99] group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  प्रिंट करें (Print / Save via Browser)
                </h4>
                <p className="text-[10px] text-slate-500">
                  सीधे अपने प्रिंटर या सेव ऐज PDF डायलॉग में भेजें
                </p>
              </div>
            </div>
            <Printer className="w-4 h-4 text-emerald-600 shrink-0" />
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
        >
          बंद करें (Close)
        </button>
      </div>
    </div>
  );
};
