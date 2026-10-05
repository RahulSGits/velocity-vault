import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'motion/react';
import { User, Flag, ShieldCheck, Activity, Brain, ArrowUpRight } from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { useCurrency } from '../components/CurrencyContext';

export function RetirementPlanner() {
  const { currency, formatValue } = useCurrency();
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlyExpenses, setMonthlyExpenses] = useState(2000);
  const [inflation, setInflation] = useState(5);
  const [returns, setReturns] = useState(10);
  const [savings, setSavings] = useState(50000);

  const results = useMemo(() => {
    const yearsToRetire = retirementAge - currentAge;
    const lifeExpectancy = 85;
    const yearsInRetirement = lifeExpectancy - retirementAge;

    // 1. Calculate future expenses at retirement (Inflation adjusted)
    const futureMonthlyExp = monthlyExpenses * Math.pow(1 + inflation / 100, yearsToRetire);
    const annualExpAtRetirement = futureMonthlyExp * 12;

    // 2. Calculate Required Corpus (using safe withdrawal rate concept or annuity formula)
    const postRetirementReturn = 6; // 6% nominal
    const realReturn = (1 + postRetirementReturn / 100) / (1 + inflation / 100) - 1;
    const requiredCorpus = annualExpAtRetirement * ((1 - Math.pow(1 + realReturn, -yearsInRetirement)) / realReturn);

    // 3. Project current savings growth
    const projectedSavings = savings * Math.pow(1 + returns / 100, yearsToRetire);

    // 4. Monthly Investment Need
    const gap = Math.max(0, requiredCorpus - projectedSavings);
    const r = returns / 100 / 12;
    const n = yearsToRetire * 12;
    const monthlyNeeded = gap * r / (Math.pow(1 + r, n) - 1);

    // Timeline Data
    let timeline = [];
    let currentVal = savings;
    let currentAnnualExp = annualExpAtRetirement;
    const monthlyRate = returns / 100 / 12;
    const retirementMonthlyRate = postRetirementReturn / 100 / 12;
    const inflationMonthlyRate = inflation / 100 / 12;

    for (let yr = 0; yr <= yearsToRetire + yearsInRetirement; yr++) {
      const age = currentAge + yr;
      
      if (age <= retirementAge) {
        // Build-up phase: Monthly compounding for 12 months
        for (let m = 0; m < 12; m++) {
          currentVal = (currentVal + (monthlyNeeded || 0)) * (1 + monthlyRate);
        }
      } else {
        // Retirement phase: Monthly compounding + Monthly withdrawals
        for (let m = 0; m < 12; m++) {
          currentVal = (currentVal - (currentAnnualExp / 12)) * (1 + retirementMonthlyRate);
        }
        // Inflation adjustment for the NEXT year's expenses
        currentAnnualExp *= (1 + inflation / 100);
      }
      
      timeline.push({
        age,
        wealth: Math.max(0, Math.round(currentVal)),
        threshold: Math.round(requiredCorpus)
      });
    }

    const readinessScore = Math.min(100, Math.round((projectedSavings / requiredCorpus) * 100));

    return {
      requiredCorpus: Math.round(requiredCorpus),
      monthlyNeeded: Math.round(monthlyNeeded),
      yearsToRetire,
      futureMonthlyExp: Math.round(futureMonthlyExp),
      readinessScore,
      timeline
    };
  }, [currentAge, retirementAge, monthlyExpenses, inflation, returns, savings]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Profile Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary flex-shrink-0">
              <User size={20} className="md:size-24" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold">Retirement Hub</h1>
              <p className="text-white/40 text-xs md:text-sm">Design your freedom timeline.</p>
            </div>
          </div>

          <div className="p-6 md:p-8 glass rounded-[2rem] md:rounded-[2.5rem] border border-white/10 space-y-6 md:space-y-8">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <MiniInput label="Current Age" value={currentAge} onChange={setCurrentAge} min={18} max={65} />
              <MiniInput label="Retire Age" value={retirementAge} onChange={setRetirementAge} min={currentAge + 1} max={75} />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex justify-between">
                Monthly Exp <span>{currency.symbol}</span>
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="number" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 md:p-4 text-2xl md:text-3xl font-display font-bold outline-none text-white w-full"
                />
              </div>
            </div>

            <SliderGroup label="Inflation rate" value={inflation} onChange={setInflation} min={2} max={10} suffix="%" />
            <SliderGroup label="Exp Returns" value={returns} onChange={setReturns} min={3} max={15} suffix="%" />
            <SliderGroup 
              label="Current Corpus" 
              value={savings} 
              onChange={setSavings} 
              min={0} 
              max={5000000} 
              step={10000} 
              suffix={currency.symbol} 
              isCurrency 
              formatValue={formatValue}
            />
          </div>
        </div>

        {/* Projections */}
        <div className="lg:col-span-8 space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="p-6 md:p-8 glass rounded-[2rem] md:rounded-[2.5rem] border border-white/10 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 hidden sm:block">
                <Flag size={80} />
              </div>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1 md:mb-2">Required Corpus</p>
              <div className="text-3xl md:text-4xl font-display font-black text-brand-primary mb-2 md:mb-3">{formatValue(results.requiredCorpus)}</div>
              <p className="text-xs md:text-sm text-white/50 leading-relaxed">
                Adjusted for inflation, you'll need <span className="text-white">{formatValue(results.futureMonthlyExp)}/mo</span> to maintain your lifestyle.
              </p>
            </div>

            <div className="p-6 md:p-8 glass rounded-[2rem] md:rounded-[2.5rem] border border-purple-500/20 bg-purple-500/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 hidden sm:block">
                <Brain size={80} />
              </div>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1 md:mb-2">Readiness Score</p>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl md:text-5xl font-display font-black text-purple-400">{results.readinessScore}%</div>
                <div className="text-[10px] font-bold uppercase text-purple-400/50">of target</div>
              </div>
              <div className="mt-4 w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${results.readinessScore}%` }}
                  className="h-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]"
                />
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10 glass rounded-[2rem] md:rounded-[2.5rem] border border-white/10 h-[300px] md:h-[400px]">
            <h3 className="text-lg md:text-xl font-bold mb-6 md:mb-8 flex items-center gap-2">
              Wealth Lifecycle <ArrowUpRight size={18} className="text-brand-accent" />
            </h3>
            <div className="h-full pb-8 md:pb-12">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={results.timeline}>
                  <XAxis dataKey="age" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '16px' }}
                    formatter={(val: number) => formatValue(val)}
                  />
                  <Area type="monotone" dataKey="wealth" stroke="#8b5cf6" strokeWidth={3} fill="url(#retirementGrad)" />
                  <defs>
                    <linearGradient id="retirementGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 md:p-8 glass rounded-[2rem] md:rounded-[3rem] border border-brand-accent/20 bg-brand-accent/5 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="space-y-1 md:space-y-2 text-center md:text-left">
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Recommended Action</p>
              <h3 className="text-xl md:text-2xl font-bold">Invest <span className="text-brand-accent">{formatValue(results.monthlyNeeded)}</span> / Monthly</h3>
              <p className="text-white/50 text-xs md:text-sm">To bridge the gap and secure your goal.</p>
            </div>
            <button className="w-full md:w-auto px-8 py-4 rounded-xl md:rounded-2xl bg-brand-accent text-black font-bold md:font-black uppercase text-xs md:text-sm tracking-widest shadow-lg shadow-brand-accent/25 hover:scale-105 active:scale-95 transition-all">
              Optimize Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniInput({ label, value, onChange, min, max }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</label>
      <input 
        type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} min={min} max={max}
        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 font-bold outline-none focus:border-brand-primary text-white"
      />
    </div>
  );
}

function SliderGroup({ label, min, max, step = 1, value, onChange, suffix, isCurrency, formatValue }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-sm">
        <label className="text-white/40 font-bold uppercase tracking-widest text-[10px]">{label}</label>
        <span className="text-brand-primary font-bold">{isCurrency && formatValue ? formatValue(value) : `${value}${suffix}`}</span>
      </div>
      <input 
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-brand-primary"
      />
    </div>
  );
}
