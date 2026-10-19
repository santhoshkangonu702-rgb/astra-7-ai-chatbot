import React, { useState } from 'react';
import {
  Share2,
  Instagram,
  Youtube,
  Calendar,
  Sparkles,
  Download,
  Copy,
  Check,
  ArrowLeft,
  Hash,
  Layers,
  FileText,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

export type SocialPlatform = 'Instagram Post' | 'Instagram Reel' | 'YouTube Thumbnail' | 'YouTube Shorts';

interface SocialDraft {
  id: string;
  platform: SocialPlatform;
  aspectRatio: '1:1' | '9:16' | '16:9' | '4:5';
  title: string;
  scriptOrConcept: string;
  caption: string;
  hashtags: string[];
  scheduledDate: string;
}

const INITIAL_DRAFTS: SocialDraft[] = [
  {
    id: 'soc-1',
    platform: 'Instagram Reel',
    aspectRatio: '9:16',
    title: 'How Test-Time Compute Changes Everything in AI',
    scriptOrConcept:
      'Hook (0-3s): "Stop training bigger models. Here is why the smartest AI in 2026 thinks longer before answering."\nVisual: Split screen comparing instantaneous wrong answer vs 5-second tree-search perfect math solution.\nCall-to-Action: Save this Reel for your next coding sprint!',
    caption:
      'We spent years scaling GPU parameters. Now, frontier intelligence spends compute at INFERENCE time. Here is the mathematical breakthrough explained in 45 seconds. ⚡🚀',
    hashtags: ['#ArtificialIntelligence', '#Tech2040', '#CodingTips', '#Astra7', '#FutureTech'],
    scheduledDate: '2026-09-28'
  },
  {
    id: 'soc-2',
    platform: 'YouTube Shorts',
    aspectRatio: '9:16',
    title: 'Top 3 ISRO Space Station Milestones in 2026',
    scriptOrConcept:
      'Hook (0-2s): "India just docked its first autonomous orbital core!"\nVisual: High-res animation of BAS-1 solar wing deployment.\nConclusion: Gaganyaan crew mission countdown is live.',
    caption:
      'From Chandrayaan-4 to Bharatiya Antariksh Station: India is leading the next era of sovereign space exploration. Watch till the end for orbital coordinates! 🇮🇳🛰️',
    hashtags: ['#ISRO', '#SpaceExploration', '#Gaganyaan', '#IndiaInSpace', '#STEM'],
    scheduledDate: '2026-09-29'
  }
];

interface SocialStudioPowerProps {
  onBack?: () => void;
}

export const SocialStudioPower: React.FC<SocialStudioPowerProps> = ({ onBack }) => {
  const [drafts, setDrafts] = useState<SocialDraft[]>(INITIAL_DRAFTS);
  const [selectedDraft, setSelectedDraft] = useState<SocialDraft>(INITIAL_DRAFTS[0]);
  const [copied, setCopied] = useState(false);

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(`${selectedDraft.caption}\n\n${selectedDraft.hashtags.join(' ')}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    hapticSuccess();
  };

  const handleExportCalendar = () => {
    const text = `# ASTRA SOCIAL STUDIO CONTENT CALENDAR
Generated: ${new Date().toISOString()}

${drafts
  .map(
    (d, i) => `## [${d.scheduledDate}] ${d.platform} (${d.aspectRatio})
Title: ${d.title}

### Visual / Script Concept:
${d.scriptOrConcept}

### Caption:
${d.caption}

### Hashtags:
${d.hashtags.join(' ')}
`
  )
  .join('\n---\n\n')}
`;
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `social-content-calendar-${Date.now()}.md`;
    a.click();
    hapticSuccess();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 text-slate-100 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-pink-500/15 via-purple-500/10 to-amber-500/15 border border-pink-500/25 backdrop-blur-md">
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
          <div className="p-2.5 rounded-2xl bg-pink-500/20 text-pink-300 border border-pink-400/30">
            <Share2 className="w-6 h-6 text-pink-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">ASTRA SOCIAL STUDIO</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30">
                CREATOR ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Reels, Shorts, Thumbnails, Captions, Hashtag Optimization & Editorial Content Calendars
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCalendar}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-500 text-white font-bold text-xs shadow-lg hover:brightness-110 transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Calendar (.md)</span>
        </button>
      </div>

      {/* Main Grid: Drafts list & Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
            Content Drafts ({drafts.length})
          </div>
          <div className="space-y-2">
            {drafts.map((d) => (
              <div
                key={d.id}
                onClick={() => {
                  setSelectedDraft(d);
                  hapticAction();
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedDraft.id === d.id
                    ? 'bg-pink-500/15 border-pink-500/40 shadow-md'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-pink-300 font-bold">
                    {d.platform} ({d.aspectRatio})
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{d.scheduledDate}</span>
                </div>
                <div className="text-sm font-bold text-white">{d.title}</div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{d.caption}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-black/50 border border-white/10 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-white/10 text-pink-300 font-bold uppercase">
                {selectedDraft.platform} • Aspect Ratio: {selectedDraft.aspectRatio}
              </span>
              <button
                onClick={handleCopyCaption}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Caption & Tags'}</span>
              </button>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">CONCEPT / TITLE</span>
              <h3 className="text-base font-bold text-white mt-0.5">{selectedDraft.title}</h3>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
              <span className="font-mono text-[10px] text-amber-400 font-bold uppercase">SCRIPT / STORYBOARD CONCEPT</span>
              <p className="text-slate-300 leading-relaxed font-sans whitespace-pre-line">{selectedDraft.scriptOrConcept}</p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
              <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase">GENERATED CAPTION</span>
              <p className="text-slate-200 leading-relaxed font-sans">{selectedDraft.caption}</p>
            </div>

            <div className="space-y-1.5">
              <span className="font-mono text-[10px] text-purple-400 font-bold uppercase">OPTIMIZED HASHTAGS</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedDraft.hashtags.map((tag) => (
                  <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
