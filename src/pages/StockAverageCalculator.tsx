import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  TrendingDown, 
  TrendingUp, 
  Calculator, 
  Target, 
  ArrowRight, 
  DollarSign, 
  Percent, 
  Sparkles,
  Layers
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useCurrency } from '../components/CurrencyContext';

interface PurchaseLot {
  id: string;
  price: number;
  quantity: number;
}

export function StockAverageCalculator() {
  const { currency, formatValue } = useCurrency();

  const [lots, setLots] = useState<PurchaseLot[]>([
    { id: '1', price: 150, quantity: 50 },
    { id: '2', price: 120, quantity: 75 },
    { id: '3', price: 95, quantity: 100 },
  ]);

  const [currentMarketPrice, setCurrentMarketPrice] = useState(135);

  // Target Average Planner
  const [desiredAverage, setDesiredAverage] = useState(115);
  const [newBuyPrice, setNewBuyPrice] = useState(90);

  // Add new lot
  const handleAddLot = () => {
    setLots([
      ...lots,
      { id: Date.now().toString(), price: currentMarketPrice, quantity: 20 },
    ]);
  };

  // Remove lot
  const handleRemoveLot = (id: string) => {
    if (lots.length > 1) {
      setLots(lots.filter((lot) => lot.id !== id));
    }
  };

  // Update lot
  const handleUpdateLot = (id: string, field: 'price' | 'quantity', val: number) => {
    setLots(
      lots.map((lot) => (lot.id === id ? { ...lot, [field]: Math.max(0, val) } : lot))
    );
  };

  // Calculations
  const metrics = useMemo(() => {
    let totalQty = 0;
    let totalInvested = 0;

    lots.forEach((lot) => {
      totalQty += lot.quantity;
      totalInvested += lot.price * lot.quantity;
    });

    const averagePrice = totalQty > 0 ? totalInvested / totalQty : 0;
    const currentValue = totalQty * currentMarketPrice;
    const profitLoss = currentValue - totalInvested;
    const pnlPercent = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

    // Required Shares to achieve Desired Average
    // New Avg = (TotalInvested + X * NewBuyPrice) / (TotalQty + X)
    // DesiredAvg * (TotalQty + X) = TotalInvested + X * NewBuyPrice
    // DesiredAvg * TotalQty + DesiredAvg * X = TotalInvested + X * NewBuyPrice
    // X * (DesiredAvg - NewBuyPrice) = TotalInvested - DesiredAvg * TotalQty
    // X = (TotalInvested - DesiredAvg * TotalQty) / (DesiredAvg - NewBuyPrice)
    let requiredSharesToTarget = 0;
    let additionalCapitalNeeded = 0;

    if (desiredAverage !== newBuyPrice) {
      const numerator = totalInvested - desiredAverage * totalQty;
      const denominator = desiredAverage - newBuyPrice;
      const calculatedX = numerator / denominator;
      if (calculatedX > 0) {
        requiredSharesToTarget = Math.ceil(calculatedX);
        additionalCapitalNeeded = requiredSharesToTarget * newBuyPrice;
      }
    }

    return {
      totalQty,
      totalInvested: Math.round(totalInvested),
      averagePrice: averagePrice.toFixed(2),
      currentValue: Math.round(currentValue),
      profitLoss: Math.round(profitLoss),
      pnlPercent: pnlPercent.toFixed(2),
      isProfit: profitLoss >= 0,
      requiredSharesToTarget,
      additionalCapitalNeeded,
    };
  }, [lots, currentMarketPrice, desiredAverage, newBuyPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <TrendingDown className="w-3.5 h-3.5" />
            Stock Average & Dip Calculator
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/5 text-white/50 border border-white/10">
            Weighted Average & Target Planner
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-white">
          Stock Average Calculator
        </h1>
        <p className="text-white/50 text-sm md:text-base mt-1">
          Calculate your weighted average share price across multiple tranches and plan buy-the-dip targets with exact share math.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Purchase Lots Entry */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 md:p-8 rounded-3xl glass border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Purchase Lots (Tranches)</h2>
                <p className="text-xs text-white/40">Enter buy prices and quantities for each transaction</p>
              </div>
              <button
                onClick={handleAddLot}
                className="px-3.5 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primary/90 transition-all flex items-center gap-1.5 shadow-lg shadow-brand-primary/20"
              >
                <Plus className="w-4 h-4" /> Add Purchase Lot
              </button>
            </div>

            {/* Lots List */}
            <div className="space-y-3">
              <AnimatePresence>
                {lots.map((lot, index) => (
                  <motion.div
                    key={lot.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white/60">
                        #{index + 1}
                      </div>
                      <span className="text-xs font-semibold text-white/80">Lot {index + 1}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 w-full sm:w-auto">
                      <div>
                        <label className="text-[10px] text-white/40 block mb-1">Buy Price</label>
                        <input
                          type="number"
                          value={lot.price}
                          onChange={(e) => handleUpdateLot(lot.id, 'price', Number(e.target.value))}
                          className="w-full sm:w-28 px-3 py-1.5 text-xs bg-black/40 rounded-xl border border-white/10 text-white font-semibold focus:outline-none focus:border-brand-primary/50"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-white/40 block mb-1">Quantity</label>
                        <input
                          type="number"
                          value={lot.quantity}
                          onChange={(e) => handleUpdateLot(lot.id, 'quantity', Number(e.target.value))}
                          className="w-full sm:w-24 px-3 py-1.5 text-xs bg-black/40 rounded-xl border border-white/10 text-white font-semibold focus:outline-none focus:border-brand-primary/50"
                        />
                      </div>

                      <div className="col-span-2 sm:col-auto flex items-center justify-between sm:justify-start gap-3 pt-1 sm:pt-0">
                        <div className="text-right sm:text-left sm:w-28">
                          <div className="text-[10px] text-white/40">Total Cost</div>
                          <div className="text-xs font-bold text-white">
                            {formatValue(lot.price * lot.quantity)}
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveLot(lot.id)}
                          disabled={lots.length <= 1}
                          className={cn(
                            "p-2 rounded-xl text-white/40 transition-colors",
                            lots.length > 1 ? "hover:text-rose-400 hover:bg-rose-500/10" : "opacity-20 cursor-not-allowed"
                          )}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Current Market Price (CMP) Slider */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Current Market Price (CMP)</span>
                <span className="font-bold text-emerald-400 text-base">{formatValue(currentMarketPrice)}</span>
              </div>
              <input
                type="number"
                value={currentMarketPrice}
                onChange={(e) => setCurrentMarketPrice(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm bg-black/40 rounded-xl border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* Target Average Planner (Buy The Dip Engine) */}
          <div className="p-6 md:p-8 rounded-3xl glass border border-blue-500/20 space-y-6 bg-blue-500/[0.02]">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Target className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="text-base font-bold text-white">Target Average Planner (Buy The Dip)</h3>
                <p className="text-xs text-white/40">Calculate exact units to buy at dip price to reach target average</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/60 block mb-1">Target Desired Average</label>
                <input
                  type="number"
                  value={desiredAverage}
                  onChange={(e) => setDesiredAverage(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-black/40 rounded-xl border border-blue-500/30 text-white"
                />
              </div>

              <div>
                <label className="text-xs text-white/60 block mb-1">Dip Buy Price</label>
                <input
                  type="number"
                  value={newBuyPrice}
                  onChange={(e) => setNewBuyPrice(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-black/40 rounded-xl border border-white/10 text-white"
                />
              </div>
            </div>

            {metrics.requiredSharesToTarget > 0 ? (
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-blue-300">Action Plan:</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    Buy <span className="text-blue-400 text-base">{metrics.requiredSharesToTarget.toLocaleString()} shares</span> at {formatValue(newBuyPrice)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-white/50">Capital Required</div>
                  <div className="text-sm font-bold text-white">{formatValue(metrics.additionalCapitalNeeded)}</div>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/50">
                Enter a target average between your current average ({metrics.averagePrice}) and your dip buy price ({newBuyPrice}) to see required units.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Key Results & Performance */}
        <div className="lg:col-span-5 space-y-6">
          {/* Average Price Highlight Card */}
          <div className="p-6 md:p-8 rounded-3xl glass border border-white/10 relative overflow-hidden space-y-6">
            <div>
              <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                Weighted Average Price
              </span>
              <div className="text-4xl font-display font-bold text-white mt-1">
                {currency.symbol}{metrics.averagePrice}
              </div>
              <p className="text-xs text-white/50 mt-1">Across {metrics.totalQty.toLocaleString()} total accumulated shares</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
              <div>
                <div className="text-[11px] text-white/40">Total Capital Invested</div>
                <div className="text-base font-bold text-white mt-0.5">{formatValue(metrics.totalInvested)}</div>
              </div>
              <div>
                <div className="text-[11px] text-white/40">Current Holding Value</div>
                <div className="text-base font-bold text-white mt-0.5">{formatValue(metrics.currentValue)}</div>
              </div>
            </div>

            {/* P&L Badge Card */}
            <div className={cn(
              "p-4 rounded-2xl border flex items-center justify-between",
              metrics.isProfit 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                : "bg-rose-500/10 border-rose-500/20 text-rose-400"
            )}>
              <div className="flex items-center gap-2.5">
                {metrics.isProfit ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                <div>
                  <div className="text-xs font-medium">Unrealized P&L</div>
                  <div className="text-lg font-bold">
                    {metrics.isProfit ? '+' : ''}{formatValue(metrics.profitLoss)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium">Return %</div>
                <div className="text-lg font-bold">
                  {metrics.isProfit ? '+' : ''}{metrics.pnlPercent}%
                </div>
              </div>
            </div>
          </div>

          {/* Quick Holding Distribution */}
          <div className="p-6 rounded-3xl glass border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Tranche Allocation Breakdown</span>
              <Layers className="w-4 h-4 text-white/40" />
            </h3>

            <div className="space-y-2.5">
              {lots.map((lot, idx) => {
                const percentage = metrics.totalInvested > 0 ? ((lot.price * lot.quantity) / metrics.totalInvested) * 100 : 0;
                return (
                  <div key={lot.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/70">Lot #{idx + 1} ({lot.quantity} @ {formatValue(lot.price)})</span>
                      <span className="font-semibold text-white">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
