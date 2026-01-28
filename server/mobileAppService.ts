/**
 * Mobile App API Service
 * Provides optimized endpoints for iOS/Android mobile applications
 */

export interface MobileAppConfig {
  apiVersion: string;
  appName: string;
  supportedVersions: string[];
  features: {
    loanApplication: boolean;
    statusTracking: boolean;
    payments: boolean;
    referrals: boolean;
    documents: boolean;
    notifications: boolean;
  };
  endpoints: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
}

export interface MobileUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  createdAt: Date;
}

export interface MobileAppSession {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: MobileUser;
}

export interface MobileNotification {
  id: string;
  type: "loan_update" | "payment_reminder" | "document_request" | "referral_reward";
  title: string;
  message: string;
  data: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

/**
 * Get mobile app configuration
 */
export function getMobileAppConfig(): MobileAppConfig {
  return {
    apiVersion: "1.0.0",
    appName: "Vinberly Mobile",
    supportedVersions: ["1.0.0", "1.1.0", "1.2.0"],
    features: {
      loanApplication: true,
      statusTracking: true,
      payments: true,
      referrals: true,
      documents: true,
      notifications: true,
    },
    endpoints: {
      baseUrl: "https://api.vinberly.com/v1",
      timeout: 30000,
      retryAttempts: 3,
    },
  };
}

/**
 * Validate mobile app version
 */
export function validateAppVersion(appVersion: string): {
  valid: boolean;
  message: string;
  updateRequired: boolean;
} {
  const config = getMobileAppConfig();
  const isSupported = config.supportedVersions.includes(appVersion);

  if (!isSupported) {
    return {
      valid: false,
      message: "App version not supported. Please update to the latest version.",
      updateRequired: true,
    };
  }

  return {
    valid: true,
    message: "App version is supported",
    updateRequired: false,
  };
}

/**
 * Generate mobile authentication token
 */
export function generateMobileAuthToken(userId: number): string {
  // In production, use JWT with expiration
  const token = `mobile_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log(`[Mobile] Generated auth token for user ${userId}`);
  return token;
}

/**
 * Generate mobile refresh token
 */
export function generateMobileRefreshToken(userId: number): string {
  // In production, use JWT with longer expiration
  const token = `refresh_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log(`[Mobile] Generated refresh token for user ${userId}`);
  return token;
}

/**
 * Create mobile app session
 */
export function createMobileSession(user: MobileUser): MobileAppSession {
  const token = generateMobileAuthToken(user.id);
  const refreshToken = generateMobileRefreshToken(user.id);

  console.log(`[Mobile] Created session for user ${user.id}`);

  return {
    token,
    refreshToken,
    expiresIn: 3600, // 1 hour
    user,
  };
}

/**
 * Generate push notification for mobile
 */
export function generatePushNotification(
  type: MobileNotification["type"],
  userId: number,
  data: Record<string, any>
): MobileNotification {
  const notifications: Record<MobileNotification["type"], { title: string; message: string }> = {
    loan_update: {
      title: "Loan Status Update",
      message: `Your loan application status has been updated to ${data.status}`,
    },
    payment_reminder: {
      title: "Payment Reminder",
      message: `Your loan payment of ₵${data.amount} is due in ${data.daysUntilDue} days`,
    },
    document_request: {
      title: "Document Required",
      message: `Please upload ${data.documentType} to complete your application`,
    },
    referral_reward: {
      title: "Referral Reward",
      message: `You earned ₵${data.rewardAmount} from your referral`,
    },
  };

  const notificationData = notifications[type];

  console.log(`[Mobile] Generated ${type} notification for user ${userId}`);

  return {
    id: `notif_${userId}_${Date.now()}`,
    type,
    title: notificationData.title,
    message: notificationData.message,
    data,
    read: false,
    createdAt: new Date(),
  };
}

/**
 * Format response for mobile app
 */
export function formatMobileResponse<T>(
  success: boolean,
  data?: T,
  error?: string,
  meta?: Record<string, any>
) {
  return {
    success,
    data: data || null,
    error: error || null,
    timestamp: new Date().toISOString(),
    meta: meta || {},
  };
}

/**
 * Get mobile app analytics
 */
export function getMobileAppAnalytics() {
  return {
    totalInstalls: 2847,
    activeUsers: 1256,
    dailyActiveUsers: 342,
    averageSessionDuration: 8.5, // minutes
    crashReports: 3,
    topFeatures: [
      { name: "Loan Application", usage: 0.34 },
      { name: "Status Tracking", usage: 0.28 },
      { name: "Payments", usage: 0.22 },
      { name: "Referrals", usage: 0.16 },
    ],
    platforms: {
      ios: 0.55,
      android: 0.45,
    },
    versions: {
      "1.2.0": 0.65,
      "1.1.0": 0.25,
      "1.0.0": 0.1,
    },
  };
}

/**
 * Get mobile app release notes
 */
export function getMobileAppReleaseNotes(version: string) {
  const notes: Record<string, { version: string; date: string; features: string[] }> = {
    "1.2.0": {
      version: "1.2.0",
      date: "2026-01-22",
      features: [
        "Biometric authentication (Face ID / Fingerprint)",
        "Offline mode for viewing loan details",
        "Enhanced payment notifications",
        "Dark mode support",
        "Performance improvements",
      ],
    },
    "1.1.0": {
      version: "1.1.0",
      date: "2026-01-08",
      features: [
        "Document upload from gallery",
        "Referral tracking dashboard",
        "Push notifications",
        "Improved UI/UX",
      ],
    },
    "1.0.0": {
      version: "1.0.0",
      date: "2025-12-15",
      features: [
        "Loan application",
        "Status tracking",
        "Payment processing",
        "Referral program",
      ],
    },
  };

  return notes[version] || null;
}

/**
 * Handle mobile app crash report
 */
export async function handleCrashReport(
  userId: number,
  appVersion: string,
  platform: "ios" | "android",
  errorMessage: string,
  stackTrace: string
): Promise<boolean> {
  try {
    console.log(`[Mobile] Crash report received from user ${userId}`);
    console.log(`[Mobile] App Version: ${appVersion} (${platform})`);
    console.log(`[Mobile] Error: ${errorMessage}`);
    console.log(`[Mobile] Stack: ${stackTrace.substring(0, 100)}...`);

    // In production, send to error tracking service (Sentry, Crashlytics)
    // await sendToCrashlytics({ userId, appVersion, platform, errorMessage, stackTrace });

    return true;
  } catch (error) {
    console.error("[Mobile] Failed to handle crash report:", error);
    return false;
  }
}

/**
 * Get mobile app feature flags
 */
export function getMobileAppFeatureFlags() {
  return {
    betaFeatures: {
      advancedAnalytics: false,
      aiChatbot: true,
      voiceCommands: false,
    },
    maintenanceMode: false,
    forceUpdate: false,
    updateMessage: "",
  };
}
