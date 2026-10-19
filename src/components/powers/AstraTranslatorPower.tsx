import React, { useState } from 'react';
import {
  ArrowLeft,
  Languages,
  ArrowRightLeft,
  Volume2,
  Copy,
  Mic,
  MicOff,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Sliders,
  MessageSquare
} from 'lucide-react';

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' }
];

interface AstraTranslatorPowerProps {
  onBack?: () => void;
}

export const AstraTranslatorPower: React.FC<AstraTranslatorPowerProps> = ({ onBack }) => {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('te');
  const [inputText, setInputText] = useState('Knowledge is the foundation of future progress and boundless discovery.');
  const [translatedText, setTranslatedText] = useState(
    'జ్ఞానం అనేది భవిష్యత్ పురోగతి మరియు అపరిమితమైన ఆవిష్కరణలకు పునాది.'
  );
  const [pronunciationGuide, setPronunciationGuide] = useState(
    'Jñānaṁ anēdi bhaviṣyat purōgati mariyu aparimitamaina āviṣkaraṇalaku punādi.'
  );
  const [translationMode, setTranslationMode] = useState<'text' | 'voice' | 'conversation'>('text');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copyNotice, setCopyNotice] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSwapLanguages = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);

    const tempText = inputText;
    setInputText(translatedText);
    setTranslatedText(tempText);
  };

  const handleTranslate = () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    setTimeout(() => {
      setIsTranslating(false);
      if (targetLang === 'te') {
        setTranslatedText('జ్ఞానం అనేది భవిష్యత్ పురోగతి మరియు అపరిమితమైన ఆవిష్కరణలకు పునాది.');
        setPronunciationGuide('Jñānaṁ anēdi bhaviṣyat purōgati mariyu aparimitamaina āviṣkaraṇalaku punādi.');
      } else if (targetLang === 'hi') {
        setTranslatedText('ज्ञान भविष्य की प्रगति और असीम खोज की आधारशिला है।');
        setPronunciationGuide('Gyaan bhavishya ki pragati aur aseem khoj ki aadhaarshila hai.');
      } else if (targetLang === 'ja') {
        setTranslatedText('知識は未来の進歩と無限の発見の礎です。');
        setPronunciationGuide('Chishiki wa mirai no shinpo to mugen no hakken no ishizue desu.');
      } else {
        setTranslatedText(`[Astra 7 Neural Translation to ${targetLang.toUpperCase()}]: ${inputText}`);
        setPronunciationGuide('Phonetic guide rendered.');
      }
    }, 450);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopyNotice(true);
    setTimeout(() => setCopyNotice(false), 2000);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech audio synthesizing in Astra Neural Voice.');
    }
  };

  return (
    <div id="astra-translator" className="h-full overflow-y-auto px-4 py-6 md:px-8 space-y-8 text-slate-100 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all"
              title="Return to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <Languages className="w-7 h-7 text-cyan-400" />
                ASTRA TRANSLATOR
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                POLYGLOT NEURAL CORE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Telugu • English • Hindi • Tamil • Kannada • Malayalam • Bengali • Global Languages
            </p>
          </div>
        </div>

        {/* Translation Mode Toggles */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
          {[
            { id: 'text', label: 'Text & Voice' },
            { id: 'conversation', label: 'Conversational Split' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setTranslationMode(m.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                translationMode === m.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Language Selector Bar with Swap Button */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-xl">
        {/* Source Language */}
        <div className="flex-1">
          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
            Source Language
          </label>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-400"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} ({lang.nativeName})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwapLanguages}
          className="p-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-300 transition-all hover:rotate-180 duration-300 mt-4 active:scale-95"
          title="Swap Languages"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>

        {/* Target Language */}
        <div className="flex-1">
          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
            Target Language
          </label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} ({lang.nativeName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Translation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Input Text Box */}
        <div className="p-5 rounded-3xl bg-slate-950/70 border border-white/10 backdrop-blur-xl flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase text-[10px] text-cyan-400">Original Text</span>
              <span>{inputText.length} characters</span>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter or paste text to translate..."
              rows={6}
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <button
              onClick={() => alert('Listening for microphone voice input in ' + sourceLang)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1.5"
            >
              <Mic className="w-4 h-4 text-cyan-400" />
              <span>Voice In</span>
            </button>

            <button
              onClick={handleTranslate}
              disabled={isTranslating}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md disabled:opacity-50"
            >
              {isTranslating ? 'Translating...' : 'Translate'}
            </button>
          </div>
        </div>

        {/* Right: Output Translation Box */}
        <div className="p-5 rounded-3xl bg-slate-950/70 border border-cyan-500/30 backdrop-blur-xl flex flex-col justify-between space-y-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase text-[10px] text-emerald-400">
                Astra Neural Translation
              </span>
              {copyNotice && <span className="text-emerald-400 text-[10px]">Copied to clipboard!</span>}
            </div>

            <div className="min-h-[140px] text-base font-medium text-slate-100 leading-relaxed">
              {translatedText}
            </div>

            {pronunciationGuide && (
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-amber-300 font-mono space-y-0.5">
                <span className="text-[9px] uppercase text-slate-400 block font-sans">
                  Pronunciation / Phonetic Guide:
                </span>
                <div>{pronunciationGuide}</div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <button
              onClick={handleSpeak}
              className={`p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs flex items-center gap-1.5 border border-cyan-400/30 ${
                isSpeaking ? 'animate-pulse' : ''
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isSpeaking ? 'Speaking...' : 'Listen (TTS)'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1.5"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
