import React from 'react';
import { Wallet, Github, Twitter, Linkedin, Mail, ArrowRight } from 'lucide-react';

export function Footer({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-black/50 backdrop-blur-lg pt-16 pb-8 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
              <Wallet className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-display font-bold">Velocity<span className="text-brand-primary">Vault</span></span>
          </div>
          <p className="text-white/50 text-sm leading-relaxed mb-6">
            Empowering your financial future with interactive 3D tools and AI-driven precision. The next generation of wealth planning is here.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-brand-primary transition-all"><Twitter size={18} /></a>
            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-brand-primary transition-all"><Github size={18} /></a>
            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-brand-primary transition-all"><Linkedin size={18} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm text-white/50">
            <li><button onClick={() => onNavigate('sip')} className="hover:text-brand-primary transition-colors">SIP Calculator</button></li>
            <li><button onClick={() => onNavigate('savings')} className="hover:text-brand-primary transition-colors">Savings Planner</button></li>
            <li><button onClick={() => onNavigate('emi')} className="hover:text-brand-primary transition-colors">EMI Estimator</button></li>
            <li><button onClick={() => onNavigate('retirement')} className="hover:text-brand-primary transition-colors">Retirement Hub</button></li>
            <li><button onClick={() => onNavigate('chat')} className="hover:text-brand-primary transition-colors font-bold text-brand-primary/80">Velocity AI</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Stock & Markets</h4>
          <ul className="space-y-4 text-sm text-white/50">
            <li><button onClick={() => onNavigate('trading')} className="hover:text-brand-primary transition-colors text-emerald-400 font-semibold flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Trading Terminal</button></li>
            <li><button onClick={() => onNavigate('swp')} className="hover:text-brand-primary transition-colors">SWP Pension Calculator</button></li>
            <li><button onClick={() => onNavigate('etf')} className="hover:text-brand-primary transition-colors">ETF & Fee Drag Optimizer</button></li>
            <li><button onClick={() => onNavigate('stock-average')} className="hover:text-brand-primary transition-colors">Stock Average & Dip</button></li>
            <li><button onClick={() => onNavigate('brokerage')} className="hover:text-brand-primary transition-colors">Brokerage & STT P&L</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Newsletter</h4>
          <p className="text-white/50 text-sm mb-4">Stay ahead with weekly AI finance tips.</p>
          <div className="flex gap-2 p-1 rounded-full bg-white/5 border border-white/10 focus-within:border-brand-primary/50 transition-colors">
            <input 
              type="email" 
              placeholder="Your email" 
              className="bg-transparent border-none outline-none px-4 py-2 text-sm w-full"
            />
            <button className="p-2 rounded-full bg-brand-primary hover:bg-brand-primary/90 transition-all">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
        <p>© 2026 Velocity Vault Technologies. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Security</a>
        </div>
      </div>
    </footer>
  );
}
