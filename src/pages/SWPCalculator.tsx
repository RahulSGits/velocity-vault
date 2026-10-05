import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { motion } from 'motion/react';
import { 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  Download, 
  Calendar, 
  DollarSign, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useCurrency } from '../components/CurrencyContext';

interface YearBreakdown {
  year: number;
  openingBalance: number;
  returnsEarned: number;
  amountWithdrawn: number;
  closingBalance: number;
}

export function SWPCalculator() {
  const { currency, formatValue } = useCurrency();

  const [initialCorpus, setInitialCorpus] = useState(5000000); // 50 Lakhs / 5M
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(35000); // 35k/mo
  const [expectedRate, setExpectedRate] = useState(10); // 10%
  const [durationYears, setDurationYears] = useState(20);
  const [annualStepUp, setAnnualStepUp] = useState(5); // 5% yearly increase in withdrawal to beat inflation

  const swpResults = useMemo(() => {
    let currentBalance = initialCorpus;
    let totalWithdrawn = 0;
    let totalReturnsEarned = 0;
    let monthlyRate = expectedRate / 100 / 12;
    let currentMonthlyWithdrawal = monthlyWithdrawal;
    let yearlyData: {
      year: string;
      balance: number;
      cumulativeWithdrawn: number;
      returnsEarned: number;
    }[] = [];
    let breakdownTable: YearBreakdown[] = [];
    let isDepleted = false;
    let depletionYear = 0;

    for (let year = 1; year <= durationYears; year++) {
      let yearOpening = currentBalance;
      let yearReturns = 0;
      let yearWithdrawn = 0;

      for (let month = 1; month <= 12; month++) {
        if (currentBalance <= 0) {
          if (!isDepleted) {
            isDepleted = true;
            depletionYear = year;
          }
          currentBalance = 0;
          break;
        }

        // Monthly return on beginning balance
        const monthInterest = currentBalance * monthlyRate;
        yearReturns += monthInterest;
        currentBalance += monthInterest;

        // Withdrawal
        const actualWithdrawal = Math.min(currentBalance, currentMonthlyWithdrawal);
        yearWithdrawn += actualWithdrawal;
        totalWithdrawn += actualWithdrawal;
        currentBalance -= actualWithdrawal;
      }

      totalReturnsEarned += yearReturns;

      yearlyData.push({
        year: `Y${year}`,
        balance: Math.max(0, Math.round(currentBalance)),
        cumulativeWithdrawn: Math.round(totalWithdrawn),
        returnsEarned: Math.round(yearReturns),
      });

      breakdownTable.push({
        year,
        openingBalance: Math.round(yearOpening),
        returnsEarned: Math.round(yearReturns),
        amountWithdrawn: Math.round(yearWithdrawn),
        closingBalance: Math.max(0, Math.round(currentBalance)),
      });

      // Increase withdrawal for next year (Step-up inflation adjustment)
      currentMonthlyWithdrawal = currentMonthlyWithdrawal * (1 + annualStepUp / 100);
    }

    const sustainabilityScore = currentBalance > initialCorpus 
      ? 'Growing Perpetually' 
      : currentBalance > 0 
        ? 'Fully Sustainable' 
        : `Depletes in Year ${depletionYear}`;

    return {
      finalBalance: Math.max(0, Math.round(currentBalance)),
      totalWithdrawn: Math.round(totalWithdrawn),
      totalReturnsEarned: Math.round(totalReturnsEarned),
      isDepleted,
      depletionYear,
      sustainabilityScore,
      yearlyData,
      breakdownTable,
    };
  }, [initialCorpus, monthlyWithdrawal, expectedRate, durationYears, annualStepUp]);

  const withdrawalRateAnnual = initialCorpus > 0 ? ((monthlyWithdrawal * 12) / initialCorpus) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <RefreshCw className="w-3.5 h-3.5" />
            Systematic Withdrawal Plan (SWP)
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/5 text-white/50 border border-white/10">
            Retirement & Cash Flow Engine
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-white">
          SWP Calculator
        </h1>
        <p className="text-white/50 text-sm md:text-base mt-1">
          Calculate regular monthly pension/withdrawals from your Mutual Funds, Stocks, or Lump Sum corpus while growing wealth.
        </p>
      </div>

      {/* Preset Rules */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="text-xs font-medium text-white/40 uppercase tracking-wider mr-2">Strategy Presets:</span>
        <button
          onClick={() => {
            setMonthlyWithdrawal(Math.round((initialCorpus * 0.04) / 12));
            setExpectedRate(11);
            setAnnualStepUp(5);
          }}
          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
          4% Rule (FIRE Benchmark)
        </button>
        <button
          onClick={() => {
            setMonthlyWithdrawal(Math.round((initialCorpus * 0.06) / 12));
            setExpectedRate(12);
            setAnnualStepUp(0);
          }}
          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all"
        >
          6% Balanced Income
        </button>
        <button
          onClick={() => {
            setMonthlyWithdrawal(Math.round((initialCorpus * 0.08) / 12));
            setExpectedRate(10);
            setAnnualStepUp(3);
          }}
          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all"
        >
          High Monthly Cashflow (8%)
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 md:p-8 rounded-3xl glass border border-white/10 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center justify-between">
              <span>Investment & Payout Setup</span>
              <span className="text-xs font-medium text-cyan-400">
                {withdrawalRateAnnual.toFixed(1)}% Annualized
              </span>
            </h2>

            {/* Total Investment / Corpus */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Initial Investment Corpus</span>
                <span className="font-bold text-white text-base">{formatValue(initialCorpus)}</span>
              </div>
              <input
                type="range"
                min={100000}
                max={50000000}
                step={50000}
                value={initialCorpus}
                onChange={(e) => setInitialCorpus(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-white/30">
                <span>{formatValue(100000)}</span>
                <span>{formatValue(50000000)}</span>
              </div>
            </div>

            {/* Monthly Withdrawal */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Monthly Withdrawal (SWP)</span>
                <span className="font-bold text-cyan-400 text-base">{formatValue(monthlyWithdrawal)} / mo</span>
              </div>
              <input
                type="range"
                min={1000}
                max={500000}
                step={1000}
                value={monthlyWithdrawal}
                onChange={(e) => setMonthlyWithdrawal(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-white/30">
                <span>{formatValue(1000)}/mo</span>
                <span>{formatValue(500000)}/mo</span>
              </div>
            </div>

            {/* Expected Return Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Expected Annual Return (CAGR)</span>
                <span className="font-bold text-white text-base">{expectedRate}% p.a.</span>
              </div>
              <input
                type="range"
                min={4}
                max={20}
                step={0.5}
                value={expectedRate}
                onChange={(e) => setExpectedRate(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-white/30">
                <span>4% (Conservative)</span>
                <span>20% (Equity Growth)</span>
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Withdrawal Time Horizon</span>
                <span className="font-bold text-white text-base">{durationYears} Years</span>
              </div>
              <input
                type="range"
                min={1}
                max={40}
                step={1}
                value={durationYears}
                onChange={(e) => setDurationYears(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-white/30">
                <span>1 Year</span>
                <span>40 Years</span>
              </div>
            </div>

            {/* Annual Inflation Step-Up */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Annual Step-Up on Withdrawal</span>
                <span className="font-bold text-amber-400 text-base">+{annualStepUp}% / yr</span>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                step={1}
                value={annualStepUp}
                onChange={(e) => setAnnualStepUp(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <p className="text-[11px] text-white/40">
                Increases monthly payout yearly to match rising inflation and living expenses.
              </p>
            </div>
          </div>

          {/* Sustainability Status Card */}
          <div className={cn(
            "p-6 rounded-3xl border transition-all",
            swpResults.isDepleted
              ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
              : swpResults.finalBalance > initialCorpus
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
          )}>
            <div className="flex items-center gap-3">
              {swpResults.isDepleted ? (
                <AlertTriangle className="w-6 h-6 shrink-0" />
              ) : (
                <ShieldCheck className="w-6 h-6 shrink-0" />
              )}
              <div>
                <h4 className="font-bold text-base text-white">Corpus Status: {swpResults.sustainabilityScore}</h4>
                <p className="text-xs text-white/70 mt-0.5">
                  {swpResults.isDepleted
                    ? `Warning: At this withdrawal rate, your portfolio runs out around Year ${swpResults.depletionYear}. Consider reducing monthly withdrawal or stepping up returns.`
                    : `Excellent! Your portfolio survives through all ${durationYears} years and still leaves a terminal corpus of ${formatValue(swpResults.finalBalance)}.`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results & Visualizer Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl glass border border-white/10 relative overflow-hidden">
              <div className="text-xs font-semibold text-white/40 uppercase tracking-wider">Total Withdrawn</div>
              <div className="text-2xl font-bold text-cyan-400 mt-1">{formatValue(swpResults.totalWithdrawn)}</div>
              <div className="text-[11px] text-white/50 mt-1">Paid out into your bank</div>
              <div className="absolute right-3 bottom-3 opacity-10 text-cyan-400">
                <RefreshCw className="w-12 h-12" />
              </div>
            </div>

            <div className="p-6 rounded-2xl glass border border-white/10 relative overflow-hidden">
              <div className="text-xs font-semibold text-white/40 uppercase tracking-wider">Returns Generated</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{formatValue(swpResults.totalReturnsEarned)}</div>
              <div className="text-[11px] text-white/50 mt-1">Compounded market gains</div>
              <div className="absolute right-3 bottom-3 opacity-10 text-emerald-400">
                <TrendingUp className="w-12 h-12" />
              </div>
            </div>

            <div className="p-6 rounded-2xl glass border border-white/10 relative overflow-hidden">
              <div className="text-xs font-semibold text-white/40 uppercase tracking-wider">Final Corpus Balance</div>
              <div className="text-2xl font-bold text-white mt-1">{formatValue(swpResults.finalBalance)}</div>
              <div className="text-[11px] text-white/50 mt-1">Remaining principal</div>
              <div className="absolute right-3 bottom-3 opacity-10 text-white">
                <DollarSign className="w-12 h-12" />
              </div>
            </div>
          </div>

          {/* Interactive Trajectory Chart */}
          <div className="p-6 md:p-8 rounded-3xl glass border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-white">Corpus & Payout Trajectory</h3>
                <p className="text-xs text-white/40">Watch your remaining balance vs cumulative payouts over {durationYears} years</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-cyan-400" />
                  <span className="text-white/70">Remaining Corpus</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-white/70">Total Withdrawn</span>
                </div>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={swpResults.yearlyData}>
                  <defs>
                    <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="withdrawnGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
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
                    dataKey="balance"
                    name="Remaining Corpus"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#corpusGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulativeWithdrawn"
                    name="Total Withdrawn"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#withdrawnGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Year by Year Breakdown Table */}
          <div className="p-6 rounded-3xl glass border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>Annual Cash Flow Breakdown</span>
              <span className="text-xs font-normal text-white/40">Showing first {Math.min(10, durationYears)} years</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 pb-2">
                    <th className="py-2.5 font-semibold">Year</th>
                    <th className="py-2.5 font-semibold">Opening Balance</th>
                    <th className="py-2.5 font-semibold">Returns Earned</th>
                    <th className="py-2.5 font-semibold text-cyan-400">Total Withdrawn</th>
                    <th className="py-2.5 font-semibold text-right">Closing Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {swpResults.breakdownTable.slice(0, 10).map((row) => (
                    <tr key={row.year} className="hover:bg-white/[0.02]">
                      <td className="py-2.5 font-medium text-white/80">Year {row.year}</td>
                      <td className="py-2.5 text-white/60">{formatValue(row.openingBalance)}</td>
                      <td className="py-2.5 text-emerald-400">+{formatValue(row.returnsEarned)}</td>
                      <td className="py-2.5 text-cyan-400 font-semibold">-{formatValue(row.amountWithdrawn)}</td>
                      <td className="py-2.5 text-right font-bold text-white">{formatValue(row.closingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
