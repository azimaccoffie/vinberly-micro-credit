/**
 * Loan Syndication Service
 * Enables multiple lenders to co-fund loans and share risk
 */

export interface Lender {
  id: number;
  name: string;
  email: string;
  availableCapital: number;
  minLoanAmount: number;
  maxLoanAmount: number;
  interestRate: number;
  riskTolerance: "low" | "medium" | "high";
  status: "active" | "inactive";
}

export interface SyndicatedLoan {
  id: number;
  applicationId: number;
  totalLoanAmount: number;
  loanPurpose: string;
  status: "pending" | "syndicated" | "funded" | "active" | "closed";
  syndicate: LenderAllocation[];
  createdAt: Date;
  fundedAt?: Date;
  closedAt?: Date;
}

export interface LenderAllocation {
  lenderId: number;
  lenderName: string;
  allocatedAmount: number;
  percentage: number;
  interestRate: number;
  status: "pending" | "committed" | "funded" | "repaid";
  commitmentDate?: Date;
  fundingDate?: Date;
}

export interface SyndicationProposal {
  loanId: number;
  totalAmount: number;
  targetLenders: number[];
  proposedAllocations: LenderAllocation[];
  createdAt: Date;
  expiresAt: Date;
  status: "open" | "closed" | "accepted" | "rejected";
}

export interface SyndicationMetrics {
  totalSyndicatedLoans: number;
  totalSyndicatedAmount: number;
  averageSyndicateSize: number;
  successRate: number;
  averageFundingTime: number; // hours
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
}

/**
 * Create a syndication proposal for a loan
 */
export function createSyndicationProposal(
  loanId: number,
  totalAmount: number,
  availableLenders: Lender[]
): SyndicationProposal {
  try {
    // Filter lenders based on loan amount and risk tolerance
    const suitableLenders = availableLenders.filter(
      (lender) =>
        lender.status === "active" &&
        lender.availableCapital >= totalAmount / 3 &&
        lender.minLoanAmount <= totalAmount &&
        lender.maxLoanAmount >= totalAmount
    );

    if (suitableLenders.length === 0) {
      throw new Error("No suitable lenders available for syndication");
    }

    // Calculate allocations based on lender capacity
    const allocations = calculateAllocations(totalAmount, suitableLenders);

    const proposal: SyndicationProposal = {
      loanId,
      totalAmount,
      targetLenders: suitableLenders.map((l) => l.id),
      proposedAllocations: allocations,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      status: "open",
    };

    console.log(`[Syndication] Created proposal for loan ${loanId} with ${suitableLenders.length} lenders`);
    return proposal;
  } catch (error) {
    console.error("[Syndication] Failed to create proposal:", error);
    throw error;
  }
}

/**
 * Calculate fair allocations for lenders
 */
function calculateAllocations(totalAmount: number, lenders: Lender[]): LenderAllocation[] {
  const allocations: LenderAllocation[] = [];

  // Sort lenders by available capital (descending)
  const sortedLenders = [...lenders].sort((a, b) => b.availableCapital - a.availableCapital);

  let remainingAmount = totalAmount;
  const baseAllocation = totalAmount / sortedLenders.length;

  sortedLenders.forEach((lender) => {
    const allocatedAmount = Math.min(
      Math.max(baseAllocation, lender.minLoanAmount),
      Math.min(lender.maxLoanAmount, remainingAmount)
    );

    allocations.push({
      lenderId: lender.id,
      lenderName: lender.name,
      allocatedAmount,
      percentage: (allocatedAmount / totalAmount) * 100,
      interestRate: lender.interestRate,
      status: "pending",
    });

    remainingAmount -= allocatedAmount;
  });

  return allocations;
}

/**
 * Get lender syndication dashboard
 */
export function getLenderDashboard(lenderId: number) {
  return {
    lenderId,
    totalCapital: 500000,
    availableCapital: 250000,
    deployedCapital: 250000,
    syndicatedLoans: 12,
    activeInvestments: 8,
    completedInvestments: 4,
    totalReturns: 45000,
    averageROI: 0.09, // 9%
    portfolioRisk: {
      low: 0.4,
      medium: 0.45,
      high: 0.15,
    },
    recentSyndications: [
      {
        loanId: 101,
        allocatedAmount: 25000,
        percentage: 25,
        status: "active",
        expectedReturn: 2250,
      },
      {
        loanId: 102,
        allocatedAmount: 20000,
        percentage: 20,
        status: "active",
        expectedReturn: 1800,
      },
    ],
  };
}

/**
 * Process lender commitment
 */
export async function processLenderCommitment(
  loanId: number,
  lenderId: number,
  allocatedAmount: number
): Promise<boolean> {
  try {
    console.log(`[Syndication] Lender ${lenderId} committed ₵${allocatedAmount} to loan ${loanId}`);

    // Update lender's available capital
    // Update loan syndicate status
    // Send confirmation email

    return true;
  } catch (error) {
    console.error("[Syndication] Failed to process commitment:", error);
    return false;
  }
}

/**
 * Get syndication statistics
 */
export function getSyndicationStatistics(): SyndicationMetrics {
  return {
    totalSyndicatedLoans: 145,
    totalSyndicatedAmount: 2500000,
    averageSyndicateSize: 3.2,
    successRate: 0.96,
    averageFundingTime: 18.5,
    riskDistribution: {
      low: 0.65,
      medium: 0.28,
      high: 0.07,
    },
  };
}

/**
 * Calculate syndication returns for lender
 */
export function calculateSyndicationReturns(
  allocatedAmount: number,
  interestRate: number,
  loanTerm: number
): { totalReturn: number; roi: number; monthlyReturn: number } {
  const totalReturn = allocatedAmount * interestRate * (loanTerm / 12);
  const roi = (totalReturn / allocatedAmount) * 100;
  const monthlyReturn = totalReturn / loanTerm;

  return {
    totalReturn: Math.round(totalReturn),
    roi: Math.round(roi * 100) / 100,
    monthlyReturn: Math.round(monthlyReturn),
  };
}

/**
 * Get syndication performance report
 */
export function getSyndicationPerformanceReport(lenderId: number) {
  return {
    lenderId,
    period: "2026-01",
    totalInvested: 250000,
    activeLoans: 8,
    completedLoans: 4,
    defaultedLoans: 0,
    defaultRate: 0,
    totalReturns: 22500,
    averageROI: 0.09,
    performanceVsTarget: 1.05, // 5% above target
    topPerformingLoans: [
      { loanId: 101, roi: 0.12, status: "active" },
      { loanId: 102, roi: 0.11, status: "active" },
      { loanId: 103, roi: 0.1, status: "completed" },
    ],
  };
}

/**
 * Validate syndication feasibility
 */
export function validateSyndicationFeasibility(
  loanAmount: number,
  availableLenders: Lender[]
): { feasible: boolean; reason: string; estimatedFundingTime: number } {
  const totalCapacity = availableLenders
    .filter((l) => l.status === "active")
    .reduce((sum, l) => sum + l.availableCapital, 0);

  if (totalCapacity < loanAmount) {
    return {
      feasible: false,
      reason: `Insufficient total lender capacity. Need ₵${loanAmount}, available ₵${totalCapacity}`,
      estimatedFundingTime: 0,
    };
  }

  const suitableLenders = availableLenders.filter(
    (l) =>
      l.status === "active" &&
      l.availableCapital >= loanAmount / 3 &&
      l.minLoanAmount <= loanAmount &&
      l.maxLoanAmount >= loanAmount
  );

  if (suitableLenders.length < 2) {
    return {
      feasible: false,
      reason: `Insufficient suitable lenders. Need at least 2, found ${suitableLenders.length}`,
      estimatedFundingTime: 0,
    };
  }

  return {
    feasible: true,
    reason: "Syndication is feasible",
    estimatedFundingTime: 24, // hours
  };
}
