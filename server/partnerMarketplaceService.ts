/**
 * Partner Marketplace Service
 * Enables ecosystem of third-party service providers
 */

export interface Partner {
  partnerId: number;
  name: string;
  category: "insurance" | "accounting" | "business_services" | "technology" | "other";
  logo: string;
  description: string;
  website: string;
  email: string;
  phone: string;
  status: "pending" | "active" | "inactive";
  joinedAt: Date;
  commission: number; // percentage
  rating: number; // 1-5
  reviews: number;
}

export interface PartnerService {
  serviceId: number;
  partnerId: number;
  name: string;
  description: string;
  category: string;
  price: number;
  pricingModel: "flat" | "percentage" | "subscription";
  features: string[];
  targetAudience: string;
  status: "active" | "inactive";
  createdAt: Date;
  integrationUrl?: string;
}

export interface PartnerIntegration {
  integrationId: number;
  partnerId: number;
  serviceId: number;
  apiKey: string;
  webhookUrl: string;
  status: "connected" | "disconnected" | "error";
  lastSync: Date;
  syncFrequency: "realtime" | "hourly" | "daily";
}

export interface PartnerTransaction {
  transactionId: number;
  partnerId: number;
  serviceId: number;
  customerId: number;
  amount: number;
  commission: number;
  status: "pending" | "completed" | "failed";
  timestamp: Date;
  referenceId: string;
}

export interface PartnerAnalytics {
  partnerId: number;
  totalTransactions: number;
  totalRevenue: number;
  totalCommission: number;
  activeUsers: number;
  conversionRate: number;
  averageRating: number;
  topServices: { serviceId: number; name: string; revenue: number }[];
}

/**
 * Create partner account
 */
export function createPartner(
  name: string,
  category: string,
  email: string,
  phone: string,
  website: string
): Partner {
  const partner: Partner = {
    partnerId: Math.floor(Math.random() * 10000),
    name,
    category: category as Partner["category"],
    logo: `https://${website}/logo.png`,
    description: "",
    website,
    email,
    phone,
    status: "pending",
    joinedAt: new Date(),
    commission: 0.15, // 15% default
    rating: 0,
    reviews: 0,
  };

  console.log(`[Marketplace] Created partner account: ${name}`);
  return partner;
}

/**
 * Add partner service
 */
export function addPartnerService(
  partnerId: number,
  name: string,
  description: string,
  category: string,
  price: number,
  pricingModel: "flat" | "percentage" | "subscription",
  features: string[]
): PartnerService {
  const service: PartnerService = {
    serviceId: Math.floor(Math.random() * 10000),
    partnerId,
    name,
    description,
    category,
    price,
    pricingModel,
    features,
    targetAudience: "Vinberly Customers",
    status: "active",
    createdAt: new Date(),
  };

  console.log(`[Marketplace] Added service: ${name} by partner ${partnerId}`);
  return service;
}

/**
 * Get marketplace partners
 */
export function getMarketplacePartners(category?: string): Partner[] {
  const partners: Partner[] = [
    {
      partnerId: 1,
      name: "Hollard Insurance",
      category: "insurance",
      logo: "https://logo.clearbit.com/hollard.com.gh",
      description: "Comprehensive business insurance for SMEs in Ghana",
      website: "https://www.hollard.com.gh",
      email: "info@hollard.com.gh",
      phone: "+233 302 742 000",
      status: "active",
      joinedAt: new Date("2025-06-01"),
      commission: 0.2,
      rating: 4.8,
      reviews: 156,
    },
    {
      partnerId: 2,
      name: "QuickBooks",
      category: "accounting",
      logo: "https://logo.clearbit.com/quickbooks.intuit.com",
      description: "Cloud-based accounting software trusted globally",
      website: "https://quickbooks.intuit.com",
      email: "support@intuit.com",
      phone: "+1 800 446 8848",
      status: "active",
      joinedAt: new Date("2025-07-15"),
      commission: 0.15,
      rating: 4.6,
      reviews: 98,
    },
    {
      partnerId: 3,
      name: "Empretec Ghana",
      category: "business_services",
      logo: "https://logo.clearbit.com/empretecghana.org",
      description: "UNCTAD-backed entrepreneurship training and consulting",
      website: "https://empretecghana.org",
      email: "info@empretecghana.org",
      phone: "+233 302 780 555",
      status: "active",
      joinedAt: new Date("2025-08-20"),
      commission: 0.25,
      rating: 4.7,
      reviews: 124,
    },
    {
      partnerId: 4,
      name: "Wave Mobile Money",
      category: "technology",
      logo: "https://logo.clearbit.com/wave.com",
      description: "Mobile money and digital payment solutions",
      website: "https://www.wave.com",
      email: "support@wave.com",
      phone: "+233 55 000 0000",
      status: "active",
      joinedAt: new Date("2025-09-10"),
      commission: 0.18,
      rating: 4.5,
      reviews: 89,
    },
    {
      partnerId: 5,
      name: "GRA Ghana",
      category: "business_services",
      logo: "https://logo.clearbit.com/gra.gov.gh",
      description: "Tax compliance and registration assistance services",
      website: "https://gra.gov.gh",
      email: "info@gra.gov.gh",
      phone: "+233 302 904 545",
      status: "active",
      joinedAt: new Date("2025-05-15"),
      commission: 0.1,
      rating: 4.3,
      reviews: 67,
    },
  ];

  return category ? partners.filter((p) => p.category === category) : partners;
}

/**
 * Get partner services
 */
export function getPartnerServices(partnerId?: number): PartnerService[] {
  const services: PartnerService[] = [
    {
      serviceId: 101,
      partnerId: 1,
      name: "Business Liability Insurance",
      description: "Comprehensive liability coverage for SMEs in Ghana",
      category: "insurance",
      price: 2500,
      pricingModel: "flat",
      features: ["₵100,000 coverage", "24/7 claims support", "Quick approval process"],
      targetAudience: "Loan Applicants",
      status: "active",
      createdAt: new Date(),
    },
    {
      serviceId: 102,
      partnerId: 2,
      name: "QuickBooks Online Subscription",
      description: "Professional accounting software with mobile app",
      category: "accounting",
      price: 1500,
      pricingModel: "subscription",
      features: ["Invoicing & expenses", "Tax compliance", "Financial reports", "Mobile app access"],
      targetAudience: "Loan Customers",
      status: "active",
      createdAt: new Date(),
    },
    {
      serviceId: 103,
      partnerId: 3,
      name: "Empretec Business Training",
      description: "6-day intensive entrepreneurship training program",
      category: "business_services",
      price: 5000,
      pricingModel: "flat",
      features: ["6-day intensive training", "UN certification", "Business plan development", "Networking opportunities"],
      targetAudience: "Loan Recipients",
      status: "active",
      createdAt: new Date(),
    },
    {
      serviceId: 104,
      partnerId: 4,
      name: "Wave Business Account",
      description: "Digital payment solutions for your business",
      category: "technology",
      price: 0,
      pricingModel: "flat",
      features: ["Free account setup", "QR code payments", "Transaction tracking", "Low fees"],
      targetAudience: "All Businesses",
      status: "active",
      createdAt: new Date(),
    },
    {
      serviceId: 105,
      partnerId: 5,
      name: "Tax Registration Package",
      description: "Complete TIN registration and tax compliance setup",
      category: "business_services",
      price: 800,
      pricingModel: "flat",
      features: ["TIN registration", "VAT setup", "Tax filing guidance", "GRA portal access"],
      targetAudience: "New Businesses",
      status: "active",
      createdAt: new Date(),
    },
  ];

  return partnerId ? services.filter((s) => s.partnerId === partnerId) : services;
}

/**
 * Setup partner integration
 */
export function setupPartnerIntegration(
  partnerId: number,
  serviceId: number,
  webhookUrl: string
): PartnerIntegration {
  const integration: PartnerIntegration = {
    integrationId: Math.floor(Math.random() * 10000),
    partnerId,
    serviceId,
    apiKey: `key_${Math.random().toString(36).slice(2)}`,
    webhookUrl,
    status: "connected",
    lastSync: new Date(),
    syncFrequency: "realtime",
  };

  console.log(`[Marketplace] Setup integration for partner ${partnerId}, service ${serviceId}`);
  return integration;
}

/**
 * Process partner transaction
 */
export async function processPartnerTransaction(
  partnerId: number,
  serviceId: number,
  customerId: number,
  amount: number
): Promise<PartnerTransaction> {
  const partners = getMarketplacePartners();
  const partner = partners.find((p) => p.partnerId === partnerId);
  const commission = partner ? amount * partner.commission : 0;

  const transaction: PartnerTransaction = {
    transactionId: Math.floor(Math.random() * 100000),
    partnerId,
    serviceId,
    customerId,
    amount,
    commission,
    status: "completed",
    timestamp: new Date(),
    referenceId: `ref_${Date.now()}`,
  };

  console.log(
    `[Marketplace] Processed transaction: ₵${amount} (Commission: ₵${commission.toFixed(2)})`
  );
  return transaction;
}

/**
 * Get partner analytics
 */
export function getPartnerAnalytics(partnerId: number): PartnerAnalytics {
  return {
    partnerId,
    totalTransactions: 342,
    totalRevenue: 512500,
    totalCommission: 76875,
    activeUsers: 125,
    conversionRate: 0.18,
    averageRating: 4.7,
    topServices: [
      { serviceId: 101, name: "Business Insurance", revenue: 250000 },
      { serviceId: 102, name: "Accounting Services", revenue: 180000 },
      { serviceId: 103, name: "Coaching Program", revenue: 82500 },
    ],
  };
}

/**
 * Get marketplace statistics
 */
export function getMarketplaceStatistics() {
  return {
    totalPartners: 28,
    activePartners: 24,
    totalServices: 156,
    totalTransactions: 8500,
    totalMarketplaceRevenue: 4250000,
    totalCommissionsPaid: 637500,
    topCategories: [
      { category: "insurance", partners: 8, revenue: 1500000 },
      { category: "accounting", partners: 6, revenue: 1200000 },
      { category: "business_services", partners: 5, revenue: 900000 },
      { category: "technology", partners: 3, revenue: 500000 },
      { category: "other", partners: 2, revenue: 150000 },
    ],
    averagePartnerRating: 4.6,
    customerSatisfaction: 4.5,
  };
}

/**
 * Get partner onboarding guide
 */
export function getPartnerOnboardingGuide() {
  return {
    steps: [
      {
        step: 1,
        title: "Application",
        description: "Submit partner application with company details",
        estimatedTime: "1 day",
      },
      {
        step: 2,
        title: "Verification",
        description: "We verify your company and credentials",
        estimatedTime: "3-5 days",
      },
      {
        step: 3,
        title: "Agreement",
        description: "Sign partnership and commission agreement",
        estimatedTime: "1 day",
      },
      {
        step: 4,
        title: "Integration",
        description: "Setup API integration and webhooks",
        estimatedTime: "2-3 days",
      },
      {
        step: 5,
        title: "Testing",
        description: "Test integration in staging environment",
        estimatedTime: "2 days",
      },
      {
        step: 6,
        title: "Launch",
        description: "Go live on marketplace",
        estimatedTime: "1 day",
      },
    ],
    totalEstimatedTime: "10-14 days",
    supportContact: "partners@vinberly.com",
  };
}

/**
 * Get partner commission structure
 */
export function getCommissionStructure() {
  return {
    tiers: [
      {
        tier: "Starter",
        monthlyRevenue: "₵0 - ₵50,000",
        commission: 0.25, // 25%
        features: ["Basic support", "Monthly payouts"],
      },
      {
        tier: "Growth",
        monthlyRevenue: "₵50,000 - ₵200,000",
        commission: 0.2, // 20%
        features: ["Priority support", "Bi-weekly payouts", "Marketing support"],
      },
      {
        tier: "Enterprise",
        monthlyRevenue: "₵200,000+",
        commission: 0.15, // 15%
        features: ["Dedicated account manager", "Weekly payouts", "Co-marketing"],
      },
    ],
    payoutSchedule: "Weekly or Bi-weekly",
    minimumPayout: 1000,
    paymentMethods: ["Bank Transfer", "Mobile Money"],
  };
}

/**
 * Get partner resources
 */
export function getPartnerResources() {
  return {
    documentation: "https://docs.vinberly.com/partners",
    apiReference: "https://api.vinberly.com/docs",
    sdks: ["JavaScript", "Python", "PHP", "Java"],
    webhookEvents: [
      "customer.created",
      "customer.updated",
      "transaction.completed",
      "transaction.failed",
      "service.purchased",
    ],
    supportEmail: "partners@vinberly.com",
    supportPhone: "+233 123 456 789",
    slackChannel: "#vinberly-partners",
  };
}

/**
 * Track partner performance
 */
export function trackPartnerPerformance(partnerId: number) {
  return {
    partnerId,
    period: "2026-01",
    metrics: {
      impressions: 12500,
      clicks: 2150,
      conversions: 385,
      conversionRate: 0.18,
      averageOrderValue: 1330,
      revenue: 512050,
      commission: 76807.5,
    },
    topReferrers: [
      { source: "Email", conversions: 125, revenue: 166250 },
      { source: "In-app", conversions: 180, revenue: 239400 },
      { source: "SMS", conversions: 80, revenue: 106400 },
    ],
    customerFeedback: {
      averageRating: 4.7,
      totalReviews: 156,
      positiveReviews: 142,
      negativeReviews: 14,
    },
  };
}
