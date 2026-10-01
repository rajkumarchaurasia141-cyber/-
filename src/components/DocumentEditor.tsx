import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  DocumentData,
  ActiveSheet,
  PageSettings,
  ColumnSettings,
  HeaderFooterSettings,
  DocumentStats,
} from '../types/document';
import { EditorTopBar } from './EditorTopBar';
import { DesktopRibbon } from './DesktopRibbon';
import { Canvas } from './Canvas';
import { MobileBottomBar } from './MobileBottomBar';
import { ColumnSheet } from './sheets/ColumnSheet';
import { FontSheet } from './sheets/FontSheet';
import { FontSizeSheet } from './sheets/FontSizeSheet';
import { ColorSheet } from './sheets/ColorSheet';
import { ParagraphSheet } from './sheets/ParagraphSheet';
import { TableSheet } from './sheets/TableSheet';
import { ImageSheet } from './sheets/ImageSheet';
import { ShapesSheet } from './sheets/ShapesSheet';
import { PageSetupSheet } from './sheets/PageSetupSheet';
import { HeaderFooterSheet } from './sheets/HeaderFooterSheet';
import { FindReplaceModal } from './sheets/FindReplaceModal';
import { StatsModal } from './sheets/StatsModal';
import { SettingsModal } from './sheets/SettingsModal';
import { CommandPalette } from './sheets/CommandPalette';
import { DownloadModal } from './sheets/DownloadModal';
import { saveDocument } from '../services/storage';
import { exportAsPdf, exportAsDocx, exportAsTxt, exportAsHtml } from '../services/export';
import { executeCommand } from '../utils/editorCommands';
import confetti from 'canvas-confetti';

interface DocumentEditorProps {
  initialDocument: DocumentData;
  onBack: () => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({ initialDocument, onBack }) => {
  const [doc, setDoc] = useState<DocumentData>(initialDocument);
  const docRef = useRef<DocumentData>(initialDocument);
  docRef.current = doc;

  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | 'saved_just_now'>('saved');
  const [zoom, setZoom] = useState(100);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [spellCheck, setSpellCheck] = useState(true);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Active typography state
  const [currentFontName, setCurrentFontName] = useState('Arial');
  const [currentFontSize, setCurrentFontSize] = useState(16);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Autosave debouncer
  const triggerAutosave = useCallback((updatedDoc: DocumentData) => {
    setSaveStatus('saving');
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveDocument(updatedDoc);
        setSaveStatus('saved_just_now');
        setTimeout(() => setSaveStatus('saved'), 2500);
      } catch (err) {
        console.error('Failed to autosave:', err);
        setSaveStatus('saved');
      }
    }, 1000);
  }, []);

  const handleContentChange = useCallback((newHtml: string) => {
    setDoc((prev) => {
      const updated: DocumentData = {
        ...prev,
        content: newHtml,
        updatedAt: Date.now(),
      };
      triggerAutosave(updated);
      return updated;
    });
  }, [triggerAutosave]);

  const handleUpdateTitle = useCallback((newTitle: string) => {
    setDoc((prev) => {
      const updated: DocumentData = {
        ...prev,
        title: newTitle,
        updatedAt: Date.now(),
      };
      triggerAutosave(updated);
      return updated;
    });
  }, [triggerAutosave]);

  const handleUpdateColumns = useCallback((columnSettings: ColumnSettings) => {
    setDoc((prev) => {
      const updated: DocumentData = {
        ...prev,
        columnSettings,
        updatedAt: Date.now(),
      };
      triggerAutosave(updated);
      return updated;
    });
  }, [triggerAutosave]);

  const handleUpdatePageSetup = useCallback((pageSettings: PageSettings) => {
    setDoc((prev) => {
      const updated: DocumentData = {
        ...prev,
        pageSettings,
        updatedAt: Date.now(),
      };
      triggerAutosave(updated);
      return updated;
    });
  }, [triggerAutosave]);

  const handleUpdateHeaderFooter = useCallback((headerFooterSettings: HeaderFooterSettings) => {
    setDoc((prev) => {
      const updated: DocumentData = {
        ...prev,
        headerFooterSettings,
        updatedAt: Date.now(),
      };
      triggerAutosave(updated);
      return updated;
    });
  }, [triggerAutosave]);

  // Export handlers
  const handlePrint = useCallback(() => {
    exportAsPdf(docRef.current);
  }, []);

  const handleExport = useCallback((type: 'pdf' | 'docx' | 'txt' | 'html') => {
    const current = docRef.current;
    if (type === 'pdf') {
      exportAsPdf(current);
    } else if (type === 'docx') {
      exportAsDocx(current);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    } else if (type === 'txt') {
      exportAsTxt(current);
    } else if (type === 'html') {
      exportAsHtml(current);
    }
  }, []);

  // Keyboard shortcuts listener - attached ONCE for butter-smooth execution
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        if (e.key === 'b' || e.key === 'B') {
          e.preventDefault();
          executeCommand('bold');
        } else if (e.key === 'i' || e.key === 'I') {
          e.preventDefault();
          executeCommand('italic');
        } else if (e.key === 'u' || e.key === 'U') {
          e.preventDefault();
          executeCommand('underline');
        } else if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          saveDocument(docRef.current).then(() => {
            setSaveStatus('saved_just_now');
            setTimeout(() => setSaveStatus('saved'), 2000);
          });
        } else if (e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          handlePrint();
        } else if (e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          setShowDownloadModal(true);
        } else if (e.key === 'f' || e.key === 'F') {
          e.preventDefault();
          setActiveSheet('findReplace');
        } else if (e.key === 'k' || e.key === 'K') {
          e.preventDefault();
          setActiveSheet('commandPalette');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrint]);

  // Compute live statistics only when needed (e.g. for stats modal)
  const stats = useMemo<DocumentStats>(() => {
    if (activeSheet !== 'stats') {
      return {
        words: doc.wordCount || 0,
        characters: 0,
        charactersWithoutSpaces: 0,
        paragraphs: 1,
        pages: 1,
        readingTimeMinutes: 1,
      };
    }
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = doc.content;
    const rawText = (tempDiv.textContent || tempDiv.innerText || '').trim();
    const wordList = rawText.split(/\s+/).filter(Boolean);
    return {
      words: wordList.length,
      characters: rawText.length,
      charactersWithoutSpaces: rawText.replace(/\s+/g, '').length,
      paragraphs: (doc.content.match(/<(p|h[1-6]|li|blockquote)[^>]*>/gi) || []).length || 1,
      pages: Math.max(1, Math.ceil(wordList.length / 450)),
      readingTimeMinutes: Math.max(1, Math.round(wordList.length / 200)),
    };
  }, [activeSheet, doc.content, doc.wordCount]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-100 select-text">
      {/* Top Header */}
      {!isFocusMode && (
        <EditorTopBar
          title={doc.title}
          onUpdateTitle={handleUpdateTitle}
          saveStatus={saveStatus}
          onBack={onBack}
          onOpenSheet={setActiveSheet}
          onPrint={handlePrint}
          onExport={handleExport}
          onOpenDownloadModal={() => setShowDownloadModal(true)}
          zoom={zoom}
          onZoomChange={setZoom}
          isFocusMode={isFocusMode}
          onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
        />
      )}

      {/* Focus Mode Exit Floating Pill */}
      {isFocusMode && (
        <div className="no-print fixed top-4 right-4 z-50">
          <button
            onClick={() => setIsFocusMode(false)}
            className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full text-xs font-medium shadow-lg backdrop-blur-xs flex items-center gap-1.5 transition-all"
          >
            Exit Focus Mode
          </button>
        </div>
      )}

      {/* Desktop Ribbon Toolbar */}
      {!isFocusMode && (
        <DesktopRibbon
          onOpenSheet={setActiveSheet}
          currentFont={currentFontName}
          currentFontSize={currentFontSize}
          columnCount={doc.columnSettings.count}
        />
      )}

      {/* Main Canvas Document Area (A4 Standard) */}
      <Canvas
        document={doc}
        onContentChange={handleContentChange}
        zoom={zoom}
        spellCheck={spellCheck}
        language={language}
      />

      {/* Mobile Floating Bottom Bar */}
      {!isFocusMode && (
        <MobileBottomBar
          onOpenSheet={setActiveSheet}
          onOpenDownloadModal={() => setShowDownloadModal(true)}
          activeSheet={activeSheet}
          activeFontName={currentFontName}
          activeFontSize={currentFontSize}
          columnCount={doc.columnSettings.count}
        />
      )}

      {/* Download / Export Modal */}
      {showDownloadModal && (
        <DownloadModal
          document={doc}
          onClose={() => setShowDownloadModal(false)}
        />
      )}

      {/* Bottom Sheet Backdrop & Drawers */}
      {activeSheet && (
        <div className="no-print bottom-sheet-overlay fixed inset-0 z-40 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-lg">
            {activeSheet === 'columns' && (
              <ColumnSheet
                settings={doc.columnSettings}
                onUpdate={handleUpdateColumns}
                onClose={() => setActiveSheet(null)}
              />
            )}

            {activeSheet === 'fonts' && (
              <FontSheet
                currentFont={currentFontName}
                onSelectFont={(f) => {
                  setCurrentFontName(f.name);
                }}
                onClose={() => setActiveSheet(null)}
              />
            )}

            {activeSheet === 'fontSize' && (
              <FontSizeSheet
                currentSize={currentFontSize}
                onSelectSize={setCurrentFontSize}
                onClose={() => setActiveSheet(null)}
              />
            )}

            {activeSheet === 'colors' && (
              <ColorSheet onClose={() => setActiveSheet(null)} />
            )}

            {activeSheet === 'paragraph' && (
              <ParagraphSheet onClose={() => setActiveSheet(null)} />
            )}

            {activeSheet === 'tables' && (
              <TableSheet onClose={() => setActiveSheet(null)} />
            )}

            {activeSheet === 'images' && (
              <ImageSheet onClose={() => setActiveSheet(null)} />
            )}

            {activeSheet === 'shapes' && (
              <ShapesSheet onClose={() => setActiveSheet(null)} />
            )}

            {activeSheet === 'pageSetup' && (
              <PageSetupSheet
                settings={doc.pageSettings}
                onUpdate={handleUpdatePageSetup}
                onClose={() => setActiveSheet(null)}
              />
            )}

            {activeSheet === 'headerFooter' && (
              <HeaderFooterSheet
                settings={doc.headerFooterSettings}
                onUpdate={handleUpdateHeaderFooter}
                onClose={() => setActiveSheet(null)}
              />
            )}
          </div>
        </div>
      )}

      {/* Global Modals */}
      {activeSheet === 'findReplace' && (
        <FindReplaceModal onClose={() => setActiveSheet(null)} />
      )}

      {activeSheet === 'stats' && (
        <StatsModal stats={stats} onClose={() => setActiveSheet(null)} />
      )}

      {activeSheet === 'settings' && (
        <SettingsModal
          spellCheck={spellCheck}
          onToggleSpellCheck={setSpellCheck}
          language={language}
          onChangeLanguage={setLanguage}
          onClose={() => setActiveSheet(null)}
        />
      )}

      {activeSheet === 'commandPalette' && (
        <CommandPalette
          onOpenSheet={(sheet) => setActiveSheet(sheet)}
          onPrint={handlePrint}
          onExport={handleExport}
          onClose={() => setActiveSheet(null)}
        />
      )}
    </div>
  );
};
