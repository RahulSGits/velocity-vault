import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Info, Download, Trash2, BarChart2, TrendingUp, Presentation } from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { useCurrency } from '../components/CurrencyContext';

export function CagriCalculator() {
  const { currency, formatValue } = useCurrency();
  const [initialValue, setInitialValue] = useState(100000);
  const [finalValue, setFinalValue] = useState(250000);
  const [years, setYears] = useState(5);

  const results = useMemo(() => {
    // CAGR = (Final Value / Initial Value) ^ (1 / Number of Years) - 1
    const cagr = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
    const totalReturn = ((finalValue - initialValue) / initialValue) * 100;

    let growthData = [];
    const annualRate = cagr / 100;
    for (let i = 0; i <= years; i++) {
        growthData.push({
            year: `Year ${i}`,
            value: Math.round(initialValue * Math.pow(1 + annualRate, i))
        });
    }

    return { cagr, totalReturn, growthData };
  }, [initialValue, finalValue, years]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:flex-1 space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Stock CAGR Calculator</h1>
            <p className="text-white/40 text-sm md:text-base">Compound Annual Growth Rate. The most accurate way to measure equity returns.</p>
          </div>

          <div className="p-6 md:p-8 glass rounded-[2.5rem] border border-white/10 space-y-8">
            <InputGroup 
              label="Initial Investment" 
              value={initialValue} 
              onChange={setInitialValue} 
              min={100} 
              max={10000000} 
              step={1000}
              suffix={currency.symbol}
            />
            <InputGroup 
              label="Final Value" 
              value={finalValue} 
              onChange={setFinalValue} 
              min={100} 
              max={100000000} 
              step={1000}
              suffix={currency.symbol}
            />
            <InputGroup 
              label="Time Duration" 
              value={years} 
              onChange={setYears} 
              min={1} 
              max={50} 
              step={1}
              suffix="Years"
            />
          </div>
        </div>

        <div className="w-full lg:flex-1 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="p-10 rounded-[3rem] glass border border-brand-primary/40 bg-brand-primary/10 flex flex-col justify-center">
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">CAGR per year</p>
                <h3 className="text-5xl font-display font-black text-brand-primary">{results.cagr.toFixed(2)}%</h3>
             </div>
             <div className="space-y-4">
                <ResultCard label="Total Absolute Return" value={`${results.totalReturn.toFixed(1)}%`} />
                <div className="p-6 glass rounded-3xl border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Growth Index</p>
                    <div className="text-xl font-display font-bold">{(finalValue / initialValue).toFixed(2)}x</div>
                  </div>
                  <BarChart2 className="text-white/20" />
                </div>
             </div>
          </div>

          <div className="glass rounded-[2.5rem] border border-white/10 p-6 md:p-8 h-[300px]">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white/80">
              Return Trajectory <Presentation size={16} className="text-brand-primary" />
            </h3>
            <div className="h-full pb-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={results.growthData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                    formatter={(val: number) => formatValue(val)}
                  />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
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
        className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-brand-primary transition-all"
      />
    </div>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-3xl p-6 border border-white/10 transition-all hover:scale-[1.02]">
      <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
      <div className="text-2xl font-display font-bold leading-tight text-white/80">{value}</div>
    </div>
  );
}
