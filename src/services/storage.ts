import { DocumentData, PageSettings, ColumnSettings, HeaderFooterSettings } from '../types/document';
import { DOCUMENT_TEMPLATES } from '../constants/templates';

const DB_NAME = 'docmaster_db';
const DB_VERSION = 1;
const STORE_NAME = 'documents';
const LOCAL_STORAGE_KEY = 'docmaster_docs_v1';

export const DEFAULT_PAGE_SETTINGS: PageSettings = {
  size: 'A4',
  orientation: 'portrait',
  marginType: 'normal',
  margins: { top: 25.4, bottom: 25.4, left: 25.4, right: 25.4 }, // 1 inch in mm
  backgroundColor: '#ffffff',
};

export const DEFAULT_COLUMN_SETTINGS: ColumnSettings = {
  count: 1,
  gap: 15, // 15mm
  showRule: false,
  applyTo: 'whole-document',
};

export const DEFAULT_HEADER_FOOTER: HeaderFooterSettings = {
  showHeader: false,
  headerText: 'DocMaster Document',
  headerAlign: 'center',
  showFooter: true,
  footerText: '',
  footerAlign: 'center',
  pageNumberPosition: 'bottom-center',
  showDateInFooter: false,
};

// Open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };
  });
}

// Fallback to localStorage
function getDocsFromLocalStorage(): DocumentData[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDocsToLocalStorage(docs: DocumentData[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(docs));
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }
}

export function calculateWordCount(html: string): number {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  const text = (temp.textContent || temp.innerText || '').trim();
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

export async function getAllDocuments(): Promise<DocumentData[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => {
        const results = (request.result as DocumentData[]) || [];
        if (results.length === 0) {
          // Initialize sample doc
          initDefaultDocuments().then(resolve);
        } else {
          // sort descending by updatedAt
          results.sort((a, b) => b.updatedAt - a.updatedAt);
          resolve(results);
        }
      };
      request.onerror = () => {
        const fallback = getDocsFromLocalStorage();
        if (fallback.length === 0) {
          initDefaultDocuments().then(resolve);
        } else {
          resolve(fallback);
        }
      };
    });
  } catch {
    const fallback = getDocsFromLocalStorage();
    if (fallback.length === 0) {
      return initDefaultDocuments();
    }
    return fallback;
  }
}

export async function getDocumentById(id: string): Promise<DocumentData | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => {
        const fallback = getDocsFromLocalStorage().find((d) => d.id === id) || null;
        resolve(fallback);
      };
    });
  } catch {
    const fallback = getDocsFromLocalStorage().find((d) => d.id === id) || null;
    return fallback;
  }
}

export async function saveDocument(doc: DocumentData): Promise<void> {
  doc.updatedAt = Date.now();
  doc.wordCount = calculateWordCount(doc.content);

  // Sync to local storage
  const localList = getDocsFromLocalStorage();
  const idx = localList.findIndex((d) => d.id === doc.id);
  if (idx >= 0) {
    localList[idx] = doc;
  } else {
    localList.unshift(doc);
  }
  saveDocsToLocalStorage(localList);

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(doc);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB save failed, saved to localStorage fallback:', err);
  }
}

export async function deleteDocument(id: string): Promise<void> {
  const localList = getDocsFromLocalStorage().filter((d) => d.id !== id);
  saveDocsToLocalStorage(localList);

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB delete failed, removed from localStorage:', err);
  }
}

export async function duplicateDocument(id: string): Promise<DocumentData | null> {
  const original = await getDocumentById(id);
  if (!original) return null;

  const clone: DocumentData = {
    ...original,
    id: 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    title: `${original.title} (Copy)`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await saveDocument(clone);
  return clone;
}

export function createNewDocument(templateId: string = 'blank', customTitle?: string): DocumentData {
  const template = DOCUMENT_TEMPLATES.find((t) => t.id === templateId) || DOCUMENT_TEMPLATES[0];

  const now = Date.now();
  return {
    id: 'doc_' + now + '_' + Math.random().toString(36).substring(2, 7),
    title: customTitle || (template.id === 'blank' ? 'Untitled Document' : template.title),
    content: template.content,
    createdAt: now,
    updatedAt: now,
    wordCount: calculateWordCount(template.content),
    pageCount: 1,
    pageSettings: {
      ...DEFAULT_PAGE_SETTINGS,
      ...(template.pageSettings || {}),
    },
    columnSettings: {
      ...DEFAULT_COLUMN_SETTINGS,
      ...(template.columnSettings || {}),
    },
    headerFooterSettings: {
      ...DEFAULT_HEADER_FOOTER,
    },
  };
}

async function initDefaultDocuments(): Promise<DocumentData[]> {
  const welcomeTemplate = DOCUMENT_TEMPLATES.find((t) => t.id === 'welcome') || DOCUMENT_TEMPLATES[0];
  const sampleDoc: DocumentData = {
    id: 'doc_welcome_sample',
    title: 'Welcome to DocMaster',
    content: welcomeTemplate.content,
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now(),
    wordCount: calculateWordCount(welcomeTemplate.content),
    pageCount: 2,
    pageSettings: {
      ...DEFAULT_PAGE_SETTINGS,
    },
    columnSettings: {
      count: 2,
      gap: 18,
      showRule: true,
      applyTo: 'whole-document',
    },
    headerFooterSettings: {
      ...DEFAULT_HEADER_FOOTER,
      headerText: 'DocMaster • Mobile-First Editor',
      showHeader: true,
    },
    pinned: true,
  };

  await saveDocument(sampleDoc);
  return [sampleDoc];
}
