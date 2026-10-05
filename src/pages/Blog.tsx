import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, ArrowRight, Clock, User, TrendingUp, Shield, HelpCircle, Zap } from 'lucide-react';
import { cn } from '@/src/utils/cn';

const ARTICLES = [
  {
    title: "The Power of Compounding: Why Time is Your Greatest Asset",
    category: "Basics",
    desc: "Understand the mathematical magic that turns small investments into huge fortunes over decades.",
    icon: TrendingUp,
    color: "blue",
    time: "5 min read"
  },
  {
    title: "Old vs New Tax Regime: Which one saves you more?",
    category: "Tax Planning",
    desc: "A deep dive into the latest Indian tax laws and how to choose the right regime for your salary bracket.",
    icon: Shield,
    color: "green",
    time: "8 min read"
  },
  {
    title: "FIRE Movement 101: How to Retire in your 30s",
    category: "Retirement",
    desc: "Learn about the 4% rule, frugal living, and high-intensity saving strategies for early freedom.",
    icon: Zap,
    color: "purple",
    time: "12 min read"
  },
  {
    title: "Mastering the 50/30/20 Rule of Budgeting",
    category: "Budgeting",
    desc: "The simplest framework to manage your needs, wants, and savings without feeling restricted.",
    icon: BookOpen,
    color: "cyan",
    time: "6 min read"
  },
  {
    title: "Is Bitcoin Digital Gold or just a Bubble?",
    category: "Crypto",
    desc: "Evaluating the history, utility, and volatility of the world's most famous cryptocurrency.",
    icon: HelpCircle,
    color: "orange",
    time: "10 min read"
  }
];

export function Blog() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-16 text-center">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-widest mb-6"
         >
           Knowledge Hub
         </motion.div>
         <h1 className="text-4xl md:text-6xl font-display font-black mb-6 tracking-tight">
           Master Your <span className="text-brand-primary">Wealth.</span>
         </h1>
         <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed">
           Deep dives into financial planning, investment strategies, and the psychology of money.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ARTICLES.map((article, index) => (
          <motion.div
            key={article.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="h-full glass rounded-[2.5rem] border border-white/10 p-8 flex flex-col transition-all hover:border-brand-primary/40 hover:bg-white/5 active:scale-[0.98]">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-12",
                article.color === 'blue' && "bg-blue-500/10 text-blue-400",
                article.color === 'green' && "bg-emerald-500/10 text-emerald-400",
                article.color === 'purple' && "bg-purple-500/10 text-purple-400",
                article.color === 'cyan' && "bg-cyan-500/10 text-cyan-400",
                article.color === 'orange' && "bg-orange-500/10 text-orange-400",
              )}>
                <article.icon size={28} />
              </div>

              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">
                 <span>{article.category}</span>
                 <div className="w-1 h-1 rounded-full bg-white/20" />
                 <span>{article.time}</span>
              </div>

              <h3 className="text-xl font-bold mb-4 leading-tight group-hover:text-brand-primary transition-colors">
                {article.title}
              </h3>

              <p className="text-white/40 text-sm leading-relaxed mb-8 flex-grow">
                {article.desc}
              </p>

              <div className="flex items-center gap-2 text-brand-primary font-bold text-sm">
                Read Article <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Newsletter Section */}
      <div className="mt-32 p-12 rounded-[4rem] bg-gradient-to-br from-brand-secondary/20 to-brand-primary/20 border border-white/10 relative overflow-hidden text-center backdrop-blur-xl">
         <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <BookOpen size={200} />
         </div>
         <div className="relative z-10">
            <h2 className="text-3xl font-display font-bold mb-4">Financial Freedom Starts with One Email.</h2>
            <p className="text-white/40 mb-10 max-w-md mx-auto">Weekly market insights and tax-saving hacks delivered to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
               <input 
                 type="email" 
                 placeholder="your@email.com"
                 className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary focus:bg-white/10 transition-all font-bold"
               />
               <button className="px-10 py-4 rounded-2xl bg-brand-primary text-white font-bold shadow-xl shadow-brand-primary/20 hover:scale-[1.05] active:scale-95 transition-all">
                 Join 12k+ Wealth Builders
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
