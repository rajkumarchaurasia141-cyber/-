export type PageSize = 'A4' | 'A5' | 'Letter' | 'Legal';
export type PageOrientation = 'portrait' | 'landscape';
export type MarginType = 'normal' | 'narrow' | 'moderate' | 'wide' | 'custom';

export interface PageMargins {
  top: number; // in mm
  bottom: number;
  left: number;
  right: number;
}

export interface PageSettings {
  size: PageSize;
  orientation: PageOrientation;
  marginType: MarginType;
  margins: PageMargins;
  backgroundColor: string;
}

export interface ColumnSettings {
  count: 1 | 2 | 3 | 4 | 5;
  gap: number; // in mm
  showRule: boolean; // vertical line between columns
  applyTo: 'whole-document' | 'selection';
}

export type PageNumberPosition =
  | 'none'
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface HeaderFooterSettings {
  showHeader: boolean;
  headerText: string;
  headerAlign: 'left' | 'center' | 'right';
  showFooter: boolean;
  footerText: string;
  footerAlign: 'left' | 'center' | 'right';
  pageNumberPosition: PageNumberPosition;
  showDateInFooter: boolean;
}

export interface DocumentData {
  id: string;
  title: string;
  content: string; // rich HTML content
  createdAt: number;
  updatedAt: number;
  wordCount: number;
  pageCount: number;
  pageSettings: PageSettings;
  columnSettings: ColumnSettings;
  headerFooterSettings: HeaderFooterSettings;
  pinned?: boolean;
}

export interface DocumentStats {
  words: number;
  characters: number;
  charactersWithoutSpaces: number;
  paragraphs: number;
  pages: number;
  readingTimeMinutes: number;
}

export interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  category: 'General' | 'Education' | 'Business' | 'Personal';
  icon: string;
  content: string;
  pageSettings?: Partial<PageSettings>;
  columnSettings?: Partial<ColumnSettings>;
}

export type ActiveSheet =
  | null
  | 'columns'
  | 'fonts'
  | 'fontSize'
  | 'colors'
  | 'paragraph'
  | 'tables'
  | 'images'
  | 'shapes'
  | 'pageSetup'
  | 'headerFooter'
  | 'findReplace'
  | 'stats'
  | 'settings'
  | 'commandPalette'
  | 'export';
