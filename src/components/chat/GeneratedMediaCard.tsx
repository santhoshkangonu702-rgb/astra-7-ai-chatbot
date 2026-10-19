import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  Share2,
  Bookmark,
  Check,
  Clapperboard,
  Layers,
  Wand2,
  ExternalLink,
  Film,
  Eye,
  RefreshCw
} from 'lucide-react';
import { GeneratedMediaPayload } from '../../types';
import { mediaApi } from '../../services/mediaApi';

interface GeneratedMediaCardProps {
  media: GeneratedMediaPayload;
  onEditRequest?: (instruction: string, base64Image: string) => void;
  onAnimateToVideo?: (base64Image: string, prompt: string) => void;
  onOpenStudio?: () => void;
}

export const GeneratedMediaCard: React.FC<GeneratedMediaCardProps> = ({
  media,
  onEditRequest,
  onAnimateToVideo,
  onOpenStudio,
}) => {
  const [showOriginal, setShowOriginal] = useState(false);
  const [saved, setSaved] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'actions'>('preview');

  const handleSave = async () => {
    try {
      await mediaApi.saveToGallery({
        mediaType: media.type,
        url: media.url,
        originalUrl: media.originalUrl,
        prompt: media.prompt,
        enhancedPrompt: media.enhancedPrompt,
        model: media.model,
        style: media.style,
        aspectRatio: media.aspectRatio,
        duration: media.duration,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save to gallery:', err);
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = media.url;
    a.download = `astra7-${media.type}-${Date.now()}.${media.type === 'video' ? 'mp4' : 'png'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const currentUrl = showOriginal && media.originalUrl ? media.originalUrl : media.url;

  return (
    <div className="mt-3 overflow-hidden rounded-2xl bg-[#080C18] border border-white/15 shadow-xl max-w-xl">
      {/* Header Info */}
      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-[#0A1020]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {media.type === 'video' ? <Film className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
          </div>
          <div>
            <span className="text-xs font-semibold text-white">
              {media.type === 'video' ? 'AI Video Studio (Veo 3.1)' : 'AI Image Studio (Gemini 3.1)'}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
              <span>{media.model}</span>
              {media.aspectRatio && <span>• {media.aspectRatio}</span>}
              {media.duration && <span>• {media.duration}s</span>}
            </div>
          </div>
        </div>

        {media.originalUrl && (
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
          >
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>{showOriginal ? 'Showing: Original' : 'Showing: Edited'}</span>
          </button>
        )}
      </div>

      {/* Media Canvas Area */}
      <div className="relative bg-black flex items-center justify-center max-h-[420px] overflow-hidden group">
        {media.type === 'video' ? (
          <video
            src={media.url}
            controls
            playsInline
            className="w-full h-full max-h-[420px] object-contain"
          />
        ) : (
          <img
            src={currentUrl}
            alt={media.prompt}
            className="w-full h-full max-h-[420px] object-contain transition-transform duration-300 group-hover:scale-[1.01]"
          />
        )}
      </div>

      {/* Prompt summary */}
      <div className="p-3 bg-[#080C16] border-t border-white/10">
        <p className="text-xs text-slate-300 line-clamp-2">
          <span className="font-semibold text-amber-400">Prompt: </span>
          {media.prompt}
        </p>

        {media.enhancedPrompt && (
          <p className="text-[11px] text-slate-400 italic line-clamp-1 mt-0.5">
            <span className="text-cyan-400 not-italic font-mono">Enhanced: </span>
            {media.enhancedPrompt}
          </p>
        )}

        {/* Quick Conversational Action Chips */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-white/5">
          {media.type === 'image' && onEditRequest && (
            <>
              <button
                onClick={() => onEditRequest('Remove the background cleanly', media.url)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-300 hover:text-white transition-all flex items-center gap-1"
              >
                <Wand2 className="w-3 h-3 text-purple-400" />
                <span>Remove Background</span>
              </button>

              <button
                onClick={() => onEditRequest('Change the lighting to warm cinematic golden hour', media.url)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-300 hover:text-white transition-all flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Golden Hour</span>
              </button>

              <button
                onClick={() => onEditRequest('Transform into an anime watercolor masterpiece', media.url)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-300 hover:text-white transition-all flex items-center gap-1"
              >
                <Eye className="w-3 h-3 text-pink-400" />
                <span>Anime Style</span>
              </button>
            </>
          )}

          {media.type === 'image' && onAnimateToVideo && (
            <button
              onClick={() => onAnimateToVideo(media.url, `Animate with gentle cinematic camera movement: ${media.prompt}`)}
              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20 hover:brightness-125 border border-fuchsia-500/30 text-[11px] text-fuchsia-300 font-medium transition-all flex items-center gap-1"
            >
              <Clapperboard className="w-3 h-3 text-fuchsia-400" />
              <span>Turn into Video</span>
            </button>
          )}

          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={handleSave}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-white/5 transition-colors"
              title="Save to Astra Gallery"
            >
              {saved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors"
              title="Download File"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
