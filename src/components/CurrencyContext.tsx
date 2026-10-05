import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CurrencyCode, Currency, CURRENCIES } from '../types';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (code: CurrencyCode) => void;
  formatValue: (value: number, maximumFractionDigits?: number) => string;
  convertValue: (valueInUSD: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(CURRENCIES.INR);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(CURRENCIES[code]);
  };

  const convertValue = (valueInUSD: number) => {
    return valueInUSD * currency.rate;
  };

  const formatValue = (value: number, maximumFractionDigits = 0) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      maximumFractionDigits,
    }).format(value);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatValue, convertValue }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
