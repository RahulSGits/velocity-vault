import React from 'react';
import { motion } from 'motion/react';
import { 
  Calculator, 
  PiggyBank, 
  History, 
  User, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Shield, 
  Zap, 
  Globe, 
  Coins, 
  Target, 
  Landmark, 
  BarChart3, 
  Scale, 
  BookOpen,
  RefreshCw,
  Layers,
  TrendingDown,
  Activity
} from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { useCurrency } from '../components/CurrencyContext';
import { AdUnit } from '../components/AdUnit';
import { CURRENCIES } from '../types';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const { formatValue, currency } = useCurrency();

  return (
    <div className="space-y-32">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-6 pt-20 pb-12">
        <div className="max-w-5xl mx-auto text-center space-y-8 z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 text-brand-accent text-xs sm:text-sm font-medium mb-4"
          >
            <Sparkles size={16} />
            The Ultimate Financial Engineering Kit & Live Market Terminal
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-8xl font-display font-extrabold tracking-tighter leading-[0.9] sm:leading-none"
          >
            Engineering <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent animate-gradient">Financial Freedom</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-2xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Real-time TradingView charts, SWP retirement engines, ETF fee optimizers, precision stock calculators, and AI wealth planning.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4"
          >
            <button 
              onClick={() => onNavigate('trading')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-primary text-white font-bold text-base shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Live Market Terminal <BarChart3 size={18} />
            </button>
            <button 
              onClick={() => onNavigate('sip')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-black font-bold text-base shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5"
            >
              SIP Calculator <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => onNavigate('swp')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass hover:bg-white/10 font-bold text-base transition-all border border-white/20 flex items-center justify-center gap-2.5"
            >
              <RefreshCw size={18} className="text-cyan-400" /> SWP Pension
            </button>
          </motion.div>
        </div>

        {/* Floating elements for visual flair */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[10%] w-32 h-32 glass rounded-3xl -rotate-12 border border-white/10 flex items-center justify-center"
          >
            <TrendingUp size={48} className="text-brand-primary opacity-50" />
          </motion.div>
          <motion.div 
            animate={{ y: [0, 40, 0], rotate: [0, -15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[20%] right-[15%] w-40 h-40 glass rounded-[2rem] rotate-12 border border-white/10 flex items-center justify-center"
          >
            <Shield size={64} className="text-brand-accent opacity-30" />
          </motion.div>
           <motion.div 
            animate={{ y: [0, -40, 0], rotate: [0, 20, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[60%] right-[5%] w-24 h-24 glass rounded-2xl border border-white/10 flex items-center justify-center"
          >
            <Coins size={40} className="text-brand-secondary opacity-30" />
          </motion.div>
        </div>
      </section>

      {/* Primary Tools Grid */}
      <motion.section 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 }
          }
        }}
        className="max-w-7xl mx-auto px-6"
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/60 mb-3">
            <BarChart3 className="w-3.5 h-3.5 text-brand-primary" /> Comprehensive Financial Suite
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Stock Market & Wealth Calculators</h2>
          <p className="text-white/50 text-lg">Real-time charts, precision market calculators, and wealth models.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: BarChart3, title: "Live Market Terminal", desc: "Interactive TradingView chart with real-time quotes, technical indicators, and position sizing.", color: "blue", id: 'trading', badge: 'Live' },
            { icon: RefreshCw, title: "SWP Calculator", desc: "Systematic Withdrawal Plan simulator for mutual funds, stocks, and monthly retirement cash flows.", color: "cyan", id: 'swp' },
            { icon: Layers, title: "ETF & Expense Ratio", desc: "Simulate index compounding, compare expense ratios (TER drag), and track dividend reinvestment (DRIP).", color: "blue", id: 'etf' },
            { icon: TrendingDown, title: "Stock Average & Dip", desc: "Multi-tranche weighted average calculator with real-time target buy-the-dip share planner.", color: "green", id: 'stock-average' },
            { icon: Scale, title: "Brokerage & STT P&L", desc: "Itemized tax contract note calculating STT, GST, SEBI fees, exchange charges, and net profit.", color: "orange", id: 'brokerage' },
            { icon: Calculator, title: "SIP Calculator", desc: "Visualize the power of compounding with step-up investments and interactive growth charts.", color: "blue", id: 'sip' },
            { icon: TrendingUp, title: "Compound Interest", desc: "Calculate potential wealth accumulation with various compounding frequencies.", color: "cyan", id: 'compound' },
            { icon: History, title: "EMI Estimator", desc: "Break down principal and interest with smooth amortization tables and debt-free paths.", color: "purple", id: 'emi' },
            { icon: Scale, title: "Income Tax (India)", desc: "Old vs New regime comparison with deduction optimization for FY 2024-25.", color: "green", id: 'tax' },
            { icon: User, title: "Retirement Hub", desc: "Calculate your 'Freedom Number' and plan your transition to a stress-free retired life.", color: "orange", id: 'retirement' },
            { icon: Coins, title: "Crypto Profit", desc: "Track ROI on your digital assets and simulate moonbag scenarios with ease.", color: "pink", id: 'crypto' },
            { icon: Landmark, title: "Stock CAGR", desc: "The gold standard for measuring equity returns. Calculate annual growth accurately.", color: "blue", id: 'cagr' },
          ].map((feature) => (
            <FeatureCard 
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.desc}
              color={feature.color}
              badge={feature.badge}
              onClick={() => onNavigate(feature.id)}
            />
          ))}
        </div>
      </motion.section>

      {/* Become Crorepati Viral Section */}
      <section className="max-w-7xl mx-auto px-6">
         <div className="p-12 md:p-20 rounded-[4rem] glass border border-brand-primary/20 bg-brand-primary/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-12">
               <Target size={300} />
            </div>
            <div className="relative z-10 max-w-xl text-center md:text-left">
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase mb-6">Viral Feature</div>
               <h2 className="text-4xl md:text-6xl font-display font-black mb-6">Become <span className="text-brand-primary font-luxury">Crorepati.</span></h2>
               <p className="text-white/40 text-lg mb-8 leading-relaxed">
                  Join the mission to net worth milestones. Use our gamified roadmap to reach <span className="text-white font-bold">{formatValue(10000000)}</span> and beyond.
               </p>
               <button 
                 onClick={() => onNavigate('goals')}
                 className="px-10 py-5 rounded-2xl bg-brand-primary text-white font-bold text-lg shadow-xl shadow-brand-primary/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
               >
                 Build Your Roadmap <ArrowRight size={20} />
               </button>
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-4 w-full md:w-auto">
               <div className="p-6 glass rounded-3xl border border-white/10 text-center">
                  <div className="text-3xl font-display font-bold mb-1">Crore</div>
                  <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Target 1</div>
               </div>
               <div className="p-6 glass rounded-3xl border border-white/10 text-center">
                  <div className="text-3xl font-display font-bold mb-1">10X</div>
                  <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Multiplier</div>
               </div>
               <div className="p-6 glass rounded-3xl border border-white/10 text-center col-span-2">
                  <div className="text-3xl font-display font-bold mb-1">Legacy</div>
                  <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Final Outcome</div>
               </div>
            </div>
         </div>
      </section>

      {/* Stats Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative py-16 md:py-32 overflow-hidden"
      >
        <div className="absolute inset-0 bg-brand-primary/5 blur-[120px] rounded-full scale-150 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="glass rounded-[2rem] md:rounded-[3rem] p-8 md:p-20 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center border border-white/10">
            <StatItem value="1.2M+" label="Active Projections" />
            <StatItem 
              value={`${currency.symbol}${currency.code === 'INR' ? '4.5T+' : (4500 / CURRENCIES.INR.rate * currency.rate).toFixed(1) + 'B+'}`} 
              label="Wealth Simulated" 
            />
            <StatItem value="99.9%" label="Calculation Logic" />
          </div>
        </div>
      </motion.section>

      {/* Mid-Page Ad Break */}
      <section className="max-w-5xl mx-auto px-6">
        <AdUnit slot="home_mid_banner" format="fluid" />
      </section>

      {/* News Ticker (Mock) */}
      <div className="w-full bg-white/5 border-y border-white/10 py-3 overflow-hidden">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-12 items-center"
        >
          <TickerItem label="BTC/USD" value="68,432.10" change="+2.4%" />
          <TickerItem label="ETH/USD" value="3,210.45" change="+1.8%" />
          <TickerItem label="NASDAQ" value="16,234.30" change="-0.2%" />
          <TickerItem label="GOLD" value="2,345.00" change="+0.5%" />
          <TickerItem label="APPLE" value="189.45" change="+0.3%" />
          <TickerItem label="TESLA" value="172.30" change="+1.2%" />
          {/* Duplicate for seamless loop */}
          <TickerItem label="BTC/USD" value="68,432.10" change="+2.4%" />
          <TickerItem label="ETH/USD" value="3,210.45" change="+1.8%" />
          <TickerItem label="NASDAQ" value="16,234.30" change="-0.2%" />
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color, badge, onClick }: any) {
  const colors: any = {
    blue: "text-blue-400 group-hover:text-blue-300 bg-blue-500/10",
    purple: "text-purple-400 group-hover:text-purple-300 bg-purple-500/10",
    cyan: "text-cyan-400 group-hover:text-cyan-300 bg-cyan-500/10",
    orange: "text-orange-400 group-hover:text-orange-300 bg-orange-500/10",
    pink: "text-pink-400 group-hover:text-pink-300 bg-pink-500/10",
    green: "text-green-400 group-hover:text-green-300 bg-green-500/10",
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -10 }}
      onClick={onClick}
      className="group p-8 rounded-[2.5rem] glass hover:bg-white/10 border border-white/10 transition-all cursor-pointer relative"
    >
      {badge && (
        <span className="absolute top-6 right-6 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {badge}
        </span>
      )}
      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", colors[color])}>
        <Icon size={32} />
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
        {description}
      </p>
      <div className="mt-8 flex items-center gap-2 text-white/20 group-hover:text-white transition-colors">
        <span className="font-bold text-sm uppercase tracking-wider">Explore Tool</span>
        <ArrowRight size={16} />
      </div>
    </motion.div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="space-y-2 flex flex-col items-center">
      <div className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-white/90 leading-tight tracking-tighter break-all">
        {value}
      </div>
      <p className="text-brand-primary font-mono tracking-widest uppercase text-[10px] sm:text-xs font-bold">{label}</p>
    </div>
  );
}

function TickerItem({ label, value, change }: any) {
  const isUp = change.startsWith('+');
  return (
    <div className="flex items-center gap-3 font-mono text-sm">
      <span className="text-white/50">{label}</span>
      <span className="text-white font-bold">{value}</span>
      <span className={cn(isUp ? "text-green-400" : "text-red-400")}>{change}</span>
    </div>
  );
}
