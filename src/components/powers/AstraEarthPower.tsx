import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Globe2,
  MapPin,
  Wind,
  Droplets,
  Thermometer,
  Clock,
  Compass,
  Users,
  Coins,
  Languages,
  ShieldCheck,
  Search,
  Activity
} from 'lucide-react';

interface EarthCity {
  id: string;
  name: string;
  country: string;
  region: string;
  coordinates: string;
  population: string;
  languages: string;
  currency: string;
  utcOffset: number;
  temperature: string;
  airQuality: string;
  cleanEnergyShare: string;
  notableTechHub: string;
}

const GLOBAL_CITIES: EarthCity[] = [
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'East Asia',
    coordinates: '35.6762° N, 139.6503° E',
    population: '37.4 Million (Greater Area)',
    languages: 'Japanese',
    currency: 'JPY (¥)',
    utcOffset: 9,
    temperature: '18°C / Clear',
    airQuality: 'AQI 22 (Optimal)',
    cleanEnergyShare: '31%',
    notableTechHub: 'Robotics, Micro-Electronics, Optics'
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    region: 'Southeast Asia',
    coordinates: '1.3521° N, 103.8198° E',
    population: '5.9 Million',
    languages: 'English, Malay, Mandarin, Tamil',
    currency: 'SGD (S$)',
    utcOffset: 8,
    temperature: '29°C / Tropical Humidity',
    airQuality: 'AQI 34 (Good)',
    cleanEnergyShare: '22%',
    notableTechHub: 'FinTech, Biopolis Bio-Clusters, AI Research'
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    region: 'Western Europe',
    coordinates: '51.5074° N, 0.1278° W',
    population: '9.0 Million',
    languages: 'English',
    currency: 'GBP (£)',
    utcOffset: 1,
    temperature: '14°C / Overcast',
    airQuality: 'AQI 29 (Good)',
    cleanEnergyShare: '48%',
    notableTechHub: 'DeepMind AI, Quantum Software, Green Finance'
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    country: 'India',
    region: 'South Asia',
    coordinates: '12.9716° N, 77.5946° E',
    population: '13.6 Million',
    languages: 'Kannada, English, Hindi, Telugu, Tamil',
    currency: 'INR (₹)',
    utcOffset: 5.5,
    temperature: '24°C / Mild Breeze',
    airQuality: 'AQI 58 (Moderate)',
    cleanEnergyShare: '36%',
    notableTechHub: 'Space Research (ISRO HQ), Global SaaS, Agentic AI'
  },
  {
    id: 'sanfrancisco',
    name: 'San Francisco',
    country: 'United States',
    region: 'North America',
    coordinates: '37.7749° N, 122.4194° W',
    population: '4.7 Million (Bay Area Metro)',
    languages: 'English, Spanish, Mandarin',
    currency: 'USD ($)',
    utcOffset: -7,
    temperature: '16°C / Coastal Fog',
    airQuality: 'AQI 28 (Good)',
    cleanEnergyShare: '54%',
    notableTechHub: 'Frontier AI Labs, Semiconductor Design, Cloud Compute'
  }
];

export const AstraEarthPower: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [selectedCity, setSelectedCity] = useState<EarthCity>(GLOBAL_CITIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUtcTime, setCurrentUtcTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentUtcTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getCityLocalTime = (offset: number) => {
    const utcMillis = currentUtcTime.getTime() + currentUtcTime.getTimezoneOffset() * 60000;
    const cityDate = new Date(utcMillis + 3600000 * offset);
    return cityDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const filteredCities = GLOBAL_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="astra-earth" className="h-full overflow-y-auto px-4 py-6 md:px-8 space-y-8 text-slate-100 max-w-7xl mx-auto">
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
                <Globe2 className="w-7 h-7 text-emerald-400" />
                ASTRA EARTH
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                PLANETARY OBSERVATORY
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live urban nodes • Climate & air telemetry • Synchronized planetary clocks • Demographics
            </p>
          </div>
        </div>

        {/* Global Live UTC Time Indicator */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono">
          <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-slate-400">UTC System Time:</span>
          <span className="font-bold text-white">{currentUtcTime.toUTCString().slice(17, 25)} UTC</span>
        </div>
      </div>

      {/* City Search Bar */}
      <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-white/[0.03] border border-emerald-500/30">
        <Search className="w-5 h-5 text-emerald-400 ml-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search planetary urban hub or country..."
          className="w-full bg-transparent text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none py-2"
        />
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: City Nodes List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Metropolitan Nodes ({filteredCities.length})</span>
            <span className="text-emerald-400 font-mono text-[10px]">SENSOR SYNC</span>
          </div>

          <div className="space-y-3">
            {filteredCities.map((city) => {
              const isSelected = selectedCity.id === city.id;
              return (
                <div
                  key={city.id}
                  onClick={() => setSelectedCity(city)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-xl ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                      : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">{city.name}</h3>
                      <div className="text-[11px] text-slate-400">{city.country} • {city.region}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-cyan-300">
                        {getCityLocalTime(city.utcOffset)}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">Local Time</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="text-emerald-300">{city.temperature}</span>
                    <span>{city.airQuality}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Planetary Node Telemetry (7 cols) */}
        <div className="lg:col-span-7">
          {selectedCity && (
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-emerald-500/30 backdrop-blur-2xl shadow-xl space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                    Planetary Coordinate Hub
                  </span>
                  <h2 className="text-2xl font-black text-white mt-0.5">
                    {selectedCity.name}, {selectedCity.country}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedCity.coordinates}</p>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-right">
                  <div className="text-lg font-black text-cyan-300 font-mono">
                    {getCityLocalTime(selectedCity.utcOffset)}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Synchronized Clock</div>
                </div>
              </div>

              {/* Environmental & Demographic Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Users className="w-3 h-3 text-emerald-400" />
                    <span>Metropolitan Population</span>
                  </div>
                  <div className="font-bold text-white text-xs">{selectedCity.population}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Languages className="w-3 h-3 text-cyan-400" />
                    <span>Spoken Languages</span>
                  </div>
                  <div className="font-bold text-white text-xs truncate">{selectedCity.languages}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Coins className="w-3 h-3 text-amber-400" />
                    <span>Currency Standard</span>
                  </div>
                  <div className="font-bold text-white text-xs">{selectedCity.currency}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-rose-400" />
                    <span>Surface Weather</span>
                  </div>
                  <div className="font-bold text-emerald-300 text-xs">{selectedCity.temperature}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Wind className="w-3 h-3 text-purple-400" />
                    <span>Air Quality Index</span>
                  </div>
                  <div className="font-bold text-cyan-300 text-xs">{selectedCity.airQuality}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-emerald-400" />
                    <span>Clean Grid Share</span>
                  </div>
                  <div className="font-bold text-amber-300 text-xs">{selectedCity.cleanEnergyShare}</div>
                </div>
              </div>

              {/* Notable Tech Ecosystem */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent border border-emerald-400/30 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-emerald-300 font-bold">
                  Technological Specialization & Innovation Clusters
                </span>
                <p className="text-xs text-slate-200">{selectedCity.notableTechHub}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
