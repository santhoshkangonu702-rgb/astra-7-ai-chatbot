import React, { useState } from 'react';
import {
  Wrench,
  Calculator,
  Repeat,
  FileText,
  Code,
  Percent,
  QrCode,
  Calendar,
  Palette,
  Copy,
  Check,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const AstraToolboxPower: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'calculator' | 'converter' | 'text' | 'json' | 'percentage' | 'qr' | 'date' | 'color'
  >('calculator');

  // Calculator State
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcPrev, setCalcPrev] = useState<number | null>(null);
  const [calcOp, setCalcOp] = useState<string | null>(null);
  const [calcClearNext, setCalcClearNext] = useState(false);

  const handleCalcNumber = (num: string) => {
    if (calcDisplay === '0' || calcClearNext) {
      setCalcDisplay(num);
      setCalcClearNext(false);
    } else {
      setCalcDisplay(calcDisplay + num);
    }
  };

  const handleCalcOp = (op: string) => {
    const current = parseFloat(calcDisplay);
    if (calcPrev === null) {
      setCalcPrev(current);
    } else if (calcOp) {
      const result = executeCalc(calcPrev, current, calcOp);
      setCalcPrev(result);
      setCalcDisplay(String(result));
    }
    setCalcOp(op);
    setCalcClearNext(true);
  };

  const executeCalc = (a: number, b: number, op: string) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      case '^': return Math.pow(a, b);
      default: return b;
    }
  };

  const handleCalcEquals = () => {
    if (calcPrev === null || !calcOp) return;
    const current = parseFloat(calcDisplay);
    const result = executeCalc(calcPrev, current, calcOp);
    setCalcDisplay(String(result));
    setCalcPrev(null);
    setCalcOp(null);
    setCalcClearNext(true);
  };

  const handleCalcClear = () => {
    setCalcDisplay('0');
    setCalcPrev(null);
    setCalcOp(null);
  };

  // Unit Converter State
  const [convType, setConvType] = useState<'length' | 'weight' | 'temp' | 'data'>('length');
  const [convValue, setConvValue] = useState<number>(1);
  const [convFrom, setConvFrom] = useState('meter');
  const [convTo, setConvTo] = useState('feet');

  const convertUnits = () => {
    const v = Number(convValue) || 0;
    if (convType === 'length') {
      const inMeters: Record<string, number> = {
        meter: 1,
        kilometer: 1000,
        centimeter: 0.01,
        millimeter: 0.001,
        mile: 1609.34,
        yard: 0.9144,
        feet: 0.3048,
        inch: 0.0254
      };
      const meters = v * (inMeters[convFrom] || 1);
      return (meters / (inMeters[convTo] || 1)).toFixed(4);
    }
    if (convType === 'weight') {
      const inKg: Record<string, number> = {
        kilogram: 1,
        gram: 0.001,
        pound: 0.453592,
        ounce: 0.0283495,
        ton: 1000
      };
      const kg = v * (inKg[convFrom] || 1);
      return (kg / (inKg[convTo] || 1)).toFixed(4);
    }
    if (convType === 'temp') {
      let celsius = v;
      if (convFrom === 'fahrenheit') celsius = (v - 32) * (5 / 9);
      if (convFrom === 'kelvin') celsius = v - 273.15;

      if (convTo === 'celsius') return celsius.toFixed(2);
      if (convTo === 'fahrenheit') return (celsius * (9 / 5) + 32).toFixed(2);
      if (convTo === 'kelvin') return (celsius + 273.15).toFixed(2);
    }
    if (convType === 'data') {
      const inBytes: Record<string, number> = {
        byte: 1,
        kilobyte: 1024,
        megabyte: 1024 * 1024,
        gigabyte: 1024 * 1024 * 1024,
        terabyte: 1024 * 1024 * 1024 * 1024
      };
      const bytes = v * (inBytes[convFrom] || 1);
      return (bytes / (inBytes[convTo] || 1)).toFixed(4);
    }
    return '0';
  };

  // Text Counter State
  const [textInput, setTextInput] = useState('');
  const wordsCount = textInput.trim() ? textInput.trim().split(/\s+/).length : 0;
  const charsCount = textInput.length;
  const charsNoSpaces = textInput.replace(/\s/g, '').length;
  const readingTime = Math.ceil(wordsCount / 200);

  // JSON Formatter State
  const [jsonInput, setJsonInput] = useState('{\n  "status": "active",\n  "count": 42\n}');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed));
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  // Percentage Calculator
  const [pctVal1, setPctVal1] = useState(15);
  const [pctVal2, setPctVal2] = useState(250);

  // QR Code State
  const [qrText, setQrText] = useState('https://astra7.ai');

  // Date Calculator
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const diffDays = Math.round(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Color Palette Tool
  const [pickedColor, setPickedColor] = useState('#6366f1');

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-500/20 backdrop-blur-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 shrink-0">
          <Wrench className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Astra Toolbox
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
              Instant Local Utilities
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            High-speed client-side productivity utilities that run with zero network latency.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {[
          { id: 'calculator', label: 'Calculator', icon: Calculator },
          { id: 'converter', label: 'Unit Converter', icon: Repeat },
          { id: 'text', label: 'Text Counter', icon: FileText },
          { id: 'json', label: 'JSON Formatter', icon: Code },
          { id: 'percentage', label: 'Percentage', icon: Percent },
          { id: 'qr', label: 'QR Code', icon: QrCode },
          { id: 'date', label: 'Date Calc', icon: Calendar },
          { id: 'color', label: 'Color Tools', icon: Palette }
        ].map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* 1. Calculator */}
        {activeTab === 'calculator' && (
          <div className="max-w-sm mx-auto space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 text-right space-y-1">
              <div className="text-xs font-mono text-slate-500 h-4">
                {calcPrev !== null ? `${calcPrev} ${calcOp || ''}` : ''}
              </div>
              <div className="text-3xl font-mono font-bold text-cyan-400 truncate">
                {calcDisplay}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {['C', '^', '÷', '×', '7', '8', '9', '-', '4', '5', '6', '+', '1', '2', '3', '=', '0', '.'].map((btn) => (
                <button
                  key={btn}
                  onClick={() => {
                    if (btn === 'C') handleCalcClear();
                    else if (btn === '=') handleCalcEquals();
                    else if (['+', '-', '×', '÷', '^'].includes(btn)) handleCalcOp(btn);
                    else handleCalcNumber(btn);
                  }}
                  className={`p-3.5 rounded-2xl text-base font-bold font-mono transition-all active:scale-95 ${
                    btn === '='
                      ? 'col-span-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                      : ['C'].includes(btn)
                      ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
                      : ['+', '-', '×', '÷', '^'].includes(btn)
                      ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. Unit Converter */}
        {activeTab === 'converter' && (
          <div className="space-y-6 max-w-lg mx-auto">
            <div className="flex gap-2 justify-center">
              {(['length', 'weight', 'temp', 'data'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setConvType(t);
                    if (t === 'length') { setConvFrom('meter'); setConvTo('feet'); }
                    if (t === 'weight') { setConvFrom('kilogram'); setConvTo('pound'); }
                    if (t === 'temp') { setConvFrom('celsius'); setConvTo('fahrenheit'); }
                    if (t === 'data') { setConvFrom('gigabyte'); setConvTo('megabyte'); }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    convType === t
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400">From</label>
                <input
                  type="number"
                  value={convValue}
                  onChange={e => setConvValue(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-lg font-bold text-slate-900 dark:text-white focus:outline-none"
                />
                <select
                  value={convFrom}
                  onChange={e => setConvFrom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  {convType === 'length' && ['meter', 'kilometer', 'centimeter', 'millimeter', 'mile', 'yard', 'feet', 'inch'].map(u => <option key={u} value={u}>{u}</option>)}
                  {convType === 'weight' && ['kilogram', 'gram', 'pound', 'ounce', 'ton'].map(u => <option key={u} value={u}>{u}</option>)}
                  {convType === 'temp' && ['celsius', 'fahrenheit', 'kelvin'].map(u => <option key={u} value={u}>{u}</option>)}
                  {convType === 'data' && ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte'].map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400">To Result</label>
                <div className="w-full px-4 py-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 text-lg font-bold text-cyan-600 dark:text-cyan-400 font-mono truncate">
                  {convertUnits()}
                </div>
                <select
                  value={convTo}
                  onChange={e => setConvTo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  {convType === 'length' && ['meter', 'kilometer', 'centimeter', 'millimeter', 'mile', 'yard', 'feet', 'inch'].map(u => <option key={u} value={u}>{u}</option>)}
                  {convType === 'weight' && ['kilogram', 'gram', 'pound', 'ounce', 'ton'].map(u => <option key={u} value={u}>{u}</option>)}
                  {convType === 'temp' && ['celsius', 'fahrenheit', 'kelvin'].map(u => <option key={u} value={u}>{u}</option>)}
                  {convType === 'data' && ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte'].map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 3. Text Counter */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <textarea
              rows={6}
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              placeholder="Paste or type text here to inspect words, character count, and reading duration..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center">
                <div className="text-2xl font-black text-cyan-500 font-mono">{wordsCount}</div>
                <div className="text-xs text-slate-400 uppercase font-bold">Words</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center">
                <div className="text-2xl font-black text-blue-500 font-mono">{charsCount}</div>
                <div className="text-xs text-slate-400 uppercase font-bold">Characters</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center">
                <div className="text-2xl font-black text-indigo-500 font-mono">{charsNoSpaces}</div>
                <div className="text-xs text-slate-400 uppercase font-bold">No Spaces</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center">
                <div className="text-2xl font-black text-violet-500 font-mono">{readingTime} min</div>
                <div className="text-xs text-slate-400 uppercase font-bold">Reading Time</div>
              </div>
            </div>
          </div>
        )}

        {/* 4. JSON Formatter */}
        {activeTab === 'json' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                onClick={formatJson}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold"
              >
                Prettify JSON
              </button>
              <button
                onClick={minifyJson}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Minify JSON
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400">Input JSON</label>
                <textarea
                  rows={8}
                  value={jsonInput}
                  onChange={e => setJsonInput(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 text-cyan-400 font-mono text-xs focus:outline-none mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400">Formatted Output</label>
                <textarea
                  rows={8}
                  readOnly
                  value={jsonError ? `Error: ${jsonError}` : jsonOutput}
                  className={`w-full p-3 rounded-xl bg-slate-950 font-mono text-xs focus:outline-none mt-1 ${
                    jsonError ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* 5. Percentage Calculator */}
        {activeTab === 'percentage' && (
          <div className="space-y-6 max-w-md mx-auto">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase">What is X% of Y?</div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={pctVal1}
                  onChange={e => setPctVal1(Number(e.target.value))}
                  className="w-24 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 font-bold text-center border"
                />
                <span className="text-sm font-bold text-slate-400">% of</span>
                <input
                  type="number"
                  value={pctVal2}
                  onChange={e => setPctVal2(Number(e.target.value))}
                  className="w-28 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 font-bold text-center border"
                />
                <span className="text-sm font-bold text-slate-400">=</span>
                <div className="text-xl font-bold font-mono text-cyan-500">
                  {((pctVal1 * pctVal2) / 100).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. QR Code Generator */}
        {activeTab === 'qr' && (
          <div className="space-y-4 max-w-sm mx-auto text-center">
            <input
              type="text"
              value={qrText}
              onChange={e => setQrText(e.target.value)}
              placeholder="Enter URL or text to generate QR..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-medium focus:outline-none"
            />
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 inline-block shadow-sm">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrText || 'Astra')}`}
                alt="QR Code"
                className="w-44 h-44 mx-auto rounded-xl"
              />
            </div>
            <p className="text-xs text-slate-400">
              Scannable with any mobile camera or QR reader.
            </p>
          </div>
        )}

        {/* 7. Date Difference */}
        {activeTab === 'date' && (
          <div className="space-y-4 max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-400">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-medium"
                />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800 text-center">
              <div className="text-3xl font-black font-mono text-cyan-600 dark:text-cyan-400">
                {diffDays} Days
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Difference between dates ({Math.round(diffDays / 7)} weeks)
              </div>
            </div>
          </div>
        )}

        {/* 8. Color Tool */}
        {activeTab === 'color' && (
          <div className="space-y-4 max-w-md mx-auto text-center">
            <div className="flex items-center justify-center gap-4">
              <input
                type="color"
                value={pickedColor}
                onChange={e => setPickedColor(e.target.value)}
                className="w-16 h-16 rounded-2xl cursor-pointer border-0"
              />
              <div className="text-left space-y-1">
                <div className="text-lg font-mono font-bold text-slate-900 dark:text-white">
                  {pickedColor.toUpperCase()}
                </div>
                <div className="text-xs text-slate-400">
                  Pick any color to copy HEX value
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
