import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Info, TrendingUp, AlertTriangle, ArrowRight, Activity } from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { useCurrency } from '../components/CurrencyContext';

export function InflationCalculator() {
  const { currency, formatValue } = useCurrency();
  const [currentValue, setCurrentValue] = useState(100000);
  const [inflationRate, setInflationRate] = useState(6);
  const [years, setYears] = useState(10);

  const results = useMemo(() => {
    // FV = PV * (1 + r)^n
    const futureValue = currentValue * Math.pow(1 + inflationRate / 100, years);
    // Purchasing Power: PV = FV / (1 + r)^n
    const purchasingPower = currentValue / Math.pow(1 + inflationRate / 100, years);

    return { futureValue, purchasingPower };
  }, [currentValue, inflationRate, years]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:flex-1 space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Inflation Calculator</h1>
            <p className="text-white/40 text-sm md:text-base">The silent wealth killer. See what your money will buy in the future.</p>
          </div>

          <div className="p-6 md:p-8 glass rounded-[2.5rem] border border-white/10 space-y-8">
            <InputGroup 
              label="Current Value" 
              value={currentValue} 
              onChange={setCurrentValue} 
              min={1000} 
              max={10000000} 
              step={1000}
              suffix={currency.symbol}
            />
            <InputGroup 
              label="Expected Inflation (p.a.)" 
              value={inflationRate} 
              onChange={setInflationRate} 
              min={1} 
              max={25} 
              step={0.1}
              suffix="%"
            />
            <InputGroup 
              label="Time Horizon" 
              value={years} 
              onChange={setYears} 
              min={1} 
              max={50} 
              step={1}
              suffix="Years"
            />
          </div>

          <div className="p-8 glass rounded-[2.5rem] border border-red-500/20 bg-red-500/5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="text-red-400" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-red-100">Erosion Alert</h4>
                <p className="text-white/40 text-sm leading-relaxed">
                  In {years} years, <span className="text-white font-bold">{formatValue(currentValue)}</span> will have the purchasing power of only <span className="text-red-400 font-bold">{formatValue(results.purchasingPower)}</span> today.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:flex-1 space-y-8">
          <div className="space-y-6">
            <div className="p-10 rounded-[3rem] glass border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity size={120} className="text-brand-primary" />
              </div>
              <div className="relative z-10">
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Future Cost of Same Lifestyle</p>
                <h3 className="text-5xl font-display font-black text-white mb-4">{formatValue(results.futureValue)}</h3>
                <p className="text-sm text-white/60 max-w-sm">
                  To maintain the same lifestyle you have today at {formatValue(currentValue)}, you will need {formatValue(results.futureValue)} in {years} years.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-8 rounded-[2.5rem] glass border border-white/10">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Capped Growth</p>
                <div className="text-2xl font-display font-bold text-white/80">{(results.futureValue / currentValue).toFixed(2)}x Cost Rise</div>
              </div>
              <div className="p-8 rounded-[2.5rem] glass border border-white/10">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Value Loss</p>
                <div className="text-2xl font-display font-bold text-red-500">-{((1 - results.purchasingPower / currentValue) * 100).toFixed(1)}% Power</div>
              </div>
            </div>
          </div>

          <div className="p-8 glass rounded-[2.5rem] border border-blue-500/20 bg-blue-500/5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center shrink-0">
                <TrendingUp className="text-blue-400" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Fighting Inflation</h4>
                <p className="text-white/40 text-sm leading-relaxed">
                  To beat inflation, your investments must earn at least <span className="text-blue-400 font-bold">{inflationRate * 1.5}%</span> annually to build real wealth, accounting for taxes and price rises.
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
        className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-brand-primary"
      />
    </div>
  );
}
