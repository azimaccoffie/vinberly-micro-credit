import { invokeLLM } from "./_core/llm";

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

    console.log(`[Email] Confirmation email would be sent to ${applicantEmail} for application ${applicationId}`);
    console.log(`[Email] Content preview: ${emailText.substring(0, 100)}...`);

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
    console.log(`[Email] Admin notification would be sent to ${adminEmail}`);
    console.log(`[Email] New application from ${applicantName} for ${businessName} - Amount: ${loanAmount}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send admin notification:", error);
    return false;
  }
}
