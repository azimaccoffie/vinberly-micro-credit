/**
 * Loan Calculator API Service
 * Provides loan calculation endpoints for external integrations
 */

export interface LoanCalculationRequest {
  loanAmount: number;
  interestRate: number;
  loanTermMonths: number;
}

export interface LoanCalculationResult {
  loanAmount: number;
  interestRate: number;
  loanTermMonths: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  amortizationSchedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
  calculatedAt: Date;
}

/**
 * Calculate monthly loan payment using amortization formula
 * Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
 * Where: M = Monthly payment, P = Principal, r = Monthly rate, n = Number of payments
 */
export function calculateLoanPayment(
  loanAmount: number,
  monthlyInterestRate: number,
  loanTermMonths: number
): LoanCalculationResult {
  try {
    // Convert annual rate to monthly rate if needed
    const monthlyRate = monthlyInterestRate / 100;

    // Calculate monthly payment
    const numerator = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths);
    const denominator = Math.pow(1 + monthlyRate, loanTermMonths) - 1;
    const monthlyPayment = numerator / denominator;

    // Calculate totals
    const totalPayment = monthlyPayment * loanTermMonths;
    const totalInterest = totalPayment - loanAmount;

    // Generate amortization schedule
    const amortizationSchedule = generateAmortizationSchedule(
      loanAmount,
      monthlyRate,
      monthlyPayment,
      loanTermMonths
    );

    console.log(`[Loan Calculator API] Calculation completed`);
    console.log(`[Loan Calculator API] Loan Amount: ₵${loanAmount}`);
    console.log(`[Loan Calculator API] Monthly Payment: ₵${monthlyPayment.toFixed(2)}`);
    console.log(`[Loan Calculator API] Total Interest: ₵${totalInterest.toFixed(2)}`);

    return {
      loanAmount,
      interestRate: monthlyInterestRate,
      loanTermMonths,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      amortizationSchedule,
      calculatedAt: new Date(),
    };
  } catch (error) {
    console.error("[Loan Calculator API] Calculation failed:", error);
    throw error;
  }
}

/**
 * Generate amortization schedule
 */
function generateAmortizationSchedule(
  loanAmount: number,
  monthlyRate: number,
  monthlyPayment: number,
  loanTermMonths: number
): Array<{
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}> {
  const schedule = [];
  let balance = loanAmount;

  for (let month = 1; month <= loanTermMonths; month++) {
    const interest = balance * monthlyRate;
    const principal = monthlyPayment - interest;
    balance -= principal;

    // Ensure balance doesn't go negative due to rounding
    const finalBalance = Math.max(0, balance);

    schedule.push({
      month,
      payment: Math.round(monthlyPayment * 100) / 100,
      principal: Math.round(principal * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.round(finalBalance * 100) / 100,
    });
  }

  return schedule;
}

/**
 * Validate loan calculation request
 */
export function validateLoanRequest(request: LoanCalculationRequest): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!request.loanAmount || request.loanAmount <= 0) {
    errors.push("Loan amount must be greater than 0");
  }

  if (!request.interestRate || request.interestRate < 0) {
    errors.push("Interest rate must be a positive number");
  }

  if (!request.loanTermMonths || request.loanTermMonths <= 0) {
    errors.push("Loan term must be greater than 0 months");
  }

  if (request.loanAmount > 1000000) {
    errors.push("Loan amount exceeds maximum limit of ₵1,000,000");
  }

  if (request.loanTermMonths > 120) {
    errors.push("Loan term cannot exceed 120 months");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get loan products with predefined rates
 */
export function getLoanProducts(): Array<{
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  minTerm: number;
  maxTerm: number;
}> {
  return [
    {
      id: "starter",
      name: "Starter Loan",
      minAmount: 1000,
      maxAmount: 10000,
      interestRate: 3.0,
      minTerm: 3,
      maxTerm: 12,
    },
    {
      id: "growth",
      name: "Growth Loan",
      minAmount: 10000,
      maxAmount: 50000,
      interestRate: 2.5,
      minTerm: 6,
      maxTerm: 24,
    },
    {
      id: "expansion",
      name: "Expansion Loan",
      minAmount: 50000,
      maxAmount: 200000,
      interestRate: 2.0,
      minTerm: 12,
      maxTerm: 36,
    },
    {
      id: "enterprise",
      name: "Enterprise Loan",
      minAmount: 200000,
      maxAmount: 1000000,
      interestRate: 1.5,
      minTerm: 24,
      maxTerm: 60,
    },
  ];
}

/**
 * Calculate loan with product details
 */
export function calculateWithProduct(
  productId: string,
  loanAmount: number,
  loanTermMonths: number
): LoanCalculationResult | { error: string } {
  const products = getLoanProducts();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return { error: "Invalid product ID" };
  }

  if (loanAmount < product.minAmount || loanAmount > product.maxAmount) {
    return { error: `Loan amount must be between ₵${product.minAmount} and ₵${product.maxAmount}` };
  }

  if (loanTermMonths < product.minTerm || loanTermMonths > product.maxTerm) {
    return { error: `Loan term must be between ${product.minTerm} and ${product.maxTerm} months` };
  }

  return calculateLoanPayment(loanAmount, product.interestRate, loanTermMonths);
}
