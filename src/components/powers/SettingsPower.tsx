import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Calendar,
  Sparkles,
  Shield,
  CreditCard,
  CheckCircle2,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { UserProfile } from '../../types';

interface SettingsPowerProps {
  currentUser: UserProfile;
  onUpdateTier: (tier: 'free' | 'plus' | 'pro') => void;
}

export const SettingsPower: React.FC<SettingsPowerProps> = ({ currentUser, onUpdateTier }) => {
  const [language, setLanguage] = useState('en');
  const [eraFormat, setEraFormat] = useState('bce_ce');
  const [theme, setTheme] = useState('dark');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const tiers = [
    {
      id: 'free' as const,
      name: 'Free Starter',
      price: '$0',
      period: 'Forever',
      features: ['Astra Chat standard tier', 'Ancient Database browsing', 'Standard search queries', '10 Scholar flashcards/day']
    },
    {
      id: 'plus' as const,
      name: 'Astra Plus',
      price: '$9',
      period: 'per month',
      popular: true,
      features: ['Full 7 Powers access', 'Deep Web Research mode', 'High-res artifact inspections', 'Unlimited Scholar quizzes', 'Export to PDF & Markdown']
    },
    {
      id: 'pro' as const,
      name: 'Astra Scholar Pro',
      price: '$25',
      period: 'per month',
      features: ['Everything in Plus', 'Dedicated Archaeological API', 'Bulk dataset uploads', 'Direct curation submission', 'Priority server-side reasoning']
    }
  ];

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>GLOBAL PREFERENCES</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Settings & Subscription Management
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure language preferences, historical chronological notation, and account tiers.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Preferences saved successfully!</span>
        </div>
      )}

      {/* Preferences form */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-5">
        <h3 className="text-sm font-bold text-white">General Configuration</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Primary Display Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500/40"
            >
              <option value="en">English (US)</option>
              <option value="es">Español (Spanish)</option>
              <option value="fr">Français (French)</option>
              <option value="de">Deutsch (German)</option>
              <option value="zh">中文 (Chinese)</option>
              <option value="ar">العربية (Arabic)</option>
              <option value="ja">日本語 (Japanese)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Chronological Era Notation</label>
            <select
              value={eraFormat}
              onChange={(e) => setEraFormat(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500/40"
            >
              <option value="bce_ce">BCE / CE (Before Common Era / Common Era)</option>
              <option value="bc_ad">BC / AD (Before Christ / Anno Domini)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Subscription Tier</span>
          </h3>
          <p className="text-xs text-slate-400">
            Select a plan to unlock advanced research depth, high-res multimodal vision, and verified data exports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiers.map((t) => {
            const isCurrent = currentUser.tier === t.id;
            return (
              <div
                key={t.id}
                className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-xl'
                    : 'bg-slate-900 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white">{t.name}</span>
                    {t.popular && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold">
                        Most Popular
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 my-3">
                    <span className="text-3xl font-extrabold text-white font-mono">{t.price}</span>
                    <span className="text-xs text-slate-400">{t.period}</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300 py-3 border-t border-white/5">
                    {t.features.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4">
                  <button
                    disabled={isCurrent}
                    onClick={() => onUpdateTier(t.id)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                      isCurrent
                        ? 'bg-white/10 text-amber-300 cursor-default'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                    }`}
                  >
                    {isCurrent ? 'Current Active Plan' : `Switch to ${t.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
