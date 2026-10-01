export interface FontOption {
  id: string;
  name: string;
  family: string;
  category: 'sans-serif' | 'serif' | 'monospace' | 'display' | 'handwriting' | 'indic';
  description: string;
}

export const AVAILABLE_FONTS: FontOption[] = [
  { id: 'arial', name: 'Arial', family: 'Arial, sans-serif', category: 'sans-serif', description: 'Clean modern standard' },
  { id: 'helvetica', name: 'Helvetica', family: 'Helvetica, Arial, sans-serif', category: 'sans-serif', description: 'Timeless Swiss typography' },
  { id: 'georgia', name: 'Georgia', family: 'Georgia, serif', category: 'serif', description: 'Elegant editorial serif' },
  { id: 'times', name: 'Times New Roman', family: '"Times New Roman", Times, serif', category: 'serif', description: 'Traditional academic' },
  { id: 'verdana', name: 'Verdana', family: 'Verdana, Geneva, sans-serif', category: 'sans-serif', description: 'High legibility on small screens' },
  { id: 'tahoma', name: 'Tahoma', family: 'Tahoma, Geneva, sans-serif', category: 'sans-serif', description: 'Compact clear lettering' },
  { id: 'trebuchet', name: 'Trebuchet MS', family: '"Trebuchet MS", sans-serif', category: 'sans-serif', description: 'Geometric contemporary' },
  { id: 'courier', name: 'Courier New', family: '"Courier New", Courier, monospace', category: 'monospace', description: 'Classic typewriter' },
  { id: 'garamond', name: 'Garamond', family: 'Garamond, "EB Garamond", serif', category: 'serif', description: 'Refined classical book type' },
  { id: 'palatino', name: 'Palatino', family: '"Palatino Linotype", Palatino, serif', category: 'serif', description: 'Sophisticated humanist serif' },
  { id: 'impact', name: 'Impact', family: 'Impact, Haettenschweiler, sans-serif', category: 'display', description: 'Bold heavy headings' },
  { id: 'comic', name: 'Comic Sans MS', family: '"Comic Sans MS", "Comic Neue", cursive', category: 'handwriting', description: 'Casual friendly script' },
  { id: 'calibri', name: 'Calibri', family: 'Calibri, Carlito, sans-serif', category: 'sans-serif', description: 'Standard modern document font' },
  { id: 'cambria', name: 'Cambria', family: 'Cambria, Georgia, serif', category: 'serif', description: 'Crisp on-screen serif' },
  { id: 'roboto', name: 'Roboto', family: 'Roboto, sans-serif', category: 'sans-serif', description: 'Android native geometric sans' },
  { id: 'inter', name: 'Inter', family: 'Inter, sans-serif', category: 'sans-serif', description: 'Popular digital interface font' },
  { id: 'poppins', name: 'Poppins', family: 'Poppins, sans-serif', category: 'sans-serif', description: 'Friendly geometric rounded' },
  { id: 'merriweather', name: 'Merriweather', family: 'Merriweather, Georgia, serif', category: 'serif', description: 'Designed for long-form reading' },
  { id: 'noto_devanagari', name: 'Noto Sans Devanagari (हिंदी)', family: '"Noto Sans Devanagari", sans-serif', category: 'indic', description: 'Devanagari Hindi Unicode text' },
  { id: 'playfair', name: 'Playfair Display', family: '"Playfair Display", serif', category: 'display', description: 'High contrast display serif' },
];

export const QUICK_FONT_SIZES = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96, 100
];
