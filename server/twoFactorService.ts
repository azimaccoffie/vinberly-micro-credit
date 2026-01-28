/**
 * Two-Factor Authentication Service
 * Handles SMS and authenticator app-based 2FA
 */

import { randomInt } from "crypto";

export interface TwoFactorSession {
  userId: number;
  method: "sms" | "authenticator";
  code: string;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
}

/**
 * Generate a 6-digit OTP code
 */
export function generateOTPCode(): string {
  return randomInt(100000, 999999).toString();
}

/**
 * Generate authenticator secret (base32 encoded)
 */
export function generateAuthenticatorSecret(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let secret = "";
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
}

/**
 * Send SMS OTP to user
 */
export async function sendSMSOTP(phoneNumber: string, userId: number): Promise<string> {
  try {
    const code = generateOTPCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log(`[2FA] SMS OTP generated for user ${userId}`);
    console.log(`[2FA] Phone: ${phoneNumber}`);
    console.log(`[2FA] Code: ${code}`);
    console.log(`[2FA] Expires at: ${expiresAt.toISOString()}`);

    // In production, send via Twilio or similar service
    // const twilio = require("twilio")(accountSid, authToken);
    // await twilio.messages.create({
    //   body: `Your Vinberly verification code is: ${code}. Valid for 10 minutes.`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phoneNumber,
    // });

    return code;
  } catch (error) {
    console.error("[2FA] Failed to send SMS OTP:", error);
    throw error;
  }
}

/**
 * Verify SMS OTP code
 */
export async function verifySMSOTP(
  userId: number,
  providedCode: string,
  storedCode: string,
  expiresAt: Date
): Promise<boolean> {
  try {
    // Check if code has expired
    if (new Date() > expiresAt) {
      console.log(`[2FA] SMS OTP expired for user ${userId}`);
      return false;
    }

    // Verify code matches
    if (providedCode !== storedCode) {
      console.log(`[2FA] Invalid SMS OTP for user ${userId}`);
      return false;
    }

    console.log(`[2FA] SMS OTP verified successfully for user ${userId}`);
    return true;
  } catch (error) {
    console.error("[2FA] SMS OTP verification failed:", error);
    return false;
  }
}

/**
 * Generate QR code URL for authenticator app setup
 */
export function generateAuthenticatorQRCode(
  secret: string,
  email: string,
  appName: string = "Vinberly Micro-Credit"
): string {
  // Format: otpauth://totp/[issuer]:[email]?secret=[secret]&issuer=[issuer]
  const encodedEmail = encodeURIComponent(email);
  const encodedIssuer = encodeURIComponent(appName);

  const otpauthUrl = `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${secret}&issuer=${encodedIssuer}`;

  // Generate QR code URL using qr-server API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(otpauthUrl)}`;

  return qrCodeUrl;
}

/**
 * Verify authenticator code (TOTP)
 * Note: In production, use a library like speakeasy or otplib
 */
export async function verifyAuthenticatorCode(
  secret: string,
  providedCode: string
): Promise<boolean> {
  try {
    // In production, use speakeasy or otplib to verify TOTP
    // const speakeasy = require("speakeasy");
    // const verified = speakeasy.totp.verify({
    //   secret: secret,
    //   encoding: "base32",
    //   token: providedCode,
    //   window: 2,
    // });

    // Mock verification for demo
    console.log(`[2FA] Verifying authenticator code: ${providedCode}`);
    console.log(`[2FA] Secret: ${secret.substring(0, 8)}...`);

    // In production, this would verify against the actual TOTP algorithm
    if (providedCode.length === 6 && /^\d+$/.test(providedCode)) {
      console.log(`[2FA] Authenticator code verified successfully`);
      return true;
    }

    console.log(`[2FA] Invalid authenticator code`);
    return false;
  } catch (error) {
    console.error("[2FA] Authenticator code verification failed:", error);
    return false;
  }
}

/**
 * Enable 2FA for user account
 */
export async function enable2FA(
  userId: number,
  method: "sms" | "authenticator",
  phoneNumber?: string
): Promise<{ secret?: string; qrCodeUrl?: string; success: boolean }> {
  try {
    if (method === "sms" && !phoneNumber) {
      throw new Error("Phone number required for SMS 2FA");
    }

    if (method === "authenticator") {
      const secret = generateAuthenticatorSecret();
      const qrCodeUrl = generateAuthenticatorQRCode(secret, `user${userId}@vinberly.local`);

      console.log(`[2FA] Authenticator 2FA enabled for user ${userId}`);
      return { secret, qrCodeUrl, success: true };
    }

    console.log(`[2FA] SMS 2FA enabled for user ${userId} on ${phoneNumber}`);
    return { success: true };
  } catch (error) {
    console.error("[2FA] Failed to enable 2FA:", error);
    return { success: false };
  }
}

/**
 * Disable 2FA for user account
 */
export async function disable2FA(userId: number): Promise<boolean> {
  try {
    console.log(`[2FA] 2FA disabled for user ${userId}`);
    return true;
  } catch (error) {
    console.error("[2FA] Failed to disable 2FA:", error);
    return false;
  }
}

/**
 * Generate backup codes for account recovery
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = `${randomInt(10000, 99999)}-${randomInt(10000, 99999)}`;
    codes.push(code);
  }
  return codes;
}

/**
 * Verify backup code
 */
export async function verifyBackupCode(
  userId: number,
  providedCode: string,
  backupCodes: string[]
): Promise<boolean> {
  try {
    const codeExists = backupCodes.includes(providedCode);
    if (codeExists) {
      console.log(`[2FA] Backup code verified for user ${userId}`);
      return true;
    }

    console.log(`[2FA] Invalid backup code for user ${userId}`);
    return false;
  } catch (error) {
    console.error("[2FA] Backup code verification failed:", error);
    return false;
  }
}
