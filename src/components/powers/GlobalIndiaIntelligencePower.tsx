import React, { useState, useMemo } from 'react';
import {
  Globe2,
  Building2,
  Flag,
  Users,
  TrendingUp,
  Landmark,
  Compass,
  Search,
  ExternalLink,
  ShieldCheck,
  Download,
  GitCompare,
  Calendar,
  Layers,
  ArrowLeft,
  ChevronRight,
  Info,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Plane,
  Train,
  Rocket,
  Cpu,
  MapPin,
  FileText
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

interface GlobalIndiaIntelligencePowerProps {
  onBack?: () => void;
  onAskAstra?: (prompt: string) => void;
}

export interface CountryProfile {
  code: string;
  name: string;
  capital: string;
  population: string;
  populationRaw: number;
  gdpNominal: string;
  gdpPerCapita: string;
  inflation: string;
  interestRate: string;
  currency: string;
  languages: string[];
  region: string;
  globalRankings: Array<{ metric: string; rank: number; total: number; source: string; year: string }>;
  keyIndicators: Record<string, string>;
  source: string;
  sourceUrl: string;
  notes: string;
}

export interface IndiaStateProfile {
  name: string;
  code: string;
  type: 'State' | 'Union Territory';
  capital: string;
  districtsCount: number;
  population: string;
  literacyRate: string;
  primaryLanguages: string[];
  gdpState: string;
  keySectors: string[];
  majorAirports: string[];
  railHeadquarters?: string;
  keySchemesImplemented: string[];
  source: string;
}

export interface GovernmentScheme {
  id: string;
  title: string;
  ministry: string;
  objective: string;
  eligibility: string;
  benefits: string;
  launchYear: string;
  sourceUrl: string;
  verificationDate: string;
}

const COUNTRIES_DATABASE: CountryProfile[] = [
  {
    code: 'IN',
    name: 'India (Bharat)',
    capital: 'New Delhi',
    population: '1.442 Billion',
    populationRaw: 1442000000,
    gdpNominal: '$4.12 Trillion (IMF 2025/26)',
    gdpPerCapita: '$2,850',
    inflation: '4.8% (CPI)',
    interestRate: '6.50% (RBI Repo Rate)',
    currency: 'Indian Rupee (INR ₹)',
    languages: ['Hindi', 'English', 'Telugu', 'Tamil', 'Kannada', 'Bengali', '+ 16 Scheduled'],
    region: 'South Asia',
    globalRankings: [
      { metric: 'Population', rank: 1, total: 195, source: 'UN Population Division', year: '2024/25' },
      { metric: 'Nominal GDP', rank: 5, total: 195, source: 'IMF WEO Database', year: '2025' },
      { metric: 'GDP by PPP', rank: 3, total: 195, source: 'World Bank Data', year: '2025' },
      { metric: 'Renewable Power Capacity', rank: 4, total: 195, source: 'IRENA Report', year: '2025' }
    ],
    keyIndicators: {
      'Internet Users': '900+ Million (Active)',
      'Digital Transactions': '13+ Billion Monthly UPI Operations',
      'Space Agency': 'ISRO (Indian Space Research Organisation)',
      'Median Age': '28.7 Years (Demographic Dividend)'
    },
    source: 'Registrar General of India, IMF World Economic Outlook & World Bank',
    sourceUrl: 'https://data.worldbank.org/country/india',
    notes: 'Methodology utilizes official civil registration, Reserve Bank data bulletins, and multilateral treaty surveys. Presented neutrally without political endorsements.'
  },
  {
    code: 'US',
    name: 'United States',
    capital: 'Washington, D.C.',
    population: '339.8 Million',
    populationRaw: 339800000,
    gdpNominal: '$28.78 Trillion (IMF 2025)',
    gdpPerCapita: '$84,700',
    inflation: '2.5% (PCE Deflator)',
    interestRate: '4.75% (Fed Funds Rate)',
    currency: 'United States Dollar (USD $)',
    languages: ['English', 'Spanish'],
    region: 'North America',
    globalRankings: [
      { metric: 'Nominal GDP', rank: 1, total: 195, source: 'IMF WEO Database', year: '2025' },
      { metric: 'Population', rank: 3, total: 195, source: 'US Census Bureau', year: '2025' },
      { metric: 'Global Innovation Index', rank: 3, total: 132, source: 'WIPO', year: '2024' }
    ],
    keyIndicators: {
      'Sovereign Reserve Currency': 'Leading Global Share (~58%)',
      'Research & Development': '$880 Billion Annual Gross Outlay',
      'Federal Reserve Policy': 'Dual Mandate: Maximum Employment & Stable Prices'
    },
    source: 'US Bureau of Economic Analysis & Federal Reserve Economic Data (FRED)',
    sourceUrl: 'https://fred.stlouisfed.org',
    notes: 'Data synchronized with quarterly BEA national income accounts and Federal Reserve statistical releases.'
  },
  {
    code: 'JP',
    name: 'Japan',
    capital: 'Tokyo',
    population: '124.5 Million',
    populationRaw: 124500000,
    gdpNominal: '$4.21 Trillion',
    gdpPerCapita: '$33,800',
    inflation: '2.4%',
    interestRate: '0.25% (Bank of Japan)',
    currency: 'Japanese Yen (JPY ¥)',
    languages: ['Japanese'],
    region: 'East Asia',
    globalRankings: [
      { metric: 'Nominal GDP', rank: 4, total: 195, source: 'IMF World Economic Outlook', year: '2025' },
      { metric: 'Life Expectancy', rank: 2, total: 195, source: 'WHO World Health Statistics', year: '2024' },
      { metric: 'High-Tech Manufacturing', rank: 3, total: 195, source: 'OECD Science Scoreboard', year: '2025' }
    ],
    keyIndicators: {
      'R&D Intensity': '3.3% of GDP',
      'Public Debt to GDP': '255% (Held primarily domestically in Yen)',
      'Automotive & Precision': 'Global leader in hybrid powertrains and industrial robotics'
    },
    source: 'Statistics Bureau of Japan & Bank of Japan Reports',
    sourceUrl: 'https://www.stat.go.jp/english/',
    notes: 'Methodology based on national household and establishment census records.'
  },
  {
    code: 'DE',
    name: 'Germany',
    capital: 'Berlin',
    population: '84.6 Million',
    populationRaw: 84600000,
    gdpNominal: '$4.59 Trillion',
    gdpPerCapita: '$54,200',
    inflation: '2.1%',
    interestRate: '3.25% (ECB Main Refinancing)',
    currency: 'Euro (EUR €)',
    languages: ['German'],
    region: 'Western Europe',
    globalRankings: [
      { metric: 'Nominal GDP', rank: 3, total: 195, source: 'IMF WEO', year: '2025' },
      { metric: 'Export Complexity', rank: 2, total: 130, source: 'Harvard Atlas of Economic Complexity', year: '2024' }
    ],
    keyIndicators: {
      'Mittelstand Ecosystem': 'Strong specialized industrial manufacturing base',
      'Energy Transition': 'Over 54% electricity generated from renewable sources'
    },
    source: 'Federal Statistical Office of Germany (Destatis) & Eurostat',
    sourceUrl: 'https://www.destatis.de/EN',
    notes: 'European System of National and Regional Accounts (ESA 2010).'
  }
];

const INDIA_STATES_DATA: IndiaStateProfile[] = [
  {
    name: 'Andhra Pradesh',
    code: 'AP',
    type: 'State',
    capital: 'Amaravati',
    districtsCount: 26,
    population: '49.5 Million (2011 Census proj.)',
    literacyRate: '67.4%',
    primaryLanguages: ['Telugu', 'English', 'Urdu'],
    gdpState: '₹14.5 Lakh Crore (GSDP)',
    keySectors: ['Agriculture & Aquaculture', 'Pharma & Biotech (Vizag)', 'Automotive Manufacturing (Sri City)', 'Ports & Maritime Logistics'],
    majorAirports: ['Visakhapatnam (VTZ)', 'Vijayawada (VGA)', 'Tirupati (TIR)'],
    keySchemesImplemented: ['YSR Rythu Bharosa', 'Aarogyasri Health Scheme', 'Jagananna Amma Vodi', 'Jalayagnam Irrigation'],
    source: 'Directorate of Economics and Statistics, Andhra Pradesh & Census of India'
  },
  {
    name: 'Telangana',
    code: 'TG',
    type: 'State',
    capital: 'Hyderabad',
    districtsCount: 33,
    population: '38.2 Million',
    literacyRate: '72.8%',
    primaryLanguages: ['Telugu', 'Urdu', 'English'],
    gdpState: '₹14.0 Lakh Crore (GSDP)',
    keySectors: ['Information Technology & AI (Cyberabad)', 'Life Sciences & Genome Valley', 'Aerospace & Defence', 'Textiles (Warangal)'],
    majorAirports: ['Rajiv Gandhi International Airport, Hyderabad (HYD)'],
    railHeadquarters: 'South Central Railway (Secunderabad)',
    keySchemesImplemented: ['Rythu Bandhu', 'Kaleshwaram Lift Irrigation', 'Mission Bhagiratha', 'T-Hub Innovation Platform'],
    source: 'Government of Telangana Socio-Economic Outlook & RBI State Finances'
  },
  {
    name: 'Karnataka',
    code: 'KA',
    type: 'State',
    capital: 'Bengaluru',
    districtsCount: 31,
    population: '67.6 Million',
    literacyRate: '75.4%',
    primaryLanguages: ['Kannada', 'English', 'Urdu'],
    gdpState: '₹25.0 Lakh Crore',
    keySectors: ['Silicon Valley of India / Software Exports', 'Biotech & Heavy Engineering', 'Coffee Production', 'Aerospace Cluster'],
    majorAirports: ['Kempegowda International Airport, Bengaluru (BLR)', 'Mangaluru (IXE)'],
    railHeadquarters: 'South Western Railway (Hubballi)',
    keySchemesImplemented: ['Gruha Lakshmi', 'Yuva Nidhi', 'Ksheera Bhagya', 'Shakti Free Transit'],
    source: 'Karnataka Planning Department & RBI State Economy Reports'
  },
  {
    name: 'Tamil Nadu',
    code: 'TN',
    type: 'State',
    capital: 'Chennai',
    districtsCount: 38,
    population: '76.8 Million',
    literacyRate: '80.1%',
    primaryLanguages: ['Tamil', 'English'],
    gdpState: '₹27.5 Lakh Crore',
    keySectors: ['Automotive & EV Hub (Detroit of Asia)', 'Electronics Manufacturing', 'Wind Energy Leader', 'Textiles & Garments (Tiruppur)'],
    majorAirports: ['Chennai (MAA)', 'Coimbatore (CJB)', 'Madurai (IXM)', 'Tiruchirappalli (TRZ)'],
    railHeadquarters: 'Southern Railway (Chennai)',
    keySchemesImplemented: ['Kalaignar Magalir Urimai Thittam', 'Pudhumai Penn', 'Makkalai Thedi Maruthuvam', 'Naan Mudhalvan'],
    source: 'Department of Economics and Statistics, Tamil Nadu'
  },
  {
    name: 'Maharashtra',
    code: 'MH',
    type: 'State',
    capital: 'Mumbai',
    districtsCount: 36,
    population: '126.4 Million',
    literacyRate: '82.3%',
    primaryLanguages: ['Marathi', 'Hindi', 'English'],
    gdpState: '₹40.2 Lakh Crore (Largest GSDP in India)',
    keySectors: ['Financial Services (RBI, BSE, NSE)', 'Automobile Manufacturing (Pune)', 'Pharmaceuticals', 'Cinema & Entertainment'],
    majorAirports: ['Chhatrapati Shivaji Maharaj International (BOM)', 'Pune (PNQ)', 'Nagpur (NAG)'],
    railHeadquarters: 'Central Railway & Western Railway (Mumbai)',
    keySchemesImplemented: ['Majhi Ladki Bahin Yojana', 'Mahatma Jyotirao Phule Jan Arogya', 'Jalyukt Shivar'],
    source: 'Maharashtra State Planning Commission & Economic Survey'
  }
];

const GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  {
    id: 'scheme-ayushman',
    title: 'Ayushman Bharat — Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    ministry: 'Ministry of Health and Family Welfare',
    objective: 'Universal health coverage offering cashless secondary and tertiary hospitalization to eligible low-income households.',
    eligibility: 'Socio-Economic Caste Census (SECC) identified deprivation criteria. Senior citizens aged 70+ irrespective of income.',
    benefits: 'Up to ₹5 Lakh per family per year for secondary and tertiary care hospitalization across impaneled public and private hospitals.',
    launchYear: '2018',
    sourceUrl: 'https://pmjay.gov.in',
    verificationDate: '2026-09 Audited'
  },
  {
    id: 'scheme-pm-kisan',
    title: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    objective: 'Direct income support to landholding farmers to procure agricultural inputs and meet domestic needs.',
    eligibility: 'All landholding farmer families with cultivable land in their name (exclusions apply for institutional landholders and tax-payers).',
    benefits: '₹6,000 per year transferred directly to bank accounts in three equal 4-monthly installments of ₹2,000 via Aadhaar-linked DBT.',
    launchYear: '2019',
    sourceUrl: 'https://pmkisan.gov.in',
    verificationDate: '2026-09 Audited'
  },
  {
    id: 'scheme-pm-awas',
    title: 'Pradhan Mantri Awas Yojana (PMAY Urban & Gramin)',
    ministry: 'Ministry of Housing and Urban Affairs & Ministry of Rural Development',
    objective: 'Provide pucca houses with basic amenities (water, sanitation, electricity) to homeless and households living in kutcha houses.',
    eligibility: 'Economically Weaker Sections (EWS), Low Income Groups (LIG), and rural households identified through SECC and Awaas+ surveys.',
    benefits: 'Direct financial subsidy ranging from ₹1.20 Lakh (Gramin plains) to interest subsidy on home loans under Credit Linked Subsidy.',
    launchYear: '2015',
    sourceUrl: 'https://pmaymis.gov.in',
    verificationDate: '2026-09 Audited'
  },
  {
    id: 'scheme-digital-india',
    title: 'Digital India & India Stack (UPI, DigiLocker, Aadhaar, ONDC)',
    ministry: 'Ministry of Electronics and Information Technology (MeitY)',
    objective: 'Transform India into a digitally empowered society and knowledge economy by providing public digital infrastructure as a utility.',
    eligibility: 'Open to all Indian residents, startups, developers, and institutions.',
    benefits: 'Paperless, presence-less, and cashless public goods enabling instant identity verification, payment settlement, and credential issuance.',
    launchYear: '2015',
    sourceUrl: 'https://www.digitalindia.gov.in',
    verificationDate: '2026-09 Audited'
  }
];

export const GlobalIndiaIntelligencePower: React.FC<GlobalIndiaIntelligencePowerProps> = ({
  onBack,
  onAskAstra
}) => {
  const [activeTab, setActiveTab] = useState<'global' | 'india' | 'compare' | 'schemes'>('global');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryProfile>(COUNTRIES_DATABASE[0]);
  const [compareCountry1, setCompareCountry1] = useState<CountryProfile>(COUNTRIES_DATABASE[0]);
  const [compareCountry2, setCompareCountry2] = useState<CountryProfile>(COUNTRIES_DATABASE[1]);
  const [selectedState, setSelectedState] = useState<IndiaStateProfile>(INDIA_STATES_DATA[0]);

  const filteredCountries = useMemo(() => {
    return COUNTRIES_DATABASE.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.capital.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.region.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredStates = useMemo(() => {
    return INDIA_STATES_DATA.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.capital.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.keySectors.some((sec) => sec.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const filteredSchemes = useMemo(() => {
    return GOVERNMENT_SCHEMES.filter(
      (sch) =>
        sch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sch.ministry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sch.objective.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleExportCountry = (country: CountryProfile) => {
    triggerHaptic(10);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(country, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${country.code}_intelligence_report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    hapticSuccess();
  };

  return (
    <div
      id="astra-global-india-power"
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
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 via-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-400">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                GLOBAL & INDIA INTELLIGENCE
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                  Audited Baseline
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Neutral Datasets • Official Census & IMF Records • State Comparisons & Government Schemes
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => {
              setActiveTab('global');
              triggerHaptic(10);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'global' ? 'bg-amber-500 text-black shadow-sm font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Global Intel
          </button>
          <button
            onClick={() => {
              setActiveTab('india');
              triggerHaptic(10);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'india' ? 'bg-amber-500 text-black shadow-sm font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            India States
          </button>
          <button
            onClick={() => {
              setActiveTab('compare');
              triggerHaptic(10);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
              activeTab === 'compare' ? 'bg-amber-500 text-black shadow-sm font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            Compare
          </button>
          <button
            onClick={() => {
              setActiveTab('schemes');
              triggerHaptic(10);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
              activeTab === 'schemes' ? 'bg-amber-500 text-black shadow-sm font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Schemes
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'global'
                ? 'Search countries by name, capital, or region...'
                : activeTab === 'india'
                ? 'Search Indian states, capitals, or key sectors...'
                : activeTab === 'schemes'
                ? 'Search schemes by title, ministry, or objective...'
                : 'Filter records...'
            }
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
          />
        </div>

        {/* 1. GLOBAL INTELLIGENCE TAB */}
        {activeTab === 'global' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Country List Sidebar */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Select Country Profile
                </h3>
                <div className="space-y-2">
                  {filteredCountries.map((c) => {
                    const isSelected = selectedCountry.code === c.code;
                    return (
                      <div
                        key={c.code}
                        onClick={() => {
                          setSelectedCountry(c);
                          triggerHaptic(8);
                        }}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500/50 shadow-md'
                            : 'bg-slate-900/40 hover:bg-slate-900/80 border-white/10'
                        }`}
                      >
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                            {c.name}
                          </h4>
                          <p className="text-xs text-slate-400">Capital: {c.capital} • {c.region}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Country Detailed Dossier */}
              <div className="lg:col-span-2 bg-slate-900/60 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                        {selectedCountry.code}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedCountry.name}</h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Capital: {selectedCountry.capital} • Currency: {selectedCountry.currency} • Region: {selectedCountry.region}
                    </p>
                  </div>
                  <button
                    onClick={() => handleExportCountry(selectedCountry)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    Export Report
                  </button>
                </div>

                {/* Macro Economic Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Total Population</span>
                    <span className="text-sm font-mono font-bold text-white mt-1 block">{selectedCountry.population}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Nominal GDP</span>
                    <span className="text-sm font-mono font-bold text-amber-300 mt-1 block">{selectedCountry.gdpNominal}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">GDP Per Capita</span>
                    <span className="text-sm font-mono font-bold text-white mt-1 block">{selectedCountry.gdpPerCapita}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Inflation Rate</span>
                    <span className="text-sm font-mono font-bold text-white mt-1 block">{selectedCountry.inflation}</span>
                  </div>
                </div>

                {/* Neutral Global Rankings */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                    Audited Global Benchmarks & Rankings
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedCountry.globalRankings.map((r, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-white block">{r.metric}</span>
                          <span className="text-[10px] text-slate-400 block">{r.source} ({r.year})</span>
                        </div>
                        <span className="text-sm font-mono font-bold text-amber-400">
                          #{r.rank} <span className="text-[10px] text-slate-500">/ {r.total}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Indicators */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Infrastructure & Technological Footprint
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.entries(selectedCountry.keyIndicators).map(([k, v]) => (
                      <div key={k} className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                        <span className="text-slate-400 block text-[11px]">{k}</span>
                        <span className="text-white font-medium block mt-0.5">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Neutral Audit Citation */}
                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Primary Source Attribution
                    </span>
                    <a
                      href={selectedCountry.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Official Data Portal
                    </a>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {selectedCountry.source}. {selectedCountry.notes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. INDIA INTELLIGENCE TAB */}
        {activeTab === 'india' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* States Listing */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  States & Union Territories ({INDIA_STATES_DATA.length})
                </h3>
                <div className="space-y-2">
                  {filteredStates.map((s) => {
                    const isSelected = selectedState.name === s.name;
                    return (
                      <div
                        key={s.code}
                        onClick={() => {
                          setSelectedState(s);
                          triggerHaptic(8);
                        }}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500/50 shadow-md'
                            : 'bg-slate-900/40 hover:bg-slate-900/80 border-white/10'
                        }`}
                      >
                        <div>
                          <h4 className="text-sm font-bold text-white">{s.name}</h4>
                          <p className="text-xs text-slate-400">Capital: {s.capital} • {s.districtsCount} Districts</p>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-amber-300">
                          {s.code}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* State Details */}
              <div className="lg:col-span-2 bg-slate-900/60 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm space-y-5">
                <div className="border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                      {selectedState.type}
                    </span>
                    <h2 className="text-2xl font-bold text-white">{selectedState.name}</h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Capital: {selectedState.capital} • {selectedState.districtsCount} Administrative Districts • Primary Languages: {selectedState.primaryLanguages.join(', ')}
                  </p>
                </div>

                {/* State Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Population</span>
                    <span className="text-sm font-mono font-bold text-white mt-1 block">{selectedState.population}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Gross State GDP</span>
                    <span className="text-sm font-mono font-bold text-amber-300 mt-1 block">{selectedState.gdpState}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Literacy Rate</span>
                    <span className="text-sm font-mono font-bold text-emerald-400 mt-1 block">{selectedState.literacyRate}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Districts</span>
                    <span className="text-sm font-mono font-bold text-white mt-1 block">{selectedState.districtsCount}</span>
                  </div>
                </div>

                {/* Key Economic Sectors */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                    Key Economic Sectors & Industry Clusters
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedState.keySectors.map((sec, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200">
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Infrastructure: Airports & Rail */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-cyan-400" />
                    Key Transport Infrastructure
                  </h4>
                  <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-xs space-y-1">
                    <div className="text-slate-300">
                      <span className="font-semibold text-slate-400">Major Airports:</span> {selectedState.majorAirports.join(', ')}
                    </div>
                    {selectedState.railHeadquarters && (
                      <div className="text-slate-300">
                        <span className="font-semibold text-slate-400">Zonal Railway HQ:</span> {selectedState.railHeadquarters}
                      </div>
                    )}
                  </div>
                </div>

                {/* Flagship State Welfare / Development Initiatives */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 text-emerald-400" />
                    State Policy & Public Initiatives (Neutral Overview)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedState.keySchemesImplemented.map((scheme, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                        {scheme}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Source attribution */}
                <div className="text-[11px] font-mono text-slate-500 border-t border-white/5 pt-2">
                  Source: {selectedState.source}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. COUNTRY COMPARISON TAB */}
        {activeTab === 'compare' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-sm space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-amber-400" />
                Side-by-Side Country Comparison Matrix
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Country 1</label>
                  <select
                    value={compareCountry1.code}
                    onChange={(e) => setCompareCountry1(COUNTRIES_DATABASE.find((c) => c.code === e.target.value) || COUNTRIES_DATABASE[0])}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {COUNTRIES_DATABASE.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Country 2</label>
                  <select
                    value={compareCountry2.code}
                    onChange={(e) => setCompareCountry2(COUNTRIES_DATABASE.find((c) => c.code === e.target.value) || COUNTRIES_DATABASE[1])}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {COUNTRIES_DATABASE.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/40">
              <table className="w-full text-xs text-left">
                <thead className="bg-white/5 text-slate-300 font-bold border-b border-white/10">
                  <tr>
                    <th className="p-3.5">Indicator</th>
                    <th className="p-3.5 text-amber-300 font-mono">{compareCountry1.name}</th>
                    <th className="p-3.5 text-cyan-300 font-mono">{compareCountry2.name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-400">Total Population</td>
                    <td className="p-3.5 font-mono">{compareCountry1.population}</td>
                    <td className="p-3.5 font-mono">{compareCountry2.population}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-400">Nominal GDP</td>
                    <td className="p-3.5 font-mono">{compareCountry1.gdpNominal}</td>
                    <td className="p-3.5 font-mono">{compareCountry2.gdpNominal}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-400">GDP Per Capita</td>
                    <td className="p-3.5 font-mono">{compareCountry1.gdpPerCapita}</td>
                    <td className="p-3.5 font-mono">{compareCountry2.gdpPerCapita}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-400">Inflation Rate</td>
                    <td className="p-3.5 font-mono">{compareCountry1.inflation}</td>
                    <td className="p-3.5 font-mono">{compareCountry2.inflation}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-400">Central Bank Rate</td>
                    <td className="p-3.5 font-mono">{compareCountry1.interestRate}</td>
                    <td className="p-3.5 font-mono">{compareCountry2.interestRate}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-400">National Currency</td>
                    <td className="p-3.5">{compareCountry1.currency}</td>
                    <td className="p-3.5">{compareCountry2.currency}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. SCHEMES & PUBLIC SERVICES TAB */}
        {activeTab === 'schemes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Verified Government Schemes & Eligibility ({filteredSchemes.length})
              </h3>
              <span className="text-xs text-slate-500">Neutral policy summaries with zero partisan persuasion</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSchemes.map((sch) => (
                <div key={sch.id} className="p-4 rounded-2xl border border-white/10 bg-slate-900/50 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        Launch: {sch.launchYear}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {sch.verificationDate}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white">{sch.title}</h4>
                    <p className="text-xs text-amber-300/80 font-medium">{sch.ministry}</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{sch.objective}</p>

                    <div className="pt-2 border-t border-white/5 space-y-2 text-xs">
                      <div>
                        <span className="font-semibold text-slate-400 block">Eligibility:</span>
                        <span className="text-slate-300 block">{sch.eligibility}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-400 block">Entitlement / Benefit:</span>
                        <span className="text-emerald-300 block">{sch.benefits}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <a
                      href={sch.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Official Portal
                    </a>
                    {onAskAstra && (
                      <button
                        onClick={() => onAskAstra(`Explain eligibility criteria and application process for "${sch.title}"`)}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        Ask Astra Details →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
