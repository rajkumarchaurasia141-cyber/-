import React from 'react';
import { Settings, Moon, Sun, Check, X, Globe } from 'lucide-react';

interface SettingsModalProps {
  spellCheck: boolean;
  onToggleSpellCheck: (val: boolean) => void;
  language: 'en' | 'hi';
  onChangeLanguage: (lang: 'en' | 'hi') => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  spellCheck,
  onToggleSpellCheck,
  language,
  onChangeLanguage,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 border border-slate-100">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
              <Settings className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-800 text-base">Editor Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 mb-5">
          {/* Spell check */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div>
              <span className="text-xs font-semibold text-slate-800 block">Spell Checking</span>
              <span className="text-[10px] text-slate-500">Browser red underline for typos</span>
            </div>
            <button
              onClick={() => onToggleSpellCheck(!spellCheck)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                spellCheck ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  spellCheck ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Primary Language */}
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-xs font-semibold text-slate-800 block mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-500" /> Document Language
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChangeLanguage('en')}
                className={`py-2 px-3 text-xs rounded-lg border text-left flex items-center justify-between ${
                  language === 'en'
                    ? 'border-blue-600 bg-blue-50 text-blue-800 font-semibold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <span>English (US)</span>
                {language === 'en' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>
              <button
                onClick={() => onChangeLanguage('hi')}
                className={`py-2 px-3 text-xs rounded-lg border text-left flex items-center justify-between ${
                  language === 'hi'
                    ? 'border-blue-600 bg-blue-50 text-blue-800 font-semibold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <span>हिंदी (Hindi)</span>
                {language === 'hi' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>
            </div>
          </div>

          {/* Autosave status */}
          <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
            <span className="text-xs font-semibold text-emerald-800 block mb-1">Local Autosave Active</span>
            <p className="text-[11px] text-emerald-600">
              Documents are automatically saved to your device via IndexedDB. Work is retained across refreshes and offline sessions.
            </p>
          </div>
        </div>

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
