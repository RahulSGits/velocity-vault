import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Info, Download, Trash2, CreditCard, AlertCircle, TrendingDown, ArrowRight } from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { useCurrency } from '../components/CurrencyContext';

export function CreditCardCalculator() {
  const { currency, formatValue } = useCurrency();
  const [balance, setBalance] = useState(50000);
  const [rate, setRate] = useState(36); // Typical credit card interest is 36-48% p.a.
  const [monthlyPayment, setMonthlyPayment] = useState(2500);

  const results = useMemo(() => {
    let currentBalance = balance;
    let totalInterest = 0;
    let months = 0;
    let chartData = [];
    const monthlyRate = rate / 100 / 12;

    // Safety break to prevent infinite loops if payment < interest
    const interestFirstMonth = balance * monthlyRate;
    if (monthlyPayment <= interestFirstMonth) {
      return { 
        impossible: true, 
        interestFirstMonth,
        totalInterest: Infinity,
        months: Infinity,
        chartData: []
      };
    }

    while (currentBalance > 0 && months < 360) { // Max 30 years
        months++;
        const interest = currentBalance * monthlyRate;
        totalInterest += interest;
        currentBalance = (currentBalance + interest) - monthlyPayment;
        
        if (currentBalance < 0) currentBalance = 0;
        
        if (months % 6 === 0 || currentBalance === 0) {
            chartData.push({
                month: `Month ${months}`,
                balance: Math.round(currentBalance)
            });
        }
    }

    return { 
        impossible: false, 
        totalInterest: Math.round(totalInterest), 
        months, 
        totalPaid: Math.round(balance + totalInterest),
        chartData 
    };
  }, [balance, rate, monthlyPayment]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:flex-1 space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Debt Payoff Toolkit</h1>
            <p className="text-white/40 text-sm md:text-base">Visualize the cost of credit card interest and plan your escape.</p>
          </div>

          <div className="p-6 md:p-8 glass rounded-[2.5rem] border border-white/10 space-y-8">
            <InputGroup 
              label="Outstanding Balance" 
              value={balance} 
              onChange={setBalance} 
              min={1000} 
              max={1000000} 
              step={1000}
              suffix={currency.symbol}
            />
            <InputGroup 
              label="Interest Rate (p.a.)" 
              value={rate} 
              onChange={setRate} 
              min={12} 
              max={60} 
              step={1}
              suffix="%"
            />
            <InputGroup 
              label="Monthly Payment" 
              value={monthlyPayment} 
              onChange={setMonthlyPayment} 
              min={500} 
              max={balance} 
              step={100}
              suffix={currency.symbol}
            />
          </div>

          {results.impossible ? (
            <div className="p-8 glass rounded-[2.5rem] border border-red-500/20 bg-red-500/5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center shrink-0">
                    <AlertCircle className="text-red-400" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-red-100">Debt Trap Detected</h4>
                    <p className="text-white/40 text-sm leading-relaxed">
                      Your monthly payment of {formatValue(monthlyPayment)} is less than the monthly interest of <span className="text-red-400 font-bold">{formatValue(results.interestFirstMonth || 0)}</span>. Your balance will keep growing.
                    </p>
                  </div>
                </div>
              </div>
          ) : (
            <div className="p-8 glass rounded-[3rem] bg-emerald-500/10 border border-emerald-500/20">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <TrendingDown className="text-emerald-400" size={24} />
                  </div>
                  <h4 className="font-bold text-xl text-emerald-100">Freedom Timeline</h4>
               </div>
               <p className="text-white/60 mb-6 font-display text-lg">
                  You will be debt-free in <span className="text-white font-bold">{Math.floor(results.months / 12)} years {results.months % 12} months</span>.
               </p>
               <div className="flex gap-4">
                  <div className="flex-1 p-4 bg-black/20 rounded-2xl">
                     <p className="text-[10px] uppercase font-bold text-white/30 mb-1">Total Principal</p>
                     <p className="font-bold">{formatValue(balance)}</p>
                  </div>
                   <div className="flex-1 p-4 bg-black/20 rounded-2xl">
                     <p className="text-[10px] uppercase font-bold text-white/30 mb-1">Total Interest</p>
                     <p className="font-bold text-red-400">{formatValue(results.totalInterest)}</p>
                  </div>
               </div>
            </div>
          )}
        </div>

        <div className="w-full lg:flex-1 space-y-8">
           <div className="p-10 rounded-[3rem] glass border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <CreditCard size={120} className="text-brand-primary" />
              </div>
              <div className="relative z-10">
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Total Payoff Amount</p>
                <h3 className="text-5xl font-display font-black text-white mb-4">
                    {results.impossible ? "∞" : formatValue(results.totalPaid)}
                </h3>
                <p className="text-sm text-white/60 max-w-sm leading-relaxed">
                  Including principal and compound interest, this is the final sum to clear your debt completely.
                </p>
              </div>
            </div>

            {!results.impossible && (
                <div className="glass rounded-[2.5rem] border border-white/10 p-6 md:p-8 h-[300px]">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white/80">
                    Payoff Trajectory <TrendingDown size={16} className="text-brand-primary" />
                    </h3>
                    <div className="h-full pb-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={results.chartData}>
                        <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                            formatter={(val: number) => formatValue(val)}
                        />
                        <Area type="monotone" dataKey="balance" stroke="#ef4444" fillOpacity={1} fill="url(#colorBalance)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                    </div>
                </div>
            )}
            
            <div className="space-y-4">
               <div className="p-6 glass rounded-3xl border border-blue-500/20 bg-blue-500/5">
                  <h4 className="flex items-center gap-2 font-bold mb-3">Expert Advice</h4>
                  <p className="text-xs text-white/60 leading-relaxed italic">
                    "Credit card interest is compounded daily. Consider a personal loan to consolidate this debt at a much lower interest rate (usually 12-16%)."
                  </p>
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
