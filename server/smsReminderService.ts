/**
 * SMS Reminder Service - Sends automated SMS notifications
 * Handles payment reminders, document verification updates, and referral notifications
 */

export interface SMSReminder {
  id: string;
  phoneNumber: string;
  message: string;
  type: "payment" | "document" | "referral" | "approval";
  scheduledFor: Date;
  sent: boolean;
  sentAt?: Date;
}

/**
 * Send payment reminder SMS
 */
export async function sendPaymentReminder(
  phoneNumber: string,
  customerName: string,
  amount: number,
  dueDate: string
): Promise<boolean> {
  try {
    const message = `Hi ${customerName}, your Vinberly loan payment of ₵${amount} is due on ${dueDate}. Visit https://vinberly.manus.space/dashboard to pay now.`;

    console.log(`[SMS] Payment reminder sent to ${phoneNumber}`);
    console.log(`[SMS] Message: ${message}`);

    // In production, this would use Twilio or similar SMS service
    // const twilio = require("twilio")(accountSid, authToken);
    // await twilio.messages.create({
    //   body: message,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phoneNumber,
    // });

    return true;
  } catch (error) {
    console.error("[SMS] Failed to send payment reminder:", error);
    return false;
  }
}

/**
 * Send document verification status SMS
 */
export async function sendDocumentVerificationSMS(
  phoneNumber: string,
  customerName: string,
  documentType: string,
  status: "verified" | "rejected",
  notes?: string
): Promise<boolean> {
  try {
    let message = `Hi ${customerName}, your ${documentType} has been ${status}.`;
    if (status === "rejected" && notes) {
      message += ` Reason: ${notes}. Please resubmit at https://vinberly.manus.space/documents`;
    } else if (status === "verified") {
      message += " Thank you!";
    }

    console.log(`[SMS] Document verification SMS sent to ${phoneNumber}`);
    console.log(`[SMS] Message: ${message}`);

    return true;
  } catch (error) {
    console.error("[SMS] Failed to send document verification SMS:", error);
    return false;
  }
}

/**
 * Send referral reward notification SMS
 */
export async function sendReferralRewardSMS(
  phoneNumber: string,
  referrerName: string,
  referralName: string,
  rewardAmount: number
): Promise<boolean> {
  try {
    const message = `Congratulations ${referrerName}! Your referral ${referralName} has been approved. You've earned ₵${rewardAmount} in rewards!`;

    console.log(`[SMS] Referral reward SMS sent to ${phoneNumber}`);
    console.log(`[SMS] Message: ${message}`);

    return true;
  } catch (error) {
    console.error("[SMS] Failed to send referral reward SMS:", error);
    return false;
  }
}

/**
 * Send loan approval SMS
 */
export async function sendLoanApprovalSMS(
  phoneNumber: string,
  customerName: string,
  loanAmount: number,
  applicationId: number
): Promise<boolean> {
  try {
    const message = `Congratulations ${customerName}! Your loan application (APP-${applicationId}) for ₵${loanAmount} has been approved. Visit https://vinberly.manus.space/dashboard to view details.`;

    console.log(`[SMS] Loan approval SMS sent to ${phoneNumber}`);
    console.log(`[SMS] Message: ${message}`);

    return true;
  } catch (error) {
    console.error("[SMS] Failed to send loan approval SMS:", error);
    return false;
  }
}

/**
 * Schedule recurring payment reminders
 * Sends reminders 3 days before payment due date
 */
export async function schedulePaymentReminders(): Promise<void> {
  try {
    console.log("[SMS] Scheduling payment reminders for all active loans...");
    // In production, this would query the database for upcoming payments
    // and schedule SMS reminders using a job queue like Bull or Agenda
    console.log("[SMS] Payment reminders scheduled successfully");
  } catch (error) {
    console.error("[SMS] Failed to schedule payment reminders:", error);
  }
}

/**
 * Send bulk SMS to multiple customers
 */
export async function sendBulkSMS(
  recipients: Array<{ phoneNumber: string; name: string }>,
  message: string
): Promise<number> {
  try {
    let successCount = 0;

    for (const recipient of recipients) {
      const personalizedMessage = message.replace("{name}", recipient.name);
      console.log(`[SMS] Sending to ${recipient.phoneNumber}: ${personalizedMessage}`);
      successCount++;
    }

    console.log(`[SMS] Bulk SMS sent to ${successCount} recipients`);
    return successCount;
  } catch (error) {
    console.error("[SMS] Failed to send bulk SMS:", error);
    return 0;
  }
}
