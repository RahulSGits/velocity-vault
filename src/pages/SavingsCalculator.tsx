import React, { useState, useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { motion } from 'motion/react';
import { PiggyBank, Target, Calendar, Coins, Sparkles } from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { useCurrency } from '../components/CurrencyContext';

export function SavingsCalculator() {
  const { currency, formatValue } = useCurrency();
  const [savingsAmt, setSavingsAmt] = useState(1000);
  const [frequency, setFrequency] = useState('monthly');
  const [rate, setRate] = useState(5);
  const [duration, setDuration] = useState(5);

  const results = useMemo(() => {
    let freqMultiplier = frequency === 'monthly' ? 12 : frequency === 'weekly' ? 52 : 1;
    let totalDeposits = 0;
    let currentValue = 0;
    let periods = duration * freqMultiplier;
    let ratePerPeriod = rate / 100 / freqMultiplier;
    let chartData = [];

    for (let p = 1; p <= periods; p++) {
      totalDeposits += savingsAmt;
      currentValue = (currentValue + savingsAmt) * (1 + ratePerPeriod);
      
      if (p % (freqMultiplier === 52 ? 4 : 1) === 0) {
        chartData.push({
          period: p,
          value: Math.round(currentValue),
          deposits: Math.round(totalDeposits)
        });
      }
    }

    return {
      totalDeposits: Math.round(totalDeposits),
      futureValue: Math.round(currentValue),
      interestEarned: Math.round(currentValue - totalDeposits),
      chartData
    };
  }, [savingsAmt, frequency, rate, duration]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Settings */}
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-bold">Savings Planner</h1>
            <p className="text-white/40">Project your future wealth with precision.</p>
          </div>

          <div className="p-8 glass rounded-[2.5rem] border border-white/10 space-y-8">
            <div className="space-y-4">
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest flex justify-between">
                Savings Amount <span>{currency.symbol}</span>
              </label>
              <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  value={savingsAmt} 
                  onChange={(e) => setSavingsAmt(Number(e.target.value))}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 w-full text-2xl font-display font-bold outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Frequency</label>
              <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
                {['weekly', 'monthly', 'yearly'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFrequency(f)}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all",
                      frequency === f ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <SliderGroup label="Interest Rate" min={1} max={15} step={0.1} value={rate} onChange={setRate} suffix="%" />
            <SliderGroup label="Duration" min={1} max={30} step={1} value={duration} onChange={setDuration} suffix="Yrs" />
          </div>

          {/* Visual Jar - 3D approximation */}
          <div className="glass rounded-[2.5rem] p-8 border border-white/10 flex flex-col items-center">
            <div className="relative w-32 h-40 border-2 border-white/20 rounded-b-3xl rounded-t-xl overflow-hidden mb-6">
              <motion.div 
                initial={false}
                animate={{ height: `${Math.min(100, (results.futureValue / (100000 / currency.rate)) * 100)}%` }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-primary/80 to-brand-accent/50 filter blur-[2px]"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <Coins size={48} className="text-white" />
              </div>
            </div>
            <p className="text-white/40 text-xs font-bold uppercase tracking-tight">Capacity Visualization</p>
          </div>
        </div>

        {/* Analytics */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SavingsCard icon={Target} label="Future Value" value={formatValue(results.futureValue)} color="cyan" primary />
            <SavingsCard icon={Coins} label="Total Deposits" value={formatValue(results.totalDeposits)} color="white" />
            <SavingsCard icon={Sparkles} label="Interest Earned" value={formatValue(results.interestEarned)} color="purple" />
          </div>

          <div className="glass rounded-[2.5rem] border border-white/10 p-10 h-[450px] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <PiggyBank size={120} />
            </div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-2xl font-bold">Accumulation Strategy</h3>
                  <p className="text-white/40 text-sm">Interactive growth timeline over {duration} years.</p>
                </div>
                <div className="text-right">
                  <div className="text-brand-accent font-display text-3xl font-bold tracking-tighter">
                    +{((results.interestEarned / results.totalDeposits) * 100).toFixed(1)}%
                  </div>
                  <div className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Bonus Interest</div>
                </div>
              </div>
              
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results.chartData}>
                    <XAxis dataKey="period" hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '16px' }}
                      formatter={(val: number) => formatValue(val)}
                      labelStyle={{ display: 'none' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={4} fill="url(#savingsGradient)" />
                    <defs>
                      <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-8 glass rounded-[2.5rem] border border-white/10 flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand-primary">
                <Calendar size={24} />
              </div>
              <div>
                <h4 className="font-bold mb-2">Milestone Tracking</h4>
                <p className="text-sm text-white/50 leading-relaxed">
                  At this rate, you'll cross the <span className="text-white font-bold">{formatValue(results.futureValue / 2)}</span> mark in roughly <span className="text-cyan-400 font-bold">{(duration / 1.8).toFixed(1)} years</span>.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-8 glass rounded-[2.5rem] border border-white/10 flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand-secondary">
                <Sparkles size={24} />
              </div>
              <div>
                <h4 className="font-bold mb-2">Wealth Accelerator</h4>
                <p className="text-sm text-white/50 leading-relaxed">
                  Switching to <span className="text-brand-secondary font-bold">Weekly</span> frequency could net you an extra <span className="text-white font-bold">{formatValue(1240 * currency.rate)}</span> due to more frequent compounding.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderGroup({ label, min, max, step, value, onChange, suffix }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center whitespace-nowrap overflow-hidden">
        <label className="text-xs font-bold text-white/50 uppercase tracking-widest">{label}</label>
        <span className="text-lg font-display font-bold text-brand-primary truncate">{value}{suffix}</span>
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

function SavingsCard({ icon: Icon, label, value, color, primary }: any) {
  const colorMap: any = {
    cyan: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20 shadow-cyan-400/10",
    purple: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    white: "text-white bg-white/5 border-white/10",
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={cn(
        "p-6 rounded-3xl border transition-all",
        colorMap[color],
        primary && "shadow-lg scale-105"
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <Icon size={18} className="opacity-70" />
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{label}</span>
      </div>
      <div className="text-2xl font-display font-bold truncate">{value}</div>
    </motion.div>
  );
}
