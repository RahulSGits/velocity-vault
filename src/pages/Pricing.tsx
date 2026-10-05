import React from 'react';
import { motion } from 'motion/react';
import { Check, X, Zap, Shield, Crown, Sparkles, Globe, Download, BarChart3, MessageSquareText } from 'lucide-react';
import { cn } from '@/src/utils/cn';

interface FeatureRowProps {
  feature: string;
  free: React.ReactNode;
  premium: React.ReactNode;
  isLast?: boolean;
}

const FeatureRow = ({ feature, free, premium, isLast }: FeatureRowProps) => (
  <div className={cn(
    "grid grid-cols-1 md:grid-cols-3 py-6 px-4 items-center transition-colors hover:bg-white/5",
    !isLast && "border-b border-white/5"
  )}>
    <div className="text-white/80 font-medium mb-2 md:mb-0">{feature}</div>
    <div className="flex justify-center md:block mb-1 md:mb-0">
      <div className="md:hidden text-[10px] uppercase text-white/30 font-bold mb-1 mr-2">Free: </div>
      {free}
    </div>
    <div className="flex justify-center md:block">
      <div className="md:hidden text-[10px] uppercase text-brand-primary font-bold mb-1 mr-2">Premium: </div>
      {premium}
    </div>
  </div>
);

const CheckIcon = () => <Check className="text-emerald-400 mx-auto md:mx-0" size={20} />;
const CrossIcon = () => <X className="text-rose-400/30 mx-auto md:mx-0" size={20} />;

export function Pricing() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-20">
      {/* Header */}
      <div className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-widest"
        >
          <Crown size={14} /> Upgrade Your Wealth
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter">
          Choose Your <span className="text-brand-primary">Velocity</span>.
        </h1>
        <p className="text-white/50 max-w-2xl mx-auto text-lg">
          From basic projections to AI-driven wealth mastery. Select the plan that matches your financial ambition.
        </p>
      </div>

      {/* Comparison Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[3rem] border border-white/10 overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 bg-white/5 p-8 border-b border-white/10 text-center md:text-left">
          <div className="hidden md:flex items-end pb-2 font-display text-2xl font-black italic text-white/20">Features</div>
          <div className="space-y-2 mb-8 md:mb-0">
            <h3 className="text-2xl font-bold">Standard</h3>
            <div className="text-4xl font-display font-black">Free</div>
            <p className="text-white/40 text-xs">Essential tools for everyone.</p>
          </div>
          <div className="space-y-2 relative">
            <div className="absolute -top-12 right-0 hidden lg:block">
              <div className="bg-brand-primary text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-1 shadow-lg shadow-brand-primary/20">
                <Zap size={10} /> Most Popular
              </div>
            </div>
            <h3 className="text-2xl font-bold text-brand-primary">Vault Pro</h3>
            <div className="text-4xl font-display font-black">₹499<span className="text-sm font-sans text-white/40">/mo</span></div>
            <p className="text-white/60 text-xs">Unleash the full power of AI.</p>
          </div>
        </div>

        <div className="p-4 md:p-8">
          <FeatureRow 
            feature="Basic Calculators (SIP, EMI)" 
            free={<CheckIcon />} 
            premium={<CheckIcon />} 
          />
          <FeatureRow 
            feature="Advanced Retirement Planning" 
            free={<div className="text-white/40 italic text-sm text-center md:text-left">Basic only</div>} 
            premium={<div className="text-brand-accent font-bold text-sm text-center md:text-left">Full Analysis</div>} 
          />
          <FeatureRow 
            feature="Currency Switching" 
            free={<CheckIcon />} 
            premium={<div className="flex items-center gap-2 text-brand-primary font-bold text-sm justify-center md:justify-start"><Globe size={14} /> Multi-Region Sync</div>} 
          />
          <FeatureRow 
            feature="AI Insights" 
            free={<div className="text-white/40 text-sm text-center md:text-left">3 hints / day</div>} 
            premium={<div className="flex items-center gap-2 text-brand-accent font-bold text-sm justify-center md:justify-start"><Sparkles size={14} /> Infinite Insights</div>} 
          />
          <FeatureRow 
            feature="Export Projections (PDF/Excel)" 
            free={<CrossIcon />} 
            premium={<CheckIcon />} 
          />
          <FeatureRow 
            feature="Portfolio Cloud Sync" 
            free={<CrossIcon />} 
            premium={<CheckIcon />} 
          />
          <FeatureRow 
            feature="Ad-Free Experience" 
            free={<CrossIcon />} 
            premium={<CheckIcon />} 
          />
          <FeatureRow 
            feature="Custom Goal Tracking" 
            free={<div className="text-white/40 text-sm text-center md:text-left">Max 3 goals</div>} 
            premium={<div className="text-brand-primary font-bold text-sm text-center md:text-left">Unlimited</div>} 
            isLast
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 bg-white/5 p-8 border-t border-white/10 text-center gap-4">
          <div className="hidden md:block"></div>
          <div>
            <button className="w-full py-4 rounded-2xl border border-white/20 hover:bg-white/5 transition-all font-bold text-sm uppercase tracking-widest">
              Current Plan
            </button>
          </div>
          <div>
            <button className="w-full py-4 rounded-2xl bg-brand-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-brand-primary/25 hover:scale-105 active:scale-95 transition-all">
              Go Pro Now
            </button>
          </div>
        </div>
      </motion.div>

      {/* Detailed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <BenefitCard 
          icon={BarChart3}
          title="Infinite Precision"
          desc="Access high-frequency compounding and multi-asset simulation models for complex portfolios."
        />
        <BenefitCard 
          icon={MessageSquareText}
          title="Dedicated AI"
          desc="A private instance of the AI wealth assistant that learns your habits and goals."
        />
        <BenefitCard 
          icon={Shield}
          title="Military Security"
          desc="Biometric sync and full encryption for all your stored financial data across devices."
        />
      </div>
    </div>
  );
}

function BenefitCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="glass p-8 rounded-[2.5rem] border border-white/10 hover:border-brand-primary/30 transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon className="text-brand-primary" size={24} />
      </div>
      <h4 className="text-xl font-bold mb-3">{title}</h4>
      <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
