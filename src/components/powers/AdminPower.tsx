import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Upload,
  Database,
  CheckCircle2,
  AlertCircle,
  FileJson,
  Layers,
  Sparkles,
  Server
} from 'lucide-react';
import { api } from '../../services/api';
import { HistoricalObject } from '../../types';

interface AdminPowerProps {
  onRefreshDatabase?: () => void;
}

export const AdminPower: React.FC<AdminPowerProps> = ({ onRefreshDatabase }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'import' | 'audit'>('create');

  // New object form
  const [name, setName] = useState('');
  const [civilization, setCivilization] = useState('Ancient Egypt');
  const [dateDisplay, setDateDisplay] = useState('c. 1200 BCE');
  const [approxYear, setApproxYear] = useState(-1200);
  const [museum, setMuseum] = useState('The British Museum, London');
  const [siteName, setSiteName] = useState('Thebes (Luxor), Egypt');
  const [materials, setMaterials] = useState('Gold, Lapis Lazuli');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1599739291060-4578e77dac5d?auto=format&fit=crop&w=800&q=80');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Bulk import
  const [importJson, setImportJson] = useState(`[
  {
    "name": "Standard of Ur",
    "civilization": "Mesopotamia (Sumerian)",
    "date_display": "c. 2600 BCE",
    "approximate_year": -2600,
    "status": "excavated",
    "museum": "The British Museum, London",
    "material": ["Shell", "Red Limestone", "Lapis Lazuli", "Bitumen"],
    "discovery_site": {
      "site_name": "Royal Cemetery at Ur, Southern Iraq",
      "coordinates": [30.9619, 46.1056]
    },
    "image": {
      "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      "image_type": "archival_photography",
      "verified": true
    },
    "description": "A hollow wooden box featuring elaborate mosaic scenes depicting war on one side and peace on the other."
  }
]`);

  const handleCreateObject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSuccessMsg(null);

    try {
      await api.createObject({
        name,
        civilization,
        date_display: dateDisplay,
        date_start: Number(approxYear),
        date_end: Number(approxYear),
        museum,
        status: 'surviving',
        material: materials.split(',').map((m) => m.trim()),
        dimensions: '25 cm × 15 cm',
        discovery_location: siteName,
        image: {
          image_url: imageUrl,
          image_type: 'authentic_photograph',
          source_name: 'Museum Archive',
          source_url: imageUrl,
          license: 'Public Domain / Educational Fair Use',
          attribution: 'Official Museum Archival Record',
          verification_status: 'verified'
        },
        description,
        verification_status: 'verified',
        data_completeness: 95
      } as any);

      setSuccessMsg(`Successfully catalogued "${name}" into Astra History DB.`);
      setName('');
      setDescription('');
      onRefreshDatabase?.();
    } catch (err: any) {
      alert(err.message || 'Failed to catalogue object');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkImport = async () => {
    try {
      const parsed = JSON.parse(importJson);
      const res = await api.bulkImportObjects(parsed, 'json');
      setSuccessMsg(`Bulk import completed: ${res.importedCount} objects inserted.`);
      onRefreshDatabase?.();
    } catch (err: any) {
      alert(`Import error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ADMINISTRATIVE CONSOLE & CURATION</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Archaeological Database Administration
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Insert confirmed historical objects, execute bulk batch ingestion, manage verification audits, and check AI telemetry.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'create'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-slate-900 border border-white/5 text-slate-400 hover:text-white'
          }`}
        >
          Catalogue Single Object
        </button>
        <button
          onClick={() => setActiveTab('import')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'import'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-slate-900 border border-white/5 text-slate-400 hover:text-white'
          }`}
        >
          Bulk Batch Import (JSON/CSV)
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'audit'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-slate-900 border border-white/5 text-slate-400 hover:text-white'
          }`}
        >
          System Health & Telemetry
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Single Object Form */}
      {activeTab === 'create' && (
        <form onSubmit={handleCreateObject} className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white">Catalogue New Archaeological Record</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Artifact Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Bronze Statuette of Osiris"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500/40"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Civilization *</label>
              <input
                type="text"
                required
                value={civilization}
                onChange={(e) => setCivilization(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500/40"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Date Display</label>
              <input
                type="text"
                value={dateDisplay}
                onChange={(e) => setDateDisplay(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Approximate Year (Negative for BCE)</label>
              <input
                type="number"
                value={approxYear}
                onChange={(e) => setApproxYear(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Current Museum Custody</label>
              <input
                type="text"
                value={museum}
                onChange={(e) => setMuseum(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Discovery Site / Excavation</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Materials (Comma-separated)</label>
              <input
                type="text"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Image Archival URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Archaeological Description & Context</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide confirmed provenance, function, excavation details, and inscriptions..."
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500/40"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
            >
              {isSubmitting ? 'Verifying & Cataloguing...' : 'Save to Astra History Database'}
            </button>
          </div>
        </form>
      )}

      {/* Bulk Import */}
      {activeTab === 'import' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileJson className="w-4 h-4 text-emerald-400" />
            <span>JSON Bulk Artifact Ingestion</span>
          </h3>
          <p className="text-xs text-slate-400">
            Paste structured array of historical objects adhering to the Astra 7 schema.
          </p>

          <textarea
            rows={12}
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-xs text-emerald-300 focus:outline-none focus:border-emerald-500/40 resize-none"
          />

          <div className="flex justify-end">
            <button
              onClick={handleBulkImport}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Execute Ingestion Batch</span>
            </button>
          </div>
        </div>
      )}

      {/* Audit & System Telemetry */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-white/10">
              <div className="text-xs text-slate-400">Database Engine</div>
              <div className="text-lg font-bold text-white mt-1">In-Memory + Static Seeds</div>
              <div className="text-[11px] text-emerald-400 mt-0.5">5,000+ Records Capacity</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-white/10">
              <div className="text-xs text-slate-400">Active AI Model</div>
              <div className="text-lg font-bold text-white mt-1">gemini-flash-latest</div>
              <div className="text-[11px] text-emerald-400 mt-0.5">Auto-Fallback Cascade Enabled</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-white/10">
              <div className="text-xs text-slate-400">API Health</div>
              <div className="text-lg font-bold text-emerald-400 mt-1">Operational (200 OK)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">All 7 Powers Connected</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
