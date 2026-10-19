import React, { useState, useEffect } from 'react';
import {
  X,
  Crown,
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  Star,
  ArrowRight
} from 'lucide-react';
import { AstraLogo } from './AstraLogo';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({
  isOpen,
  onClose,
  onUpgradeSuccess
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [upgraded, setUpgraded] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleUpgrade = () => {
    setUpgraded(true);
    setTimeout(() => {
      onUpgradeSuccess();
      onClose();
    }, 1200);
  };

  const features = [
    { name: 'Core AI Models Access', free: 'Standard', pro: 'Priority Ultra High Speed' },
    { name: 'Study Assistant Quizzes & Flashcards', free: '10 / day', pro: 'Unlimited' },
    { name: 'Code Assistant Debugging & Translation', free: 'Basic snippets', pro: 'Full projects + 9+ languages' },
    { name: 'ATS Resume Builder & PDF Export', free: '1 template', pro: 'All templates + AI bullet tuner' },
    { name: 'Visual Art Generation (Image Creator)', free: '5 / day', pro: 'Unlimited High-Res' },
    { name: 'Multimodal Image Analysis (Vision AI)', free: 'Limited', pro: 'Full High-Resolution' },
    { name: 'Activity History Cloud Sync', free: 'Local only', pro: 'Unlimited Cross-Device' }
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-800">
            <Crown className="w-3.5 h-3.5" />
            <span>Astra 7 Pro Membership</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Supercharge Your Workflow
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Unlimited reasoning, advanced coding debugging, ATS resume templates, and priority generation.
          </p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Monthly ($9.99 / mo)
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              billingCycle === 'annual'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span>Annual ($7.49 / mo)</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-bold">Save 25%</span>
          </button>
        </div>

        {/* Comparison Table */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden mb-6 text-xs">
          <div className="grid grid-cols-12 bg-slate-50 dark:bg-slate-800/80 p-3 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
            <div className="col-span-6">Capability</div>
            <div className="col-span-3 text-center text-slate-500">Free</div>
            <div className="col-span-3 text-center text-amber-600 dark:text-amber-400 font-black">Pro</div>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {features.map((f, i) => (
              <div key={i} className="grid grid-cols-12 p-3 items-center">
                <div className="col-span-6 text-slate-800 dark:text-slate-200 font-medium">{f.name}</div>
                <div className="col-span-3 text-center text-slate-500 text-[11px]">{f.free}</div>
                <div className="col-span-3 text-center text-amber-600 dark:text-amber-400 font-bold text-[11px]">
                  {f.pro}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        {upgraded ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-700 dark:text-emerald-300 font-bold text-center text-sm flex items-center justify-center gap-2">
            <Check className="w-5 h-5" />
            <span>Upgraded to Pro! Enjoy unlimited access.</span>
          </div>
        ) : (
          <button
            onClick={handleUpgrade}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 text-slate-950 font-black text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
          >
            <span>Activate Pro Now ({billingCycle === 'annual' ? '$89 / year' : '$9.99 / month'})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        <div className="text-center text-[11px] text-slate-400 mt-3">
          Cancel anytime with 1-click. 14-day money back satisfaction guarantee.
        </div>
      </div>
    </div>
  );
};
