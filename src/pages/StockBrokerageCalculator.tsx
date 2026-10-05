import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Calculator, 
  Scale, 
  Percent, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Info,
  ArrowRight,
  Receipt
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useCurrency } from '../components/CurrencyContext';

type TradeSegment = 'delivery' | 'intraday' | 'futures' | 'options';

export function StockBrokerageCalculator() {
  const { currency, formatValue } = useCurrency();

  const [segment, setSegment] = useState<TradeSegment>('delivery');
  const [exchange, setExchange] = useState<'NSE' | 'BSE' | 'US'>('NSE');
  const [buyPrice, setBuyPrice] = useState(1500);
  const [sellPrice, setSellPrice] = useState(1620);
  const [quantity, setQuantity] = useState(100);
  const [brokerageFlat, setBrokerageFlat] = useState(20); // 20 per executed order or 0

  const calculations = useMemo(() => {
    const buyTurnover = buyPrice * quantity;
    const sellTurnover = sellPrice * quantity;
    const totalTurnover = buyTurnover + sellTurnover;
    const grossPnl = sellTurnover - buyTurnover;

    let brokerage = 0;
    let stt = 0;
    let exchangeCharges = 0;
    let sebiCharges = (totalTurnover * 0.0001) / 100; // ₹10 per crore
    let stampDuty = 0;

    if (exchange === 'US') {
      // US Market rules: zero commission standard, SEC fees, FINRA TAF
      brokerage = 0;
      stt = 0;
      exchangeCharges = sellTurnover * 0.0000278; // SEC fee on sell
      sebiCharges = 0;
      stampDuty = 0;
    } else {
      // Indian NSE/BSE rules
      if (segment === 'delivery') {
        brokerage = Math.min(brokerageFlat * 2, totalTurnover * 0.001); // max 20 per order or 0.1%
        stt = totalTurnover * 0.001; // 0.1% on buy & sell
        exchangeCharges = totalTurnover * 0.0000325; // NSE 0.00325%
        stampDuty = buyTurnover * 0.00015; // 0.015% on buy
      } else if (segment === 'intraday') {
        brokerage = Math.min(brokerageFlat * 2, totalTurnover * 0.0003); // ₹20 or 0.03%
        stt = sellTurnover * 0.00025; // 0.025% on sell only
        exchangeCharges = totalTurnover * 0.0000325;
        stampDuty = buyTurnover * 0.00003; // 0.003% on buy
      } else if (segment === 'futures') {
        brokerage = brokerageFlat * 2;
        stt = sellTurnover * 0.0002; // 0.02% on sell
        exchangeCharges = totalTurnover * 0.000019;
        stampDuty = buyTurnover * 0.00002;
      } else if (segment === 'options') {
        brokerage = brokerageFlat * 2;
        stt = sellTurnover * 0.00125; // 0.125% on premium sell
        exchangeCharges = totalTurnover * 0.0005;
        stampDuty = buyTurnover * 0.00003;
      }
    }

    const gst = (brokerage + exchangeCharges) * 0.18; // 18% GST on brokerage + exchange
    const totalTaxesAndCharges = brokerage + stt + exchangeCharges + sebiCharges + stampDuty + gst;
    const netPnl = grossPnl - totalTaxesAndCharges;
    const pointsToBreakeven = quantity > 0 ? totalTaxesAndCharges / quantity : 0;
    const breakevenSellPrice = buyPrice + pointsToBreakeven;
    const roiPercent = buyTurnover > 0 ? (netPnl / buyTurnover) * 100 : 0;

    return {
      buyTurnover: Math.round(buyTurnover),
      sellTurnover: Math.round(sellTurnover),
      totalTurnover: Math.round(totalTurnover),
      grossPnl: Math.round(grossPnl),
      brokerage: Math.round(brokerage * 100) / 100,
      stt: Math.round(stt * 100) / 100,
      exchangeCharges: Math.round(exchangeCharges * 100) / 100,
      sebiCharges: Math.round(sebiCharges * 100) / 100,
      stampDuty: Math.round(stampDuty * 100) / 100,
      gst: Math.round(gst * 100) / 100,
      totalTaxesAndCharges: Math.round(totalTaxesAndCharges * 100) / 100,
      netPnl: Math.round(netPnl * 100) / 100,
      pointsToBreakeven: pointsToBreakeven.toFixed(2),
      breakevenSellPrice: breakevenSellPrice.toFixed(2),
      roiPercent: roiPercent.toFixed(2),
      isProfit: netPnl >= 0,
    };
  }, [segment, exchange, buyPrice, sellPrice, quantity, brokerageFlat]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Scale className="w-3.5 h-3.5" />
            Brokerage, STT & Net P&L Calculator
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/5 text-white/50 border border-white/10">
            Regulatory Tax & Charges Engine
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-white">
          Stock Brokerage & P&L Calculator
        </h1>
        <p className="text-white/50 text-sm md:text-base mt-1">
          Calculate net profit after STT, GST, Exchange charges, SEBI fees, and stamp duty with exact breakeven points.
        </p>
      </div>

      {/* Segment Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex p-1 bg-black/40 rounded-2xl border border-white/10">
          {[
            { id: 'delivery', label: 'Equity Delivery' },
            { id: 'intraday', label: 'Equity Intraday' },
            { id: 'futures', label: 'Futures (F&O)' },
            { id: 'options', label: 'Options (F&O)' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSegment(item.id as TradeSegment)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-semibold transition-all",
                segment === item.id ? "bg-brand-primary text-white shadow-lg" : "text-white/50 hover:text-white"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40 font-medium">Exchange:</span>
          {(['NSE', 'BSE', 'US'] as const).map((ex) => (
            <button
              key={ex}
              onClick={() => setExchange(ex)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border",
                exchange === ex
                  ? "bg-white/15 text-white border-white/20"
                  : "bg-white/5 text-white/50 border-transparent hover:text-white"
              )}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Trade Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 md:p-8 rounded-3xl glass border border-white/10 space-y-6">
            <h2 className="text-lg font-bold text-white">Trade Parameters</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60 block mb-1">Buy Price per Share</label>
                <div className="relative">
                  <input
                    type="number"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(Number(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 text-sm bg-black/40 rounded-xl border border-white/10 text-white font-semibold focus:outline-none focus:border-brand-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-white/60 block mb-1">Sell Price per Share</label>
                <div className="relative">
                  <input
                    type="number"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(Number(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 text-sm bg-black/40 rounded-xl border border-white/10 text-white font-semibold focus:outline-none focus:border-brand-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-white/60 block mb-1">Quantity (Number of Shares)</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 text-sm bg-black/40 rounded-xl border border-white/10 text-white font-semibold focus:outline-none focus:border-brand-primary/50"
                />
              </div>

              {exchange !== 'US' && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">Brokerage Flat Fee per order (Zerodha/Groww/Angel)</span>
                    <span className="font-semibold text-white">₹{brokerageFlat} / order</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={5}
                    value={brokerageFlat}
                    onChange={(e) => setBrokerageFlat(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Breakeven Summary Box */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-amber-300 font-medium">Points to Break Even</span>
                <span className="font-bold text-white">+{calculations.pointsToBreakeven} pts</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-amber-300 font-medium">Breakeven Sell Price</span>
                <span className="font-bold text-amber-400">{currency.symbol}{calculations.breakevenSellPrice}</span>
              </div>
              <p className="text-[10px] text-white/50 pt-1">
                You must sell above {currency.symbol}{calculations.breakevenSellPrice} to make a net profit after all taxes.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Net P&L & Detailed Tax Invoice Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          {/* Net P&L Highlight Card */}
          <div className="p-6 md:p-8 rounded-3xl glass border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                  Net Realized Profit / Loss
                </span>
                <div className={cn(
                  "text-4xl font-display font-bold mt-1",
                  calculations.isProfit ? "text-emerald-400" : "text-rose-400"
                )}>
                  {calculations.isProfit ? '+' : ''}{formatValue(calculations.netPnl)}
                </div>
                <div className="text-xs text-white/50 mt-1">
                  Gross P&L: {calculations.grossPnl >= 0 ? '+' : ''}{formatValue(calculations.grossPnl)} | ROI: {calculations.roiPercent}%
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-right shrink-0">
                <div className="text-[11px] text-white/40">Total Taxes & Brokerage</div>
                <div className="text-lg font-bold text-rose-400 mt-0.5">
                  -{formatValue(calculations.totalTaxesAndCharges)}
                </div>
              </div>
            </div>

            {/* Turnovers Grid */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
              <div className="p-3 rounded-xl bg-white/[0.02]">
                <div className="text-[10px] text-white/40">Buy Turnover</div>
                <div className="text-xs font-bold text-white mt-0.5">{formatValue(calculations.buyTurnover)}</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02]">
                <div className="text-[10px] text-white/40">Sell Turnover</div>
                <div className="text-xs font-bold text-white mt-0.5">{formatValue(calculations.sellTurnover)}</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02]">
                <div className="text-[10px] text-white/40">Total Turnover</div>
                <div className="text-xs font-bold text-white mt-0.5">{formatValue(calculations.totalTurnover)}</div>
              </div>
            </div>
          </div>

          {/* Itemized Contract Note / Tax Invoice */}
          <div className="p-6 md:p-8 rounded-3xl glass border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-amber-400" />
              Itemized Tax & Statutory Charges Breakdown
            </h3>

            <div className="divide-y divide-white/5 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-white/70">Brokerage Fee</span>
                <span className="font-semibold text-white">{formatValue(calculations.brokerage)}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <div>
                  <span className="text-white/70">STT / CTT (Securities Transaction Tax)</span>
                  <span className="text-[10px] text-white/30 block">Government statutory tax</span>
                </div>
                <span className="font-semibold text-white">{formatValue(calculations.stt)}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-white/70">Exchange Transaction Charges (NSE/BSE)</span>
                <span className="font-semibold text-white">{formatValue(calculations.exchangeCharges)}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-white/70">GST (18% on Brokerage + Exchange Charges)</span>
                <span className="font-semibold text-white">{formatValue(calculations.gst)}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-white/70">SEBI Turnover Charges</span>
                <span className="font-semibold text-white">{formatValue(calculations.sebiCharges)}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-white/70">Stamp Duty (State Government)</span>
                <span className="font-semibold text-white">{formatValue(calculations.stampDuty)}</span>
              </div>
              <div className="py-3 flex justify-between items-center text-sm font-bold bg-white/[0.02] px-3 rounded-xl mt-2">
                <span className="text-white">Total Deduction</span>
                <span className="text-rose-400">-{formatValue(calculations.totalTaxesAndCharges)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
