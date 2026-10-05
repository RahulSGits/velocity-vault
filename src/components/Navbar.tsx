import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, 
  Calculator, 
  PiggyBank, 
  History, 
  User, 
  Menu, 
  X, 
  Bot, 
  ChevronDown, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Landmark, 
  CreditCard, 
  Coins, 
  Scale, 
  Activity, 
  BarChart3, 
  RefreshCw, 
  Layers, 
  TrendingDown,
  Sparkles
} from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { CurrencySelector } from './CurrencySelector';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const calculators = [
    { id: 'trading', label: 'Live Trading Terminal', icon: BarChart3, desc: 'Real-time charts & risk engine' },
    { id: 'swp', label: 'SWP Calculator', icon: RefreshCw, desc: 'Mutual funds & stock withdrawal' },
    { id: 'etf', label: 'ETF & Expense Ratio', icon: Layers, desc: 'Index funds & TER cost savings' },
    { id: 'stock-average', label: 'Stock Average / Dip', icon: TrendingDown, desc: 'Buy the dip & target planner' },
    { id: 'brokerage', label: 'Brokerage & STT P&L', icon: Scale, desc: 'Net profit & tax contract note' },
    { id: 'cagr', label: 'Stock CAGR', icon: Landmark, desc: 'Equity return rate' },
    { id: 'sip', label: 'SIP Calculator', icon: Calculator, desc: 'Mutual funds & wealth growth' },
    { id: 'compound', label: 'Compound Interest', icon: TrendingUp, desc: 'Wealth acceleration' },
    { id: 'emi', label: 'EMI / Loan', icon: History, desc: 'Loans & amortization' },
    { id: 'tax', label: 'Tax (India)', icon: Scale, desc: 'Old vs New regime' },
    { id: 'retirement', label: 'Retirement', icon: User, desc: 'FIRE & pension planning' },
    { id: 'savings', label: 'Savings Goal', icon: PiggyBank, desc: 'Target based savings' },
    { id: 'crypto', label: 'Crypto Profit', icon: Coins, desc: 'BTC & altcoin moonbags' },
    { id: 'fd-rd', label: 'FD / RD', icon: Landmark, desc: 'Guaranteed returns' },
    { id: 'inflation', label: 'Inflation', icon: Activity, desc: 'Purchasing power loss' },
    { id: 'debt', label: 'Credit Card', icon: CreditCard, desc: 'Interest & payoff paths' },
  ];

  const mainNav = [
    { id: 'home', label: 'Home', icon: Wallet },
    { id: 'trading', label: 'Live Markets', icon: BarChart3, badge: 'Live' },
    { id: 'goals', label: 'Vision Board', icon: Target },
    { id: 'chat', label: 'AI Chat', icon: Bot },
    { id: 'blog', label: 'Learn', icon: BookOpen },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4 px-6 md:px-12",
      isScrolled ? "bg-black/50 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
          onClick={() => {
            onNavigate('home');
            setIsMobileMenuOpen(false);
          }}
        >
          <div className="relative">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform shadow-lg shadow-brand-primary/20">
              <Wallet className="text-white w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="absolute -inset-1 bg-brand-primary/20 blur-lg rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-lg sm:text-xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Velocity<span className="text-brand-primary">Vault</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
           <button
             onClick={() => onNavigate('home')}
             className={cn(
               "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2",
               currentPage === 'home' ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]" : "text-white/60 hover:text-white"
             )}
           >
             <Wallet className="w-4 h-4" /> Home
           </button>

           <div className="relative group/tools">
              <button
                onMouseEnter={() => setIsToolsOpen(true)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2",
                  calculators.some(c => c.id === currentPage && currentPage !== 'trading') ? "bg-brand-primary text-white" : "text-white/60 hover:text-white"
                )}
              >
                <Calculator className="w-4 h-4" /> Calculators <ChevronDown className="w-3 h-3 opacity-50" />
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/tools:opacity-100 group-hover/tools:visible transition-all duration-300 w-[960px] z-[100]">
                 <div className="bg-neutral-950/98 border border-white/10 p-8 rounded-[2.5rem] grid grid-cols-4 gap-6 shadow-[0_30px_100px_rgba(0,0,0,0.95)] backdrop-blur-3xl">
                    {[
                      {
                        title: "Stock Market & F&O",
                        color: "from-blue-500 to-cyan-500",
                        items: [
                          { id: 'trading', label: 'Live Trading Terminal', icon: BarChart3, iconColor: 'text-emerald-400 bg-emerald-500/10', desc: 'Real-time charts & risk engine' },
                          { id: 'swp', label: 'SWP Calculator', icon: RefreshCw, iconColor: 'text-cyan-400 bg-cyan-500/10', desc: 'Mutual funds & stock withdrawal' },
                          { id: 'etf', label: 'ETF & Expense Ratio', icon: Layers, iconColor: 'text-blue-400 bg-blue-500/10', desc: 'Index funds & TER cost savings' },
                          { id: 'stock-average', label: 'Stock Average / Dip', icon: TrendingDown, iconColor: 'text-indigo-400 bg-indigo-500/10', desc: 'Buy the dip & target planner' },
                          { id: 'brokerage', label: 'Brokerage & STT P&L', icon: Scale, iconColor: 'text-amber-400 bg-amber-500/10', desc: 'Net profit & tax contract note' },
                        ]
                      },
                      {
                        title: "Wealth & Equity",
                        color: "from-blue-500 to-indigo-500",
                        items: [
                          { id: 'sip', label: 'SIP Calculator', icon: Calculator, iconColor: 'text-blue-400 bg-blue-500/10', desc: 'Mutual funds & wealth growth' },
                          { id: 'compound', label: 'Compound Interest', icon: TrendingUp, iconColor: 'text-indigo-400 bg-indigo-500/10', desc: 'Wealth acceleration' },
                          { id: 'cagr', label: 'Stock CAGR', icon: Landmark, iconColor: 'text-sky-400 bg-sky-500/10', desc: 'Equity return rate' },
                          { id: 'crypto', label: 'Crypto Profit', icon: Coins, iconColor: 'text-orange-400 bg-orange-500/10', desc: 'BTC & altcoin moonbags' },
                        ]
                      },
                      {
                        title: "Goals & Safety",
                        color: "from-emerald-500 to-teal-500",
                        items: [
                          { id: 'fd-rd', label: 'FD / RD', icon: Landmark, iconColor: 'text-emerald-400 bg-emerald-500/10', desc: 'Guaranteed risk-free returns' },
                          { id: 'savings', label: 'Savings Goal', icon: PiggyBank, iconColor: 'text-teal-400 bg-teal-500/10', desc: 'Target based savings planner' },
                          { id: 'retirement', label: 'Retirement Hub', icon: User, iconColor: 'text-cyan-400 bg-cyan-500/10', desc: 'FIRE & pension planning' },
                        ]
                      },
                      {
                        title: "Debt & Planning",
                        color: "from-red-500 to-rose-500",
                        items: [
                          { id: 'emi', label: 'EMI / Loan', icon: History, iconColor: 'text-red-400 bg-red-500/10', desc: 'Loans & amortization schedule' },
                          { id: 'debt', label: 'Credit Card', icon: CreditCard, iconColor: 'text-rose-400 bg-rose-500/10', desc: 'Interest & payoff escape paths' },
                          { id: 'tax', label: 'Tax (India)', icon: Scale, iconColor: 'text-amber-400 bg-amber-500/10', desc: 'Old vs New regime comparison' },
                          { id: 'inflation', label: 'Inflation', icon: Activity, iconColor: 'text-yellow-400 bg-yellow-500/10', desc: 'Purchasing power loss tracker' },
                        ]
                      }
                    ].map((cat, idx) => (
                      <div key={idx} className="space-y-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full w-fit">
                          <span className={cn("w-1.5 h-1.5 rounded-full bg-gradient-to-r", cat.color)} />
                          <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none">{cat.title}</span>
                        </div>
                        <div className="space-y-1">
                          {cat.items.map(calc => (
                            <button
                              key={calc.id}
                              onClick={() => {
                                onNavigate(calc.id);
                                setIsToolsOpen(false);
                              }}
                              className={cn(
                                "flex items-start gap-2.5 p-2.5 rounded-2xl transition-all text-left w-full group/item hover:bg-white/5",
                                currentPage === calc.id ? "bg-white/10 border border-white/10" : "border border-transparent"
                              )}
                            >
                               <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover/item:scale-110", calc.iconColor)}>
                                  <calc.icon className="w-4 h-4 animate-none" />
                               </div>
                               <div>
                                  <div className="text-xs font-semibold text-white/90 group-hover/item:text-white transition-colors block">{calc.label}</div>
                                  <div className="text-[9px] text-white/40 group-hover/item:text-white/60 transition-colors leading-tight mt-0.5">{calc.desc}</div>
                                </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {mainNav.filter(n => n.id !== 'home').map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 relative",
                currentPage === item.id 
                  ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {item.badge && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <CurrencySelector />
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 text-white bg-white/5 rounded-xl border border-white/10"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[-1]"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] glass border-l border-white/10 z-[60] overflow-y-auto"
            >
              <div className="p-8 space-y-8">
                <div className="flex justify-between items-center">
                   <div className="font-display font-black text-xl italic tracking-widest text-brand-primary">MENU</div>
                   <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-full"><X size={20} /></button>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest px-4">Stock Market & Calculators</p>
                  <div className="grid grid-cols-2 gap-2">
                    {calculators.map(calc => (
                      <button
                        key={calc.id}
                        onClick={() => {
                          onNavigate(calc.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={cn(
                          "p-3 rounded-2xl border transition-all text-left",
                          currentPage === calc.id ? "bg-brand-primary border-brand-primary text-white" : "bg-white/5 border-white/10 text-white/60"
                        )}
                      >
                         <calc.icon size={18} className={cn("mb-1.5", currentPage === calc.id ? "text-white" : "text-brand-primary")} />
                         <div className="text-[11px] font-bold leading-tight">{calc.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest px-4">Navigation</p>
                  {mainNav.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl w-full text-left font-bold transition-all",
                        currentPage === item.id ? "bg-white/10 text-brand-primary shadow-xl" : "text-white/60"
                      )}
                    >
                      <item.icon size={20} />
                      {item.label}
                    </button>
                  ))}
                </div>
                
                 <div className="pt-8 border-t border-white/10">
                   <CurrencySelector />
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

