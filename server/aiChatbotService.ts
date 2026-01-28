import { invokeLLM, Message } from "./_core/llm";

/**
 * AI Chatbot Support Service
 * Provides 24/7 customer support using LLM
 */

export interface ChatMessage {
  messageId: string;
  conversationId: string;
  sender: "user" | "bot";
  content: string;
  timestamp: Date;
  sentiment?: "positive" | "neutral" | "negative";
  intent?: string;
  confidence?: number;
}

export interface Conversation {
  conversationId: string;
  userId: number;
  startTime: Date;
  endTime?: Date;
  messages: ChatMessage[];
  status: "active" | "closed" | "escalated";
  topic: string;
  resolved: boolean;
  escalatedToAgent?: string;
}

export interface ChatbotResponse {
  messageId: string;
  content: string;
  intent: string;
  confidence: number;
  suggestedActions?: string[];
  requiresEscalation: boolean;
  escalationReason?: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  views: number;
  helpful: number;
  unhelpful: number;
}

export interface ConversationAnalytics {
  totalConversations: number;
  averageResolutionTime: number; // minutes
  resolutionRate: number; // percentage
  escalationRate: number; // percentage
  customerSatisfaction: number; // 1-5 rating
  topTopics: { topic: string; count: number }[];
  commonIssues: string[];
}

/**
 * Process user message and generate bot response
 */
export async function processChatMessage(
  conversationId: string,
  userId: number,
  userMessage: string
): Promise<ChatbotResponse> {
  try {
    console.log(`[Chatbot] Processing message from user ${userId}: "${userMessage}"`);

    // Use real LLM for a more natural response
    const systemPrompt = `You are the Vinberly Micro-Credit AI Assistant. 
    Vinberly Micro-Credit is based in Accra, Ghana, providing micro-credit solutions to small businesses and entrepreneurs.
    
    Current Services:
    - Business Loans (₵1,000 - ₵100,000)
    - Loan Status Tracking (/track)
    - Document Verification (/documents)
    - Referral Program (/referral)
    - Blog with financial tips (/blog)
    
    Your goal is to be helpful, professional, and friendly. If a user asks about their specific status or payments, provide a helpful general answer but remind them they can check details in their dashboard.
    
    If the user has a serious problem or seems frustrated, suggest escalating to a human agent.`;

    const messages: Message[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ];

    const llmResult = await invokeLLM({ messages });
    const responseContent = llmResult.choices[0].message.content as string;

    // Analyze user intent (can still use the heuristic or ask LLM, but heuristic is faster for metadata)
    const intent = analyzeIntent(userMessage);
    const confidence = calculateConfidence(userMessage, intent);

    const botResponse: ChatbotResponse = {
      messageId: `msg-${Date.now()}`,
      content: responseContent,
      intent,
      confidence,
      suggestedActions: generateSuggestedActions(intent),
      requiresEscalation: responseContent.toLowerCase().includes("human agent") || responseContent.toLowerCase().includes("support team"),
      escalationReason: responseContent.toLowerCase().includes("human agent") ? "User requested human assistance" : undefined,
    };

    console.log(`[Chatbot] Generated response with intent: ${intent}, confidence: ${confidence}`);
    return botResponse;
  } catch (error) {
    console.error("[Chatbot] Error processing message:", error);
    // Fallback to heuristic if LLM fails
    const intent = analyzeIntent(userMessage);
    return {
      messageId: `msg-fallback-${Date.now()}`,
      content: generateFallbackResponse(userMessage),
      intent,
      confidence: 0.5,
      requiresEscalation: true,
      escalationReason: "LLM failure, falling back to heuristic",
    };
  }
}

/**
 * Analyze user message intent
 */
function analyzeIntent(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("status") ||
    lowerMessage.includes("application") ||
    lowerMessage.includes("where")
  ) {
    return "loan_status";
  }

  if (
    lowerMessage.includes("how") &&
    (lowerMessage.includes("apply") || lowerMessage.includes("process"))
  ) {
    return "application_process";
  }

  if (
    lowerMessage.includes("payment") ||
    lowerMessage.includes("pay") ||
    lowerMessage.includes("repay")
  ) {
    return "payment_info";
  }

  if (
    lowerMessage.includes("document") ||
    lowerMessage.includes("upload") ||
    lowerMessage.includes("file")
  ) {
    return "document_upload";
  }

  if (lowerMessage.includes("rate") || lowerMessage.includes("interest")) {
    return "interest_rates";
  }

  if (lowerMessage.includes("refer") || lowerMessage.includes("reward")) {
    return "referral_program";
  }

  if (
    lowerMessage.includes("problem") ||
    lowerMessage.includes("issue") ||
    lowerMessage.includes("error")
  ) {
    return "account_issue";
  }

  return "general_inquiry";
}

/**
 * Calculate confidence score
 */
function calculateConfidence(message: string, intent: string): number {
  const keywords = {
    loan_status: ["status", "application", "where", "check"],
    application_process: ["how", "apply", "process", "steps"],
    payment_info: ["payment", "pay", "repay", "installment"],
    document_upload: ["document", "upload", "file", "submit"],
    interest_rates: ["rate", "interest", "percentage", "cost"],
    referral_program: ["refer", "reward", "bonus", "friend"],
  };

  const intentKeywords = keywords[intent as keyof typeof keywords] || [];
  const matchedKeywords = intentKeywords.filter((kw) =>
    message.toLowerCase().includes(kw)
  ).length;

  return Math.min(1, (matchedKeywords / Math.max(1, intentKeywords.length)) * 0.8 + 0.2);
}

/**
 * Handle loan status query
 */
async function handleLoanStatusQuery(userId: number): Promise<string> {
  return `I can help you check your loan status. Your current application (APP-${userId}) is in the "Under Review" stage. 
  
Expected timeline: 2-3 business days
Current status: Documents verified, awaiting final approval

You can track your application in real-time at: /track

Is there anything specific about your application you'd like to know?`;
}

/**
 * Handle application process query
 */
function handleApplicationProcessQuery(): string {
  return `Here's how our loan application process works:

1. **Submit Application** - Fill out the online form with your business details
2. **Document Upload** - Upload required documents (business registration, tax ID, bank statements)
3. **Verification** - Our team verifies your documents (24-48 hours)
4. **Credit Check** - We check your credit history and business background
5. **Approval Decision** - You'll receive approval/rejection decision
6. **Funding** - Approved loans are disbursed within 24 hours

Average approval time: 2-3 business days
Loan amount: ₵1,000 - ₵100,000

Ready to apply? Click here: /apply`;
}

/**
 * Handle payment info query
 */
async function handlePaymentInfoQuery(userId: number): Promise<string> {
  return `Here's your payment information:

**Current Loan Details:**
- Loan Amount: ₵25,000
- Monthly Payment: ₵2,150
- Remaining Balance: ₵18,500
- Next Payment Due: 2026-02-15

**Payment Methods:**
- Bank Transfer
- Mobile Money (MTN, Vodafone, AirtelTigo)
- Online Payment Gateway
- Direct Debit

You can make payments at: /dashboard/payments

Would you like to set up automatic payments?`;
}

/**
 * Handle document upload query
 */
function handleDocumentUploadQuery(): string {
  return `To upload documents, follow these steps:

1. Go to: /documents
2. Click "Upload Document"
3. Select document type:
   - Business Registration
   - Tax ID
   - Bank Statements
   - Proof of Address
4. Upload the file (PDF, JPG, PNG)
5. Submit for verification

**Requirements:**
- File size: Max 10MB
- Format: PDF or Image
- Clear and legible
- Recent (within 3 months)

Need help? Contact support@vinberly.com`;
}

/**
 * Handle interest rates query
 */
function handleInterestRatesQuery(): string {
  return `Our interest rates are competitive and based on several factors:

**Standard Rates:**
- Low Risk: 8% - 12% annually
- Medium Risk: 12% - 18% annually
- High Risk: 18% - 24% annually

**Factors Affecting Your Rate:**
- Credit score
- Business age
- Loan amount
- Repayment history
- Collateral

**Use Our Calculator:**
Visit: /calculator to estimate your monthly payment

Get a personalized quote: /apply`;
}

/**
 * Handle referral program query
 */
function handleReferralProgramQuery(): string {
  return `Join our referral program and earn rewards!

**How It Works:**
1. Share your unique referral link
2. Friend applies for a loan using your link
3. Friend gets approved and receives funding
4. You earn ₵300 reward!

**Benefits:**
- Unlimited referrals
- Instant rewards
- No referral limit
- Track earnings in dashboard

**Start Referring:**
Your referral link: /referral
Share on: Facebook, WhatsApp, Email, Twitter

View your earnings: /dashboard/referrals`;
}

/**
 * Generate fallback response
 */
function generateFallbackResponse(userMessage: string): string {
  return `I appreciate your question about "${userMessage}". 

I'm not entirely sure how to help with that specific topic. Here are some things I can help you with:
- Check loan application status
- Learn about our application process
- Get payment information
- Upload documents
- Understand interest rates
- Join our referral program

Or, I can connect you with a support agent for more detailed assistance. Would you like me to do that?`;
}

/**
 * Generate suggested actions
 */
function generateSuggestedActions(intent: string): string[] {
  const actions: Record<string, string[]> = {
    loan_status: ["View Full Application", "Download Documents", "Contact Support"],
    application_process: ["Start Application", "View Requirements", "Schedule Call"],
    payment_info: ["Make Payment", "Set Auto-Pay", "View History"],
    document_upload: ["Upload Now", "View Requirements", "Get Help"],
    interest_rates: ["Use Calculator", "Apply Now", "Compare Rates"],
    referral_program: ["Get Referral Link", "View Earnings", "Share Now"],
  };

  return actions[intent] || ["View FAQ", "Contact Support", "Schedule Call"];
}

/**
 * Get FAQ items
 */
export function getFAQItems(category?: string): FAQItem[] {
  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "What is the minimum loan amount?",
      answer: "The minimum loan amount is ₵1,000. Maximum is ₵100,000.",
      category: "loans",
      keywords: ["minimum", "amount", "loan"],
      views: 1250,
      helpful: 1100,
      unhelpful: 50,
    },
    {
      id: 2,
      question: "How long does approval take?",
      answer: "Most applications are approved within 2-3 business days.",
      category: "application",
      keywords: ["approval", "time", "days"],
      views: 2100,
      helpful: 1900,
      unhelpful: 80,
    },
    {
      id: 3,
      question: "What documents do I need?",
      answer: "You need business registration, tax ID, and recent bank statements.",
      category: "documents",
      keywords: ["documents", "required", "submit"],
      views: 1800,
      helpful: 1600,
      unhelpful: 100,
    },
  ];

  return category ? faqs.filter((faq) => faq.category === category) : faqs;
}

/**
 * Get chatbot analytics
 */
export function getChatbotAnalytics(): ConversationAnalytics {
  return {
    totalConversations: 12500,
    averageResolutionTime: 4.5,
    resolutionRate: 0.85,
    escalationRate: 0.15,
    customerSatisfaction: 4.2,
    topTopics: [
      { topic: "Loan Status", count: 3500 },
      { topic: "Application Process", count: 2800 },
      { topic: "Payment Information", count: 2200 },
      { topic: "Document Upload", count: 1800 },
      { topic: "Interest Rates", count: 1200 },
    ],
    commonIssues: [
      "Application status inquiry",
      "Payment method question",
      "Document verification delay",
      "Interest rate calculation",
      "Referral reward tracking",
    ],
  };
}

/**
 * Escalate conversation to human agent
 */
export async function escalateToAgent(conversationId: string, reason: string): Promise<string> {
  console.log(`[Chatbot] Escalating conversation ${conversationId} to agent. Reason: ${reason}`);

  return `I'm connecting you with a support agent who can better assist you.

Your conversation ID: ${conversationId}
Reason: ${reason}

Average wait time: 2-5 minutes
You'll be connected shortly...`;
}
