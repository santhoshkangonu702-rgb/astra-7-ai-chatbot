import React, { useState } from 'react';
import {
  Settings,
  Palette,
  Moon,
  Sun,
  Volume2,
  Bell,
  Smartphone,
  Shield,
  Trash2,
  Download,
  RotateCcw,
  Check,
  Zap,
  Sliders
} from 'lucide-react';
import { AppTheme, AccentColor } from '../../types';

interface SettingsScreenProps {
  currentTheme: AppTheme;
  currentAccent: AccentColor;
  onThemeChange: (theme: AppTheme) => void;
  onAccentChange: (accent: AccentColor) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  currentTheme,
  currentAccent,
  onThemeChange,
  onAccentChange
}) => {
  const [animations, setAnimations] = useState(true);
  const [sounds, setSounds] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const themes: { id: AppTheme; label: string; desc: string }[] = [
    { id: 'light', label: 'Crisp Light', desc: 'Default bright, clean glassmorphic aesthetic' },
    { id: 'dark', label: 'Astral Dark', desc: 'Deep space contrast for nighttime productivity' },
    { id: 'pastel', label: 'Soft Pastel', desc: 'Gentle warm tones and soft gradient shadows' },
    { id: 'ocean', label: 'Ocean Breeze', desc: 'Deep cyan and oceanic turquoise palette' },
  ];

  const accents: { id: AccentColor; label: string; bg: string; border: string }[] = [
    { id: 'purple', label: 'Cosmic Purple', bg: 'bg-indigo-600', border: 'border-indigo-600' },
    { id: 'blue', label: 'Electric Blue', bg: 'bg-blue-600', border: 'border-blue-600' },
    { id: 'pink', label: 'Neon Pink', bg: 'bg-pink-600', border: 'border-pink-600' },
    { id: 'orange', label: 'Solar Orange', bg: 'bg-amber-500', border: 'border-amber-500' },
    { id: 'green', label: 'Emerald Mint', bg: 'bg-emerald-600', border: 'border-emerald-600' },
    { id: 'cyan', label: 'Cyber Cyan', bg: 'bg-cyan-500', border: 'border-cyan-500' },
  ];

  const handleClearCache = () => {
    if (window.confirm('Clear all local app cache and reset settings?')) {
      localStorage.clear();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Settings & Preferences</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customize appearance themes, accent palettes, interaction toggles, and system storage.
              </p>
            </div>
          </div>
        </div>

        {/* Appearance Themes */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Palette className="w-4 h-4 text-indigo-500" />
            <span>Visual Theme Mode</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {themes.map((t) => (
              <div
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  currentTheme === t.id
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                }`}
              >
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{t.label}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.desc}</div>
                </div>
                {currentTheme === t.id && (
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Accent Color Picker */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Sliders className="w-4 h-4 text-indigo-500" />
            <span>Accent Highlight Color</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {accents.map((acc) => (
              <button
                key={acc.id}
                onClick={() => onAccentChange(acc.id)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                  currentAccent === acc.id
                    ? 'border-slate-900 dark:border-white shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                }`}
              >
                <span className={`w-8 h-8 rounded-full ${acc.bg} shadow-sm flex items-center justify-center text-white`}>
                  {currentAccent === acc.id && <Check className="w-4 h-4" />}
                </span>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{acc.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* System & Interaction Toggles */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Interactions & Feedback
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Smooth Animations</div>
                <div className="text-slate-500">Enable fluid transitions and card hover elevations</div>
              </div>
              <input
                type="checkbox"
                checked={animations}
                onChange={(e) => setAnimations(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Auditory Effects</div>
                <div className="text-slate-500">Play subtle chimes on message reception and flashcard flips</div>
              </div>
              <input
                type="checkbox"
                checked={sounds}
                onChange={(e) => setSounds(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Productivity Reminders</div>
                <div className="text-slate-500">Show tips and spaced-repetition study flashcard alerts</div>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Haptic Vibration</div>
                <div className="text-slate-500">Vibrate mobile devices on button press and task completion</div>
              </div>
              <input
                type="checkbox"
                checked={haptics}
                onChange={(e) => setHaptics(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>
          </div>
        </div>

        {/* Data & Cache Management */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Storage & Maintenance
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleClearCache}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset Local Cache & Preferences</span>
            </button>
          </div>

          {savedSuccess && (
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>Settings and cache successfully refreshed!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
