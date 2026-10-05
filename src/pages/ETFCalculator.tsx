import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { motion } from 'motion/react';
import { 
  Layers, 
  TrendingUp, 
  DollarSign, 
  Percent, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  PieChart as PieChartIcon, 
  Info,
  Scale
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useCurrency } from '../components/CurrencyContext';

const ETF_PRESETS = [
  { name: 'S&P 500 ETF (VOO/SPY)', expectedCagr: 12, expenseRatio: 0.03, dividendYield: 1.5, category: 'US Index' },
  { name: 'Nasdaq 100 ETF (QQQ)', expectedCagr: 15.5, expenseRatio: 0.20, dividendYield: 0.6, category: 'US Tech' },
  { name: 'Nifty 50 BeES ETF', expectedCagr: 13.0, expenseRatio: 0.05, dividendYield: 1.2, category: 'India Broad' },
  { name: 'Physical Gold ETF (GLD)', expectedCagr: 10.0, expenseRatio: 0.40, dividendYield: 0.0, category: 'Commodity' },
  { name: 'All-World ETF (VT)', expectedCagr: 10.5, expenseRatio: 0.07, dividendYield: 1.9, category: 'Global' },
];

export function ETFCalculator() {
  const { currency, formatValue } = useCurrency();

  const [investmentType, setInvestmentType] = useState<'sip' | 'lumpsum'>('sip');
  const [amount, setAmount] = useState(10000); // 10k monthly or lumpsum
  const [cagr, setCagr] = useState(12.5); // Expected Gross Index return
  const [expenseRatio, setExpenseRatio] = useState(0.05); // 0.05% TER
  const [activeFundExpenseRatio, setActiveFundExpenseRatio] = useState(1.75); // 1.75% active fund comparison
  const [dividendYield, setDividendYield] = useState(1.2); // 1.2%
  const [reinvestDividends, setReinvestDividends] = useState(true);
  const [trackingError, setTrackingError] = useState(0.08); // 0.08%
  const [years, setYears] = useState(15);

  const results = useMemo(() => {
    const etfNetReturnRate = Math.max(0.1, cagr + (reinvestDividends ? dividendYield : 0) - expenseRatio - trackingError);
    const activeNetReturnRate = Math.max(0.1, cagr + (reinvestDividends ? dividendYield : 0) - activeFundExpenseRatio);
    const grossReturnRate = cagr + (reinvestDividends ? dividendYield : 0);

    let totalPrincipal = 0;
    let etfWealth = 0;
    let activeWealth = 0;
    let grossWealth = 0;

    let chartData = [];

    const etfMonthlyRate = etfNetReturnRate / 100 / 12;
    const activeMonthlyRate = activeNetReturnRate / 100 / 12;
    const grossMonthlyRate = grossReturnRate / 100 / 12;

    if (investmentType === 'lumpsum') {
      totalPrincipal = amount;
      for (let y = 1; y <= years; y++) {
        etfWealth = amount * Math.pow(1 + etfNetReturnRate / 100, y);
        activeWealth = amount * Math.pow(1 + activeNetReturnRate / 100, y);
        grossWealth = amount * Math.pow(1 + grossReturnRate / 100, y);

        chartData.push({
          year: `Y${y}`,
          invested: totalPrincipal,
          etf: Math.round(etfWealth),
          active: Math.round(activeWealth),
          gross: Math.round(grossWealth),
          feeSavings: Math.round(etfWealth - activeWealth),
        });
      }
    } else {
      let curEtf = 0;
      let curActive = 0;
      let curGross = 0;
      let curInvested = 0;

      for (let y = 1; y <= years; y++) {
        for (let m = 1; m <= 12; m++) {
          curInvested += amount;
          curEtf = (curEtf + amount) * (1 + etfMonthlyRate);
          curActive = (curActive + amount) * (1 + activeMonthlyRate);
          curGross = (curGross + amount) * (1 + grossMonthlyRate);
        }

        totalPrincipal = curInvested;
        etfWealth = curEtf;
        activeWealth = curActive;
        grossWealth = curGross;

        chartData.push({
          year: `Y${y}`,
          invested: Math.round(curInvested),
          etf: Math.round(curEtf),
          active: Math.round(curActive),
          gross: Math.round(curGross),
          feeSavings: Math.round(curEtf - curActive),
        });
      }
    }

    const feeLossToActive = Math.max(0, Math.round(etfWealth - activeWealth));
    const etfTotalFeesPaid = Math.max(0, Math.round(grossWealth - etfWealth));

    return {
      totalPrincipal: Math.round(totalPrincipal),
      etfFinalWealth: Math.round(etfWealth),
      activeFinalWealth: Math.round(activeWealth),
      grossFinalWealth: Math.round(grossWealth),
      feeLossToActive,
      etfTotalFeesPaid,
      etfNetReturnRate: etfNetReturnRate.toFixed(2),
      activeNetReturnRate: activeNetReturnRate.toFixed(2),
      chartData,
    };
  }, [investmentType, amount, cagr, expenseRatio, activeFundExpenseRatio, dividendYield, reinvestDividends, trackingError, years]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Layers className="w-3.5 h-3.5" />
            Exchange Traded Funds (ETF) Suite
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/5 text-white/50 border border-white/10">
            Expense Ratio & Fee Optimization
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-white">
          ETF & Index Fund Calculator
        </h1>
        <p className="text-white/50 text-sm md:text-base mt-1">
          Calculate compounding returns for ETFs, simulate dividend reinvestment, and see the huge wealth difference low expense ratios deliver.
        </p>
      </div>

      {/* ETF Presets */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="text-xs font-medium text-white/40 uppercase tracking-wider mr-2">Index Presets:</span>
        {ETF_PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => {
              setCagr(preset.expectedCagr);
              setExpenseRatio(preset.expenseRatio);
              setDividendYield(preset.dividendYield);
            }}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            {preset.name} ({preset.expenseRatio}% TER)
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 md:p-8 rounded-3xl glass border border-white/10 space-y-6">
            {/* Mode Switcher */}
            <div className="flex p-1 bg-black/40 rounded-2xl border border-white/10">
              <button
                onClick={() => setInvestmentType('sip')}
                className={cn(
                  "flex-1 py-2 rounded-xl text-xs font-semibold transition-all",
                  investmentType === 'sip' ? "bg-brand-primary text-white shadow-lg" : "text-white/50 hover:text-white"
                )}
              >
                Monthly ETF SIP
              </button>
              <button
                onClick={() => setInvestmentType('lumpsum')}
                className={cn(
                  "flex-1 py-2 rounded-xl text-xs font-semibold transition-all",
                  investmentType === 'lumpsum' ? "bg-brand-primary text-white shadow-lg" : "text-white/50 hover:text-white"
                )}
              >
                One-Time Lump Sum
              </button>
            </div>

            {/* Investment Amount */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">{investmentType === 'sip' ? 'Monthly Investment' : 'Initial Lump Sum'}</span>
                <span className="font-bold text-white text-base">{formatValue(amount)}</span>
              </div>
              <input
                type="range"
                min={500}
                max={investmentType === 'sip' ? 500000 : 5000000}
                step={500}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Underlying Index CAGR */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Expected Index Growth (CAGR)</span>
                <span className="font-bold text-white text-base">{cagr}% p.a.</span>
              </div>
              <input
                type="range"
                min={4}
                max={25}
                step={0.5}
                value={cagr}
                onChange={(e) => setCagr(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Time Horizon */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Investment Time Horizon</span>
                <span className="font-bold text-white text-base">{years} Years</span>
              </div>
              <input
                type="range"
                min={1}
                max={35}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Cost & Expense Comparison Grid */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                <span>Fee & Friction Comparison</span>
                <Scale className="w-4 h-4 text-blue-400" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-blue-400 font-medium block mb-1">
                    ETF Expense Ratio (TER)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="2.0"
                    value={expenseRatio}
                    onChange={(e) => setExpenseRatio(Number(e.target.value) || 0.01)}
                    className="w-full px-3 py-1.5 text-xs bg-black/40 rounded-xl border border-blue-500/30 text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-rose-400 font-medium block mb-1">
                    Active Mutual Fund TER
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.5"
                    max="3.0"
                    value={activeFundExpenseRatio}
                    onChange={(e) => setActiveFundExpenseRatio(Number(e.target.value) || 0.5)}
                    className="w-full px-3 py-1.5 text-xs bg-black/40 rounded-xl border border-rose-500/30 text-white font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-white/50 font-medium block mb-1">
                    Dividend Yield % (p.a.)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={dividendYield}
                    onChange={(e) => setDividendYield(Number(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-xs bg-black/40 rounded-xl border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-white/50 font-medium block mb-1">
                    Tracking Error Drag %
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1.5"
                    value={trackingError}
                    onChange={(e) => setTrackingError(Number(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-xs bg-black/40 rounded-xl border border-white/10 text-white"
                  />
                </div>
              </div>

              {/* DRIP Toggle */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-white/70">Reinvest Dividends (DRIP Mode)</span>
                <button
                  onClick={() => setReinvestDividends(!reinvestDividends)}
                  className={cn(
                    "w-11 h-6 rounded-full transition-colors relative",
                    reinvestDividends ? "bg-emerald-500" : "bg-white/20"
                  )}
                >
                  <span
                    className={cn(
                      "w-4 h-4 rounded-full bg-white absolute top-1 transition-transform",
                      reinvestDividends ? "left-6" : "left-1"
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results & Visualizer Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl glass border border-blue-500/20 relative overflow-hidden bg-blue-500/5">
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">ETF Portfolio Value</div>
              <div className="text-2xl font-bold text-white mt-1">{formatValue(results.etfFinalWealth)}</div>
              <div className="text-[11px] text-blue-300/60 mt-1">Net CAGR: {results.etfNetReturnRate}%</div>
            </div>

            <div className="p-6 rounded-2xl glass border border-rose-500/20 relative overflow-hidden bg-rose-500/5">
              <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Active Mutual Fund</div>
              <div className="text-2xl font-bold text-white/80 mt-1">{formatValue(results.activeFinalWealth)}</div>
              <div className="text-[11px] text-rose-300/60 mt-1">Net CAGR: {results.activeNetReturnRate}%</div>
            </div>

            <div className="p-6 rounded-2xl glass border border-emerald-500/30 relative overflow-hidden bg-emerald-500/10">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Extra Money Saved</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">+{formatValue(results.feeLossToActive)}</div>
              <div className="text-[11px] text-emerald-300/70 mt-1">Pure savings from low fees</div>
            </div>
          </div>

          {/* Growth Chart */}
          <div className="p-6 md:p-8 rounded-3xl glass border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-white">Low-Cost ETF vs High-Fee Active Fund</h3>
                <p className="text-xs text-white/40">Watch how small differences in expense ratios create enormous wealth gaps over time</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-400" />
                  <span className="text-white/70">ETF Growth</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-400" />
                  <span className="text-white/70">Active Fund</span>
                </div>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={results.chartData}>
                  <defs>
                    <linearGradient id="etfGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="year" stroke="#ffffff40" fontSize={11} tickLine={false} />
                  <YAxis 
                    stroke="#ffffff40" 
                    fontSize={11} 
                    tickLine={false} 
                    tickFormatter={(val) => `${(val / 100000).toFixed(0)}L`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#ffffff20', borderRadius: '1rem' }}
                    formatter={(value: any) => [formatValue(Number(value)), '']}
                  />
                  <Area
                    type="monotone"
                    dataKey="etf"
                    name="ETF Net Value"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#etfGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="active"
                    name="Active Fund Value"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#activeGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Value Breakdown Insight */}
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                The Power of the 1% Fee Difference
              </h4>
              <p className="text-xs text-white/60 leading-relaxed">
                By picking an ETF charging <span className="text-white font-semibold">{expenseRatio}%</span> instead of a standard active fund at <span className="text-white font-semibold">{activeFundExpenseRatio}%</span>, you retain an extra <span className="text-emerald-400 font-bold">{formatValue(results.feeLossToActive)}</span> in your pocket.
              </p>
            </div>
            <div className="space-y-2 border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-4">
              <div className="flex justify-between text-xs py-1 border-b border-white/5">
                <span className="text-white/50">Total Invested Principal</span>
                <span className="font-semibold text-white">{formatValue(results.totalPrincipal)}</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-white/5">
                <span className="text-white/50">Gross Market Wealth</span>
                <span className="font-semibold text-white">{formatValue(results.grossFinalWealth)}</span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-white/50">Total ETF Lifetime TER Cost</span>
                <span className="font-semibold text-blue-400">{formatValue(results.etfTotalFeesPaid)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
