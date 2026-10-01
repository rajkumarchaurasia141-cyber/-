import React, { useRef } from 'react';
import { insertImageHtml } from '../../utils/editorCommands';
import { Image as ImageIcon, Upload, Camera, Sparkles, X } from 'lucide-react';

interface ImageSheetProps {
  onClose: () => void;
}

export const ImageSheet: React.FC<ImageSheetProps> = ({ onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          insertImageHtml(event.target.result as string, file.name);
          onClose();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const sampleImages = [
    {
      title: 'Company Seal / Badge',
      src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Executive Chart & Graph',
      src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Modern Office Tech',
      src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleInsertSample = (src: string, title: string) => {
    insertImageHtml(src, title);
    onClose();
  };

  return (
    <div className="p-5 max-w-lg mx-auto bg-white rounded-t-2xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-base">Insert Image</h3>
            <p className="text-xs text-slate-500">Upload photos, diagrams, or use camera</p>
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

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Actions */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-4 rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/50 hover:bg-purple-50 hover:border-purple-400 flex flex-col items-center justify-center text-center transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Upload className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-800">Upload from Device</span>
          <span className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, WebP</span>
        </button>

        <button
          onClick={() => cameraInputRef.current?.click()}
          className="p-4 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400 flex flex-col items-center justify-center text-center transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Camera className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-800">Take Photo</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Use Device Camera</span>
        </button>
      </div>

      {/* Sample Visual Assets */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Professional Assets
        </label>
        <div className="grid grid-cols-3 gap-2">
          {sampleImages.map((img, i) => (
            <div
              key={i}
              onClick={() => handleInsertSample(img.src, img.title)}
              className="group cursor-pointer rounded-lg overflow-hidden border border-slate-200 relative aspect-video bg-slate-100 hover:border-purple-500"
            >
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1">
                <span className="text-[9px] text-white font-medium line-clamp-1">{img.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
};
