/**
 * Multi-Currency Support Service
 * Handles currency conversion, exchange rates, and localization
 */

export type SupportedCurrency = "GHS" | "USD" | "EUR" | "GBP" | "NGN" | "KES";

export interface CurrencyRate {
  from: SupportedCurrency;
  to: SupportedCurrency;
  rate: number;
  timestamp: Date;
  source: string;
}

export interface CurrencyConfig {
  code: SupportedCurrency;
  name: string;
  symbol: string;
  decimalPlaces: number;
  country: string;
  isDefault: boolean;
}

export interface ConversionResult {
  originalAmount: number;
  originalCurrency: SupportedCurrency;
  convertedAmount: number;
  targetCurrency: SupportedCurrency;
  exchangeRate: number;
  timestamp: Date;
}

/**
 * Supported currencies configuration
 */
const CURRENCY_CONFIG: Record<SupportedCurrency, CurrencyConfig> = {
  GHS: {
    code: "GHS",
    name: "Ghanaian Cedi",
    symbol: "₵",
    decimalPlaces: 2,
    country: "Ghana",
    isDefault: true,
  },
  USD: {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    decimalPlaces: 2,
    country: "United States",
    isDefault: false,
  },
  EUR: {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    decimalPlaces: 2,
    country: "European Union",
    isDefault: false,
  },
  GBP: {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    decimalPlaces: 2,
    country: "United Kingdom",
    isDefault: false,
  },
  NGN: {
    code: "NGN",
    name: "Nigerian Naira",
    symbol: "₦",
    decimalPlaces: 2,
    country: "Nigeria",
    isDefault: false,
  },
  KES: {
    code: "KES",
    name: "Kenyan Shilling",
    symbol: "KSh",
    decimalPlaces: 2,
    country: "Kenya",
    isDefault: false,
  },
};

/**
 * Current exchange rates (in production, fetch from API)
 */
const EXCHANGE_RATES: Record<string, number> = {
  "GHS-USD": 0.065,
  "GHS-EUR": 0.06,
  "GHS-GBP": 0.052,
  "GHS-NGN": 26.5,
  "GHS-KES": 8.2,
  "USD-GHS": 15.38,
  "USD-EUR": 0.92,
  "USD-GBP": 0.8,
  "USD-NGN": 410,
  "USD-KES": 127,
  "EUR-GHS": 16.67,
  "EUR-USD": 1.09,
  "EUR-GBP": 0.87,
  "EUR-NGN": 445,
  "EUR-KES": 138,
  "GBP-GHS": 19.23,
  "GBP-USD": 1.25,
  "GBP-EUR": 1.15,
  "GBP-NGN": 512,
  "GBP-KES": 159,
  "NGN-GHS": 0.038,
  "NGN-USD": 0.0024,
  "NGN-EUR": 0.0022,
  "NGN-GBP": 0.002,
  "NGN-KES": 0.31,
  "KES-GHS": 0.122,
  "KES-USD": 0.0079,
  "KES-EUR": 0.0072,
  "KES-GBP": 0.0063,
  "KES-NGN": 3.25,
};

/**
 * Get supported currencies
 */
export function getSupportedCurrencies(): CurrencyConfig[] {
  return Object.values(CURRENCY_CONFIG);
}

/**
 * Get currency configuration
 */
export function getCurrencyConfig(code: SupportedCurrency): CurrencyConfig | null {
  return CURRENCY_CONFIG[code] || null;
}

/**
 * Convert amount between currencies
 */
export function convertCurrency(
  amount: number,
  fromCurrency: SupportedCurrency,
  toCurrency: SupportedCurrency
): ConversionResult {
  try {
    if (fromCurrency === toCurrency) {
      return {
        originalAmount: amount,
        originalCurrency: fromCurrency,
        convertedAmount: amount,
        targetCurrency: toCurrency,
        exchangeRate: 1,
        timestamp: new Date(),
      };
    }

    const rateKey = `${fromCurrency}-${toCurrency}`;
    const exchangeRate = EXCHANGE_RATES[rateKey];

    if (!exchangeRate) {
      throw new Error(`Exchange rate not available for ${fromCurrency} to ${toCurrency}`);
    }

    const convertedAmount = amount * exchangeRate;

    console.log(`[Currency] Converted ${amount} ${fromCurrency} to ${convertedAmount.toFixed(2)} ${toCurrency}`);

    return {
      originalAmount: amount,
      originalCurrency: fromCurrency,
      convertedAmount: Math.round(convertedAmount * 100) / 100,
      targetCurrency: toCurrency,
      exchangeRate,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("[Currency] Conversion failed:", error);
    throw error;
  }
}

/**
 * Format amount with currency symbol
 */
export function formatCurrency(amount: number, currency: SupportedCurrency): string {
  const config = getCurrencyConfig(currency);
  if (!config) {
    return `${amount} ${currency}`;
  }

  const formattedAmount = amount.toFixed(config.decimalPlaces);
  return `${config.symbol}${formattedAmount}`;
}

/**
 * Get exchange rate between two currencies
 */
export function getExchangeRate(
  fromCurrency: SupportedCurrency,
  toCurrency: SupportedCurrency
): CurrencyRate {
  const rateKey = `${fromCurrency}-${toCurrency}`;
  const rate = EXCHANGE_RATES[rateKey] || 1;

  console.log(`[Currency] Exchange rate: 1 ${fromCurrency} = ${rate} ${toCurrency}`);

  return {
    from: fromCurrency,
    to: toCurrency,
    rate,
    timestamp: new Date(),
    source: "Vinberly Currency Service",
  };
}

/**
 * Get all exchange rates for a currency
 */
export function getAllExchangeRates(baseCurrency: SupportedCurrency): Record<string, number> {
  const rates: Record<string, number> = {};

  Object.keys(CURRENCY_CONFIG).forEach((targetCurrency) => {
    if (baseCurrency !== targetCurrency) {
      const rateKey = `${baseCurrency}-${targetCurrency}`;
      rates[targetCurrency] = EXCHANGE_RATES[rateKey] || 0;
    }
  });

  return rates;
}

/**
 * Validate currency code
 */
export function isValidCurrency(code: string): code is SupportedCurrency {
  return code in CURRENCY_CONFIG;
}

/**
 * Get default currency
 */
export function getDefaultCurrency(): CurrencyConfig {
  return CURRENCY_CONFIG.GHS;
}

/**
 * Get currency by country
 */
export function getCurrencyByCountry(country: string): CurrencyConfig | null {
  const currency = Object.values(CURRENCY_CONFIG).find((c) => c.country === country);
  return currency || null;
}

/**
 * Convert loan amount to multiple currencies
 */
export function convertLoanAmount(
  amount: number,
  fromCurrency: SupportedCurrency,
  targetCurrencies: SupportedCurrency[]
): Record<string, number> {
  const conversions: Record<string, number> = {};

  targetCurrencies.forEach((targetCurrency) => {
    const result = convertCurrency(amount, fromCurrency, targetCurrency);
    conversions[targetCurrency] = result.convertedAmount;
  });

  return conversions;
}

/**
 * Get currency exchange rate history (mock data)
 */
export function getExchangeRateHistory(
  fromCurrency: SupportedCurrency,
  toCurrency: SupportedCurrency,
  days: number = 30
): Array<{ date: Date; rate: number }> {
  const history = [];
  const baseRate = getExchangeRate(fromCurrency, toCurrency).rate;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Mock fluctuation
    const fluctuation = (Math.random() - 0.5) * 0.02;
    const rate = baseRate * (1 + fluctuation);

    history.push({
      date,
      rate: Math.round(rate * 10000) / 10000,
    });
  }

  return history;
}

/**
 * Get multi-currency loan product pricing
 */
export function getMultiCurrencyLoanPricing(loanAmountGHS: number) {
  const currencies: SupportedCurrency[] = ["GHS", "USD", "EUR", "GBP", "NGN", "KES"];
  const pricing: Record<string, { amount: number; interestRate: number; term: number }> = {};

  currencies.forEach((currency) => {
    const converted = convertCurrency(loanAmountGHS, "GHS", currency);
    pricing[currency] = {
      amount: converted.convertedAmount,
      interestRate: 2.5, // Same rate for all currencies
      term: 12, // months
    };
  });

  return pricing;
}
