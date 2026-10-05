import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Info, Download, Trash2, Coins, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { useCurrency } from '../components/CurrencyContext';

const COINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', color: '#f7931a' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', color: '#627eea' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', color: '#14f195' },
];

export function CryptoCalculator() {
  const { currency, formatValue } = useCurrency();
  const [investment, setInvestment] = useState(10000);
  const [buyPrice, setBuyPrice] = useState(30000);
  const [sellPrice, setSellPrice] = useState(60000);
  const [selectedCoin, setSelectedCoin] = useState(COINS[0]);

  const results = useMemo(() => {
    const units = investment / buyPrice;
    const currentValue = units * sellPrice;
    const profit = currentValue - investment;
    const roi = (profit / investment) * 100;

    return { units, currentValue, profit, roi };
  }, [investment, buyPrice, sellPrice]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
       <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Crypto Profit Calculator</h1>
          <p className="text-white/40 text-sm md:text-base">Calculate your moon bags or sim your "What if?" moments.</p>
        </div>

      <div className="flex flex-col lg:flex-row gap-12 mt-10">
        <div className="w-full lg:w-[400px] space-y-8">
          <div className="p-6 md:p-8 glass rounded-[2.5rem] border border-white/10 space-y-8">
            <div className="flex gap-2">
              {COINS.map(coin => (
                <button
                  key={coin.id}
                  onClick={() => setSelectedCoin(coin)}
                  className={cn(
                    "flex-1 py-3 px-2 rounded-xl text-[10px] font-bold uppercase transition-all border flex items-center justify-center gap-2",
                    selectedCoin.id === coin.id 
                      ? "bg-white/10 border-white/20 text-white" 
                      : "bg-white/5 border-transparent text-white/40"
                  )}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: coin.color }} />
                  {coin.symbol}
                </button>
              ))}
            </div>

            <InputGroup 
              label="Investment Amount" 
              value={investment} 
              onChange={setInvestment} 
              min={100} 
              max={1000000} 
              step={100}
              suffix={currency.symbol}
            />
            <InputGroup 
              label={`Buy Price (${selectedCoin.symbol})`}
              value={buyPrice} 
              onChange={setBuyPrice} 
              min={0.1} 
              max={200000} 
              step={buyPrice < 100 ? 1 : 100}
              suffix={currency.symbol}
            />
            <InputGroup 
              label={`Sell Price (${selectedCoin.symbol})`}
              value={sellPrice} 
              onChange={setSellPrice} 
              min={0.1} 
              max={1000000} 
              step={sellPrice < 100 ? 1 : 100}
              suffix={currency.symbol}
            />

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => {
                  setInvestment(10000);
                  setBuyPrice(30000);
                  setSellPrice(60000);
                  setSelectedCoin(COINS[0]);
                }}
                className="flex-1 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-white/50 hover:text-white"
              >
                <RefreshCcw size={18} /> Reset
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:flex-1 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ResultCard 
              label="Total Value" 
              value={formatValue(results.currentValue)} 
              primary 
              subValue={`${results.units.toFixed(4)} ${selectedCoin.symbol}`}
            />
            <ResultCard 
              label="Profit / Loss" 
              value={formatValue(results.profit)} 
              trend={results.profit >= 0 ? 'up' : 'down'}
            />
            <ResultCard 
              label="Return (ROI)" 
              value={`${results.roi.toFixed(2)}%`}
              trend={results.roi >= 0 ? 'up' : 'down'}
            />
          </div>

          <div className="glass rounded-[3rem] p-10 border border-white/10 flex flex-col items-center justify-center text-center relative overflow-hidden h-[400px]">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-primary/10 blur-[100px] rounded-full" />
             
             <div className="relative z-10 space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center border border-white/10 mb-4">
                  <Coins size={40} className="text-brand-primary animate-pulse" />
                </div>
                <h3 className="text-3xl font-display font-bold">Moon Bag Analysis</h3>
                <p className="text-white/40 max-w-md mx-auto">
                  If {selectedCoin.name} hits your target price of {formatValue(sellPrice)}, your <span className="text-white font-bold">{formatValue(investment)}</span> investment will grow <span className="text-brand-primary font-bold">{(results.currentValue / investment).toFixed(1)}x</span>.
                </p>
                <div className="pt-4 flex gap-4 justify-center">
                  <div className="px-4 py-2 rounded-full glass border border-white/10 text-[10px] font-bold uppercase text-white/40 tracking-widest">
                    HODL Efficiency: 84%
                  </div>
                   <div className="px-4 py-2 rounded-full glass border border-white/10 text-[10px] font-bold uppercase text-white/40 tracking-widest">
                    Volatility Risk: High
                  </div>
                </div>
             </div>
          </div>
          
          <div className="p-8 glass rounded-[2.5rem] border border-yellow-500/20 bg-yellow-500/5">
            <div className="flex items-start gap-4">
              <Info className="text-yellow-500 mt-1" size={24} />
              <div>
                <h4 className="font-bold text-lg mb-2">Crypto Strategy</h4>
                <p className="text-white/40 text-sm leading-relaxed italic">
                  "Don't invest more than you can afford to lose. Cryptocurrencies are highly volatile assets. Past performance is not indicative of future results."
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

function ResultCard({ label, value, primary, subValue, trend }: any) {
  return (
    <div className={cn(
      "glass rounded-3xl p-6 border transition-all hover:scale-[1.02]",
      primary ? "border-brand-primary/40 bg-brand-primary/10 shadow-[0_0_30px_rgba(59,130,246,0.1)]" : "border-white/10"
    )}>
      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <div>
          <div className={cn(
            "text-2xl font-display font-bold leading-tight",
            trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-white'
          )}>{value}</div>
          {subValue && <div className="text-[10px] text-white/30 font-bold mt-1 uppercase">{subValue}</div>}
        </div>
        {trend === 'up' && <TrendingUp className="text-emerald-400/50" /> }
        {trend === 'down' && <TrendingDown className="text-red-400/50" /> }
      </div>
    </div>
  );
}
