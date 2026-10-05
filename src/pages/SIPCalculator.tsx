import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'motion/react';
import { Info, Download, Trash2, ArrowRight, TrendingUp } from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { useCurrency } from '../components/CurrencyContext';

export function SIPCalculator() {
  const { currency, formatValue } = useCurrency();
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [rate, setRate] = useState(12);
  const [duration, setDuration] = useState(10);
  const [stepUp, setStepUp] = useState(0);

  const results = useMemo(() => {
    let totalInvested = 0;
    let currentWealth = 0;
    let monthlyRate = rate / 100 / 12;
    let yearlyData = [];
    let currentMonthly = monthlyInvestment;

    for (let year = 1; year <= duration; year++) {
      for (let month = 1; month <= 12; month++) {
        totalInvested += currentMonthly;
        currentWealth = (currentWealth + currentMonthly) * (1 + monthlyRate);
      }
      yearlyData.push({
        year: `Year ${year}`,
        invested: Math.round(totalInvested),
        wealth: Math.round(currentWealth),
        returns: Math.round(currentWealth - totalInvested)
      });
      currentMonthly = currentMonthly * (1 + stepUp / 100);
    }

    return {
      totalInvested: Math.round(totalInvested),
      totalWealth: Math.round(currentWealth),
      estimatedReturns: Math.round(currentWealth - totalInvested),
      yearlyData
    };
  }, [monthlyInvestment, rate, duration, stepUp]);

  const pieData = [
    { name: 'Total Invested', value: results.totalInvested },
    { name: 'Estimated Returns', value: results.estimatedReturns }
  ];
  const COLORS = ['#ffffff10', '#3b82f6'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Inputs */}
        <div className="w-full lg:flex-1 space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">SIP Calculator</h1>
            <p className="text-white/40 text-sm md:text-base">Wealth is built through discipline. See how your seed grows.</p>
          </div>

          <div className="p-6 md:p-8 glass rounded-[2rem] md:rounded-[2.5rem] border border-white/10 space-y-8">
            <InputGroup 
              label="Monthly Investment" 
              value={monthlyInvestment} 
              onChange={setMonthlyInvestment} 
              min={500} 
              max={1000000} 
              step={500}
              suffix={currency.symbol}
            />
            <InputGroup 
              label="Expected Return Rate (p.a.)" 
              value={rate} 
              onChange={setRate} 
              min={1} 
              max={30} 
              step={0.5}
              suffix="%"
            />
            <InputGroup 
              label="Time Period" 
              value={duration} 
              onChange={setDuration} 
              min={1} 
              max={40} 
              step={1}
              suffix="Years"
            />
            <InputGroup 
              label="Annual Step-Up" 
              value={stepUp} 
              onChange={setStepUp} 
              min={0} 
              max={50} 
              step={1}
              suffix="%"
            />

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => {
                  setMonthlyInvestment(5000);
                  setRate(12);
                  setDuration(10);
                  setStepUp(0);
                }}
                className="flex-1 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-white/50 hover:text-white"
              >
                <Trash2 size={18} /> Reset
              </button>
              <button className="flex-1 py-4 rounded-2xl bg-brand-primary font-bold transition-all shadow-lg shadow-brand-primary/20 hover:scale-[1.02] flex items-center justify-center gap-2">
                <Download size={18} /> Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="w-full lg:flex-1 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultCard label="Total Invested" value={formatValue(results.totalInvested)} />
            <ResultCard label="Est. Returns" value={formatValue(results.estimatedReturns)} />
            <ResultCard label="Total Wealth" value={formatValue(results.totalWealth)} primary />
            <div className="glass rounded-3xl p-6 flex items-center justify-between border border-white/10">
              <div>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Growth Multiplier</p>
                <div className="text-xl md:text-2xl font-display font-bold">{(results.totalWealth / results.totalInvested).toFixed(2)}x</div>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <TrendingUp className="text-cyan-400" size={20} />
              </div>
            </div>
          </div>

          <div className="glass rounded-[2rem] md:rounded-[2.5rem] border border-white/10 p-6 md:p-8 h-[300px] md:h-[400px]">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              Growth Projection <Info size={16} className="text-white/20" />
            </h3>
            <div className="h-full pb-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={results.yearlyData}>
                  <defs>
                    <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                    formatter={(val: number) => formatValue(val)}
                  />
                  <Area type="monotone" dataKey="wealth" stroke="#3b82f6" fillOpacity={1} fill="url(#colorWealth)" strokeWidth={3} />
                  <Area type="monotone" dataKey="invested" stroke="#ffffff30" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass rounded-[2.5rem] border border-white/10 p-8 flex flex-col items-center justify-center">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                      formatter={(val: number) => formatValue(val)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <span className="text-xs text-white/50">Invested</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-primary" />
                  <span className="text-xs text-white/50">Returns</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-6 glass rounded-3xl border border-white/10">
                <h4 className="text-sm font-bold text-white/40 mb-2 uppercase tracking-tight">AI Strategy</h4>
                <p className="text-sm leading-relaxed">
                  With a <span className="text-brand-primary font-bold">{stepUp}%</span> annual increase, you reach your goal <span className="text-cyan-400 font-bold">2.4 years faster</span>.
                </p>
              </div>
              <div className="p-6 glass rounded-3xl border border-brand-primary/20 bg-brand-primary/5">
                <h4 className="text-sm font-bold text-brand-primary mb-2 uppercase tracking-tight">Expert Tip</h4>
                <p className="text-sm leading-relaxed">
                  History shows that increasing your SIP by just 10% yearly can nearly double your wealth over 15 years.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputGroup({ label, value, onChange, min, max, step, suffix }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <label className="text-sm font-bold text-white/60 uppercase tracking-widest">{label}</label>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            value={value} 
            onChange={(e) => onChange(Number(e.target.value))}
            className="bg-transparent text-right font-display text-2xl font-bold w-32 outline-none text-brand-primary"
          />
          <span className="text-white/40 font-bold uppercase text-xs">{suffix}</span>
        </div>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-brand-primary hover:accent-brand-secondary transition-all"
      />
    </div>
  );
}

function ResultCard({ label, value, primary }: { label: string; value: string; primary?: boolean }) {
  return (
    <div className={cn(
      "glass rounded-3xl p-6 border transition-all hover:scale-[1.02]",
      primary ? "border-brand-primary/40 bg-brand-primary/10 shadow-[0_0_30px_rgba(59,130,246,0.1)]" : "border-white/10"
    )}>
      <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
      <div className={cn(
        "text-2xl font-display font-bold leading-tight",
        primary ? "text-white" : "text-white/80"
      )}>{value}</div>
    </div>
  );
}
