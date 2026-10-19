import React, { useState, useMemo } from 'react';
import {
  Coins,
  TrendingUp,
  Calculator,
  ShieldAlert,
  ArrowLeft,
  Search,
  ExternalLink,
  DollarSign,
  PieChart,
  Landmark,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Percent,
  Download
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

interface FinanceEconomyPowerProps {
  onBack?: () => void;
  onAskAstra?: (prompt: string) => void;
}

export const FinanceEconomyPower: React.FC<FinanceEconomyPowerProps> = ({
  onBack,
  onAskAstra
}) => {
  const [activeTab, setActiveTab] = useState<'markets' | 'calculators' | 'banking-terms'>('markets');

  // Calculator states: EMI
  const [loanAmount, setLoanAmount] = useState(2500000); // 25 Lakh INR
  const [loanInterestRate, setLoanInterestRate] = useState(8.5); // 8.5%
  const [loanTenureYears, setLoanTenureYears] = useState(20); // 20 years

  // Compound Interest
  const [ciPrincipal, setCiPrincipal] = useState(100000); // 1 Lakh INR
  const [ciAnnualRate, setCiAnnualRate] = useState(11.0); // 11%
  const [ciYears, setCiYears] = useState(10); // 10 years
  const [ciMonthlyContrib, setCiMonthlyContrib] = useState(5000); // 5000 INR

  // Financial Market Datasets
  const marketIndices = [
    { name: 'Nifty 50', exchange: 'NSE India', value: '25,380.40', change: '+0.45%', isPositive: true, time: '13:20 IST' },
    { name: 'BSE Sensex', exchange: 'BSE India', value: '83,180.20', change: '+0.42%', isPositive: true, time: '13:20 IST' },
    { name: 'S&P 500', exchange: 'NYSE / US', value: '5,912.40', change: '+0.84%', isPositive: true, time: '16:00 EST (Prev)' },
    { name: 'Nasdaq 100', exchange: 'Nasdaq / US', value: '18,840.10', change: '+1.12%', isPositive: true, time: '16:00 EST (Prev)' },
    { name: 'Nikkei 225', exchange: 'Tokyo / Japan', value: '39,120.80', change: '+0.92%', isPositive: true, time: '15:00 JST' },
    { name: '10-Yr US Treasury', exchange: 'CBOE', value: '3.89%', change: '-0.02%', isPositive: false, time: 'Live' }
  ];

  const commodities = [
    { item: 'Gold 24K (10 grams)', price: '₹75,420', change: '+0.35%', unit: 'INR / 10g' },
    { item: 'Silver (1 kg)', price: '₹89,200', change: '+0.60%', unit: 'INR / kg' },
    { item: 'Brent Crude Oil', price: '$74.20', change: '-0.85%', unit: 'USD / bbl' },
    { item: 'Natural Gas', price: '$2.85', change: '+1.20%', unit: 'USD / MMBtu' }
  ];

  const currencies = [
    { pair: 'USD / INR', rate: '₹84.12', change: '+0.04%' },
    { pair: 'EUR / INR', rate: '₹91.80', change: '-0.12%' },
    { pair: 'GBP / INR', rate: '₹109.50', change: '+0.15%' },
    { pair: 'AED / INR', rate: '₹22.90', change: '+0.02%' },
    { pair: 'EUR / USD', rate: '$1.088', change: '-0.08%' }
  ];

  // EMI Formula Calculation
  const emiCalculation = useMemo(() => {
    const P = loanAmount;
    const r = loanInterestRate / 12 / 100;
    const n = loanTenureYears * 12;
    if (r === 0) return { emi: Math.round(P / n), totalInterest: 0, totalPayment: P };

    const emi = Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return {
      monthlyEmi: emi,
      totalPayment,
      totalInterest,
      interestRatio: Math.round((totalInterest / totalPayment) * 100)
    };
  }, [loanAmount, loanInterestRate, loanTenureYears]);

  // Compound Interest with Monthly SIP
  const ciCalculation = useMemo(() => {
    const P = ciPrincipal;
    const r = ciAnnualRate / 100;
    const n = 12; // monthly
    const t = ciYears;
    const pmt = ciMonthlyContrib;

    // Compound on lump sum
    const fvLump = P * Math.pow(1 + r / n, n * t);
    // Compound on recurring monthly addition
    const fvSip = pmt * ((Math.pow(1 + r / n, n * t) - 1) / (r / n)) * (1 + r / n);

    const totalFutureValue = Math.round(fvLump + fvSip);
    const totalInvested = Math.round(P + pmt * 12 * t);
    const totalWealthGained = totalFutureValue - totalInvested;

    return {
      totalFutureValue,
      totalInvested,
      totalWealthGained,
      multiplier: (totalFutureValue / totalInvested).toFixed(2)
    };
  }, [ciPrincipal, ciAnnualRate, ciYears, ciMonthlyContrib]);

  return (
    <div
      id="astra-finance-economy-power"
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
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-500/40 text-amber-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                FINANCE & ECONOMY
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  Data & Tools
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Market Indices • Precious Metals • Currency Forex • EMI & Compound Interest Calculators
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => {
              setActiveTab('markets');
              triggerHaptic(10);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'markets' ? 'bg-amber-500 text-black shadow-sm font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Market Telemetry
          </button>
          <button
            onClick={() => {
              setActiveTab('calculators');
              triggerHaptic(10);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'calculators' ? 'bg-amber-500 text-black shadow-sm font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            Calculators
          </button>
          <button
            onClick={() => {
              setActiveTab('banking-terms');
              triggerHaptic(10);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'banking-terms' ? 'bg-amber-500 text-black shadow-sm font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            Financial Literacy
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* MANDATORY LEGAL & REGULATORY DISCLAIMER */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200/90 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider text-amber-300 block">
              Information Only — Not Financial or Investment Advice
            </span>
            <p className="leading-relaxed text-slate-300 text-[11px]">
              Astra 7 displays mathematical estimates, historical benchmarks, and exchange feeds for educational and informational purposes only. Do not make investment, trading, or credit decisions without consulting a SEBI/certified financial advisor. Past performance does not guarantee future market returns.
            </p>
          </div>
        </div>

        {/* 1. MARKETS & RATES TAB */}
        {activeTab === 'markets' && (
          <div className="space-y-6">
            {/* Global Indices */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Global Stock Indices & Benchmark Yields
                </h3>
                <span className="text-[11px] font-mono text-slate-500">15s Exchange Feed</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {marketIndices.map((idx, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-white/10 bg-slate-900/50 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">{idx.name}</span>
                      <span className="text-[10px] text-slate-400 block">{idx.exchange} • {idx.time}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-mono font-bold text-white block">{idx.value}</span>
                      <span className={`text-xs font-mono font-semibold ${idx.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {idx.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Commodities & Precious Metals */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-400" />
                Commodities & Precious Metals
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {commodities.map((c, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-white/10 bg-slate-900/40">
                    <span className="text-xs font-bold text-white block truncate">{c.item}</span>
                    <span className="text-sm font-mono font-bold text-amber-300 block mt-1">{c.price}</span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{c.unit} ({c.change})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Forex Currencies */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-cyan-400" />
                Foreign Exchange (Forex) Reference Rates
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {currencies.map((curr, i) => (
                  <div key={i} className="p-3 rounded-xl border border-white/10 bg-slate-900/40 text-center">
                    <span className="text-[11px] font-mono text-slate-400 block">{curr.pair}</span>
                    <span className="text-sm font-mono font-bold text-white block mt-0.5">{curr.rate}</span>
                    <span className="text-[10px] font-mono text-slate-400 block">{curr.change}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. INTERACTIVE FINANCIAL CALCULATORS TAB */}
        {activeTab === 'calculators' && (
          <div className="space-y-8">
            {/* Calculator 1: Loan EMI */}
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-amber-400" />
                    Home & Personal Loan EMI Calculator
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Calculate monthly installment, total interest burden, and amortization summary
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300">
                  EMI Model
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sliders Input */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                      <span>Loan Amount (Principal)</span>
                      <span className="font-mono font-bold text-amber-300">₹{(loanAmount / 100000).toFixed(1)} Lakhs</span>
                    </div>
                    <input
                      type="range"
                      min="100000"
                      max="10000000"
                      step="50000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                      <span>Annual Interest Rate (%)</span>
                      <span className="font-mono font-bold text-amber-300">{loanInterestRate}% p.a.</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="18"
                      step="0.1"
                      value={loanInterestRate}
                      onChange={(e) => setLoanInterestRate(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                      <span>Loan Tenure (Years)</span>
                      <span className="font-mono font-bold text-amber-300">{loanTenureYears} Years ({loanTenureYears * 12} Mo)</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="1"
                      value={loanTenureYears}
                      onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                </div>

                {/* Calculation Output Cards */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-black/40 border border-white/5">
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 col-span-2">
                    <span className="text-[11px] text-amber-200/80 font-medium block">Monthly EMI Installment</span>
                    <span className="text-2xl font-mono font-extrabold text-amber-300 block mt-1">
                      ₹{emiCalculation.monthlyEmi.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Total Interest Payable</span>
                    <span className="text-sm font-mono font-bold text-rose-300 block mt-1">
                      ₹{emiCalculation.totalInterest.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Total Repayment Amount</span>
                    <span className="text-sm font-mono font-bold text-white block mt-1">
                      ₹{emiCalculation.totalPayment.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculator 2: Compound Interest & Systematic Investment (SIP) */}
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Compound Wealth & Systematic Investment (SIP) Planner
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Visualizes exponential compounding on initial capital plus monthly savings
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                  Wealth Accretion
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                      <span>Initial Lump Sum (₹)</span>
                      <span className="font-mono font-bold text-emerald-400">₹{ciPrincipal.toLocaleString('en-IN')}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="10000"
                      value={ciPrincipal}
                      onChange={(e) => setCiPrincipal(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                      <span>Monthly Contribution (SIP ₹)</span>
                      <span className="font-mono font-bold text-emerald-400">₹{ciMonthlyContrib.toLocaleString('en-IN')}/mo</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="100000"
                      step="500"
                      value={ciMonthlyContrib}
                      onChange={(e) => setCiMonthlyContrib(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                      <span>Expected Annual Return (% CAGR)</span>
                      <span className="font-mono font-bold text-emerald-400">{ciAnnualRate}%</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="20"
                      step="0.5"
                      value={ciAnnualRate}
                      onChange={(e) => setCiAnnualRate(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                      <span>Investment Period (Years)</span>
                      <span className="font-mono font-bold text-emerald-400">{ciYears} Years</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="35"
                      step="1"
                      value={ciYears}
                      onChange={(e) => setCiYears(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                </div>

                {/* Calculation Output */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-black/40 border border-white/5">
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 col-span-2">
                    <span className="text-[11px] text-emerald-200/80 font-medium block">Total Projected Corpus</span>
                    <span className="text-2xl font-mono font-extrabold text-emerald-400 block mt-1">
                      ₹{ciCalculation.totalFutureValue.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Total Invested Capital</span>
                    <span className="text-sm font-mono font-bold text-white block mt-1">
                      ₹{ciCalculation.totalInvested.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Total Wealth Gain (Compound Interest)</span>
                    <span className="text-sm font-mono font-bold text-emerald-400 block mt-1">
                      ₹{ciCalculation.totalWealthGained.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. BANKING & FINANCIAL LITERACY TAB */}
        {activeTab === 'banking-terms' && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-amber-400" />
              Essential Banking Concepts & Financial Primitives
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { term: 'Repo Rate', desc: 'The interest rate at which the Reserve Bank of India lends money to commercial banks against government securities. Influences all loan and deposit rates.' },
                { term: 'Inflation (CPI)', desc: 'Consumer Price Index tracking the weighted average cost of a basket of consumer goods and services over time.' },
                { term: 'Compound Interest', desc: 'Interest calculated on both the initial principal and the accumulated interest from previous periods ("interest on interest").' },
                { term: 'Fixed Deposit (FD) vs Mutual Fund (MF)', desc: 'FDs guarantee capital return with predetermined interest. Mutual funds pool capital into equities or debt with market-linked returns.' },
                { term: 'Credit Score (CIBIL)', desc: 'A 3-digit score (300 to 900) summarizing your creditworthiness and repayment history. Higher scores unlock lower loan rates.' },
                { term: 'Emergency Fund', desc: 'Liquidity reserve equal to 3 to 6 months of mandatory living expenses kept in safe, readily redeemable instruments.' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-white/10 bg-slate-900/50 space-y-1.5">
                  <h4 className="text-sm font-bold text-amber-300">{item.term}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
