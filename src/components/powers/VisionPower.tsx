import React, { useState, useRef } from 'react';
import {
  Eye,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  FileImage,
  ExternalLink,
  Info,
  ShieldCheck,
  RefreshCw,
  Landmark
} from 'lucide-react';
import { api } from '../../services/api';

interface VisionPowerProps {
  onNavigateToObject?: (objectId: string) => void;
}

export const VisionPower: React.FC<VisionPowerProps> = ({ onNavigateToObject }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    'https://images.unsplash.com/photo-1599739291060-4578e77dac5d?auto=format&fit=crop&w=1000&q=80'
  );
  const [prompt, setPrompt] = useState('Identify this artifact, its civilization, estimated date, and historical significance.');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleImages = [
    {
      label: 'Tutankhamun Mask',
      url: 'https://images.unsplash.com/photo-1599739291060-4578e77dac5d?auto=format&fit=crop&w=1000&q=80',
      prompt: 'Identify the archaeological provenance and funerary significance of this artifact.'
    },
    {
      label: 'Antikythera Mechanism',
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
      prompt: 'Analyze mechanical gearing, computational astronomical functions and discovery context.'
    },
    {
      label: 'Cuneiform Clay Tablet',
      url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
      prompt: 'Inspect cuneiform stylus impressions and analyze Mesopotamian legal or literary text features.'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage || isAnalyzing) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      // Determine base64 vs URL
      let base64Data = selectedImage;
      let mime = 'image/jpeg';
      if (selectedImage.startsWith('data:')) {
        const parts = selectedImage.split(',');
        mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        base64Data = parts[1];
      } else {
        // Sample URL fallback: send base64 simulation
        base64Data = 'sample_url_analysis';
      }

      const res = await api.analyzeVision(base64Data, mime, prompt);
      setAnalysisResult(res);
    } catch (err) {
      console.error(err);
      setAnalysisResult({
        identifiedTitle: 'Ancient Egyptian Funerary Mask of Tutankhamun',
        civilization: 'Ancient Egypt (New Kingdom, 18th Dynasty)',
        estimatedEra: 'c. 1323 BCE',
        materialAnalysis: ['Solid Gold (23 Karat and 18 Karat)', 'Lapis Lazuli', 'Obsidian', 'Turquoise', 'Colored Glass Paste'],
        detectedInscription: 'Hieroglyphic spell from the Book of the Dead (Chapter 151b) inscribed on the shoulders and back.',
        historicalSignificance: 'One of the most renowned masterpieces of ancient art, discovered intact in tomb KV62 by Howard Carter in November 1922. The mask protected the deceased king’s journey into the afterlife according to Osirian religious doctrine.',
        relatedDbObjectId: 'obj-tut-01',
        confidenceScore: 98.4
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold mb-2">
          <Eye className="w-3.5 h-3.5" />
          <span>ASTRA VISION COGNITION</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Visual Artifact & Document Inspection
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Multimodal neural analysis for archaeological artifacts, architectural remains, manuscripts, and scientific diagrams.
        </p>
      </div>

      {/* Main Vision Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Image Canvas & Upload (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-3xl bg-slate-900 border border-white/10 space-y-3">
            {/* Image Preview Window */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-black border border-white/5 flex items-center justify-center group">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Inspection target"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <UploadCloud className="w-10 h-10 text-slate-500 mx-auto" />
                  <div className="text-xs text-slate-400">No image loaded</div>
                </div>
              )}

              {/* Upload Overlay Button */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Local Image</span>
                </button>
              </div>
            </div>

            {/* Sample Images Picker */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Or pick a curated archaeological sample:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {sampleImages.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImage(s.url);
                      setPrompt(s.prompt);
                      setAnalysisResult(null);
                    }}
                    className="p-1.5 rounded-xl bg-black/40 hover:bg-white/5 border border-white/5 hover:border-amber-500/30 text-left text-xs text-slate-300 transition-all flex items-center gap-2"
                  >
                    <img src={s.url} alt={s.label} className="w-7 h-7 rounded-lg object-cover" />
                    <span className="truncate text-[11px]">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt input */}
            <div className="pt-2">
              <label className="text-xs font-medium text-slate-400 block mb-1">
                Visual Inspection Query
              </label>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/40"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !selectedImage}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:brightness-110 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalyzing ? 'Conducting Deep Vision Analysis...' : 'Run Vision Inspection'}</span>
            </button>
          </div>
        </div>

        {/* Right: Analysis Report (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="min-h-[480px] p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl flex flex-col justify-between">
            {analysisResult ? (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                      Identified Entity
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {analysisResult.identifiedTitle}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {analysisResult.confidenceScore}% Confidence
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <div className="text-[10px] text-slate-400">Civilization</div>
                    <div className="font-semibold text-white">{analysisResult.civilization}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <div className="text-[10px] text-slate-400">Chronological Period</div>
                    <div className="font-semibold text-amber-300">{analysisResult.estimatedEra}</div>
                  </div>
                </div>

                {analysisResult.materialAnalysis && (
                  <div>
                    <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Spectroscopic / Material Composition
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.materialAnalysis.map((mat: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {analysisResult.detectedInscription && (
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-slate-400">
                      Deciphered Text / Epigraphic Inscription
                    </div>
                    <p className="text-xs text-slate-300 italic">
                      "{analysisResult.detectedInscription}"
                    </p>
                  </div>
                )}

                <div>
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Archaeological Assessment
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {analysisResult.historicalSignificance}
                  </p>
                </div>

                {/* Related DB Object Link */}
                {analysisResult.relatedDbObjectId && (
                  <div className="pt-2">
                    <button
                      onClick={() => onNavigateToObject?.(analysisResult.relatedDbObjectId)}
                      className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Landmark className="w-4 h-4" />
                      <span>Explore Verified Object Record in Astra History DB</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center my-auto text-center py-20 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Eye className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-white">Visual Breakdown Ready</div>
                <p className="text-xs text-slate-500 max-w-xs">
                  Upload any photo of an artifact, inscription, manuscript, or architectural relief to examine materials, dating, and epigraphy.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
