import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, Target, Trophy, TrendingUp, CheckCircle2 } from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { useCurrency } from '../components/CurrencyContext';

const GOALS = [
  { id: 'crorepati', title: 'Become Crorepati', target: 10000000, icon: Trophy, color: 'brand-primary' },
  { id: 'fire', title: 'FIRE (Early Retirement)', target: 50000000, icon: Sparkles, color: 'emerald-500' },
  { id: 'world_trip', title: 'World Trip Fund', target: 2000000, icon: Target, color: 'cyan-400' },
];

export function WealthGoals() {
  const { currency, formatValue } = useCurrency();
  const [selectedGoal, setSelectedGoal] = useState(GOALS[0]);
  const [monthlySaving, setMonthlySaving] = useState(10000);
  const [expectedRate, setExpectedRate] = useState(12);

  const results = useMemo(() => {
    let currentWealth = 0;
    let months = 0;
    const monthlyRate = expectedRate / 100 / 12;
    let chartData = [];

    while (currentWealth < selectedGoal.target && months < 600) { // Max 50 years
        months++;
        currentWealth = (currentWealth + monthlySaving) * (1 + monthlyRate);
        
        if (months % 12 === 0 || currentWealth >= selectedGoal.target) {
            chartData.push({
                year: `Year ${Math.round(months / 12)}`,
                wealth: Math.round(currentWealth)
            });
        }
    }

    return { 
        years: (months / 12).toFixed(1),
        totalInvested: Math.round(monthlySaving * months),
        totalMonths: months,
        chartData
    };
  }, [selectedGoal, monthlySaving, expectedRate]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
         <h1 className="text-4xl md:text-5xl font-display font-black mb-4">Vision <span className="text-brand-primary">Board</span></h1>
         <p className="text-white/40 max-w-xl">Gamified wealth targets. Track your journey to significant financial milestones.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
           {GOALS.map(goal => (
              <button
                key={goal.id}
                onClick={() => setSelectedGoal(goal)}
                className={cn(
                  "w-full p-8 rounded-[2.5rem] glass border transition-all text-left group",
                  selectedGoal.id === goal.id 
                    ? `border-${goal.color}/40 bg-${goal.color}/10 shadow-lg` 
                    : "border-white/10 hover:bg-white/5 opacity-60 hover:opacity-100"
                )}
              >
                <div className="flex justify-between items-start mb-4">
                   <div className={cn(
                     "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                     selectedGoal.id === goal.id ? `bg-${goal.color}/20 text-${goal.color}` : "bg-white/10 text-white/40"
                   )}>
                      <goal.icon size={28} />
                   </div>
                   {selectedGoal.id === goal.id && <CheckCircle2 className="text-white" size={20} />}
                </div>
                <h3 className="text-xl font-bold mb-1">{goal.title}</h3>
                <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Target: {formatValue(goal.target)}</p>
              </button>
           ))}
        </div>

        <div className="lg:col-span-2 space-y-8">
           <div className="p-8 md:p-12 glass rounded-[3rem] border border-white/10">
              <h3 className="text-2xl font-bold mb-10 flex items-center gap-3">
                 <Target className="text-brand-primary" /> Roadmap to {formatValue(selectedGoal.target)}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                 <div className="space-y-8">
                    <InputBox 
                      label="Monthly Contribution" 
                      value={monthlySaving} 
                      onChange={setMonthlySaving} 
                      min={1000} 
                      max={500000} 
                      step={1000}
                      suffix={currency.symbol}
                    />
                    <InputBox 
                      label="Expected Returns" 
                      value={expectedRate} 
                      onChange={setExpectedRate} 
                      min={1} 
                      max={30} 
                      step={1}
                      suffix="%"
                    />
                 </div>

                 <div className="flex flex-col justify-center items-center text-center p-8 bg-black/20 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                    <div className="relative z-10">
                       <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-2">Time to Reach Goal</p>
                       <div className="text-6xl font-display font-black text-brand-primary mb-2 tracking-tighter">
                          {results.years}<span className="text-xl">yrs</span>
                       </div>
                       <p className="text-xs text-white/30">Based on compounding returns</p>
                    </div>
                 </div>
              </div>

              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results.chartData}>
                    <defs>
                      <linearGradient id="colorGoal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                       formatter={(val: number) => formatValue(val)}
                    />
                    <Area type="monotone" dataKey="wealth" stroke="#3b82f6" fillOpacity={1} fill="url(#colorGoal)" strokeWidth={4} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="p-8 glass rounded-[2.5rem] border border-brand-primary/20 bg-brand-primary/5 flex items-center justify-between">
              <div className="space-y-1">
                 <h4 className="font-bold text-lg">Invested Capital</h4>
                 <p className="text-white/40 text-sm">Amount you put in over {results.years} years</p>
              </div>
              <div className="text-3xl font-display font-bold">{formatValue(results.totalInvested)}</div>
           </div>
        </div>
      </div>
    </div>
  );
}

function InputBox({ label, value, onChange, min, max, step, suffix }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <label className="text-sm font-bold text-white/40 uppercase tracking-widest">{label}</label>
        <div className="text-lg font-bold text-brand-primary">{value} <span className="text-[10px] text-white/20">{suffix}</span></div>
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
