/**
 * White-Label Solution Service
 * Enables other microfinance institutions to use Vinberly platform
 */

export interface WhiteLabelClient {
  id: number;
  name: string;
  domain: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  email: string;
  phone: string;
  country: string;
  status: "active" | "inactive" | "trial";
  subscriptionTier: "starter" | "professional" | "enterprise";
  createdAt: Date;
  expiresAt?: Date;
}

export interface WhiteLabelBranding {
  clientId: number;
  companyName: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  customDomain: string;
  emailTemplate: string;
  smsTemplate: string;
  termsOfService: string;
  privacyPolicy: string;
}

export interface WhiteLabelFeatures {
  clientId: number;
  loanApplications: boolean;
  customerPortal: boolean;
  adminDashboard: boolean;
  paymentProcessing: boolean;
  smsNotifications: boolean;
  emailNotifications: boolean;
  referralProgram: boolean;
  documentVerification: boolean;
  creditBureauIntegration: boolean;
  loanSyndication: boolean;
  multiCurrency: boolean;
  customReporting: boolean;
  apiAccess: boolean;
  whiteLabel: boolean;
}

export interface WhiteLabelSubscription {
  clientId: number;
  tier: "starter" | "professional" | "enterprise";
  monthlyFee: number;
  transactionFee: number; // percentage
  features: WhiteLabelFeatures;
  maxUsers: number;
  maxApplications: number;
  supportLevel: "email" | "priority" | "dedicated";
  billingCycle: "monthly" | "annual";
  startDate: Date;
  renewalDate: Date;
}

export interface WhiteLabelMetrics {
  clientId: number;
  totalApplications: number;
  approvedApplications: number;
  totalLoanAmount: number;
  activeUsers: number;
  monthlyRevenue: number;
  apiCallsThisMonth: number;
  uptime: number; // percentage
}

/**
 * Create white-label client
 */
export function createWhiteLabelClient(
  name: string,
  domain: string,
  email: string,
  country: string,
  subscriptionTier: "starter" | "professional" | "enterprise"
): WhiteLabelClient {
  const client: WhiteLabelClient = {
    id: Math.floor(Math.random() * 10000),
    name,
    domain,
    logo: `https://${domain}/logo.png`,
    primaryColor: "#1B5E3F",
    secondaryColor: "#D4A574",
    email,
    phone: "",
    country,
    status: "trial",
    subscriptionTier,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30-day trial
  };

  console.log(`[WhiteLabel] Created client: ${name} (${domain})`);
  return client;
}

/**
 * Get white-label branding configuration
 */
export function getWhiteLabelBranding(clientId: number): WhiteLabelBranding {
  return {
    clientId,
    companyName: "Client Company Name",
    logo: `https://client-domain.com/logo.png`,
    favicon: `https://client-domain.com/favicon.ico`,
    primaryColor: "#1B5E3F",
    secondaryColor: "#D4A574",
    accentColor: "#E8664A",
    fontFamily: "Inter, sans-serif",
    customDomain: "client-domain.com",
    emailTemplate: "professional",
    smsTemplate: "friendly",
    termsOfService: "https://client-domain.com/terms",
    privacyPolicy: "https://client-domain.com/privacy",
  };
}

/**
 * Update white-label branding
 */
export function updateWhiteLabelBranding(
  clientId: number,
  branding: Partial<WhiteLabelBranding>
): WhiteLabelBranding {
  console.log(`[WhiteLabel] Updated branding for client ${clientId}`);

  return {
    clientId,
    companyName: branding.companyName || "Company Name",
    logo: branding.logo || "",
    favicon: branding.favicon || "",
    primaryColor: branding.primaryColor || "#1B5E3F",
    secondaryColor: branding.secondaryColor || "#D4A574",
    accentColor: branding.accentColor || "#E8664A",
    fontFamily: branding.fontFamily || "Inter, sans-serif",
    customDomain: branding.customDomain || "",
    emailTemplate: branding.emailTemplate || "professional",
    smsTemplate: branding.smsTemplate || "friendly",
    termsOfService: branding.termsOfService || "",
    privacyPolicy: branding.privacyPolicy || "",
  };
}

/**
 * Get white-label subscription details
 */
export function getWhiteLabelSubscription(
  clientId: number,
  tier: "starter" | "professional" | "enterprise"
): WhiteLabelSubscription {
  const subscriptions = {
    starter: {
      monthlyFee: 999,
      transactionFee: 0.05,
      maxUsers: 5,
      maxApplications: 100,
      supportLevel: "email" as const,
    },
    professional: {
      monthlyFee: 2999,
      transactionFee: 0.03,
      maxUsers: 25,
      maxApplications: 1000,
      supportLevel: "priority" as const,
    },
    enterprise: {
      monthlyFee: 9999,
      transactionFee: 0.02,
      maxUsers: 500,
      maxApplications: 50000,
      supportLevel: "dedicated" as const,
    },
  };

  const tierConfig = subscriptions[tier];

  return {
    clientId,
    tier,
    monthlyFee: tierConfig.monthlyFee,
    transactionFee: tierConfig.transactionFee,
    features: getWhiteLabelFeatures(clientId, tier),
    maxUsers: tierConfig.maxUsers,
    maxApplications: tierConfig.maxApplications,
    supportLevel: tierConfig.supportLevel,
    billingCycle: "monthly",
    startDate: new Date(),
    renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };
}

/**
 * Get white-label features based on subscription tier
 */
function getWhiteLabelFeatures(
  clientId: number,
  tier: "starter" | "professional" | "enterprise"
): WhiteLabelFeatures {
  const baseFeatures: WhiteLabelFeatures = {
    clientId,
    loanApplications: true,
    customerPortal: true,
    adminDashboard: true,
    paymentProcessing: false,
    smsNotifications: false,
    emailNotifications: true,
    referralProgram: false,
    documentVerification: false,
    creditBureauIntegration: false,
    loanSyndication: false,
    multiCurrency: false,
    customReporting: false,
    apiAccess: false,
    whiteLabel: true,
  };

  if (tier === "professional") {
    return {
      ...baseFeatures,
      paymentProcessing: true,
      smsNotifications: true,
      referralProgram: true,
      documentVerification: true,
      customReporting: true,
      apiAccess: true,
    };
  }

  if (tier === "enterprise") {
    return {
      ...baseFeatures,
      paymentProcessing: true,
      smsNotifications: true,
      referralProgram: true,
      documentVerification: true,
      creditBureauIntegration: true,
      loanSyndication: true,
      multiCurrency: true,
      customReporting: true,
      apiAccess: true,
    };
  }

  return baseFeatures;
}

/**
 * Get white-label client metrics
 */
export function getWhiteLabelMetrics(clientId: number): WhiteLabelMetrics {
  return {
    clientId,
    totalApplications: 342,
    approvedApplications: 285,
    totalLoanAmount: 1250000,
    activeUsers: 42,
    monthlyRevenue: 45000,
    apiCallsThisMonth: 12500,
    uptime: 99.95,
  };
}

/**
 * Get white-label API documentation
 */
export function getWhiteLabelAPIDocumentation(clientId: number) {
  return {
    clientId,
    apiVersion: "1.0.0",
    baseUrl: `https://api.vinberly.com/v1/clients/${clientId}`,
    authentication: "Bearer Token",
    endpoints: [
      {
        method: "POST",
        path: "/applications",
        description: "Submit loan application",
      },
      {
        method: "GET",
        path: "/applications/:id",
        description: "Get application status",
      },
      {
        method: "POST",
        path: "/payments",
        description: "Process payment",
      },
      {
        method: "GET",
        path: "/analytics",
        description: "Get analytics data",
      },
    ],
    rateLimit: {
      requestsPerMinute: 1000,
      requestsPerDay: 100000,
    },
    documentation: "https://docs.vinberly.com/white-label",
  };
}

/**
 * Generate white-label implementation guide
 */
export function generateImplementationGuide(clientId: number, clientName: string) {
  return {
    clientId,
    clientName,
    steps: [
      {
        step: 1,
        title: "Setup Custom Domain",
        description: "Configure DNS records to point to Vinberly platform",
        estimatedTime: "1 hour",
      },
      {
        step: 2,
        title: "Customize Branding",
        description: "Upload logo, set colors, customize email templates",
        estimatedTime: "2 hours",
      },
      {
        step: 3,
        title: "Configure Features",
        description: "Enable/disable features based on subscription tier",
        estimatedTime: "1 hour",
      },
      {
        step: 4,
        title: "Integrate API",
        description: "Connect your systems using REST API",
        estimatedTime: "4 hours",
      },
      {
        step: 5,
        title: "Testing & QA",
        description: "Test all features in staging environment",
        estimatedTime: "8 hours",
      },
      {
        step: 6,
        title: "Go Live",
        description: "Deploy to production",
        estimatedTime: "1 hour",
      },
    ],
    totalEstimatedTime: "17 hours",
    supportContact: "support@vinberly.com",
  };
}

/**
 * Get white-label pricing page
 */
export function getWhiteLabelPricingPage() {
  return {
    title: "Vinberly White-Label Pricing",
    description: "Launch your own micro-credit platform",
    tiers: [
      {
        name: "Starter",
        price: 999,
        period: "month",
        features: [
          "Up to 5 users",
          "100 applications/month",
          "Basic reporting",
          "Email support",
          "Custom domain",
        ],
        cta: "Start Free Trial",
      },
      {
        name: "Professional",
        price: 2999,
        period: "month",
        features: [
          "Up to 25 users",
          "1,000 applications/month",
          "Advanced reporting",
          "Priority support",
          "Payment processing",
          "SMS notifications",
        ],
        cta: "Start Free Trial",
        popular: true,
      },
      {
        name: "Enterprise",
        price: 9999,
        period: "month",
        features: [
          "Unlimited users",
          "Unlimited applications",
          "Custom reporting",
          "Dedicated support",
          "Full API access",
          "Credit bureau integration",
          "Loan syndication",
          "Multi-currency support",
        ],
        cta: "Contact Sales",
      },
    ],
  };
}
