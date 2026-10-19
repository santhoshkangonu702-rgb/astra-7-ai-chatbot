import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Globe2,
  Building,
  Users,
  Coins,
  Clock,
  Mountain,
  CloudSun,
  TrendingUp,
  GraduationCap,
  Cpu,
  Zap,
  Plane,
  Satellite,
  Leaf,
  Calendar,
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';

export interface WorldDataRecord {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  primaryMetric: string;
  metricLabel: string;
  secondaryMetrics: Array<{ label: string; value: string }>;
  verifiedDate: string;
  source: string;
  sourceType: 'Statistical Baseline' | 'Official Census' | 'Scientific Sensor Mesh';
  notes: string;
}

const WORLD_DATASET: WorldDataRecord[] = [
  {
    id: 'wd-pop-global',
    category: 'Population',
    title: 'Global Human Population',
    subtitle: 'Planetary demographic distribution & growth plateau',
    primaryMetric: '8.18 Billion',
    metricLabel: 'Total Living Population',
    secondaryMetrics: [
      { label: 'Annual Growth Rate', value: '0.86%' },
      { label: 'Median Age', value: '30.9 Years' },
      { label: 'Urban Population', value: '57.4%' },
      { label: 'Peak Projection', value: '10.3B (circa 2080)' },
    ],
    verifiedDate: '2025/2026 Revision',
    source: 'UN Population Division World Population Prospects',
    sourceType: 'Statistical Baseline',
    notes: 'Calculated via national census synchronization and probabilistic demographic modeling.',
  },
  {
    id: 'wd-country-india',
    category: 'Countries',
    title: 'Republic of India (Bharat)',
    subtitle: 'Most populous democracy, South Asian subcontinent',
    primaryMetric: '1.442 Billion',
    metricLabel: 'Population (2025)',
    secondaryMetrics: [
      { label: 'Capital', value: 'New Delhi' },
      { label: 'Nominal GDP', value: '$4.12 Trillion (IMF)' },
      { label: 'Currency', value: 'Indian Rupee (INR ₹)' },
      { label: 'Primary Languages', value: 'Hindi, English + 22 Scheduled' },
    ],
    verifiedDate: '2025/2026',
    source: 'Census Registrar General of India & IMF World Economic Outlook',
    sourceType: 'Official Census',
    notes: 'World’s 5th largest economy by nominal GDP, 3rd by purchasing power parity (PPP).',
  },
  {
    id: 'wd-country-usa',
    category: 'Countries',
    title: 'United States of America',
    subtitle: 'Federal republic, North America',
    primaryMetric: '341.2 Million',
    metricLabel: 'Population (2025)',
    secondaryMetrics: [
      { label: 'Capital', value: 'Washington, D.C.' },
      { label: 'Nominal GDP', value: '$28.78 Trillion' },
      { label: 'Currency', value: 'United States Dollar (USD $)' },
      { label: 'Time Zones', value: 'UTC-5 to UTC-10 (6 zones)' },
    ],
    verifiedDate: '2025/2026',
    source: 'US Census Bureau & Bureau of Economic Analysis',
    sourceType: 'Official Census',
    notes: 'Global reserve currency issuer and largest national economy by nominal valuation.',
  },
  {
    id: 'wd-city-tokyo',
    category: 'Cities',
    title: 'Tokyo Metropolitan Area',
    subtitle: 'World’s largest metropolitan cluster, Japan',
    primaryMetric: '37.1 Million',
    metricLabel: 'Metro Cluster Population',
    secondaryMetrics: [
      { label: 'Prefecture Population', value: '14.1 Million' },
      { label: 'Metro GDP', value: '$2.05 Trillion' },
      { label: 'Transit System', value: 'Tokyo Metro + JR East' },
      { label: 'Density', value: '6,400 / km²' },
    ],
    verifiedDate: '2025',
    source: 'Tokyo Metropolitan Government Statistics Division',
    sourceType: 'Statistical Baseline',
    notes: 'World leader in rail commuter throughput and seismic resilient civil architecture.',
  },
  {
    id: 'wd-econ-global-gdp',
    category: 'Economy',
    title: 'Global Gross Domestic Product',
    subtitle: 'Aggregate world economic output (Nominal)',
    primaryMetric: '$109.5 Trillion',
    metricLabel: 'World GDP Nominal',
    secondaryMetrics: [
      { label: 'Top 3 Economies', value: 'US, China, Germany' },
      { label: 'Global Inflation', value: '3.4% median' },
      { label: 'Services Share', value: '65.2%' },
      { label: 'Merchandise Trade', value: '$32 Trillion' },
    ],
    verifiedDate: 'October 2025 Report',
    source: 'International Monetary Fund (IMF) World Economic Outlook',
    sourceType: 'Statistical Baseline',
    notes: 'Exchange rate converted nominal aggregates reflecting post-pandemic supply chain stabilization.',
  },
  {
    id: 'wd-energy-renewable',
    category: 'Energy',
    title: 'Global Clean Electricity Generation',
    subtitle: 'Solar photovoltaic, wind, hydro and nuclear shares',
    primaryMetric: '42.1%',
    metricLabel: 'Zero-Carbon Power Generation',
    secondaryMetrics: [
      { label: 'Solar & Wind Total', value: '16.8% of global grid' },
      { label: 'Hydroelectric Power', value: '14.9%' },
      { label: 'Nuclear Power', value: '9.2%' },
      { label: 'Annual Solar Addition', value: '540 GW installed' },
    ],
    verifiedDate: '2025 Annual Synthesis',
    source: 'International Energy Agency (IEA) World Energy Outlook',
    sourceType: 'Statistical Baseline',
    notes: 'Solar PV capacity additions exceeded all fossil fuel additions combined for the 3rd consecutive year.',
  },
  {
    id: 'wd-climate-co2',
    category: 'Climate',
    title: 'Atmospheric Carbon Dioxide Concentration',
    subtitle: 'Direct baseline measurements at Mauna Loa Observatory',
    primaryMetric: '426.8 ppm',
    metricLabel: 'Monthly Mean CO2 (Parts Per Million)',
    secondaryMetrics: [
      { label: 'Pre-Industrial Baseline', value: '280 ppm' },
      { label: '10-Year Growth Rate', value: '+2.4 ppm / year' },
      { label: 'Global Surface Temp', value: '+1.38°C above 1850–1900' },
      { label: 'Ocean Heat Content', value: 'Record High 2025' },
    ],
    verifiedDate: 'Updated NOAA Data 2025/2026',
    source: 'NOAA Global Monitoring Laboratory & NASA GISTEMP',
    sourceType: 'Scientific Sensor Mesh',
    notes: 'Direct physical infrared spectrometry readings verified across international reference standards.',
  },
  {
    id: 'wd-space-satellites',
    category: 'Space',
    title: 'Active Orbital Spacecraft & Debris',
    subtitle: 'Low Earth Orbit (LEO) and Geostationary inventory',
    primaryMetric: '11,450+',
    metricLabel: 'Operational Active Satellites',
    secondaryMetrics: [
      { label: 'Commercial Broadband Constellations', value: '7,200+ (Starlink, etc.)' },
      { label: 'Tracked Debris (>10cm)', value: '36,500 objects' },
      { label: 'Humans in Space', value: '10–14 continuous crew' },
      { label: 'Annual Launches', value: '235 orbital attempts' },
    ],
    verifiedDate: '2025 Registry',
    source: 'United Nations Office for Outer Space Affairs (UNOOSA) & US Space Command',
    sourceType: 'Scientific Sensor Mesh',
    notes: 'LEO spacecraft density has tripled since 2020 driven by reusable launch mass economics.',
  },
  {
    id: 'wd-languages-global',
    category: 'Languages',
    title: 'Global Linguistic Diversity',
    subtitle: 'Living natural languages catalogued worldwide',
    primaryMetric: '7,168',
    metricLabel: 'Documented Living Languages',
    secondaryMetrics: [
      { label: 'Top Native Language', value: 'Mandarin Chinese (940M)' },
      { label: 'Top Total Speakers', value: 'English (1.52 Billion)' },
      { label: 'Endangered Languages', value: '3,018 (42%)' },
      { label: 'Digital Preservation', value: '1,200+ active LLM tokens' },
    ],
    verifiedDate: '2025 Edition',
    source: 'Ethnologue: Languages of the World (28th Edition)',
    sourceType: 'Statistical Baseline',
    notes: 'Over 85% of online web indexed content remains concentrated across fewer than 12 languages.',
  },
  {
    id: 'wd-tech-internet',
    category: 'Technology',
    title: 'Global Internet Connectivity & Mobile Penetration',
    subtitle: 'Connected human population across digital networks',
    primaryMetric: '5.54 Billion',
    metricLabel: 'Active Internet Users (68% World)',
    secondaryMetrics: [
      { label: 'Unique Mobile Subscribers', value: '5.65 Billion' },
      { label: '5G Global Coverage', value: '48% population' },
      { label: 'Daily Data Transferred', value: '3.8 Exabytes' },
      { label: 'Fiber-To-The-Home', value: '820 Million lines' },
    ],
    verifiedDate: '2025 Facts & Figures',
    source: 'International Telecommunication Union (ITU) Geneva',
    sourceType: 'Statistical Baseline',
    notes: 'Universal mobile broadband penetration achieved across 95% of inhabited continental zones.',
  },
  {
    id: 'wd-geo-oceans',
    category: 'Geography',
    title: 'Earth’s Planetary Surface & Oceans',
    subtitle: 'Hydrosphere, lithosphere, and topographic extremes',
    primaryMetric: '70.8%',
    metricLabel: 'Surface Covered by Oceans',
    secondaryMetrics: [
      { label: 'Deepest Point', value: 'Challenger Deep (10,928m)' },
      { label: 'Highest Elevation', value: 'Mount Everest (8,848.86m)' },
      { label: 'Total Surface Area', value: '510.1 Million km²' },
      { label: 'Freshwater Share', value: '2.5% of total water' },
    ],
    verifiedDate: 'Scientific Geodetic Baseline',
    source: 'USGS National Center for Earth Resources Observation',
    sourceType: 'Scientific Sensor Mesh',
    notes: 'Satellite altimetry and multi-beam bathymetry provide sub-meter elevation mapping.',
  },
  {
    id: 'wd-edu-literacy',
    category: 'Education',
    title: 'Global Youth & Adult Literacy',
    subtitle: 'Educational attainment and basic numeracy baseline',
    primaryMetric: '87.2%',
    metricLabel: 'Global Adult Literacy Rate',
    secondaryMetrics: [
      { label: 'Youth Literacy (15–24)', value: '91.8%' },
      { label: 'Primary School Completion', value: '90.2%' },
      { label: 'Tertiary Enrollment', value: '42.3% gross' },
      { label: 'STEM Graduates / Year', value: '18.4 Million' },
    ],
    verifiedDate: 'UNESCO Global Education Monitoring Report 2024/2025',
    source: 'UNESCO Institute for Statistics (UIS)',
    sourceType: 'Statistical Baseline',
    notes: 'Significant regional divergence remains in rural Sub-Saharan Africa and conflict zones.',
  },
];

const CATEGORIES = [
  'All',
  'Countries',
  'Cities',
  'Population',
  'Languages',
  'Currencies',
  'Time Zones',
  'Geography',
  'Climate',
  'Economy',
  'Education',
  'Technology',
  'Energy',
  'Transportation',
  'Space',
  'Environment',
];

interface WorldDataPowerProps {
  onBack?: () => void;
  onExploreData?: (prompt: string) => void;
}

export const WorldDataPower: React.FC<WorldDataPowerProps> = ({
  onBack,
  onExploreData,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRecords = WORLD_DATASET.filter((rec) => {
    const matchesCategory =
      selectedCategory === 'All' || rec.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.primaryMetric.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-full p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all group"
              title="Return to Astra 7 Home"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>← Back to Astra 7</span>
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                PLANETARY DATABASE
              </span>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>World Data</span>
                <Globe2 className="w-5 h-5 text-cyan-400" />
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical planetary statistics, demographic metrics, climate sensors, and institutional economic indicators.
            </p>
          </div>
        </div>

        {/* Data Provenance Badge */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-200">
          <Database className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>Every indicator displays verified publication date & source.</span>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search countries, cities, GDP, population, energy, climate metrics..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dataset Grid */}
      {filteredRecords.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
          <Globe2 className="w-8 h-8 text-cyan-400 mx-auto opacity-50" />
          <h3 className="text-sm font-bold text-white">No planetary records match your search</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms or select "All" categories to browse the complete World Data index.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-bold hover:bg-cyan-500/30 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map((rec) => (
            <div
              key={rec.id}
              className="rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 p-5 hover:border-cyan-400/30 transition-all flex flex-col justify-between group space-y-4"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-white/5 text-cyan-300 border border-white/10 uppercase">
                    {rec.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {rec.verifiedDate}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-base font-bold text-white mt-2 group-hover:text-cyan-300 transition-colors">
                  {rec.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                  {rec.subtitle}
                </p>

                {/* Primary Highlight Metric */}
                <div className="mt-4 p-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20">
                  <span className="text-[10px] font-mono font-bold text-slate-400 block">
                    {rec.metricLabel}
                  </span>
                  <div className="text-2xl font-black tracking-tight text-cyan-300 mt-0.5">
                    {rec.primaryMetric}
                  </div>
                </div>

                {/* Secondary Metrics List */}
                <div className="mt-3 space-y-1.5 text-xs">
                  {rec.secondaryMetrics.map((sm, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-1 border-b border-white/5 text-[11px]"
                    >
                      <span className="text-slate-400">{sm.label}</span>
                      <span className="font-semibold text-slate-200">{sm.value}</span>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                <p className="text-[10px] text-slate-400 mt-3 italic leading-relaxed">
                  "{rec.notes}"
                </p>
              </div>

              {/* Footer: Source and Chat query */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <div className="text-[10px] text-slate-500 truncate max-w-[170px]" title={rec.source}>
                  Src: {rec.source}
                </div>
                {onExploreData && (
                  <button
                    onClick={() =>
                      onExploreData(
                        `Explain and analyze the verified data for "${rec.title}" (${rec.primaryMetric} - ${rec.source}). What are the key implications, historical context, and future trends?`
                      )
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-colors"
                    title="Analyze in Astra Chat"
                  >
                    <span>Analyze</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
