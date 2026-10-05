import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Info, Shield, Zap, Calculator, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { useCurrency } from '../components/CurrencyContext';

export function TaxCalculator() {
  const { currency, formatValue } = useCurrency();
  const [income, setIncome] = useState(1200000);
  const [deductions, setDeductions] = useState(150000); // 80C usually
  const [hra, setHra] = useState(50000);
  const [others, setOthers] = useState(0);

  const calculateOldRegime = (annualIncome: number, totalDeductions: number) => {
    let taxableIncome = Math.max(0, annualIncome - totalDeductions - 50000); // 50k standard deduction
    let tax = 0;

    if (taxableIncome <= 250000) tax = 0;
    else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05;
    else if (taxableIncome <= 1000000) tax = 12500 + (taxableIncome - 500000) * 0.2;
    else tax = 112500 + (taxableIncome - 1000000) * 0.3;

    // Rebate u/s 87A
    if (taxableIncome <= 500000) tax = 0;

    const cess = tax * 0.04;
    return tax + cess;
  };

  const calculateNewRegime = (annualIncome: number) => {
    // FY 2024-25 New Regime (Simplified)
    let taxableIncome = Math.max(0, annualIncome - 75000); // 75k standard deduction in new regime recently
    let tax = 0;

    if (taxableIncome <= 300000) tax = 0;
    else if (taxableIncome <= 700000) tax = (taxableIncome - 300000) * 0.05;
    else if (taxableIncome <= 1000000) tax = 20000 + (taxableIncome - 700000) * 0.1;
    else if (taxableIncome <= 1200000) tax = 50000 + (taxableIncome - 1000000) * 0.15;
    else if (taxableIncome <= 1500000) tax = 80000 + (taxableIncome - 1200000) * 0.2;
    else tax = 140000 + (taxableIncome - 1500000) * 0.3;

    // Rebate u/s 87A (New Regime up to 7L)
    if (taxableIncome <= 700000) tax = 0;

    const cess = tax * 0.04;
    return tax + cess;
  };

  const results = useMemo(() => {
    const totalDeductions = deductions + hra + others;
    const oldTax = calculateOldRegime(income, totalDeductions);
    const newTax = calculateNewRegime(income);
    const savings = Math.abs(oldTax - newTax);
    const better = newTax < oldTax ? 'New Regime' : 'Old Regime';

    return { oldTax, newTax, savings, better };
  }, [income, deductions, hra, others]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:flex-1 space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Income Tax Calculator</h1>
            <p className="text-white/40 text-sm md:text-base">Compare Old vs New Tax Regimes for FY 2024-25 (India).</p>
          </div>

          <div className="p-6 md:p-8 glass rounded-[2.5rem] border border-white/10 space-y-8">
            <InputGroup 
              label="Annual Gross Income" 
              value={income} 
              onChange={setIncome} 
              min={100000} 
              max={10000000} 
              step={10000}
              suffix={currency.symbol}
            />
            
            <div className="pt-4 border-t border-white/5">
              <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-6">Exemptions & Deductions (Old Regime)</h3>
              <div className="space-y-6">
                <InputGroupShort 
                  label="Sec 80C (EPF, LIC, ELSS...)" 
                  value={deductions} 
                  onChange={setDeductions} 
                  max={150000}
                  suffix={currency.symbol}
                />
                <InputGroupShort 
                  label="HRA Exemption" 
                  value={hra} 
                  onChange={setHra} 
                  max={500000}
                  suffix={currency.symbol}
                />
                <InputGroupShort 
                  label="Other Deductions (80D, NPS...)" 
                  value={others} 
                  onChange={setOthers} 
                  max={200000}
                  suffix={currency.symbol}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:flex-1 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={cn(
              "p-8 rounded-[2.5rem] glass transition-all border",
              results.better === 'Old Regime' ? "border-brand-primary/40 bg-brand-primary/10 shadow-lg" : "border-white/10 opacity-70"
            )}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Old Regime</p>
                  <h4 className="text-2xl font-display font-bold">{formatValue(results.oldTax)}</h4>
                </div>
                {results.better === 'Old Regime' && <CheckCircle2 className="text-brand-primary" />}
              </div>
              <p className="text-xs text-white/40 leading-relaxed italic">Includes Standard Deduction of {formatValue(50000)}</p>
            </div>

            <div className={cn(
              "p-8 rounded-[2.5rem] glass transition-all border",
              results.better === 'New Regime' ? "border-emerald-500/40 bg-emerald-500/10 shadow-lg" : "border-white/10 opacity-70"
            )}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">New Regime</p>
                  <h4 className="text-2xl font-display font-bold">{formatValue(results.newTax)}</h4>
                </div>
                {results.better === 'New Regime' && <CheckCircle2 className="text-emerald-400" />}
              </div>
              <p className="text-xs text-white/40 leading-relaxed italic">Includes Standard Deduction of {formatValue(75000)}</p>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-brand-primary to-brand-secondary shadow-xl flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs font-bold uppercase mb-1">Tax Savings with {results.better}</p>
              <h3 className="text-3xl font-display font-black">{formatValue(results.savings)}</h3>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <Zap className="text-white fill-white" size={32} />
            </div>
          </div>

          <div className="space-y-4">
             <div className="p-6 glass rounded-[2rem] border border-white/10">
              <h4 className="flex items-center gap-2 font-bold mb-3">
                <Info size={18} className="text-brand-primary" /> Tax Planning Tips
              </h4>
              <ul className="space-y-3">
                 <li className="flex gap-3 text-sm text-white/60">
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                   If you have high rent (HRA) and investments (80C), the Old Regime usually results in lower tax.
                 </li>
                 <li className="flex gap-3 text-sm text-white/60">
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                   The New Regime is simpler—no need to track investment proofs.
                 </li>
              </ul>
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

function InputGroupShort({ label, value, onChange, max, suffix }: any) {
  return (
    <div className="grid grid-cols-2 gap-4 items-center">
      <label className="text-xs font-bold text-white/40 uppercase">{label}</label>
      <div className="relative group">
        <input 
          type="number" 
          value={value}
          onChange={(e) => onChange(Math.min(max, Number(e.target.value)))}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary transition-all text-sm font-bold text-right pr-12"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-white/20 font-bold">{suffix}</span>
      </div>
    </div>
  );
}
