import React, { useState } from 'react';
import {
  Award,
  Trophy,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Code2,
  FolderKanban,
  Download,
  Share2,
  ArrowLeft,
  Flame,
  Star,
  ShieldCheck
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

interface Certificate {
  id: string;
  title: string;
  type: 'Certificate of Completion' | 'Certificate of Achievement';
  issuer: string;
  issueDate: string;
  skillsVerified: string[];
  accreditationNote: string;
}

interface AchievementCenterPowerProps {
  onBack?: () => void;
}

export const AchievementCenterPower: React.FC<AchievementCenterPowerProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'skills' | 'completions' | 'certificates'>('profile');
  const [learningHours] = useState(148);
  const [coursesCompleted] = useState(12);
  const [projectsCompleted] = useState(7);
  const [quizzesPassed] = useState(34);

  const certificates: Certificate[] = [
    {
      id: 'cert-1',
      title: 'Full-Stack TypeScript & AI Agent Architectures',
      type: 'Certificate of Achievement',
      issuer: 'Astra 7 Learning Academy',
      issueDate: '2026-09-15',
      skillsVerified: ['TypeScript 5.6', 'React 19', 'RAG Pipelines', 'Vector Embeddings'],
      accreditationNote: 'Truthful Verification: Certificate of Achievement recognizing self-paced practical mastery.'
    },
    {
      id: 'cert-2',
      title: 'Quantum Computing Simulators & Cryptographic Algorithms',
      type: 'Certificate of Completion',
      issuer: 'Astra Quantum Lab',
      issueDate: '2026-08-20',
      skillsVerified: ['Qiskit Simulation', 'Shor Algorithm Fundamentals', 'Post-Quantum Lattice Cryptography'],
      accreditationNote: 'Truthful Verification: Certificate of Completion upon finishing simulated virtual laboratory modules.'
    }
  ];

  const skills = [
    { name: 'TypeScript & React', level: 'Advanced', progress: 92 },
    { name: 'Generative AI & Tool Calling', level: 'Advanced', progress: 88 },
    { name: 'Data Visualization & D3', level: 'Proficient', progress: 75 },
    { name: 'Prompt Engineering & Ethics', level: 'Master', progress: 96 },
    { name: 'Distributed Systems & WebSockets', level: 'Proficient', progress: 70 }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 text-slate-100 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-purple-500/15 border border-amber-500/25 backdrop-blur-md">
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
            <Trophy className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">ASTRA ACHIEVEMENT CENTER</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                TRUTHFUL VERIFICATION
              </span>
            </div>
            <p className="text-xs text-slate-400">
              ACHIEVEMENT PROFILE → SKILLS → PROGRESS → COMPLETIONS → CERTIFICATES
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
          <Clock className="w-6 h-6 text-amber-400 shrink-0" />
          <div>
            <div className="text-[10px] font-mono text-slate-400">LEARNING HOURS</div>
            <div className="text-xl font-bold text-white">{learningHours} hrs</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-cyan-400 shrink-0" />
          <div>
            <div className="text-[10px] font-mono text-slate-400">COURSES COMPLETED</div>
            <div className="text-xl font-bold text-white">{coursesCompleted}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
          <FolderKanban className="w-6 h-6 text-purple-400 shrink-0" />
          <div>
            <div className="text-[10px] font-mono text-slate-400">PROJECTS BUILT</div>
            <div className="text-xl font-bold text-white">{projectsCompleted}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <div className="text-[10px] font-mono text-slate-400">QUIZZES PASSED</div>
            <div className="text-xl font-bold text-white">{quizzesPassed}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-2 text-xs">
        {[
          { id: 'profile', label: 'Achievement Profile', icon: Trophy },
          { id: 'skills', label: 'Verified Skills', icon: Star },
          { id: 'certificates', label: 'Certificates of Completion', icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB: Profile */}
      {activeTab === 'profile' && (
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white">Learner Cognitive Profile</h3>
          <p className="text-slate-300 leading-relaxed">
            Consistently advancing through autonomous study pipelines, coding labs, and virtual simulations.
            Total verified commitment of {learningHours} hours with 100% adherence to academic honesty.
          </p>
        </div>
      )}

      {/* TAB: Skills */}
      {activeTab === 'skills' && (
        <div className="space-y-3">
          {skills.map((s, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{s.name}</span>
                <span className="text-amber-300 font-mono">{s.level} ({s.progress}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${s.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: Certificates (Truthful wording strictly enforced) */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Truthful Certification Standard:</strong> All credentials are explicitly labeled
              "Certificate of Completion" or "Certificate of Achievement" and are not represented as accredited
              university degrees unless formal institutional articulation agreements are in effect.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-6 rounded-3xl bg-gradient-to-br from-black/60 to-slate-900/60 border border-amber-500/30 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold uppercase">
                    {cert.type}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{cert.issueDate}</span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">{cert.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Issued by: {cert.issuer}</p>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Verified Competencies:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {cert.skillsVerified.map((sk) => (
                      <span key={sk} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-200 border border-white/5">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-[10px] font-mono text-slate-400 italic pt-2 border-t border-white/5">
                  {cert.accreditationNote}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
