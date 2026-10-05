import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Info, Download, Trash2, Landmark, RefreshCw } from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { useCurrency } from '../components/CurrencyContext';

export function FDRDCalculator() {
  const { currency, formatValue } = useCurrency();
  const [type, setType] = useState<'FD' | 'RD'>('FD');
  const [principal, setPrincipal] = useState(100000);
  const [monthlyDeposit, setMonthlyDeposit] = useState(5000);
  const [rate, setRate] = useState(7);
  const [time, setTime] = useState(5);

  const results = useMemo(() => {
    let maturityAmount = 0;
    let totalInvested = 0;

    if (type === 'FD') {
        totalInvested = principal;
        // Simple FD: A = P(1 + r/4)^(4n) - Quarterly compounding is standard in many places
        maturityAmount = principal * Math.pow(1 + rate / 400, 4 * time);
    } else {
        // RD: A = P * {[(1+r)^n - 1] / (1-(1+r)^(-1/3))} - Complex formula, simplified for monthly
        let m = rate / 100 / 12;
        let n = time * 12;
        totalInvested = monthlyDeposit * n;
        
        // Sum of installments with quarterly compounding
        // Simplified monthly compounding for clarity
        maturityAmount = monthlyDeposit * ((Math.pow(1 + m, n) - 1) / m) * (1 + m);
    }

    const interestEarned = maturityAmount - totalInvested;

    return { 
        totalInvested: Math.round(totalInvested), 
        maturityAmount: Math.round(maturityAmount), 
        interestEarned: Math.round(interestEarned) 
    };
  }, [type, principal, monthlyDeposit, rate, time]);

  const pieData = [
    { name: 'Total Invested', value: results.totalInvested },
    { name: 'Interest Earned', value: results.interestEarned }
  ];
  const COLORS = ['#ffffff10', '#3b82f6'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:flex-1 space-y-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
               <button 
                 onClick={() => setType('FD')}
                 className={cn(
                   "px-6 py-2 rounded-full text-xs font-bold uppercase transition-all",
                   type === 'FD' ? "bg-brand-primary text-white" : "bg-white/5 text-white/40 border border-white/10"
                 )}
               >
                 Fixed Deposit
               </button>
               <button 
                 onClick={() => setType('RD')}
                 className={cn(
                   "px-6 py-2 rounded-full text-xs font-bold uppercase transition-all",
                   type === 'RD' ? "bg-brand-primary text-white" : "bg-white/5 text-white/40 border border-white/10"
                 )}
               >
                 Recurring Deposit
               </button>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{type} Calculator</h1>
            <p className="text-white/40 text-sm md:text-base">Safe, predictable returns. Plan your low-risk debt portfolio.</p>
          </div>

          <div className="p-6 md:p-8 glass rounded-[2.5rem] border border-white/10 space-y-8">
            {type === 'FD' ? (
                <InputGroup 
                  label="Principal Amount" 
                  value={principal} 
                  onChange={setPrincipal} 
                  min={1000} 
                  max={10000000} 
                  step={1000}
                  suffix={currency.symbol}
                />
            ) : (
                <InputGroup 
                  label="Monthly Installment" 
                  value={monthlyDeposit} 
                  onChange={setMonthlyDeposit} 
                  min={500} 
                  max={500000} 
                  step={100}
                  suffix={currency.symbol}
                />
            )}
            
            <InputGroup 
              label="Annual Rate of Interest (%)" 
              value={rate} 
              onChange={setRate} 
              min={1} 
              max={15} 
              step={0.1}
              suffix="%"
            />
            <InputGroup 
              label="Duration" 
              value={time} 
              onChange={setTime} 
              min={0.5} 
              max={25} 
              step={0.5}
              suffix="Years"
            />
          </div>
        </div>

        <div className="w-full lg:flex-1 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultCard label="Maturity Value" value={formatValue(results.maturityAmount)} primary />
            <ResultCard label="Total Interest" value={formatValue(results.interestEarned)} />
            <ResultCard label="Total Invested" value={formatValue(results.totalInvested)} />
            <div className="glass rounded-3xl p-6 flex items-center justify-between border border-white/10">
               <div>
                 <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Effective ROI</p>
                 <div className="text-xl font-display font-bold text-emerald-400">{(results.interestEarned / results.totalInvested * 100 / time).toFixed(2)}%</div>
               </div>
               <Landmark className="text-white/20" />
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
                  <span className="text-xs text-white/50">Interest</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
               <div className="p-6 glass rounded-3xl border border-white/10">
                  <h4 className="text-xs font-bold text-white/40 mb-3 uppercase tracking-widest">Bank Comp</h4>
                  <div className="space-y-3">
                     {[ {bank: 'HDFC', rate: '7.2%'}, {bank: 'SBI', rate: '6.8%'}, {bank: 'Kotak', rate: '7.1%'} ].map(b => (
                        <div key={b.bank} className="flex justify-between items-center text-sm">
                           <span className="text-white/60">{b.bank} Bank</span>
                           <span className="font-bold text-brand-primary">{b.rate}</span>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="p-6 glass rounded-3xl border border-brand-primary/20 bg-brand-primary/5">
                  <p className="text-xs text-white/60 leading-relaxed italic">
                    RD (Recurring Deposit) is perfect for building a corpus from monthly savings without lump sum risk.
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

function ResultCard({ label, value, primary }: any) {
  return (
    <div className={cn(
      "glass rounded-3xl p-6 border transition-all hover:scale-[1.02]",
      primary ? "border-brand-primary/40 bg-brand-primary/10" : "border-white/10"
    )}>
      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">{label}</p>
      <div className={cn(
        "text-2xl font-display font-bold leading-tight",
        primary ? "text-white" : "text-white/80"
      )}>{value}</div>
    </div>
  );
}
