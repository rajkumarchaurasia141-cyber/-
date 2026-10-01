import React, { useRef, useEffect, useCallback, useMemo } from 'react';
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
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastHtmlRef = useRef<string>(doc.content);

  // Sync initial content once or on document ID change
  useEffect(() => {
    if (contentRef.current) {
      if (contentRef.current.innerHTML !== doc.content && doc.content !== lastHtmlRef.current) {
        contentRef.current.innerHTML = doc.content;
        lastHtmlRef.current = doc.content;
      }
    }
  }, [doc.id]);

  // Smooth debounced input handler - gives instant 60fps/120fps native typing with zero lag
  const handleInput = useCallback(() => {
    if (!contentRef.current) return;
    const currentHtml = contentRef.current.innerHTML;
    lastHtmlRef.current = currentHtml;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    // Debounce state update to parent so user experiences butter-smooth typing
    debounceTimerRef.current = setTimeout(() => {
      onContentChange(currentHtml);
    }, 280);

    saveSelection();
  }, [onContentChange]);

  const handleBlur = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (contentRef.current) {
      const currentHtml = contentRef.current.innerHTML;
      lastHtmlRef.current = currentHtml;
      onContentChange(currentHtml);
    }
  }, [onContentChange]);

  const { margins, orientation } = doc.pageSettings;
  const { count, gap, showRule } = doc.columnSettings;
  const {
    showHeader,
    headerText,
    headerAlign,
    showFooter,
    footerText,
    footerAlign,
    pageNumberPosition,
    showDateInFooter,
  } = doc.headerFooterSettings;

  // STRICT A4 DIMENSIONS (210mm x 297mm)
  const isLandscape = orientation === 'landscape';
  const pageBaseWidthMm = isLandscape ? 297 : 210;
  const pageBaseHeightMm = isLandscape ? 210 : 297;

  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, [language]);

  return (
    <div
      className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center p-2 sm:p-6 md:p-8 bg-slate-200/90 min-h-screen"
      style={{
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain',
        scrollBehavior: 'smooth',
      }}
    >
      {/* Zoom transform container */}
      <div
        className="w-full flex flex-col items-center transition-transform duration-100 origin-top"
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
        }}
      >
        {/* A4 Sheet Dimensions Indicator */}
        <div className="no-print mb-2 flex items-center gap-2 text-[11px] font-semibold text-slate-500 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full shadow-2xs border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span>A4 साइज़ (210 × 297 mm)</span>
          <span className="text-slate-300">•</span>
          <span className="capitalize">{orientation}</span>
          <span className="text-slate-300">•</span>
          <span>{count} {count === 1 ? 'कॉलम' : 'कॉलम'}</span>
        </div>

        {/* Real A4 Paper Canvas */}
        <div
          className="document-page-canvas w-full bg-white rounded-md shadow-2xl border border-slate-300/80 transition-all flex flex-col relative"
          style={{
            width: '100%',
            maxWidth: `${pageBaseWidthMm}mm`,
            minHeight: `${pageBaseHeightMm}mm`,
            paddingTop: `${margins.top}mm`,
            paddingBottom: `${margins.bottom}mm`,
            paddingLeft: `${margins.left}mm`,
            paddingRight: `${margins.right}mm`,
            boxSizing: 'border-box',
          }}
        >
          {/* Header Area */}
          {showHeader && (
            <div
              className={`text-xs text-slate-400 pb-3 mb-3 border-b border-slate-100 flex items-center select-none ${
                headerAlign === 'left'
                  ? 'justify-start'
                  : headerAlign === 'right'
                  ? 'justify-end'
                  : 'justify-center'
              }`}
            >
              <span>{headerText || 'DocMaster A4 Document'}</span>
            </div>
          )}

          {/* Top Page Number */}
          {pageNumberPosition.startsWith('top-') && (
            <div
              className={`text-[10px] text-slate-400 mb-2 flex select-none ${
                pageNumberPosition === 'top-left'
                  ? 'justify-start'
                  : pageNumberPosition === 'top-right'
                  ? 'justify-end'
                  : 'justify-center'
              }`}
            >
              पृष्ठ 1 / 1 (A4)
            </div>
          )}

          {/* Core Contenteditable Surface */}
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onBlur={handleBlur}
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
              minHeight: '100%',
              lineHeight: 1.6,
            }}
          />

          {/* Bottom Page Number */}
          {pageNumberPosition.startsWith('bottom-') && (
            <div
              className={`text-[10px] text-slate-400 mt-4 flex select-none ${
                pageNumberPosition === 'bottom-left'
                  ? 'justify-start'
                  : pageNumberPosition === 'bottom-right'
                  ? 'justify-end'
                  : 'justify-center'
              }`}
            >
              पृष्ठ 1 / 1 (A4)
            </div>
          )}

          {/* Footer Area */}
          {showFooter && (
            <div
              className={`text-xs text-slate-400 pt-3 mt-auto border-t border-slate-100 flex items-center justify-between select-none`}
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
        <div className="no-print mt-4 mb-24 text-xs text-slate-500 font-medium px-4 py-1.5 bg-white/90 backdrop-blur-xs rounded-full shadow-xs border border-slate-200">
          A4 Standard Sheet • {doc.wordCount || 0} शब्द • स्वतः सुरक्षित (Autosaved)
        </div>
      </div>
    </div>
  );
};
