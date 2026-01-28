export interface SMSConfig {
  teamPhoneNumbers: string[];
  enabled: boolean;
}

const defaultConfig: SMSConfig = {
  teamPhoneNumbers: ["+233598656465"],
  enabled: true,
};

export async function sendSMSNotification(
  phoneNumber: string,
  message: string
): Promise<boolean> {
  try {
    if (!defaultConfig.enabled) {
      console.log("[SMS] SMS notifications are disabled");
      return false;
    }

    console.log(`[SMS] SMS would be sent to ${phoneNumber}`);
    console.log(`[SMS] Message: ${message}`);
    
    return true;
  } catch (error) {
    console.error("[SMS] Failed to send SMS notification:", error);
    return false;
  }
}

export async function sendTeamAlertSMS(
  applicantName: string,
  businessName: string,
  loanAmount: string
): Promise<boolean> {
  try {
    if (!defaultConfig.enabled) {
      console.log("[SMS] SMS notifications are disabled");
      return false;
    }

    const message = `Vinberly Alert: New loan application from ${applicantName}. Business: ${businessName}. Amount: ${loanAmount}. Check dashboard for details.`;

    for (const phoneNumber of defaultConfig.teamPhoneNumbers) {
      await sendSMSNotification(phoneNumber, message);
    }

    return true;
  } catch (error) {
    console.error("[SMS] Failed to send team alert SMS:", error);
    return false;
  }
}

export function updateSMSConfig(config: Partial<SMSConfig>): void {
  Object.assign(defaultConfig, config);
  console.log("[SMS] SMS configuration updated:", defaultConfig);
}

export function getSMSConfig(): SMSConfig {
  return { ...defaultConfig };
}
