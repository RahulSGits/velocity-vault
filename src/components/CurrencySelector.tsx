import React from 'react';
import { useCurrency } from './CurrencyContext';
import { CURRENCIES, CurrencyCode } from '../types';
import { Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 glass hover:bg-white/5 transition-all text-sm font-bold"
      >
        <Globe size={16} className="text-brand-accent" />
        {currency.code}
        <ChevronDown size={14} className={isOpen ? "rotate-180" : ""} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-48 glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl z-[60]"
          >
            <div className="p-2 space-y-1">
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                <button
                  key={code}
                  onClick={() => {
                    setCurrency(code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm rounded-xl transition-all flex items-center justify-between ${
                    currency.code === code ? "bg-brand-primary text-white" : "hover:bg-white/5 text-white/60 hover:text-white"
                  }`}
                >
                  <span className="font-medium">{CURRENCIES[code].label}</span>
                  <span className="font-mono text-[10px] opacity-60">{CURRENCIES[code].symbol}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50" 
          onClick={() => setIsOpen(false)} 
        />
      )}
    </div>
  );
}
