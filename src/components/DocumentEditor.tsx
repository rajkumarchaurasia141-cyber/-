import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { saveDocument } from '../services/storage';
import { exportAsPdf, exportAsDocx, exportAsTxt, exportAsHtml } from '../services/export';
import { executeCommand, restoreSelection, saveSelection } from '../utils/editorCommands';
import confetti from 'canvas-confetti';

interface DocumentEditorProps {
  initialDocument: DocumentData;
  onBack: () => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({ initialDocument, onBack }) => {
  const [doc, setDoc] = useState<DocumentData>(initialDocument);
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);
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
    }, 1200);
  }, []);

  const handleContentChange = (newHtml: string) => {
    const updated: DocumentData = {
      ...doc,
      content: newHtml,
      updatedAt: Date.now(),
    };
    setDoc(updated);
    triggerAutosave(updated);
  };

  const handleUpdateTitle = (newTitle: string) => {
    const updated: DocumentData = {
      ...doc,
      title: newTitle,
      updatedAt: Date.now(),
    };
    setDoc(updated);
    triggerAutosave(updated);
  };

  const handleUpdateColumns = (columnSettings: ColumnSettings) => {
    const updated: DocumentData = {
      ...doc,
      columnSettings,
      updatedAt: Date.now(),
    };
    setDoc(updated);
    triggerAutosave(updated);
  };

  const handleUpdatePageSetup = (pageSettings: PageSettings) => {
    const updated: DocumentData = {
      ...doc,
      pageSettings,
      updatedAt: Date.now(),
    };
    setDoc(updated);
    triggerAutosave(updated);
  };

  const handleUpdateHeaderFooter = (headerFooterSettings: HeaderFooterSettings) => {
    const updated: DocumentData = {
      ...doc,
      headerFooterSettings,
      updatedAt: Date.now(),
    };
    setDoc(updated);
    triggerAutosave(updated);
  };

  // Export handlers
  const handlePrint = () => {
    exportAsPdf(doc);
  };

  const handleExport = (type: 'pdf' | 'docx' | 'txt' | 'html') => {
    if (type === 'pdf') {
      exportAsPdf(doc);
    } else if (type === 'docx') {
      exportAsDocx(doc);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    } else if (type === 'txt') {
      exportAsTxt(doc);
    } else if (type === 'html') {
      exportAsHtml(doc);
    }
  };

  // Keyboard shortcuts listener
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
          saveDocument(doc).then(() => {
            setSaveStatus('saved_just_now');
            setTimeout(() => setSaveStatus('saved'), 2000);
          });
        } else if (e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          handlePrint();
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
  }, [doc]);

  // Calculate live statistics
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = doc.content;
  const rawText = (tempDiv.textContent || tempDiv.innerText || '').trim();
  const wordList = rawText.split(/\s+/).filter(Boolean);
  const stats: DocumentStats = {
    words: wordList.length,
    characters: rawText.length,
    charactersWithoutSpaces: rawText.replace(/\s+/g, '').length,
    paragraphs: (doc.content.match(/<(p|h[1-6]|li|blockquote)[^>]*>/gi) || []).length || 1,
    pages: Math.max(1, Math.ceil(wordList.length / 450)),
    readingTimeMinutes: wordList.length / 200,
  };

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

      {/* Main Canvas Document Area */}
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
          activeSheet={activeSheet}
          activeFontName={currentFontName}
          activeFontSize={currentFontSize}
          columnCount={doc.columnSettings.count}
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
