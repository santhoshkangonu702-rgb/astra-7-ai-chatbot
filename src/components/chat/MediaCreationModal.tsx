import React, { useState } from 'react';
import {
  Sparkles,
  Clapperboard,
  X,
  Palette,
  Ratio,
  Clock,
  Wand2,
  AlertCircle
} from 'lucide-react';
import { mediaApi } from '../../services/mediaApi';

interface MediaCreationModalProps {
  isOpen: boolean;
  initialMode?: 'image' | 'video';
  initialPrompt?: string;
  referenceImage?: string;
  onClose: () => void;
  onGenerationStarted: (task: {
    type: 'image' | 'video';
    prompt: string;
    model: string;
    operationName?: string;
    imageUrl?: string;
    aspectRatio?: string;
    style?: string;
  }) => void;
}

export const MediaCreationModal: React.FC<MediaCreationModalProps> = ({
  isOpen,
  initialMode = 'image',
  initialPrompt = '',
  referenceImage,
  onClose,
  onGenerationStarted,
}) => {
  const [mode, setMode] = useState<'image' | 'video'>(initialMode);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [style, setStyle] = useState('photorealistic');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('1:1');
  const [quality, setQuality] = useState<'standard' | 'high'>('high');
  const [videoDuration, setVideoDuration] = useState<number>(5);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    setMode(initialMode);
    if (initialPrompt) setPrompt(initialPrompt);
  }, [initialMode, initialPrompt, isOpen]);

  if (!isOpen) return null;

  const imageStyles = [
    { id: 'photorealistic', label: 'Photorealistic' },
    { id: 'cinematic', label: 'Cinematic' },
    { id: 'anime', label: 'Anime / Manga' },
    { id: 'illustration', label: 'Digital Art' },
    { id: '3d', label: '3D Render' },
    { id: 'watercolor', label: 'Watercolor' },
    { id: 'product_photography', label: 'Studio Product' },
    { id: 'minimalist', label: 'Minimalist' },
  ];

  const videoStyles = [
    { id: 'cinematic', label: 'Cinematic Drone' },
    { id: 'timelapse', label: 'Hyper-lapse' },
    { id: 'macro', label: 'Macro Slow Motion' },
    { id: 'cyberpunk', label: 'Cyberpunk Neon' },
    { id: 'documentary', label: 'Documentary Nature' },
  ];

  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancing) return;
    setIsEnhancing(true);
    setError(null);
    try {
      const enhanced = await mediaApi.generateImage({
        prompt: `Expand and enhance prompt: "${prompt}"`,
        style,
        enhance: true,
      }).catch(() => null);
      if (enhanced?.enhancedPrompt) {
        setPrompt(enhanced.enhancedPrompt);
      }
    } catch {
      // ignore
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleCreate = async () => {
    if (!prompt.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === 'image') {
        const result = await mediaApi.generateImage({
          prompt: prompt.trim(),
          aspectRatio,
          style,
          quality,
          enhance: true,
        });

        onGenerationStarted({
          type: 'image',
          prompt: result.prompt,
          model: result.model,
          imageUrl: result.imageUrl,
          aspectRatio: result.aspectRatio,
          style,
        });
        onClose();
      } else {
        // Video generation with Veo 3.1
        const result = await mediaApi.generateVideo({
          prompt: prompt.trim(),
          base64StartImage: referenceImage,
          aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9',
          resolution: '720p',
        });

        onGenerationStarted({
          type: 'video',
          prompt: prompt.trim(),
          model: result.model,
          operationName: result.operationName,
          aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9',
        });
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Creation request failed. Verify your server configuration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#0A0E1A] border border-white/15 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-white/10 bg-[#0C1222]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-400 border border-amber-500/30">
              {mode === 'image' ? <Sparkles className="w-5 h-5" /> : <Clapperboard className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {mode === 'image' ? 'Astra AI Image Studio' : 'Astra AI Video Studio (Veo 3.1)'}
              </h2>
              <p className="text-xs text-slate-400">
                {mode === 'image'
                  ? 'Powered by Gemini 3.1 Flash Image'
                  : 'Powered by Veo 3.1 Cinematic Video Preview'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-white/10 bg-[#080C16]">
          <button
            onClick={() => setMode('image')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border-b-2 ${
              mode === 'image'
                ? 'border-amber-400 text-amber-300 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Image</span>
          </button>
          <button
            onClick={() => setMode('video')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border-b-2 ${
              mode === 'video'
                ? 'border-amber-400 text-amber-300 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Clapperboard className="w-4 h-4" />
            <span>Generate Video</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Reference Image Thumbnail if Image-to-Video */}
          {referenceImage && mode === 'video' && (
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <img
                src={referenceImage}
                alt="Reference"
                className="w-12 h-12 rounded-lg object-cover border border-white/10"
              />
              <div className="text-xs">
                <span className="font-semibold text-white">Image-to-Video Active</span>
                <p className="text-slate-400 text-[11px]">
                  Veo will use this reference image as the starting frame.
                </p>
              </div>
            </div>
          )}

          {/* Prompt Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300">Prompt Description</label>
              <button
                type="button"
                onClick={handleEnhancePrompt}
                disabled={!prompt.trim() || isEnhancing}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 disabled:opacity-40 flex items-center gap-1 font-mono"
              >
                <Wand2 className="w-3 h-3" />
                <span>{isEnhancing ? 'Enhancing...' : 'Enhance Prompt'}</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                mode === 'image'
                  ? 'A crystalline cybernetic lotus flower floating in a neon bioluminescent pond, volumetric rays, 8k...'
                  : 'Cinematic drone shot flying through futuristic neon skyscrapers at night with reflective rain...'
              }
              className="w-full p-3 rounded-2xl bg-[#070A14] border border-white/15 focus:border-amber-500 text-white text-xs placeholder:text-slate-500 focus:outline-none resize-none"
            />
          </div>

          {/* Style Selector */}
          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Aesthetic Style</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {(mode === 'image' ? imageStyles : videoStyles).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStyle(st.id)}
                  className={`p-2 rounded-xl text-xs font-mono transition-all border text-left truncate ${
                    style === st.id
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-bold'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
              <Ratio className="w-3.5 h-3.5 text-cyan-400" />
              <span>Aspect Ratio</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['1:1', '16:9', '9:16', '4:3'] as const).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`p-2 rounded-xl text-xs font-mono transition-all border text-center ${
                    aspectRatio === ratio
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-white/10 bg-[#080C16] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={!prompt.trim() || isSubmitting}
            className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Launching Generation...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate {mode === 'image' ? 'Artwork' : 'Video Clip'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
