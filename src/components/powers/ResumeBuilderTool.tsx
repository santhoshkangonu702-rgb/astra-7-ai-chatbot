import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Plus,
  Trash2,
  Download,
  Printer,
  Copy,
  Check,
  Eye,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  Wand2,
  ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';
import { ResumeData } from '../../types';

export const ResumeBuilderTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [template, setTemplate] = useState<'modern' | 'executive' | 'tech'>('modern');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [copied, setCopied] = useState(false);

  const [resume, setResume] = useState<ResumeData>({
    personalInfo: {
      fullName: 'Alex Morgan',
      title: 'Full-Stack Software Engineer',
      email: 'alex.morgan@example.com',
      phone: '+1 (555) 342-8901',
      location: 'San Francisco, CA',
      website: 'alexmorgan.dev',
      linkedin: 'linkedin.com/in/alexmorgan',
      github: 'github.com/alexmorgan',
      summary: 'Impact-driven Full-Stack Engineer with 3+ years of experience architecting high-throughput distributed web systems, optimizing frontend rendering velocity, and leading responsive UX initiatives.'
    },
    education: [
      {
        id: 'edu-1',
        school: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        field: 'Computer Science & Data Analytics',
        startDate: '2019',
        endDate: '2023',
        gpa: '3.85'
      }
    ],
    experience: [
      {
        id: 'exp-1',
        company: 'Vortex Cloud Technologies',
        role: 'Software Engineer II',
        location: 'San Francisco, CA',
        startDate: 'Jun 2023',
        endDate: 'Present',
        current: true,
        bullets: [
          'Engineered event-driven microservices reducing server latency by 38% for 450,000+ daily active users.',
          'Spearheaded transition to TypeScript and modern React components, decreasing critical frontend bugs by 42%.',
          'Collaborated with product designers to implement accessibility and WCAG AA standards across all workflows.'
        ]
      }
    ],
    skills: {
      technical: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'GraphQL'],
      soft: ['Cross-Functional Leadership', 'Agile Methodology', 'Technical Mentorship', 'System Architecture'],
      tools: ['Git', 'VS Code', 'AWS Cloud', 'Vite', 'Figma']
    },
    projects: [
      {
        id: 'proj-1',
        title: 'Astra Studio AI Workspace',
        description: 'Multi-engine intelligent application featuring instant code reasoning, ATS resume generation, and study tutoring.',
        techStack: ['React', 'TypeScript', 'Tailwind', 'Gemini AI API'],
        link: 'https://github.com/demo/astra-studio'
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        date: '2023'
      }
    ]
  });

  // Enhance Summary with AI
  const handleEnhanceSummary = async () => {
    setIsEnhancing(true);
    try {
      const res = await api.createContent({
        tool: 'writer',
        prompt: `Improve this resume executive summary for a ${resume.personalInfo.title} with skills ${resume.skills.technical.join(', ')}: "${resume.personalInfo.summary}"`,
        tone: 'professional',
        length: 'short'
      });
      if (res.content) {
        setResume((prev) => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, summary: res.content.trim() }
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Enhance Bullets for an experience entry
  const handleEnhanceBullet = async (expId: string, bulletIdx: number) => {
    const exp = resume.experience.find((e) => e.id === expId);
    if (!exp) return;
    const currentBullet = exp.bullets[bulletIdx];

    setIsEnhancing(true);
    try {
      const res = await api.createContent({
        tool: 'writer',
        prompt: `Rewrite this resume accomplishment bullet with powerful action verbs, metrics, and concise technical impact: "${currentBullet}"`,
        tone: 'professional',
        length: 'short'
      });
      if (res.content) {
        const cleanBullet = res.content.replace(/^[-•*\s]+/, '').split('\n')[0];
        setResume((prev) => ({
          ...prev,
          experience: prev.experience.map((item) => {
            if (item.id === expId) {
              const updatedBullets = [...item.bullets];
              updatedBullets[bulletIdx] = cleanBullet;
              return { ...item, bullets: updatedBullets };
            }
            return item;
          })
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Add experience
  const addExperience = () => {
    setResume((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: `exp-${Date.now()}`,
          company: 'Company Name',
          role: 'Job Title',
          location: 'City, State',
          startDate: 'Date',
          endDate: 'Present',
          current: true,
          bullets: ['Key impact or achievement with measurable outcomes.']
        }
      ]
    }));
  };

  const removeExperience = (id: string) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id)
    }));
  };

  // Add education
  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: `edu-${Date.now()}`,
          school: 'University or College',
          degree: 'Degree',
          field: 'Field of Study',
          startDate: '2020',
          endDate: '2024'
        }
      ]
    }));
  };

  const removeEducation = (id: string) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id)
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-${resume.personalInfo.fullName.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Resume Builder</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Design ATS-friendly resumes with AI-enhanced bullet points, live preview, and instant export.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Template Selector */}
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value as any)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="modern">Modern Accent</option>
              <option value="executive">Executive Clean</option>
              <option value="tech">Tech Minimal</option>
            </select>

            <button
              onClick={handlePrint}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-colors flex items-center gap-1.5"
              title="Export JSON Data"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'editor'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Form Editor
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Document Preview</span>
          </button>
        </div>

        {/* EDITOR VIEW */}
        {activeTab === 'editor' && (
          <div className="space-y-6">
            {/* Personal Details */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                1. Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={resume.personalInfo.fullName}
                    onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, fullName: e.target.value } })}
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">Target Job Title</label>
                  <input
                    type="text"
                    value={resume.personalInfo.title}
                    onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, title: e.target.value } })}
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={resume.personalInfo.email}
                    onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, email: e.target.value } })}
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={resume.personalInfo.phone}
                    onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, phone: e.target.value } })}
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={resume.personalInfo.location}
                    onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, location: e.target.value } })}
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">LinkedIn / Portfolio</label>
                  <input
                    type="text"
                    value={resume.personalInfo.linkedin || ''}
                    onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, linkedin: e.target.value } })}
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Executive Summary */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Executive Summary
                  </label>
                  <button
                    onClick={handleEnhanceSummary}
                    disabled={isEnhancing}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <Wand2 className="w-3 h-3" />
                    <span>Enhance with AI</span>
                  </button>
                </div>
                <textarea
                  value={resume.personalInfo.summary}
                  onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, summary: e.target.value } })}
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Experience Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  2. Work Experience
                </h2>
                <button
                  onClick={addExperience}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Role</span>
                </button>
              </div>

              {resume.experience.map((exp) => (
                <div key={exp.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {exp.role || 'Role'} at {exp.company || 'Company'}
                    </div>
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                      title="Remove experience"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => {
                        const val = e.target.value;
                        setResume((prev) => ({
                          ...prev,
                          experience: prev.experience.map((item) => item.id === exp.id ? { ...item, company: val } : item)
                        }));
                      }}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-800 dark:text-slate-200"
                    />
                    <input
                      type="text"
                      placeholder="Role Title"
                      value={exp.role}
                      onChange={(e) => {
                        const val = e.target.value;
                        setResume((prev) => ({
                          ...prev,
                          experience: prev.experience.map((item) => item.id === exp.id ? { ...item, role: val } : item)
                        }));
                      }}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-800 dark:text-slate-200"
                    />
                    <input
                      type="text"
                      placeholder="Dates (e.g. 2022 - Present)"
                      value={`${exp.startDate} - ${exp.endDate}`}
                      onChange={(e) => {
                        const parts = e.target.value.split('-');
                        setResume((prev) => ({
                          ...prev,
                          experience: prev.experience.map((item) =>
                            item.id === exp.id
                              ? { ...item, startDate: parts[0]?.trim() || '', endDate: parts[1]?.trim() || '' }
                              : item
                          )
                        }));
                      }}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  {/* Bullets */}
                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-bold text-slate-500">Accomplishment Bullets</div>
                    {exp.bullets.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <span className="text-slate-400 text-xs">•</span>
                        <input
                          type="text"
                          value={b}
                          onChange={(e) => {
                            const val = e.target.value;
                            setResume((prev) => ({
                              ...prev,
                              experience: prev.experience.map((item) => {
                                if (item.id === exp.id) {
                                  const nb = [...item.bullets];
                                  nb[bIdx] = val;
                                  return { ...item, bullets: nb };
                                }
                                return item;
                              })
                            }));
                          }}
                          className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-800 dark:text-slate-200"
                        />
                        <button
                          onClick={() => handleEnhanceBullet(exp.id, bIdx)}
                          title="AI Action Verb & Metric Enhancer"
                          className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 text-xs font-bold"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Education Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  3. Education
                </h2>
                <button
                  onClick={addEducation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add School</span>
                </button>
              </div>

              {resume.education.map((edu) => (
                <div key={edu.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {edu.degree} in {edu.field}
                    </div>
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="School"
                      value={edu.school}
                      onChange={(e) => {
                        const val = e.target.value;
                        setResume((prev) => ({
                          ...prev,
                          education: prev.education.map((item) => item.id === edu.id ? { ...item, school: val } : item)
                        }));
                      }}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-800 dark:text-slate-200"
                    />
                    <input
                      type="text"
                      placeholder="Degree & Major"
                      value={`${edu.degree} in ${edu.field}`}
                      onChange={(e) => {
                        const val = e.target.value;
                        setResume((prev) => ({
                          ...prev,
                          education: prev.education.map((item) => item.id === edu.id ? { ...item, degree: val } : item)
                        }));
                      }}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-800 dark:text-slate-200"
                    />
                    <input
                      type="text"
                      placeholder="Graduation Year"
                      value={edu.endDate}
                      onChange={(e) => {
                        const val = e.target.value;
                        setResume((prev) => ({
                          ...prev,
                          education: prev.education.map((item) => item.id === edu.id ? { ...item, endDate: val } : item)
                        }));
                      }}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIVE PREVIEW VIEW (ATS Printable layout) */}
        {activeTab === 'preview' && (
          <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-300 shadow-xl max-w-4xl mx-auto font-sans leading-relaxed">
            {/* Header */}
            <div className={`pb-6 mb-6 ${template === 'modern' ? 'border-b-2 border-indigo-600' : 'border-b border-slate-300'}`}>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                {resume.personalInfo.fullName}
              </h1>
              <div className="text-base font-bold text-indigo-600 mt-1">
                {resume.personalInfo.title}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
                <span>{resume.personalInfo.email}</span>
                <span>•</span>
                <span>{resume.personalInfo.phone}</span>
                <span>•</span>
                <span>{resume.personalInfo.location}</span>
                {resume.personalInfo.linkedin && (
                  <>
                    <span>•</span>
                    <span>{resume.personalInfo.linkedin}</span>
                  </>
                )}
              </div>
            </div>

            {/* Summary */}
            {resume.personalInfo.summary && (
              <div className="mb-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b pb-1">
                  Professional Summary
                </h2>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {resume.personalInfo.summary}
                </p>
              </div>
            )}

            {/* Experience */}
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 border-b pb-1">
                Professional Experience
              </h2>
              <div className="space-y-4">
                {resume.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-slate-900">{exp.role}</span>
                      <span className="text-[11px] text-slate-500">{exp.startDate} – {exp.endDate}</span>
                    </div>
                    <div className="text-xs italic text-slate-600 mb-1.5">{exp.company} • {exp.location}</div>
                    <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-slate-700">
                      {exp.bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 border-b pb-1">
                Education
              </h2>
              <div className="space-y-3">
                {resume.education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-baseline text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{edu.school}</div>
                      <div className="text-slate-600">{edu.degree} in {edu.field} {edu.gpa ? `(GPA: ${edu.gpa})` : ''}</div>
                    </div>
                    <div className="text-[11px] text-slate-500">{edu.startDate} – {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b pb-1">
                Technical & Professional Skills
              </h2>
              <div className="text-xs text-slate-700 space-y-1">
                <p><strong>Technical:</strong> {resume.skills.technical.join(', ')}</p>
                <p><strong>Tools & Platforms:</strong> {resume.skills.tools.join(', ')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
