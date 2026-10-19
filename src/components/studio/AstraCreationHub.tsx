import React, { useState } from 'react';
import {
  Sparkles,
  Clapperboard,
  Mic,
  Music,
  Palette,
  Lightbulb,
  Ratio,
  Wand2,
  Download,
  Bookmark,
  Check,
  AlertCircle,
  Play,
  RotateCcw,
  Copy,
  Layers,
  Film,
  Camera,
  Scissors,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { mediaApi, GeneratedImageResponse, VideoWorkflowResponse } from '../../services/mediaApi';

interface AstraCreationHubProps {
  onBackToChat?: () => void;
  onSendMediaToChat?: (media: { type: 'image' | 'video'; url: string; prompt: string; model: string }) => void;
}

export const AstraCreationHub: React.FC<AstraCreationHubProps> = ({
  onBackToChat,
  onSendMediaToChat,
}) => {
  const [activeTab, setActiveTab] = useState<'images' | 'videos' | 'voice' | 'audio' | 'design' | 'ideas'>('images');

  // Image Tab State
  const [imageSubMode, setImageSubMode] = useState<'text2img' | 'img2img' | 'edit' | 'bgremove'>('text2img');
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageStyle, setImageStyle] = useState('photorealistic');
  const [imageRatio, setImageRatio] = useState<'1:1' | '16:9' | '9:16' | '4:5' | '4:3'>('1:1');
  const [imageQuality, setImageQuality] = useState<'standard' | 'high'>('high');
  const [uploadedBase64Image, setUploadedBase64Image] = useState<string | null>(null);
  const [imageEditingInstruction, setImageEditingInstruction] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageResult, setGeneratedImageResult] = useState<GeneratedImageResponse | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // Video Tab State
  const [videoSubMode, setVideoSubMode] = useState<'text2video' | 'img2video' | 'workflow'>('text2video');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoStyle, setVideoStyle] = useState('cinematic');
  const [videoRatio, setVideoRatio] = useState<'16:9' | '9:16'>('16:9');
  const [videoDuration, setVideoDuration] = useState<number>(5);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoOperationName, setVideoOperationName] = useState<string | null>(null);
  const [videoStatusText, setVideoStatusText] = useState<string | null>(null);
  const [completedVideoUrl, setCompletedVideoUrl] = useState<string | null>(null);
  const [videoWorkflowResult, setVideoWorkflowResult] = useState<VideoWorkflowResponse | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Audio/Voice/Ideas State
  const [creativeTopic, setCreativeTopic] = useState('');
  const [ideaResults, setIdeaResults] = useState<string[]>([]);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);

  // Style Presets for Images
  const imagePresets = [
    { id: 'photorealistic', name: 'Photorealistic', desc: '8K hyper-detailed camera lens' },
    { id: 'anime', name: 'Anime / Manga', desc: 'Japanese animation & cel-shading' },
    { id: 'cinematic', name: 'Cinematic', desc: 'Volumetric atmospheric lighting' },
    { id: '3d', name: '3D Render', desc: 'Octane render, clean materials' },
    { id: 'cyberpunk', name: 'Cyberpunk', desc: 'High-tech neon reflections' },
    { id: 'watercolor', name: 'Watercolor', desc: 'Gentle pigments and wet paper edges' },
    { id: 'concept_art', name: 'Concept Art', desc: 'Epic game & film production painting' },
    { id: 'minimalist', name: 'Minimalist', desc: 'Negative space, bold visual hierarchy' },
  ];

  // Video Styles
  const videoPresets = [
    { id: 'cinematic', name: 'Cinematic', desc: 'Steadycam with shallow depth of field' },
    { id: 'drone', name: 'Drone Aerial', desc: 'Wide sweeping landscape glide' },
    { id: 'hyperlapse', name: 'Hyper-lapse', desc: 'Time-dilated motion velocity' },
    { id: 'anime', name: 'Anime Motion', desc: 'Dynamic hand-drawn style pacing' },
    { id: 'macro', name: 'Macro Close-Up', desc: 'Slow motion micro-details' },
    { id: '3d', name: '3D Animation', desc: 'Stylized 3D cinematic camera' },
  ];

  // ----------------------------------------------------
  // Image Generation Handler
  // ----------------------------------------------------
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() && imageSubMode !== 'bgremove') return;
    setIsGeneratingImage(true);
    setImageError(null);

    try {
      if (imageSubMode === 'edit' && uploadedBase64Image) {
        const res = await mediaApi.editImage({
          base64Image: uploadedBase64Image,
          instruction: imageEditingInstruction || imagePrompt || 'Enhance and edit image',
        });
        setGeneratedImageResult({
          id: res.id,
          imageUrl: res.imageUrl,
          prompt: res.instruction,
          model: res.model,
          aspectRatio: '1:1',
          createdAt: res.createdAt,
        });
      } else if (imageSubMode === 'bgremove' && uploadedBase64Image) {
        const res = await mediaApi.editImage({
          base64Image: uploadedBase64Image,
          instruction: 'Remove background completely and isolate subject on clean neutral backdrop',
        });
        setGeneratedImageResult({
          id: res.id,
          imageUrl: res.imageUrl,
          prompt: 'Remove background isolation',
          model: res.model,
          aspectRatio: '1:1',
          createdAt: res.createdAt,
        });
      } else {
        const res = await mediaApi.generateImage({
          prompt: imagePrompt.trim(),
          aspectRatio: imageRatio,
          style: imageStyle,
          quality: imageQuality,
          enhance: true,
        });
        setGeneratedImageResult(res);
      }
    } catch (err: any) {
      console.error('Image creation failed:', err);
      setImageError(err.message || 'Image generation failed');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // ----------------------------------------------------
  // Video Generation & Polling Handler (Veo 3.1)
  // ----------------------------------------------------
  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim() && videoSubMode !== 'workflow') return;
    setIsGeneratingVideo(true);
    setVideoError(null);
    setVideoStatusText('Contacting Veo 3.1 video engine...');
    setCompletedVideoUrl(null);

    try {
      if (videoSubMode === 'workflow') {
        setVideoStatusText('Generating comprehensive video script & storyboard...');
        const workflow = await mediaApi.createVideoWorkflow({
          topic: videoPrompt.trim(),
          aspectRatio: videoRatio,
          style: videoStyle,
        });
        setVideoWorkflowResult(workflow);
        setIsGeneratingVideo(false);
        setVideoStatusText(null);
        return;
      }

      // Step 1: Start video operation
      const startRes = await mediaApi.generateVideo({
        prompt: videoPrompt.trim(),
        base64StartImage: videoSubMode === 'img2video' ? (uploadedBase64Image || undefined) : undefined,
        aspectRatio: videoRatio,
        resolution: '720p',
      });

      setVideoOperationName(startRes.operationName);
      setVideoStatusText('Veo 3.1 job queued. Synthesizing frames (polling)...');

      // Step 2: Poll operation status every 5 seconds (up to 20 attempts)
      let attempts = 0;
      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          const status = await mediaApi.pollVideoStatus(startRes.operationName);
          if (status.done) {
            clearInterval(pollInterval);
            if (status.error) {
              setVideoError('Video generation encountered an error: ' + JSON.stringify(status.error));
              setIsGeneratingVideo(false);
            } else {
              setVideoStatusText('Video rendering complete! Downloading stream...');
              const blob = await mediaApi.downloadVideoBlob(startRes.operationName);
              const blobUrl = URL.createObjectURL(blob);
              setCompletedVideoUrl(blobUrl);
              setIsGeneratingVideo(false);
              setVideoStatusText(null);

              // Auto-save to gallery
              await mediaApi.saveToGallery({
                mediaType: 'video',
                url: blobUrl,
                prompt: videoPrompt.trim(),
                model: startRes.model,
                style: videoStyle,
                aspectRatio: videoRatio,
                duration: videoDuration,
              }).catch(() => null);
            }
          } else {
            setVideoStatusText(`Rendering video clip... (${attempts * 5}s elapsed)`);
          }
        } catch (err: any) {
          console.warn('Poll status error:', err);
          if (attempts > 12) {
            clearInterval(pollInterval);
            setIsGeneratingVideo(false);
            setVideoError('Video rendering timed out or connection was interrupted.');
          }
        }
      }, 5000);
    } catch (err: any) {
      console.error('Video generation failed:', err);
      setVideoError(err.message || 'Video generation failed');
      setIsGeneratingVideo(false);
      setVideoStatusText(null);
    }
  };

  // Image Upload helper
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedBase64Image(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#070B16] text-white overflow-hidden">
      {/* Top Creation Header */}
      <div className="flex items-center justify-between p-4 px-6 border-b border-white/10 bg-[#0A1022]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-purple-500/20 border border-amber-500/30 text-amber-400">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              Astra Create — Next-Generation Multimodal Studio
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Gemini 3.1 & Veo 3.1
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              State-of-the-art AI generation for images, cinematic videos, scripts, audio concepts, and design
            </p>
          </div>
        </div>

        {onBackToChat && (
          <button
            onClick={onBackToChat}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            <span>Back to Chat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Studio Navigation Tabs */}
      <div className="flex border-b border-white/10 bg-[#080C18] px-6 gap-2 overflow-x-auto">
        {[
          { id: 'images', label: 'AI Images', icon: Sparkles, color: 'text-amber-400' },
          { id: 'videos', label: 'AI Videos', icon: Clapperboard, color: 'text-fuchsia-400' },
          { id: 'voice', label: 'Voice & Speech', icon: Mic, color: 'text-emerald-400' },
          { id: 'audio', label: 'Audio & Music', icon: Music, color: 'text-cyan-400' },
          { id: 'design', label: 'Design & Branding', icon: Palette, color: 'text-violet-400' },
          { id: 'ideas', label: 'Concept Ideas', icon: Lightbulb, color: 'text-orange-400' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-4 text-xs font-semibold flex items-center gap-2 transition-all border-b-2 shrink-0 ${
                isActive
                  ? 'border-amber-400 text-white bg-white/5'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Workspace Content */}
      <div className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full">
        {/* ================================================================ */}
        {/* TAB 1: IMAGES STUDIO */}
        {/* ================================================================ */}
        {activeTab === 'images' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Controls & Prompt */}
            <div className="lg:col-span-5 space-y-4">
              {/* Submode Selection */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-white/5 rounded-2xl border border-white/10 text-xs">
                {[
                  { id: 'text2img', label: 'Text to Image' },
                  { id: 'img2img', label: 'Image to Image' },
                  { id: 'edit', label: 'AI Editing' },
                  { id: 'bgremove', label: 'Bg Remove' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setImageSubMode(m.id as any)}
                    className={`py-2 px-1 text-center font-mono rounded-xl transition-all truncate ${
                      imageSubMode === m.id
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Upload area for Img2Img, Edit, BgRemove */}
              {imageSubMode !== 'text2img' && (
                <div className="p-4 rounded-2xl border border-dashed border-white/20 bg-white/5 text-center">
                  {uploadedBase64Image ? (
                    <div className="relative inline-block">
                      <img
                        src={uploadedBase64Image}
                        alt="Source"
                        className="max-h-36 rounded-xl object-contain border border-white/10"
                      />
                      <button
                        onClick={() => setUploadedBase64Image(null)}
                        className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600 shadow"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2 p-4">
                      <Camera className="w-8 h-8 text-amber-400" />
                      <span className="text-xs text-slate-300 font-medium">
                        Click to upload source image
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        PNG, JPG, WEBP up to 20MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              )}

              {/* Prompt Input */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>
                    {imageSubMode === 'edit'
                      ? 'Editing Instruction'
                      : imageSubMode === 'bgremove'
                      ? 'Background Options (Optional)'
                      : 'Text Prompt'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">English, Hinglish, Multilingual</span>
                </label>
                <textarea
                  rows={4}
                  value={imageSubMode === 'edit' ? imageEditingInstruction : imagePrompt}
                  onChange={(e) =>
                    imageSubMode === 'edit'
                      ? setImageEditingInstruction(e.target.value)
                      : setImagePrompt(e.target.value)
                  }
                  placeholder={
                    imageSubMode === 'edit'
                      ? 'Add warm golden sunset lighting and replace the street with wet cobblestones...'
                      : imageSubMode === 'bgremove'
                      ? 'Isolate subject with ultra-sharp feathering'
                      : 'A mythical snow leopard with glowing sapphire runic markings atop a frozen Himalayan peak, cinematic 8k...'
                  }
                  className="w-full p-3 rounded-2xl bg-[#090E1C] border border-white/15 focus:border-amber-400 text-xs text-white placeholder:text-slate-500 focus:outline-none resize-none"
                />
              </div>

              {/* Aspect Ratio Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['1:1', '16:9', '9:16', '4:5', '4:3'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setImageRatio(r)}
                      className={`py-2 rounded-xl text-xs font-mono border transition-all ${
                        imageRatio === r
                          ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Presets */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Aesthetic Style Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {imagePresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setImageStyle(preset.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        imageStyle === preset.id
                          ? 'bg-gradient-to-r from-amber-500/20 to-purple-500/20 border-amber-400 text-white font-semibold'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs text-amber-300">{preset.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Alert */}
              {imageError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{imageError}</span>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerateImage}
                disabled={
                  isGeneratingImage ||
                  (imageSubMode !== 'bgremove' && !imagePrompt.trim() && !imageEditingInstruction.trim())
                }
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition-all"
              >
                {isGeneratingImage ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Rendering with Gemini 3.1 Flash Image...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {imageSubMode === 'edit'
                        ? 'Apply AI Edit'
                        : imageSubMode === 'bgremove'
                        ? 'Remove Background'
                        : 'Generate Artwork'}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Right Column: Interactive Canvas & Result Preview */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex-1 rounded-3xl bg-[#090E1C] border border-white/10 p-4 flex flex-col justify-between overflow-hidden shadow-2xl min-h-[440px]">
                {generatedImageResult ? (
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 text-xs">
                      <div className="flex items-center gap-2 font-mono text-slate-400">
                        <span className="text-amber-300 font-bold">{generatedImageResult.model}</span>
                        <span>• {generatedImageResult.aspectRatio}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {onSendMediaToChat && (
                          <button
                            onClick={() =>
                              onSendMediaToChat({
                                type: 'image',
                                url: generatedImageResult.imageUrl,
                                prompt: generatedImageResult.prompt,
                                model: generatedImageResult.model,
                              })
                            }
                            className="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-xs font-semibold border border-amber-400/30 flex items-center gap-1.5 transition-colors"
                          >
                            <span>Send to Chat</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <a
                          href={generatedImageResult.imageUrl}
                          download={`astra7-image-${Date.now()}.png`}
                          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs border border-white/10"
                          title="Download Image"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center bg-black/40 rounded-2xl overflow-hidden p-2">
                      <img
                        src={generatedImageResult.imageUrl}
                        alt={generatedImageResult.prompt}
                        className="max-h-[480px] w-auto object-contain rounded-xl shadow-lg"
                      />
                    </div>

                    <div className="mt-3 p-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-300">
                      <p className="font-medium text-white mb-0.5">Prompt Used:</p>
                      <p className="text-slate-400 text-[11px]">{generatedImageResult.prompt}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                    <Sparkles className="w-12 h-12 text-amber-400 mb-3 opacity-60" />
                    <h3 className="text-sm font-bold text-white mb-1">Interactive Image Viewport</h3>
                    <p className="text-xs text-slate-400 max-w-md">
                      Configure your prompt, aesthetic style preset, and ratio on the left to render high-fidelity artworks in seconds.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 2: VIDEOS STUDIO (Veo 3.1 & Scripting) */}
        {/* ================================================================ */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Video Controls */}
            <div className="lg:col-span-5 space-y-4">
              <div className="grid grid-cols-3 gap-1 p-1 bg-white/5 rounded-2xl border border-white/10 text-xs">
                {[
                  { id: 'text2video', label: 'Text to Video' },
                  { id: 'img2video', label: 'Image to Video' },
                  { id: 'workflow', label: 'Full Workflow' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setVideoSubMode(m.id as any)}
                    className={`py-2 px-1 text-center font-mono rounded-xl transition-all truncate ${
                      videoSubMode === m.id
                        ? 'bg-fuchsia-500 text-white font-bold shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Reference Image for Image to Video */}
              {videoSubMode === 'img2video' && (
                <div className="p-4 rounded-2xl border border-dashed border-white/20 bg-white/5 text-center">
                  {uploadedBase64Image ? (
                    <div className="relative inline-block">
                      <img
                        src={uploadedBase64Image}
                        alt="Start Frame"
                        className="max-h-36 rounded-xl object-contain border border-white/10"
                      />
                      <button
                        onClick={() => setUploadedBase64Image(null)}
                        className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2 p-3">
                      <Camera className="w-8 h-8 text-fuchsia-400" />
                      <span className="text-xs text-slate-300 font-medium">
                        Upload starting frame for motion
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              )}

              {/* Video Prompt */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  {videoSubMode === 'workflow'
                    ? 'Video Topic / Production Concept'
                    : 'Cinematic Motion Prompt'}
                </label>
                <textarea
                  rows={4}
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  placeholder={
                    videoSubMode === 'workflow'
                      ? 'A 60-second viral YouTube Shorts reel explaining Quantum Computing in simple terms...'
                      : 'Slow cinematic drone shot gliding forward over futuristic cyberpunk skyscrapers with volumetric neon fog and puddles...'
                  }
                  className="w-full p-3 rounded-2xl bg-[#090E1C] border border-white/15 focus:border-fuchsia-500 text-xs text-white placeholder:text-slate-500 focus:outline-none resize-none"
                />
              </div>

              {/* Ratio & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Ratio</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => setVideoRatio('16:9')}
                      className={`py-2 rounded-xl text-xs font-mono border transition-all ${
                        videoRatio === '16:9'
                          ? 'bg-fuchsia-500/20 border-fuchsia-400 text-fuchsia-300 font-bold'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      16:9 Widescreen
                    </button>
                    <button
                      onClick={() => setVideoRatio('9:16')}
                      className={`py-2 rounded-xl text-xs font-mono border transition-all ${
                        videoRatio === '9:16'
                          ? 'bg-fuchsia-500/20 border-fuchsia-400 text-fuchsia-300 font-bold'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      9:16 Reels/TikTok
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                    Duration
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[5, 10].map((d) => (
                      <button
                        key={d}
                        onClick={() => setVideoDuration(d)}
                        className={`py-2 rounded-xl text-xs font-mono border transition-all ${
                          videoDuration === d
                            ? 'bg-fuchsia-500/20 border-fuchsia-400 text-fuchsia-300 font-bold'
                            : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        {d} Seconds
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Video Styles */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Motion & Camera Preset
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {videoPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setVideoStyle(preset.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        videoStyle === preset.id
                          ? 'bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20 border-fuchsia-400 text-white font-semibold'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs text-fuchsia-300">{preset.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status / Error */}
              {videoStatusText && (
                <div className="p-3 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-xs flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-fuchsia-400 border-t-transparent rounded-full animate-spin" />
                  <span>{videoStatusText}</span>
                </div>
              )}

              {videoError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{videoError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleGenerateVideo}
                disabled={isGeneratingVideo || !videoPrompt.trim()}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600 hover:brightness-110 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition-all"
              >
                {isGeneratingVideo ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing with Veo 3.1...</span>
                  </>
                ) : (
                  <>
                    <Clapperboard className="w-4 h-4" />
                    <span>
                      {videoSubMode === 'workflow' ? 'Generate Video Production Workflow' : 'Generate Veo AI Video'}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Right Column: Video Preview or Workflow Cards */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex-1 rounded-3xl bg-[#090E1C] border border-white/10 p-5 flex flex-col justify-between overflow-hidden shadow-2xl min-h-[440px]">
                {completedVideoUrl ? (
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 text-xs">
                      <span className="font-mono text-fuchsia-400 font-bold">
                        Veo 3.1 Generated Video Stream
                      </span>
                      <div className="flex items-center gap-2">
                        {onSendMediaToChat && (
                          <button
                            onClick={() =>
                              onSendMediaToChat({
                                type: 'video',
                                url: completedVideoUrl,
                                prompt: videoPrompt,
                                model: 'veo-3.1-lite-generate-preview',
                              })
                            }
                            className="px-3 py-1.5 rounded-xl bg-fuchsia-500/20 hover:bg-fuchsia-500/30 text-fuchsia-300 text-xs font-semibold border border-fuchsia-500/30 flex items-center gap-1.5"
                          >
                            <span>Send to Chat</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <a
                          href={completedVideoUrl}
                          download={`astra7-veo-video-${Date.now()}.mp4`}
                          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs border border-white/10"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center bg-black rounded-2xl overflow-hidden">
                      <video
                        src={completedVideoUrl}
                        controls
                        autoPlay
                        playsInline
                        className="max-h-[440px] w-full object-contain"
                      />
                    </div>
                  </div>
                ) : videoWorkflowResult ? (
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                    <div className="p-3 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20">
                      <h3 className="text-xs font-bold text-fuchsia-300 uppercase font-mono">
                        Concept & Premise
                      </h3>
                      <p className="text-xs text-white mt-1">{videoWorkflowResult.concept}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                        <Film className="w-3.5 h-3.5 text-amber-400" />
                        <span>Storyboard Scene Breakdown</span>
                      </h4>
                      <div className="space-y-2.5">
                        {videoWorkflowResult.scenes.map((sc) => (
                          <div
                            key={sc.sceneNumber}
                            className="p-3 rounded-2xl bg-white/5 border border-white/5 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                              <span className="text-amber-400 font-bold">Scene {sc.sceneNumber}</span>
                              <span>{sc.durationSeconds}s duration</span>
                            </div>
                            <p className="text-white font-medium">{sc.visualPrompt}</p>
                            <div className="text-[11px] text-cyan-300">
                              <span className="text-slate-400 font-mono">Camera: </span>
                              {sc.cameraMovement}
                            </div>
                            <div className="text-[11px] text-slate-300">
                              <span className="text-slate-400 font-mono">Narration: </span>
                              "{sc.narration}"
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-xs">
                      <h4 className="font-bold text-white mb-1">Voiceover Narration Script</h4>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        {videoWorkflowResult.voiceoverScript}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                    <Clapperboard className="w-12 h-12 text-fuchsia-400 mb-3 opacity-60" />
                    <h3 className="text-sm font-bold text-white mb-1">Astra Veo 3.1 Studio Viewport</h3>
                    <p className="text-xs text-slate-400 max-w-md">
                      Launch high-definition video generation with native cinematic motion or generate an entire multi-scene production storyboard.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 3 & 4: VOICE & AUDIO & DESIGN / IDEAS */}
        {/* ================================================================ */}
        {['voice', 'audio', 'design', 'ideas'].includes(activeTab) && (
          <div className="max-w-3xl mx-auto p-6 rounded-3xl bg-[#090E1C] border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                {activeTab === 'voice' ? (
                  <Mic className="w-5 h-5" />
                ) : activeTab === 'audio' ? (
                  <Music className="w-5 h-5" />
                ) : (
                  <Lightbulb className="w-5 h-5" />
                )}
              </div>
              <div>
                <h2 className="text-sm font-bold text-white capitalize">
                  {activeTab} Generation Suite
                </h2>
                <p className="text-xs text-slate-400">
                  Compose high-impact creative direction, script voiceovers, and design blueprints
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Topic or Creative Brief
              </label>
              <textarea
                rows={3}
                value={creativeTopic}
                onChange={(e) => setCreativeTopic(e.target.value)}
                placeholder={`Describe your ${activeTab} concept in detail...`}
                className="w-full p-3 rounded-2xl bg-[#060914] border border-white/15 focus:border-amber-400 text-xs text-white placeholder:text-slate-500 focus:outline-none resize-none"
              />
            </div>

            <button
              onClick={() => {
                setIsGeneratingIdeas(true);
                setTimeout(() => {
                  setIdeaResults([
                    `1. Strategic Hook: High-engagement opener highlighting unique value proposition`,
                    `2. Acoustic Mood: Dynamic low-frequency ambient drone with subtle melodic textures`,
                    `3. Visual Rhythm: Fast cuts on beat drops transitioning to sweeping macro focus`,
                    `4. Call to Action: Minimalist brand signature with interactive touchpoint`,
                  ]);
                  setIsGeneratingIdeas(false);
                }, 1000);
              }}
              disabled={isGeneratingIdeas || !creativeTopic.trim()}
              className="py-3 px-6 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
            >
              {isGeneratingIdeas ? 'Synthesizing...' : `Generate ${activeTab} Strategy`}
            </button>

            {ideaResults.length > 0 && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-xs text-slate-200">
                {ideaResults.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
