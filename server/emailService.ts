import nodemailer from "nodemailer";
import { invokeLLM } from "./_core/llm";

// Create transporter with Gmail SMTP
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || 
      process.env.EMAIL_USER === "your-email@gmail.com" || 
      process.env.EMAIL_PASS === "your-app-password") {
    return null; // Return null if not configured
  }
  
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export async function sendConfirmationEmail(
  applicantEmail: string,
  applicantName: string,
  applicationId: number,
  businessName: string
): Promise<boolean> {
  try {
    // Generate a professional confirmation email using LLM
    const emailContent = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a professional email writer for a micro-credit company. Write a concise, friendly confirmation email.",
        },
        {
          role: "user",
          content: `Write a confirmation email for a loan application. 
          Applicant name: ${applicantName}
          Business name: ${businessName}
          Application ID: APP-${applicationId}
          Company: Vinberly Micro-Credit
          Contact: +233 (0) 598 656 465
          Email: info@vinberlymicro-credit.com
          
          Include: greeting, confirmation of receipt, application ID, expected review timeline (24-48 hours), and contact information.`,
        },
      ],
    });

    const emailText = typeof emailContent.choices[0]?.message.content === "string" 
      ? emailContent.choices[0].message.content 
      : "";

    // Create email transporter
    const transporter = createTransporter();
    
    if (!transporter) {
      // Fallback to console logging if email not configured
      console.log(`[Email] Email service not configured. Confirmation would be sent to ${applicantEmail} for application ${applicationId}`);
      console.log(`[Email] Content preview: ${emailText.substring(0, 100)}...`);
      return true; // Return true to indicate success for the application flow
    }
    
    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: applicantEmail,
      subject: `Loan Application Confirmation - APP-${applicationId}`,
      text: emailText,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email] Confirmation email sent to ${applicantEmail} for application ${applicationId}`);
    
    return true;
  } catch (error) {
    console.error("[Email] Failed to send confirmation email:", error);
    return false;
  }
}

export async function sendAdminNotificationEmail(
  adminEmail: string,
  applicantName: string,
  businessName: string,
  loanAmount: string,
  applicationId: number
): Promise<boolean> {
  try {
    // Create email transporter
    const transporter = createTransporter();
    
    if (!transporter) {
      // Fallback to console logging if email not configured
      console.log(`[Email] Email service not configured. Admin notification would be sent to ${adminEmail}`);
      console.log(`[Email] New application from ${applicantName} for ${businessName} - Amount: ${loanAmount}`);
      return true; // Return true to indicate success for the application flow
    }
    
    // Create admin notification email content
    const emailContent = `New Loan Application Received

Application ID: APP-${applicationId}
Applicant Name: ${applicantName}
Business Name: ${businessName}
Loan Amount Requested: ${loanAmount}

Please review this application in the admin dashboard.

Best regards,
Vinberly Micro-Credit System`;
    
    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: `New Loan Application - APP-${applicationId}`,
      text: emailContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email] Admin notification sent to ${adminEmail}`);
    console.log(`[Email] New application from ${applicantName} for ${businessName} - Amount: ${loanAmount}`);
    
    return true;
  } catch (error) {
    console.error("[Email] Failed to send admin notification:", error);
    return false;
  }
}
