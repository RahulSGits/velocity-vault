import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';
import { Info, Download, Trash2, TrendingUp, Landmark } from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { useCurrency } from '../components/CurrencyContext';

export function CompoundInterest() {
  const { currency, formatValue } = useCurrency();
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(10);
  const [time, setTime] = useState(10);
  const [frequency, setFrequency] = useState(1); // 1 for annual, 12 for monthly, etc.

  const results = useMemo(() => {
    let yearlyData = [];
    let currentAmount = principal;
    const r = rate / 100;
    const n = frequency;
    const t = time;

    for (let year = 1; year <= t; year++) {
      // A = P(1 + r/n)^(nt)
      currentAmount = principal * Math.pow(1 + r / n, n * year);
      yearlyData.push({
        year: `Year ${year}`,
        amount: Math.round(currentAmount),
        interest: Math.round(currentAmount - principal)
      });
    }

    const totalAmount = principal * Math.pow(1 + r / n, n * t);

    return {
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalAmount - principal),
      yearlyData
    };
  }, [principal, rate, time, frequency]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:flex-1 space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Compound Interest</h1>
            <p className="text-white/40 text-sm md:text-base">The eighth wonder of the world. Witness the power of time.</p>
          </div>

          <div className="p-6 md:p-8 glass rounded-[2.5rem] border border-white/10 space-y-8">
            <InputGroup 
              label="Initial Principal" 
              value={principal} 
              onChange={setPrincipal} 
              min={1000} 
              max={10000000} 
              step={1000}
              suffix={currency.symbol}
            />
            <InputGroup 
              label="Interest Rate (%)" 
              value={rate} 
              onChange={setRate} 
              min={1} 
              max={50} 
              step={0.1}
              suffix="%"
            />
            <InputGroup 
              label="Time Period" 
              value={time} 
              onChange={setTime} 
              min={1} 
              max={50} 
              step={1}
              suffix="Years"
            />
            
            <div className="space-y-4">
              <label className="text-sm font-bold text-white/60 uppercase tracking-widest">Compounding Frequency</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Annual', value: 1 },
                  { label: 'Semi-Annual', value: 2 },
                  { label: 'Quarterly', value: 4 },
                  { label: 'Monthly', value: 12 }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setFrequency(item.value)}
                    className={cn(
                      "py-3 px-4 rounded-xl text-xs font-bold transition-all border",
                      frequency === item.value 
                        ? "bg-brand-primary/20 border-brand-primary text-brand-primary" 
                        : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => {
                  setPrincipal(10000);
                  setRate(10);
                  setTime(10);
                  setFrequency(1);
                }}
                className="flex-1 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-white/50 hover:text-white"
              >
                <Trash2 size={18} /> Reset
              </button>
              <button className="flex-1 py-4 rounded-2xl bg-brand-primary font-bold transition-all shadow-lg shadow-brand-primary/20 hover:scale-[1.02] flex items-center justify-center gap-2">
                <Download size={18} /> Export
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:flex-1 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultCard label="Maturity Value" value={formatValue(results.totalAmount)} primary />
            <ResultCard label="Total Interest" value={formatValue(results.totalInterest)} />
          </div>

          <div className="glass rounded-[2.5rem] border border-white/10 p-6 md:p-8 h-[300px] md:h-[400px]">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white/80">
              Wealth Accumulation <TrendingUp size={16} className="text-brand-primary" />
            </h3>
            <div className="h-full pb-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={results.yearlyData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#666' }}
                    formatter={(val: number) => formatValue(val)}
                  />
                  <XAxis dataKey="year" hide />
                  <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-8 glass rounded-[2.5rem] border border-brand-primary/20 bg-brand-primary/5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/20 flex items-center justify-center shrink-0">
                <Info className="text-brand-primary" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">The Rule of 72</h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  Want to know how long it takes to double your money? Divide 72 by your interest rate. At {rate}%, your money doubles every <span className="text-brand-primary font-bold">{(72 / rate).toFixed(1)} years</span>.
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
