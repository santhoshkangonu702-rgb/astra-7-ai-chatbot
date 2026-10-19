import React, { useState } from 'react';
import {
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Download,
  Play,
  CheckCircle2,
  FileCode,
  FolderTree,
  Database,
  Globe2,
  ArrowLeft,
  ChevronRight,
  Terminal,
  Server,
  Layout,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

interface AstraAppBuilderPowerProps {
  onBack?: () => void;
  onAskAstra?: (prompt: string) => void;
}

export type BuilderStage =
  | 'IDEA'
  | 'REQUIREMENTS'
  | 'UI DESIGN'
  | 'DATABASE'
  | 'FRONTEND'
  | 'BACKEND'
  | 'TESTING'
  | 'PREVIEW'
  | 'EXPORT';

export const AstraAppBuilderPower: React.FC<AstraAppBuilderPowerProps> = ({
  onBack,
  onAskAstra
}) => {
  const [appIdea, setAppIdea] = useState('College attendance & lab submission portal with facial biometric check-in and automated marks analytics');
  const [currentStage, setCurrentStage] = useState<BuilderStage>('IDEA');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>('src/App.tsx');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const stages: BuilderStage[] = [
    'IDEA',
    'REQUIREMENTS',
    'UI DESIGN',
    'DATABASE',
    'FRONTEND',
    'BACKEND',
    'TESTING',
    'PREVIEW',
    'EXPORT'
  ];

  const fileTree = [
    { path: 'src/App.tsx', language: 'typescript' },
    { path: 'src/components/AttendanceScanner.tsx', language: 'typescript' },
    { path: 'src/components/StudentRoster.tsx', language: 'typescript' },
    { path: 'src/db/schema.sql', language: 'sql' },
    { path: 'server/apiRoutes.ts', language: 'typescript' },
    { path: 'package.json', language: 'json' }
  ];

  const codeSnippets: Record<string, string> = {
    'src/App.tsx': `import React, { useState } from 'react';\nimport { AttendanceScanner } from './components/AttendanceScanner';\nimport { StudentRoster } from './components/StudentRoster';\n\nexport default function App() {\n  const [activeTab, setActiveTab] = useState<'scan' | 'roster'>('scan');\n\n  return (\n    <div className="min-h-screen bg-slate-950 text-white p-6">\n      <header className="max-w-5xl mx-auto flex justify-between border-b border-white/10 pb-4">\n        <h1 className="text-xl font-bold text-amber-400">CampusSync Portal 2026</h1>\n        <div className="flex gap-2">\n          <button onClick={() => setActiveTab('scan')} className="px-3 py-1 bg-amber-500 text-black font-bold rounded-lg">Scanner</button>\n          <button onClick={() => setActiveTab('roster')} className="px-3 py-1 bg-white/10 rounded-lg">Roster</button>\n        </div>\n      </header>\n      <main className="max-w-5xl mx-auto mt-6">\n        {activeTab === 'scan' ? <AttendanceScanner /> : <StudentRoster />}\n      </main>\n    </div>\n  );\n}`,
    'src/db/schema.sql': `-- PostgreSQL / Supabase Schema for CampusSync Attendance\nCREATE TABLE students (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  roll_number VARCHAR(20) UNIQUE NOT NULL,\n  full_name VARCHAR(100) NOT NULL,\n  department VARCHAR(50) NOT NULL,\n  semester INT NOT NULL,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\nCREATE TABLE attendance_logs (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  student_id UUID REFERENCES students(id) ON DELETE CASCADE,\n  course_code VARCHAR(20) NOT NULL,\n  session_timestamp TIMESTAMPTZ DEFAULT NOW(),\n  verification_method VARCHAR(30) DEFAULT 'BIOMETRIC_FACE',\n  status VARCHAR(20) CHECK (status IN ('PRESENT', 'ABSENT', 'LATE'))\n);`,
    'server/apiRoutes.ts': `import { Router } from 'express';\nexport const attendanceRouter = Router();\n\nattendanceRouter.post('/verify-entry', async (req, res) => {\n  const { rollNumber, courseCode } = req.body;\n  // Validates biometric hash against enrolled embeddings\n  return res.json({\n    verified: true,\n    student: rollNumber,\n    status: 'PRESENT',\n    loggedAt: new Date().toISOString()\n  });\n});`
  };

  const handleNextStage = () => {
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex < stages.length - 1) {
      setIsSynthesizing(true);
      triggerHaptic(10);
      setTimeout(() => {
        setIsSynthesizing(false);
        setCurrentStage(stages[currentIndex + 1]);
        hapticSuccess();
      }, 500);
    }
  };

  const handleExportZip = () => {
    triggerHaptic(12);
    const bundle = {
      idea: appIdea,
      stage: currentStage,
      files: codeSnippets,
      manifest: {
        appName: 'CampusSync Portal',
        generatedWith: 'Astra 7 — Nexus 2040 App Builder',
        verified: true
      }
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bundle, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `campus-sync-app-scaffold.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
    hapticSuccess();
    setStatusNotice('App codebase blueprint exported successfully.');
    setTimeout(() => setStatusNotice(null), 3000);
  };

  return (
    <div
      id="astra-app-builder-power"
      className="w-full flex-1 flex flex-col bg-[#04060E] text-slate-100 min-h-0 min-w-0 overflow-y-auto"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Top Header */}
      <div className="sticky top-0 z-20 border-b border-amber-500/20 bg-[#050814]/95 backdrop-blur-md px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={() => {
                triggerHaptic(10);
                onBack();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
              title="Return"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/40 text-amber-400">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                ASTRA APP BUILDER
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  Full-Stack Synthesizer
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Idea → Requirements → UI Design → Database → Frontend → Backend → Testing → Preview → Export
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportZip}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export Codebase</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {statusNotice && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{statusNotice}</span>
          </div>
        )}

        {/* 9-Stage Progress Ladder */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              Active Synthesis Stage: <span className="text-amber-300">{currentStage}</span>
            </span>
            <span className="font-mono">{stages.indexOf(currentStage) + 1} of 9</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {stages.map((stage, idx) => {
              const isPast = stages.indexOf(currentStage) > idx;
              const isCurrent = currentStage === stage;

              return (
                <button
                  key={stage}
                  onClick={() => {
                    setCurrentStage(stage);
                    triggerHaptic(8);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-black shadow-md'
                      : isPast
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {idx + 1}. {stage}
                </button>
              );
            })}
          </div>
        </div>

        {/* App Prompt Input */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-sm space-y-3">
          <label className="block text-xs font-bold text-slate-300">
            Application Concept & System Requirements
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={appIdea}
              onChange={(e) => setAppIdea(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleNextStage}
              disabled={isSynthesizing}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4" />
              {isSynthesizing ? 'Synthesizing...' : 'Next Stage →'}
            </button>
          </div>
        </div>

        {/* Code Editor & File Tree Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 rounded-2xl border border-white/10 bg-[#060a16] overflow-hidden">
          {/* File Tree */}
          <div className="border-r border-white/10 p-4 space-y-3 bg-black/30">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-amber-400" />
              Project File Tree
            </h4>
            <div className="space-y-1">
              {fileTree.map((f) => (
                <button
                  key={f.path}
                  onClick={() => {
                    setSelectedFile(f.path);
                    triggerHaptic(8);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-2 ${
                    selectedFile === f.path ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{f.path}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="lg:col-span-3 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span className="text-white font-bold">{selectedFile}</span>
              </div>
              <span>TypeScript / Strict Mode</span>
            </div>

            <pre className="p-4 rounded-xl bg-black/60 border border-white/5 text-xs font-mono text-amber-100/90 overflow-x-auto leading-relaxed max-h-[380px]">
              {codeSnippets[selectedFile] || `// Code for ${selectedFile} ready for synthesis\n// Fully typed interface compliant with Astra 7 standards.`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
