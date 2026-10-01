import React, { useState, useEffect } from 'react';
import { DocumentData } from './types/document';
import {
  getAllDocuments,
  createNewDocument,
  deleteDocument,
  duplicateDocument,
  saveDocument,
} from './services/storage';
import { Dashboard } from './components/Dashboard';
import { DocumentEditor } from './components/DocumentEditor';
import { SettingsModal } from './components/sheets/SettingsModal';

export const App: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [currentDoc, setCurrentDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [spellCheck, setSpellCheck] = useState(true);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Load documents on initial launch
  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    setLoading(true);
    try {
      const list = await getAllDocuments();
      setDocuments(list);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = (templateId?: string) => {
    const newDoc = createNewDocument(templateId);
    saveDocument(newDoc).then(() => {
      setDocuments((prev) => [newDoc, ...prev]);
      setCurrentDoc(newDoc);
    });
  };

  const handleDuplicate = async (id: string) => {
    const clone = await duplicateDocument(id);
    if (clone) {
      setDocuments((prev) => [clone, ...prev]);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDocument(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    if (currentDoc?.id === id) {
      setCurrentDoc(null);
    }
  };

  const handleRename = async (id: string, newTitle: string) => {
    const docToUpdate = documents.find((d) => d.id === id);
    if (docToUpdate) {
      const updated = { ...docToUpdate, title: newTitle, updatedAt: Date.now() };
      await saveDocument(updated);
      setDocuments((prev) => prev.map((d) => (d.id === id ? updated : d)));
      if (currentDoc?.id === id) {
        setCurrentDoc(updated);
      }
    }
  };

  const handleBackToDashboard = () => {
    setCurrentDoc(null);
    loadDocs();
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-800">Loading DocMaster...</p>
        <p className="text-xs text-slate-400 mt-1">Initializing local storage & workspace</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-100 font-sans">
      {currentDoc ? (
        <DocumentEditor
          initialDocument={currentDoc}
          onBack={handleBackToDashboard}
        />
      ) : (
        <Dashboard
          documents={documents}
          onOpenDocument={(doc) => setCurrentDoc(doc)}
          onCreateNew={handleCreateNew}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          onRename={handleRename}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {showSettings && (
        <SettingsModal
          spellCheck={spellCheck}
          onToggleSpellCheck={setSpellCheck}
          language={language}
          onChangeLanguage={setLanguage}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default App;
