import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Check,
  AlertCircle,
  X,
  ExternalLink,
  Cpu,
  Layers,
  Zap,
  Tag
} from 'lucide-react';
import { mediaApi, ModelCapabilityItem } from '../../services/mediaApi';

interface TrendingModelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModel?: (modelId: string) => void;
}

export const TrendingModelsModal: React.FC<TrendingModelsModalProps> = ({
  isOpen,
  onClose,
  onSelectModel,
}) => {
  const [models, setModels] = useState<ModelCapabilityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    if (isOpen) {
      loadModels();
    }
  }, [isOpen]);

  const loadModels = async () => {
    setLoading(true);
    try {
      const list = await mediaApi.getModels();
      setModels(list);
    } catch (err) {
      console.error('Failed to load models:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const categories = [
    'ALL',
    'AI IMAGE',
    'AI VIDEO',
    'AI CHAT',
    'AI VOICE',
    'AI MUSIC',
    'AI RESEARCH',
  ];

  const filteredModels =
    selectedCategory === 'ALL'
      ? models
      : models.filter((m) => m.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Trending':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'New':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Popular':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      default:
        return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col bg-[#0A0E1A] border border-white/15 rounded-3xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0C1222]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500/20 to-purple-500/20 border border-amber-500/30 text-amber-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Trending AI Models & Multimodal Hub
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Live Status
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Current active models, capabilities, context capacities, and verified provider status
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category filter pills */}
        <div className="flex items-center gap-1.5 p-3 px-5 border-b border-white/5 bg-[#080C16] overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-bold shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Models Grid */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-3">
              <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono">Querying verified provider capabilities...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredModels.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-[#0F162A]/70 border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                            {m.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">{m.provider}</span>
                      </div>
                      <span
                        className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border ${getStatusColor(
                          m.status
                        )}`}
                      >
                        {m.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mb-3 line-clamp-2">
                      {m.recommendedUse}
                    </p>

                    {/* Capabilities Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {m.capabilities.map((cap, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-300 font-mono border border-white/5"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400">
                        {m.pricingTier}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Configured" />
                    </div>

                    {onSelectModel && (
                      <button
                        onClick={() => {
                          onSelectModel(m.id);
                          onClose();
                        }}
                        className="px-3 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-medium text-xs border border-amber-500/30 transition-colors flex items-center gap-1"
                      >
                        <span>Select</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
