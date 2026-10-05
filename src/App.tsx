import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThreeBackground } from './components/ThreeBackground';
import { Home } from './pages/Home';
import { SIPCalculator } from './pages/SIPCalculator';
import { SavingsCalculator } from './pages/SavingsCalculator';
import { EMICalculator } from './pages/EMICalculator';
import { RetirementPlanner } from './pages/RetirementPlanner';
import { CompoundInterest } from './pages/CompoundInterest';
import { TaxCalculator } from './pages/TaxCalculator';
import { InflationCalculator } from './pages/InflationCalculator';
import { CryptoCalculator } from './pages/CryptoCalculator';
import { CagriCalculator } from './pages/CagriCalculator';
import { FDRDCalculator } from './pages/FDRDCalculator';
import { CreditCardCalculator } from './pages/CreditCardCalculator';
import { TradingTerminal } from './pages/TradingTerminal';
import { SWPCalculator } from './pages/SWPCalculator';
import { ETFCalculator } from './pages/ETFCalculator';
import { StockAverageCalculator } from './pages/StockAverageCalculator';
import { StockBrokerageCalculator } from './pages/StockBrokerageCalculator';
import { Blog } from './pages/Blog';
import { WealthGoals } from './pages/WealthGoals';
import { Chat } from './pages/Chat';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AIAssistant } from './components/AIAssistant';
import { CurrencyProvider } from './components/CurrencyContext';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Simple scrollToTop on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home onNavigate={setCurrentPage} />;
      case 'sip': return <SIPCalculator />;
      case 'savings': return <SavingsCalculator />;
      case 'emi': return <EMICalculator />;
      case 'retirement': return <RetirementPlanner />;
      case 'compound': return <CompoundInterest />;
      case 'tax': return <TaxCalculator />;
      case 'inflation': return <InflationCalculator />;
      case 'crypto': return <CryptoCalculator />;
      case 'cagr': return <CagriCalculator />;
      case 'trading': return <TradingTerminal onNavigate={setCurrentPage} />;
      case 'swp': return <SWPCalculator />;
      case 'etf': return <ETFCalculator />;
      case 'stock-average': return <StockAverageCalculator />;
      case 'brokerage': return <StockBrokerageCalculator />;
      case 'fd-rd': return <FDRDCalculator />;
      case 'debt': return <CreditCardCalculator />;
      case 'blog': return <Blog />;
      case 'goals': return <WealthGoals />;
      case 'chat': return <Chat onNavigate={setCurrentPage} />;
      default: return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <CurrencyProvider>
      <div className="min-h-screen text-white font-sans selection:bg-brand-primary selection:text-white">
        <ThreeBackground />
        
        <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
        
        <main className="relative pt-24 pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>

        <AIAssistant onNavigate={setCurrentPage} />
        <Footer onNavigate={setCurrentPage} />
      </div>
    </CurrencyProvider>
  );
}
