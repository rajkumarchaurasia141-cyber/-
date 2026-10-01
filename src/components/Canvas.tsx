import React, { useRef, useEffect } from 'react';
import { DocumentData } from '../types/document';
import { saveSelection } from '../utils/editorCommands';

interface CanvasProps {
  document: DocumentData;
  onContentChange: (newHtml: string) => void;
  zoom: number;
  spellCheck: boolean;
  language: 'en' | 'hi';
}

export const Canvas: React.FC<CanvasProps> = ({
  document: doc,
  onContentChange,
  zoom,
  spellCheck,
  language,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  // Sync initial content once or on document switch
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== doc.content) {
      if (!isInternalChange.current) {
        contentRef.current.innerHTML = doc.content;
      }
    }
    isInternalChange.current = false;
  }, [doc.id]);

  const handleInput = () => {
    if (contentRef.current) {
      isInternalChange.current = true;
      const html = contentRef.current.innerHTML;
      onContentChange(html);
      saveSelection();
    }
  };

  const { margins, size, orientation } = doc.pageSettings;
  const { count, gap, showRule } = doc.columnSettings;
  const { showHeader, headerText, headerAlign, showFooter, footerText, footerAlign, pageNumberPosition, showDateInFooter } = doc.headerFooterSettings;

  // Paper width & height calculation
  // A4 = 210 x 297mm, Letter = 215.9 x 279.4mm, A5 = 148 x 210mm, Legal = 215.9 x 355.6mm
  let pageBaseWidth = 210; // in mm
  let pageBaseHeight = 297;
  if (size === 'Letter') {
    pageBaseWidth = 215.9;
    pageBaseHeight = 279.4;
  } else if (size === 'A5') {
    pageBaseWidth = 148;
    pageBaseHeight = 210;
  } else if (size === 'Legal') {
    pageBaseWidth = 215.9;
    pageBaseHeight = 355.6;
  }

  if (orientation === 'landscape') {
    const temp = pageBaseWidth;
    pageBaseWidth = pageBaseHeight;
    pageBaseHeight = temp;
  }

  const currentDate = new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex-1 overflow-auto flex justify-center p-2 sm:p-6 md:p-10 bg-slate-200/80 min-h-screen">
      {/* Zoom transform container */}
      <div
        className="transition-transform duration-150 origin-top flex flex-col items-center"
        style={{
          transform: `scale(${zoom / 100})`,
        }}
      >
        {/* Realistic Page Canvas */}
        <div
          className="document-page-canvas w-full max-w-[850px] bg-white rounded-lg shadow-xl border border-slate-300/60 transition-all flex flex-col"
          style={{
            minHeight: `${pageBaseHeight}mm`,
            width: '100%',
            maxWidth: `${pageBaseWidth}mm`,
            paddingTop: `${margins.top}mm`,
            paddingBottom: `${margins.bottom}mm`,
            paddingLeft: `${margins.left}mm`,
            paddingRight: `${margins.right}mm`,
          }}
        >
          {/* Header Area */}
          {showHeader && (
            <div
              className={`text-xs text-slate-400 pb-4 mb-4 border-b border-slate-100 flex items-center ${
                headerAlign === 'left'
                  ? 'justify-start'
                  : headerAlign === 'right'
                  ? 'justify-end'
                  : 'justify-center'
              }`}
            >
              <span>{headerText || 'DocMaster Document'}</span>
            </div>
          )}

          {/* Top Page Number if configured */}
          {pageNumberPosition.startsWith('top-') && (
            <div
              className={`text-[10px] text-slate-400 mb-2 flex ${
                pageNumberPosition === 'top-left'
                  ? 'justify-start'
                  : pageNumberPosition === 'top-right'
                  ? 'justify-end'
                  : 'justify-center'
              }`}
            >
              Page 1 of {Math.max(1, doc.pageCount)}
            </div>
          )}

          {/* Core Contenteditable Surface */}
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyUp={saveSelection}
            onMouseUp={saveSelection}
            onTouchEnd={saveSelection}
            spellCheck={spellCheck}
            lang={language}
            className={`editable-content doc-columns-${count} flex-1 focus:outline-none text-slate-800`}
            style={{
              columnCount: count,
              columnGap: `${gap}mm`,
              columnRule: showRule ? '1px solid #cbd5e1' : 'none',
              fontFamily: language === 'hi' ? '"Noto Sans Devanagari", sans-serif' : 'Arial, sans-serif',
            }}
          />

          {/* Bottom Page Number if configured */}
          {pageNumberPosition.startsWith('bottom-') && (
            <div
              className={`text-[10px] text-slate-400 mt-4 flex ${
                pageNumberPosition === 'bottom-left'
                  ? 'justify-start'
                  : pageNumberPosition === 'bottom-right'
                  ? 'justify-end'
                  : 'justify-center'
              }`}
            >
              Page 1 of {Math.max(1, doc.pageCount)}
            </div>
          )}

          {/* Footer Area */}
          {showFooter && (
            <div
              className={`text-xs text-slate-400 pt-4 mt-auto border-t border-slate-100 flex items-center justify-between`}
            >
              <div
                className={`flex-1 flex ${
                  footerAlign === 'left'
                    ? 'justify-start'
                    : footerAlign === 'right'
                    ? 'justify-end'
                    : 'justify-center'
                }`}
              >
                <span>{footerText || 'DocMaster'}</span>
              </div>
              {showDateInFooter && <span className="text-[10px] text-slate-400">{currentDate}</span>}
            </div>
          )}
        </div>

        {/* Page status pill below page */}
        <div className="no-print mt-4 mb-20 text-xs text-slate-500 font-medium px-3 py-1 bg-white/80 backdrop-blur-xs rounded-full shadow-xs border border-slate-200">
          Page 1 of {Math.max(1, doc.pageCount)} • {count} {count === 1 ? 'Column' : 'Columns'} ({gap}mm gap) • {doc.pageSettings.size}
        </div>
      </div>
    </div>
  );
};
