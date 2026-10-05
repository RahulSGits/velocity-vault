export interface CalculatorResult {
  totalInvestment: number;
  estimatedReturns: number;
  totalWealth: number;
  yearlyData: YearlyGrowth[];
}

export interface YearlyGrowth {
  year: number;
  invested: number;
  wealth: number;
}

export interface EMITableData {
  month: number;
  principal: number;
  interest: number;
  remaining: number;
}

export type Theme = 'dark' | 'light';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'INR' | 'CAD';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  rate: number; // Rate relative to USD
  label: string;
}

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  INR: { code: 'INR', symbol: '₹', rate: 83.3, label: 'Indian Rupee' },
  USD: { code: 'USD', symbol: '$', rate: 1, label: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, label: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79, label: 'British Pound' },
  JPY: { code: 'JPY', symbol: '¥', rate: 151.4, label: 'Japanese Yen' },
  CAD: { code: 'CAD', symbol: 'C$', rate: 1.35, label: 'Canadian Dollar' },
};
