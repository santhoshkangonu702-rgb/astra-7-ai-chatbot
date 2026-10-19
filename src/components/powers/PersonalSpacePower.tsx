import React, { useState } from 'react';
import {
  User,
  Brain,
  FolderKanban,
  FileText,
  Target,
  ListTodo,
  BookOpen,
  Award,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Download,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { PowerId } from '../../types';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

interface PersonalSpacePowerProps {
  onBack?: () => void;
  onSelectPower?: (power: PowerId) => void;
}

export const PersonalSpacePower: React.FC<PersonalSpacePowerProps> = ({ onBack, onSelectPower }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'memory' | 'projects' | 'goals' | 'learning'>('all');

  const categories = [
    { id: 'memory', name: 'Memory Facets', icon: Brain, count: 6, power: 'memory' as PowerId, color: 'text-amber-400' },
    { id: 'projects', name: 'Active Projects', icon: FolderKanban, count: 4, power: 'projects' as PowerId, color: 'text-cyan-400' },
    { id: 'documents', name: 'Indexed Documents', icon: FileText, count: 3, power: 'documents' as PowerId, color: 'text-purple-400' },
    { id: 'goals', name: 'Coached Goals', icon: Target, count: 5, power: 'goalcoach' as PowerId, color: 'text-emerald-400' },
    { id: 'tasks', name: 'Planner Tasks', icon: ListTodo, count: 12, power: 'planner' as PowerId, color: 'text-orange-400' },
    { id: 'research', name: 'Deep Research', icon: BookOpen, count: 2, power: 'research' as PowerId, color: 'text-blue-400' },
    { id: 'skills', name: 'Achievement Skills', icon: Award, count: 8, power: 'achievements' as PowerId, color: 'text-yellow-400' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 text-slate-100 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-cyan-500/15 border border-amber-500/25 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all group shrink-0 mr-1"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>← Back</span>
            </button>
          )}
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
            <Lock className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">ASTRA PERSONAL SPACE</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                PRIVATE COGNITIVE VAULT
              </span>
            </div>
            <p className="text-xs text-slate-400">
              MEMORY + PROJECTS + DOCUMENTS + GOALS + TASKS + LEARNING + RESEARCH + SKILLS
            </p>
          </div>
        </div>
      </div>

      {/* Unified Cognitive Vault Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              onClick={() => {
                if (onSelectPower) onSelectPower(cat.power);
                hapticAction();
              }}
              className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <Icon className={`w-5 h-5 ${cat.color}`} />
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">{cat.count} Items</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {cat.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Encrypted in client-side private vault</p>
              </div>

              <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-amber-400/80 flex items-center justify-between">
                <span>OPEN MODULE</span>
                <span>→</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs text-slate-300">
        <div className="flex items-center gap-2 font-bold text-white">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zero Silent Profiling Guarantee</span>
        </div>
        <p className="leading-relaxed text-slate-400">
          Everything stored in your Astra Personal Space is strictly under your control. Information is never
          harvested without consent, never shared with third parties, and never used to train public foundation models.
          You can edit, archive, or permanently purge any record at any time.
        </p>
      </div>
    </div>
  );
};
