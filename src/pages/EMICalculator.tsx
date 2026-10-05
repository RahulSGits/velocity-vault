import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'motion/react';
import { History, CreditCard, Landmark, Percent, Table } from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { useCurrency } from '../components/CurrencyContext';

export function EMICalculator() {
  const { currency, formatValue } = useCurrency();
  const [loanAmount, setLoanAmount] = useState(100000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(5);
  const [fees, setFees] = useState(1);

  const results = useMemo(() => {
    const p = loanAmount;
    const r = rate / 12 / 100;
    const n = tenure * 12;
    
    // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;
    const processingFees = (fees / 100) * p;

    // Amortization Schedule
    let schedule = [];
    let remainingBalance = p;
    for (let month = 1; month <= Math.min(n, 12); month++) { // Sample first 12 months
      const interest = remainingBalance * r;
      const principal = emi - interest;
      remainingBalance -= principal;
      schedule.push({
        month,
        principal: Math.round(principal),
        interest: Math.round(interest),
        remaining: Math.max(0, Math.round(remainingBalance))
      });
    }

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      processingFees: Math.round(processingFees),
      schedule
    };
  }, [loanAmount, rate, tenure, fees]);

  const pieData = [
    { name: 'Principal', value: loanAmount },
    { name: 'Total Interest', value: results.totalInterest }
  ];
  const COLORS = ['#ffffff10', '#06b6d4'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Controls */}
        <div className="flex-1 space-y-8">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">EMI Estimator</h1>
            <p className="text-white/40">Demystify your debt and plan your repayment journey.</p>
          </div>

          <div className="p-10 glass rounded-[3rem] border border-white/10 space-y-10">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
                  <Landmark size={14} /> Loan Amount
                </label>
                <div className="text-2xl font-display font-bold text-cyan-400">{formatValue(loanAmount)}</div>
              </div>
              <input 
                type="range" min={10000} max={10000000} step={10000} value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
                  <Percent size={14} /> Interest Rate
                </label>
                <div className="text-2xl font-display font-bold text-cyan-400">{rate}%</div>
              </div>
              <input 
                type="range" min={1} max={20} step={0.1} value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
                  <History size={14} /> Tenure (Years)
                </label>
                <div className="text-2xl font-display font-bold text-cyan-400">{tenure}</div>
              </div>
              <input 
                type="range" min={1} max={30} step={1} value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Processing Fees (%)</label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFees(f)}
                    className={cn(
                      "py-3 rounded-xl text-sm font-bold transition-all border",
                      fees === f ? "bg-cyan-400 text-black border-cyan-400" : "bg-white/5 text-white/40 border-white/10 hover:border-white/20"
                    )}
                  >
                    {f}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 space-y-8">
          <div className="p-8 glass rounded-[3rem] border border-cyan-400/20 bg-cyan-400/5 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent pointer-events-none" />
            <motion.div 
              key={results.emi}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative z-10"
            >
              <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                <CreditCard size={12} /> Monthly Repayment
              </div>
              <div className="text-6xl font-display font-black text-cyan-400 mb-2">{formatValue(results.emi)}</div>
              <p className="text-white/30 text-xs italic">Includes principal and interest</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoBox label="Total Interest" value={formatValue(results.totalInterest)} color="cyan" />
            <InfoBox label="Total Payment" value={formatValue(results.totalPayment)} color="white" />
            <InfoBox label="Processing Fee" value={formatValue(results.processingFees)} color="muted" />
            <InfoBox label="Interest/Principal Ratio" value={`${((results.totalInterest / loanAmount) * 100).toFixed(1)}%`} color="muted" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-[250px] glass rounded-[2.5rem] border border-white/10 p-8">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} stroke="none" />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col items-center gap-2 mt-2">
                 <div className="flex gap-4">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-white/10" /><span className="text-[10px] text-white/40 font-bold uppercase">Principal</span></div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-400" /><span className="text-[10px] text-white/40 font-bold uppercase">Interest</span></div>
                 </div>
              </div>
            </div>

            <div className="glass rounded-[2.5rem] border border-white/10 p-8 overflow-hidden">
              <div className="flex items-center gap-2 mb-6 font-bold text-sm uppercase tracking-widest text-white/50">
                <Table size={16} /> Amortization (First Year)
              </div>
              <div className="space-y-4 max-h-[160px] overflow-y-auto scrollbar-hide pr-2">
                {results.schedule.map((row) => (
                  <div key={row.month} className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
                    <span className="text-white/40 font-mono">Month {row.month}</span>
                    <div className="text-right">
                      <div className="text-white font-bold">{formatValue(row.principal)} / {formatValue(row.interest)}</div>
                      <div className="text-white/20 text-[10px] uppercase">Rem: {formatValue(row.remaining)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value, color }: any) {
  const styles: any = {
    cyan: "border-cyan-400/20 text-cyan-400 bg-cyan-400/5",
    white: "border-white/10 text-white",
    muted: "border-white/5 text-white/40",
  };
  return (
    <div className={cn("p-6 rounded-3xl border text-center transition-all hover:bg-white/5", styles[color])}>
      <div className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-60">{label}</div>
      <div className="text-xl font-display font-bold">{value}</div>
    </div>
  );
}
