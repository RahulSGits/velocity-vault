import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  BarChart3, 
  Maximize2, 
  Search, 
  Layers, 
  Calculator, 
  ShieldAlert, 
  ArrowUpRight, 
  ArrowDownRight,
  Flame,
  Globe2,
  DollarSign,
  Percent,
  RefreshCw
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useCurrency } from '../components/CurrencyContext';

const POPULAR_SYMBOLS = [
  { symbol: 'NSE:NIFTY', name: 'NIFTY 50', category: 'India' },
  { symbol: 'BSE:SENSEX', name: 'SENSEX', category: 'India' },
  { symbol: 'NASDAQ:AAPL', name: 'Apple Inc', category: 'US Tech' },
  { symbol: 'NASDAQ:NVDA', name: 'Nvidia Corp', category: 'US Tech' },
  { symbol: 'NASDAQ:TSLA', name: 'Tesla Inc', category: 'US Tech' },
  { symbol: 'AMEX:SPY', name: 'SPDR S&P 500 ETF', category: 'ETFs' },
  { symbol: 'NASDAQ:QQQ', name: 'Invesco QQQ ETF', category: 'ETFs' },
  { symbol: 'BINANCE:BTCUSDT', name: 'Bitcoin / USDT', category: 'Crypto' },
  { symbol: 'BINANCE:ETHUSDT', name: 'Ethereum / USDT', category: 'Crypto' },
  { symbol: 'TVC:GOLD', name: 'Gold Spot', category: 'Commodities' },
];

export function TradingTerminal({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { currency, formatValue } = useCurrency();
  const [selectedSymbol, setSelectedSymbol] = useState('NASDAQ:NVDA');
  const [customSymbolInput, setCustomSymbolInput] = useState('');
  const [activeTab, setActiveTab] = useState<'chart' | 'heatmap' | 'screener' | 'calculator'>('chart');
  const [timeframe, setTimeframe] = useState('D');

  // Real-time Position & Risk Size Calculator state
  const [accountSize, setAccountSize] = useState(10000);
  const [riskPercent, setRiskPercent] = useState(2);
  const [entryPrice, setEntryPrice] = useState(120);
  const [stopLossPrice, setStopLossPrice] = useState(114);
  const [targetPrice, setTargetPrice] = useState(138);

  const containerRef = useRef<HTMLDivElement>(null);
  const widgetScriptRef = useRef<HTMLScriptElement | null>(null);

  // Load TradingView Advanced Chart Widget
  useEffect(() => {
    if (activeTab !== 'chart' || !containerRef.current) return;

    // Clean previous widget
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => {
      if (typeof (window as any).TradingView !== 'undefined' && containerRef.current) {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: selectedSymbol,
          interval: timeframe,
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#09090b',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: 'tradingview_widget_container',
          hide_side_toolbar: false,
          studies: [
            'MASimple@tv-basicstudies',
            'RSI@tv-basicstudies',
            'MACD@tv-basicstudies'
          ],
        });
      }
    };

    containerRef.current.appendChild(script);
    widgetScriptRef.current = script;

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [selectedSymbol, timeframe, activeTab]);

  // Position Sizing Calculations
  const riskAmount = (accountSize * riskPercent) / 100;
  const priceRiskPerShare = Math.abs(entryPrice - stopLossPrice);
  const positionQuantity = priceRiskPerShare > 0 ? Math.floor(riskAmount / priceRiskPerShare) : 0;
  const totalPositionValue = positionQuantity * entryPrice;
  const potentialProfitPerShare = Math.abs(targetPrice - entryPrice);
  const totalPotentialProfit = positionQuantity * potentialProfitPerShare;
  const riskRewardRatio = priceRiskPerShare > 0 ? (potentialProfitPerShare / priceRiskPerShare).toFixed(2) : '0';

  const handleApplyCustomSymbol = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSymbolInput.trim()) {
      let sym = customSymbolInput.trim().toUpperCase();
      if (!sym.includes(':')) {
        sym = `NASDAQ:${sym}`;
      }
      setSelectedSymbol(sym);
      setCustomSymbolInput('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Market Terminal
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/5 text-white/50 border border-white/10">
              TradingView Powered
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-white">
            Real-Time Market Terminal
          </h1>
          <p className="text-white/50 text-sm md:text-base mt-1">
            Real-time live charts, technical indicators, instant position sizing, and stock market analytics.
          </p>
        </div>

        {/* Quick Nav Tools */}
        <div className="flex flex-wrap items-center gap-2">
          {onNavigate && (
            <>
              <button
                onClick={() => onNavigate('swp')}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/80 transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                SWP Calculator
              </button>
              <button
                onClick={() => onNavigate('etf')}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/80 transition-all flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                ETF Calculator
              </button>
              <button
                onClick={() => onNavigate('stock-average')}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/80 transition-all flex items-center gap-1.5"
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Stock Average
              </button>
              <button
                onClick={() => onNavigate('brokerage')}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/80 transition-all flex items-center gap-1.5"
              >
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                Brokerage & STT
              </button>
            </>
          )}
        </div>
      </div>

      {/* Symbol Picker & Control Bar */}
      <div className="p-4 rounded-2xl glass border border-white/10 mb-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Popular Symbols */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
          <span className="text-xs font-medium text-white/40 uppercase tracking-wider shrink-0 mr-1">
            Watchlist:
          </span>
          {POPULAR_SYMBOLS.map((item) => (
            <button
              key={item.symbol}
              onClick={() => setSelectedSymbol(item.symbol)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all",
                selectedSymbol === item.symbol
                  ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 border border-brand-primary/40 font-semibold"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5"
              )}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Custom Symbol Search Form */}
        <form onSubmit={handleApplyCustomSymbol} className="flex items-center gap-2 w-full lg:w-auto shrink-0">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ticker (e.g. RELIANCE, TSLA)"
              value={customSymbolInput}
              onChange={(e) => setCustomSymbolInput(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-black/40 rounded-xl border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-primary/50"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white shrink-0 transition-all"
          >
            Load
          </button>
        </form>
      </div>

      {/* Tabs Switcher: Live Chart / Heatmap / Stock Screener */}
      <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('chart')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2",
            activeTab === 'chart'
              ? "bg-white/15 text-white border border-white/20"
              : "text-white/50 hover:text-white hover:bg-white/5"
          )}
        >
          <BarChart3 className="w-4 h-4 text-blue-400" />
          Interactive Live Chart
        </button>
        <button
          onClick={() => setActiveTab('heatmap')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2",
            activeTab === 'heatmap'
              ? "bg-white/15 text-white border border-white/20"
              : "text-white/50 hover:text-white hover:bg-white/5"
          )}
        >
          <Flame className="w-4 h-4 text-orange-400" />
          Market Heatmap
        </button>
        <button
          onClick={() => setActiveTab('screener')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2",
            activeTab === 'screener'
              ? "bg-white/15 text-white border border-white/20"
              : "text-white/50 hover:text-white hover:bg-white/5"
          )}
        >
          <Globe2 className="w-4 h-4 text-emerald-400" />
          Global Screener & Overview
        </button>
      </div>

      {/* Main Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Frame */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'chart' && (
            <div className="p-2 md:p-3 rounded-2xl glass border border-white/10 relative overflow-hidden">
              <div className="h-[550px] w-full rounded-xl overflow-hidden bg-neutral-950/80">
                <div id="tradingview_widget_container" ref={containerRef} className="w-full h-full" />
              </div>
            </div>
          )}

          {activeTab === 'heatmap' && (
            <div className="p-3 rounded-2xl glass border border-white/10">
              <div className="h-[580px] w-full rounded-xl overflow-hidden bg-neutral-950">
                <iframe
                  src="https://s.tradingview.com/embed-widget/stock-heatmap/?locale=en#%7B%22dataSource%22%3A%22SPX500%22%2C%22blockSize%22%3A%22market_cap_calc%22%2C%22blockColor%22%3A%22change%22%2C%22grouping%22%3A%22sector%22%2C%22colorTheme%22%3A%22dark%22%2C%22hasTopBar%22%3Atrue%2C%22isDataSetEnabled%22%3Atrue%7D"
                  className="w-full h-full border-0"
                  title="Stock Heatmap"
                />
              </div>
            </div>
          )}

          {activeTab === 'screener' && (
            <div className="p-3 rounded-2xl glass border border-white/10">
              <div className="h-[580px] w-full rounded-xl overflow-hidden bg-neutral-950">
                <iframe
                  src="https://s.tradingview.com/embed-widget/screener/?locale=en#%7B%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22defaultColumn%22%3A%22overview%22%2C%22defaultScreen%22%3A%22most_capitalized%22%2C%22market%22%3A%22america%22%2C%22showToolbar%22%3Atrue%2C%22colorTheme%22%3A%22dark%22%7D"
                  className="w-full h-full border-0"
                  title="Stock Screener"
                />
              </div>
            </div>
          )}

          {/* Quick Real-Time Market Indices Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'S&P 500', value: '5,980.20', change: '+0.82%', up: true },
              { label: 'NASDAQ 100', value: '20,845.60', change: '+1.14%', up: true },
              { label: 'NIFTY 50', value: '24,650.15', change: '+0.45%', up: true },
              { label: 'BTC / USD', value: '$96,400', change: '+2.85%', up: true },
            ].map((idx, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-[11px] text-white/40 font-medium">{idx.label}</div>
                <div className="text-base font-bold text-white mt-0.5">{idx.value}</div>
                <div className={cn("text-xs font-semibold flex items-center gap-1 mt-0.5", idx.up ? "text-emerald-400" : "text-rose-400")}>
                  {idx.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {idx.change}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Real-Time Position Sizing & Risk Management Engine */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Live Risk & Sizing</h3>
                  <p className="text-[11px] text-white/40">Calculate stop-loss & position units</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                1: {riskRewardRatio} R:R
              </span>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-white/60">Portfolio / Capital Size</span>
                  <span className="font-semibold text-white">{formatValue(accountSize)}</span>
                </div>
                <input
                  type="number"
                  value={accountSize}
                  onChange={(e) => setAccountSize(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-black/40 rounded-xl border border-white/10 text-white focus:outline-none focus:border-brand-primary/50"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-white/60">Max Risk per Trade</span>
                  <span className="font-semibold text-emerald-400">{riskPercent}% ({formatValue(riskAmount)})</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(Number(e.target.value))}
                  className="w-full accent-brand-primary cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Entry Price</label>
                  <input
                    type="number"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 text-xs bg-black/40 rounded-lg border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-rose-400/80 block mb-1">Stop Loss</label>
                  <input
                    type="number"
                    value={stopLossPrice}
                    onChange={(e) => setStopLossPrice(Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 text-xs bg-black/40 rounded-lg border border-rose-500/20 text-rose-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-emerald-400/80 block mb-1">Target Price</label>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 text-xs bg-black/40 rounded-lg border border-emerald-500/20 text-emerald-400"
                  />
                </div>
              </div>
            </div>

            {/* Sizing Output Cards */}
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-brand-primary uppercase tracking-wider font-semibold">
                    Optimal Shares / Quantity
                  </div>
                  <div className="text-2xl font-bold text-white mt-0.5">
                    {positionQuantity.toLocaleString()} <span className="text-xs font-normal text-white/50">Units</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-white/40">Total Exposure</div>
                  <div className="text-xs font-bold text-white/90">{formatValue(totalPositionValue)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <div className="text-[10px] text-rose-400/80 font-medium">Risk if Stopped Out</div>
                  <div className="text-sm font-bold text-rose-400 mt-0.5">
                    -{formatValue(riskAmount)}
                  </div>
                  <div className="text-[10px] text-rose-400/60 mt-0.5">
                    -{priceRiskPerShare.toFixed(2)} / share
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-[10px] text-emerald-400/80 font-medium">Potential Gain at Target</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">
                    +{formatValue(totalPotentialProfit)}
                  </div>
                  <div className="text-[10px] text-emerald-400/60 mt-0.5">
                    +{potentialProfitPerShare.toFixed(2)} / share
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Sizing Insight */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-white/50 leading-relaxed">
              💡 <span className="text-white/80 font-medium">Pro Rule:</span> Never risk more than 1-2% of total capital per trade. With your {riskPercent}% rule, buying {positionQuantity} units caps total drawdown safely at {formatValue(riskAmount)}.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
