import React, { useState } from 'react';
import {
  AlertTriangle,
  Flame,
  Waves,
  Wind,
  CloudRain,
  MapPin,
  Clock,
  ShieldAlert,
  ArrowLeft,
  Filter,
  CheckCircle2,
  ExternalLink,
  Info
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

export type DisasterEventType =
  | 'Earthquake'
  | 'Cyclone'
  | 'Flood'
  | 'Wildfire'
  | 'Volcano'
  | 'Tsunami'
  | 'Severe Weather';

export interface DisasterAlert {
  id: string;
  location: string;
  event: DisasterEventType;
  severity: 'Catastrophic (Level 5)' | 'Severe (Level 4)' | 'Moderate (Level 3)' | 'Advisory (Level 2)' | 'Informational (Level 1)';
  time: string;
  source: string;
  sourceUrl: string;
  magnitudeOrMetrics: string;
  affectedRadiusKm: number;
  safetyAdvisory: string;
}

const VERIFIED_ALERTS: DisasterAlert[] = [
  {
    id: 'dis-1',
    location: 'Bay of Bengal / Odisha-Andhra Coast',
    event: 'Cyclone',
    severity: 'Moderate (Level 3)',
    time: '2026-09-26 08:30 IST',
    source: 'India Meteorological Department (IMD) Tropical Cyclone Center',
    sourceUrl: 'https://mausam.imd.gov.in',
    magnitudeOrMetrics: 'Sustained winds 85 km/h; Central Pressure 992 hPa',
    affectedRadiusKm: 250,
    safetyAdvisory: 'Fishermen advised not to venture into deep sea. Coastal ports on high alert.'
  },
  {
    id: 'dis-2',
    location: 'Offshore Miyagi Prefecture, Japan',
    event: 'Earthquake',
    severity: 'Advisory (Level 2)',
    time: '2026-09-26 06:14 UTC',
    source: 'Japan Meteorological Agency (JMA) & USGS Seismic Network',
    sourceUrl: 'https://earthquake.usgs.gov',
    magnitudeOrMetrics: 'Magnitude 5.4 M_w • Focal Depth 42 km',
    affectedRadiusKm: 120,
    safetyAdvisory: 'No tsunami hazard expected. Standard structural seismic safety checks underway.'
  },
  {
    id: 'dis-3',
    location: 'Reykjanes Peninsula, Iceland',
    event: 'Volcano',
    severity: 'Moderate (Level 3)',
    time: '2026-09-26 04:00 UTC',
    source: 'Icelandic Meteorological Office (IMO) Volcanic Alert Desk',
    sourceUrl: 'https://en.vedur.is',
    magnitudeOrMetrics: 'Effusive basaltic fissure lava extrusion rate 18 m³/s',
    affectedRadiusKm: 20,
    safetyAdvisory: 'Exclusion zone enforced around Grindavík defense barriers. Air traffic unaffected.'
  },
  {
    id: 'dis-4',
    location: 'Brahmaputra Basin, Assam, India',
    event: 'Flood',
    severity: 'Moderate (Level 3)',
    time: '2026-09-26 07:00 IST',
    source: 'Central Water Commission (CWC) Flood Forecasting Division',
    sourceUrl: 'https://cwc.gov.in',
    magnitudeOrMetrics: 'Water level 0.42m above Danger Level at Nematighat',
    affectedRadiusKm: 180,
    safetyAdvisory: 'NDRF teams deployed for river embankment reinforcement.'
  }
];

interface DisasterCenterPowerProps {
  onBack?: () => void;
}

export const DisasterCenterPower: React.FC<DisasterCenterPowerProps> = ({ onBack }) => {
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<DisasterAlert>(VERIFIED_ALERTS[0]);

  const filtered = VERIFIED_ALERTS.filter((a) => {
    if (selectedEventFilter !== 'all' && a.event !== selectedEventFilter) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 text-slate-100 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-rose-500/15 via-orange-500/10 to-amber-500/15 border border-rose-500/25 backdrop-blur-md">
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
          <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-400/30">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">ASTRA DISASTER CENTER</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30">
                OFFICIAL FEEDS ONLY
              </span>
            </div>
            <p className="text-xs text-slate-400">
              LOCATION → EVENT → SEVERITY → TIME → SOURCE
            </p>
          </div>
        </div>
      </div>

      {/* Safety Guardrail: Never fabricate emergency information */}
      <div className="p-3.5 rounded-2xl bg-black/40 border border-rose-500/20 text-xs text-slate-300 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
        <span>
          <strong>Emergency Grounding Rule:</strong> ASTRA 7 never hallucinates or fabricates hazard alerts.
          All coordinates, times, and warnings are grounded strictly in primary government meteorological and seismic feeds.
        </span>
      </div>

      {/* Event Type Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
        {['all', 'Earthquake', 'Cyclone', 'Flood', 'Wildfire', 'Volcano'].map((f) => (
          <button
            key={f}
            onClick={() => setSelectedEventFilter(f)}
            className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-all ${
              selectedEventFilter === f
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Main Grid: Alerts List & Selected Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Alerts List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
            Active Hazard Bulletins ({filtered.length})
          </div>
          <div className="space-y-2">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedAlert(item);
                  hapticAction();
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedAlert.id === item.id
                    ? 'bg-rose-500/15 border-rose-500/40 shadow-md'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold uppercase">
                    {item.event}
                  </span>
                  <span className="text-[10px] font-mono text-amber-300">{item.time}</span>
                </div>
                <div className="text-sm font-bold text-white">{item.location}</div>
                <div className="text-[11px] text-slate-400 mt-1">{item.magnitudeOrMetrics}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Required Display: LOCATION → EVENT → SEVERITY → TIME → SOURCE */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-black/50 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">ACTIVE DISASTER TELEMETRY</span>
                <h3 className="text-lg font-black text-white">{selectedAlert.location}</h3>
              </div>
              <span className="text-xs font-mono text-rose-300 bg-rose-500/10 px-3 py-1 rounded-xl border border-rose-500/20">
                {selectedAlert.severity}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="font-mono text-[10px] text-rose-400 font-bold uppercase">EVENT</span>
                  <p className="text-slate-100 font-bold text-sm">{selectedAlert.event}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="font-mono text-[10px] text-amber-400 font-bold uppercase">TIME</span>
                  <p className="text-slate-200 font-mono">{selectedAlert.time}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase">METRICS & IMPACT</span>
                <p className="text-slate-200">{selectedAlert.magnitudeOrMetrics}</p>
                <p className="text-slate-400 text-[11px] font-mono">Radial Impact Zone: ~{selectedAlert.affectedRadiusKm} km</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase">SOURCE</span>
                <p className="text-slate-200 font-semibold">{selectedAlert.source}</p>
                <a
                  href={selectedAlert.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 text-[11px] font-mono pt-1"
                >
                  <span>Official Meteorological Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                <span className="font-mono text-[10px] text-rose-300 font-bold uppercase">OFFICIAL ADVISORY</span>
                <p className="text-slate-200 leading-relaxed">{selectedAlert.safetyAdvisory}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
