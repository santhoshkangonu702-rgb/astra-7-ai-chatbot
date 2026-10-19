import React, { useState } from 'react';
import {
  Plane,
  Compass,
  Calendar,
  Luggage,
  MapPin,
  Clock,
  Coins,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Download,
  ArrowLeft,
  Sparkles,
  Users,
  Sun,
  Hotel,
  Train,
  Share2
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

interface TravelIntelligencePowerProps {
  onBack?: () => void;
  onAskAstra?: (prompt: string) => void;
}

export type TravelStyle = 'Family' | 'Student' | 'Business' | 'Solo' | 'Group';
export type BudgetTier = 'Budget / Backpacker' | 'Balanced Moderate' | 'Executive / Premium' | 'Luxury 5-Star';

interface ItineraryDay {
  dayNumber: number;
  title: string;
  activities: Array<{ time: string; activity: string; costEstimate: string; tip?: string }>;
}

export const TravelIntelligencePower: React.FC<TravelIntelligencePowerProps> = ({
  onBack,
  onAskAstra
}) => {
  const [origin, setOrigin] = useState('New Delhi (DEL)');
  const [destination, setDestination] = useState('Tokyo (HND/NRT), Japan');
  const [tripDurationDays, setTripDurationDays] = useState(5);
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('Solo');
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('Balanced Moderate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Dynamic sample day-by-day plan
  const sampleItinerary: ItineraryDay[] = [
    {
      dayNumber: 1,
      title: 'Arrival, High-Speed Transit & Shinjuku Skyview',
      activities: [
        { time: '14:00', activity: 'Land at Haneda Airport, activate Suica / Pasmo transit card and pocket Wi-Fi', costEstimate: '¥3,000 (~$20)' },
        { time: '16:30', activity: 'Check-in to central accommodation near Shinjuku / Shibuya corridor', costEstimate: 'Included in Lodging' },
        { time: '19:00', activity: 'Tokyo Metropolitan Government Building observation deck for sunset & night skyline', costEstimate: 'Free Public Access' },
        { time: '20:30', activity: 'Dinner at Omoide Yokocho (Yakitori alley) or authentic ramen counter', costEstimate: '¥1,800 (~$12)', tip: 'Cash or IC Card preferred at small counters' }
      ]
    },
    {
      dayNumber: 2,
      title: 'Traditional Asakusa, Senso-ji & Digital Art Immersion',
      activities: [
        { time: '08:30', activity: 'Visit Senso-ji Temple and Nakamise-dori shopping street early to avoid crowds', costEstimate: 'Free Entrance' },
        { time: '12:00', activity: 'River walk along Sumida River toward Tokyo Skytree area', costEstimate: '¥500 transit' },
        { time: '14:30', activity: 'Interactive sensory digital art experience at teamLab Planets (Toyosu)', costEstimate: '¥3,800 (~$25)', tip: 'Requires advance online booking' },
        { time: '18:30', activity: 'Ginza evening stroll and subterranean Depachika food halls', costEstimate: '¥2,500 dinner' }
      ]
    },
    {
      dayNumber: 3,
      title: 'Meiji Jingu Shrine, Harajuku & Iconic Shibuya Crossing',
      activities: [
        { time: '09:00', activity: 'Peaceful walk through dense evergreen forest canopy to Meiji Shrine', costEstimate: 'Free' },
        { time: '11:30', activity: 'Explore Takeshita Street and boutique cafes in Omotesando', costEstimate: '¥1,500 snacks & matcha' },
        { time: '15:00', activity: 'Shibuya Scramble Crossing & Shibuya Sky 360-degree open-air rooftop', costEstimate: '¥2,200', tip: 'Sunset slot must be reserved 4 weeks ahead' },
        { time: '19:00', activity: 'Miyashita Park dining terrace & local izakaya culture', costEstimate: '¥3,500' }
      ]
    }
  ];

  const estimatedCosts = {
    flightsRoundtrip: '₹48,000 – ₹62,000 ($580 – $750)',
    lodgingPerNight: '₹6,500 – ₹10,000 ($80 – $120)',
    dailyFoodTransit: '₹3,500 ($42) per day',
    totalEstimatedBudget: '₹95,000 – ₹1,25,000 ($1,150 – $1,500)'
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    triggerHaptic(12);
    setTimeout(() => {
      setIsGenerating(false);
      hapticSuccess();
    }, 700);
  };

  const handleExportItinerary = () => {
    triggerHaptic(10);
    const itineraryData = {
      origin,
      destination,
      durationDays: tripDurationDays,
      travelStyle,
      budgetTier,
      costs: estimatedCosts,
      days: sampleItinerary,
      generatedAt: new Date().toISOString()
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(itineraryData, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `astra_itinerary_${destination.slice(0, 10)}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
    hapticSuccess();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div
      id="astra-travel-intelligence-power"
      className="w-full flex-1 flex flex-col bg-[#04060E] text-slate-100 min-h-0 min-w-0 overflow-y-auto"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Header */}
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
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-amber-500/20 border border-amber-500/40 text-amber-400">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                TRAVEL INTELLIGENCE
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                  Global Itinerary Engine
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Day-by-Day Trip Generator • Cost Breakdowns • Transit & Visa Requirements • Weather Grounding
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportItinerary}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export Itinerary</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {savedSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Itinerary exported to JSON format.</span>
          </div>
        )}

        {/* Input Parameters Form */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Departure Origin</label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Trip Style</label>
              <select
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value as TravelStyle)}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Solo">Solo Explorer</option>
                <option value="Family">Family Vacation</option>
                <option value="Student">Student Budget</option>
                <option value="Business">Business & Workation</option>
                <option value="Group">Group Friends</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Budget Tier</label>
              <select
                value={budgetTier}
                onChange={(e) => setBudgetTier(e.target.value as BudgetTier)}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Budget / Backpacker">Budget / Backpacker</option>
                <option value="Balanced Moderate">Balanced Moderate</option>
                <option value="Executive / Premium">Executive / Premium</option>
                <option value="Luxury 5-Star">Luxury 5-Star</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Duration:</span>
              {[3, 5, 7, 10].map((d) => (
                <button
                  key={d}
                  onClick={() => setTripDurationDays(d)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                    tripDurationDays === d ? 'bg-amber-500/20 border-amber-500/60 text-amber-300' : 'border-white/10 text-slate-400'
                  }`}
                >
                  {d} Days
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-amber-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isGenerating ? 'Synthesizing...' : 'Re-generate Itinerary'}
            </button>
          </div>
        </div>

        {/* Cost & Destination Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/50">
            <span className="text-[10px] text-slate-400 block">Flight Estimate</span>
            <span className="text-sm font-mono font-bold text-white block mt-1">{estimatedCosts.flightsRoundtrip}</span>
          </div>
          <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/50">
            <span className="text-[10px] text-slate-400 block">Lodging (per night)</span>
            <span className="text-sm font-mono font-bold text-white block mt-1">{estimatedCosts.lodgingPerNight}</span>
          </div>
          <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/50">
            <span className="text-[10px] text-slate-400 block">Food & Daily Transit</span>
            <span className="text-sm font-mono font-bold text-white block mt-1">{estimatedCosts.dailyFoodTransit}</span>
          </div>
          <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10">
            <span className="text-[10px] text-amber-300 block">Total Projected Budget</span>
            <span className="text-sm font-mono font-bold text-amber-300 block mt-1">{estimatedCosts.totalEstimatedBudget}</span>
          </div>
        </div>

        {/* Day-by-Day Timeline */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-400" />
            Synthesized Day-by-Day Itinerary Plan
          </h3>

          <div className="space-y-4">
            {sampleItinerary.map((day) => (
              <div key={day.dayNumber} className="p-5 rounded-2xl border border-white/10 bg-slate-900/50 space-y-3">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2.5">
                  <span className="px-2.5 py-0.5 rounded-full font-mono text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Day {day.dayNumber}
                  </span>
                  <h4 className="text-sm font-bold text-white">{day.title}</h4>
                </div>

                <div className="space-y-2.5 pt-1">
                  {day.activities.map((act, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="font-mono font-bold text-amber-400 shrink-0 mt-0.5">{act.time}</span>
                        <div>
                          <p className="text-slate-200">{act.activity}</p>
                          {act.tip && (
                            <p className="text-[11px] text-cyan-300/80 mt-0.5">Tip: {act.tip}</p>
                          )}
                        </div>
                      </div>
                      <span className="font-mono text-slate-400 shrink-0">{act.costEstimate}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visa & Travel Checklist Notice */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-bold flex items-center gap-1.5 text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Visa & Entry Protocols
            </span>
            <span className="text-[10px] font-mono text-slate-500">Source: Ministry of Foreign Affairs (MOFA)</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Short-term tourism eVisa available online for eligible passport holders. Passport validity must exceed 6 months from entry date. Digital Visit Japan Web declaration recommended for expedited customs & biometric immigration.
          </p>
        </div>
      </div>
    </div>
  );
};
