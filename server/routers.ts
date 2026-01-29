import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { createLoanApplication, getLoanApplications, updateLoanApplicationStatus, getLoanApplicationById } from "./loanDb";
import { notifyOwner } from "./_core/notification";
import { sendConfirmationEmail, sendAdminNotificationEmail } from "./emailService";
import { sendTeamAlertSMS } from "./smsService";
import { getBlogArticles, getBlogArticleBySlug, getBlogArticlesByCategory, createBlogArticle } from "./blogDb";
import { enable2FA, disable2FA, generateBackupCodes, sendSMSOTP, verifySMSOTP } from "./twoFactorService";
import { calculateLoanPayment, validateLoanRequest, getLoanProducts, calculateWithProduct } from "./loanCalculatorAPI";
import { generateMonthlyReport, generateQuarterlyReport, generateAnnualReport, exportReportAsCSV, exportReportAsJSON } from "./complianceReportsService";
import { processChatMessage, getFAQItems, getChatbotAnalytics } from "./aiChatbotService";
import { createLoanPool, tokenizePool, getTokenMarketplace, getTokenPerformance, getTokenizationAnalytics } from "./blockchainTokenizationService";
import { getMarketplacePartners, getPartnerServices, processPartnerTransaction, getMarketplaceStatistics } from "./partnerMarketplaceService";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      // Use the same cookie options as login to ensure consistency
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  loanApplication: router({
    submit: publicProcedure
      .input(
        z.object({
          fullName: z.string().min(1),
          email: z.string().email(),
          phone: z.string().min(1),
          businessName: z.string().min(1),
          businessType: z.string().min(1),
          businessDescription: z.string().optional(),
          loanAmount: z.string().min(1),
          loanPurpose: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const result = await createLoanApplication({
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          businessName: input.businessName,
          businessType: input.businessType,
          businessDescription: input.businessDescription || null,
          loanAmount: input.loanAmount,
          loanPurpose: input.loanPurpose,
          status: "pending",
        });

        // Get the inserted ID from the result
        const applicationId = (result as any).insertId || 1;

        // Send confirmation email
        await sendConfirmationEmail(input.email, input.fullName, applicationId, input.businessName);

        // Send admin notification
        await sendAdminNotificationEmail("info@vinberlymicro-credit.com", input.fullName, input.businessName, input.loanAmount, applicationId);

        // Send SMS alert to team
        await sendTeamAlertSMS(input.fullName, input.businessName, input.loanAmount);

        // Notify owner
        await notifyOwner({
          title: "New Loan Application",
          content: `${input.fullName} has submitted a loan application for ₵${input.loanAmount}`,
        });

        return { applicationId, success: true };
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getLoanApplicationById(input.id);
      }),

    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("You do not have required permission (10002)");
      }
      return await getLoanApplications();
    }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          applicationId: z.number(),
          newStatus: z.enum(["pending", "processing", "approved", "rejected"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("You do not have required permission (10002)");
        }
        await updateLoanApplicationStatus(input.applicationId, input.newStatus);
        return { success: true };
      }),
  }),

  blog: router({
    getAll: publicProcedure.query(async () => {
      return await getBlogArticles();
    }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        try {
          const article = await getBlogArticleBySlug(input.slug);
          
          // Mock fallback for demonstration/development
          const mockArticles: any[] = [
            {
              id: 1,
              title: "5 Tips for Growing Your Small Business in Accra",
              slug: "5-tips-growing-business",
              content: `Growing a business in Accra requires a combination of local market knowledge, strategic networking, and financial discipline. Here are five essential tips to help you scale:
              
              1. Understand Your Local Market: Accra is a diverse city with distinct neighborhood preferences. Research your target area thoroughly.
              2. Build Strong Relationships: Networking is key in the Ghanaian business environment. Join local business associations and attend community events.
              3. Maintain Financial Discipline: Keep your personal and business finances separate. Use accounting software to track every cedi.
              4. Invest in Digital Marketing: With more Ghanaians online than ever, a strong social media presence can significantly boost your reach.
              5. Access the Right Credit: Choose a credit partner like Vinberly that understands the unique needs of micro-entrepreneurs.`,
              excerpt: "Learn proven strategies to scale your business operations and increase revenue in the competitive Accra market.",
              category: "business",
              author: "Ama Osei",
              imageUrl: "/images/growth-illustration.png",
              createdAt: new Date("2026-01-15"),
              published: 1
            },
            {
              id: 2,
              title: "Understanding Micro-Credit: A Beginner's Guide",
              slug: "understanding-micro-credit",
              content: "Micro-credit is more than just a small loan; it's a tool for economic empowerment. For many entrepreneurs in Accra, access to traditional banking is limited. Micro-credit bridges this gap by providing small, manageable loans tailored to the cash flow of small businesses. At Vinberly, we focus on helping you use credit as a springboard for growth, rather than just a survival tool.",
              excerpt: "Discover how micro-credit works and why it's the perfect solution for entrepreneurs starting out.",
              category: "finance",
              author: "Kwesi Mensah",
              imageUrl: "/images/loan-calculator.png",
              createdAt: new Date("2026-01-10"),
              published: 1
            },
            {
              id: 3,
              title: "From Zero to Hero: Success Stories of Vinberly Clients",
              slug: "success-stories-clients",
              content: "Our clients are our greatest inspiration. From the bustling markets of Makola to the tech hubs of East Legon, Vinberly has supported thousands of success stories. Ama, a textile trader, used her first loan to double her inventory and now employs three people. Kwesi, a restaurant owner, renovated his kitchen and saw a 40% increase in patrons. Your success story could be next.",
              excerpt: "Read inspiring stories of entrepreneurs who transformed their businesses with Vinberly's support.",
              category: "success-stories",
              author: "Abena Boateng",
              imageUrl: "/images/community-support.png",
              createdAt: new Date("2026-01-05"),
              published: 1
            }
          ];

          if (!article) {
            const mockArticle = mockArticles.find(a => a.slug === input.slug);
            if (mockArticle) return mockArticle;
            throw new Error("Article not found");
          }
          return article;
        } catch (error) {
          console.error(`[Blog] Error fetching article with slug ${input.slug}:`, error);
          
          // Absolute fallback if database is completely broken
          const emergencyArticles: any[] = [
            {
              id: 1,
              title: "5 Tips for Growing Your Small Business in Accra",
              slug: "5-tips-growing-business",
              content: `Growing a business in Accra requires a combination of local market knowledge, strategic networking, and financial discipline. Here are five essential tips to help you scale:
              
              1. Understand Your Local Market: Accra is a diverse city with distinct neighborhood preferences. Research your target area thoroughly.
              2. Build Strong Relationships: Networking is key in the Ghanaian business environment. Join local business associations and attend community events.
              3. Maintain Financial Discipline: Keep your personal and business finances separate. Use accounting software to track every cedi.
              4. Invest in Digital Marketing: With more Ghanaians online than ever, a strong social media presence can significantly boost your reach.
              5. Access the Right Credit: Choose a credit partner like Vinberly that understands the unique needs of micro-entrepreneurs.`,
              excerpt: "Learn proven strategies to scale your business operations.",
              category: "business",
              author: "Ama Osei",
              imageUrl: "/images/growth-illustration.png",
              createdAt: new Date(),
              published: 1
            },
            {
              id: 2,
              title: "Understanding Micro-Credit: A Beginner's Guide",
              slug: "understanding-micro-credit",
              content: "Micro-credit is more than just a small loan; it's a tool for economic empowerment. For many entrepreneurs in Accra, access to traditional banking is limited. Micro-credit bridges this gap by providing small, manageable loans tailored to the cash flow of small businesses. At Vinberly, we focus on helping you use credit as a springboard for growth, rather than just a survival tool.",
              excerpt: "Discover how micro-credit works and why it's the perfect solution for entrepreneurs starting out.",
              category: "finance",
              author: "Kwesi Mensah",
              imageUrl: "/images/loan-calculator.png",
              createdAt: new Date(),
              published: 1
            },
            {
              id: 3,
              title: "From Zero to Hero: Success Stories of Vinberly Clients",
              slug: "success-stories-clients",
              content: "Our clients are our greatest inspiration. From the bustling markets of Makola to the tech hubs of East Legon, Vinberly has supported thousands of success stories. Ama, a textile trader, used her first loan to double her inventory and now employs three people. Kwesi, a restaurant owner, renovated his kitchen and saw a 40% increase in patrons. Your success story could be next.",
              excerpt: "Read inspiring stories of entrepreneurs who transformed their businesses with Vinberly's support.",
              category: "success-stories",
              author: "Abena Boateng",
              imageUrl: "/images/community-support.png",
              createdAt: new Date(),
              published: 1
            }
          ];

          const emergencyArticle = emergencyArticles.find(a => a.slug === input.slug);
          if (emergencyArticle) return emergencyArticle;
          
          throw error;
        }
      }),

    getByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return await getBlogArticlesByCategory(input.category);
      }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          slug: z.string().min(1),
          excerpt: z.string().min(1),
          content: z.string().min(1),
          category: z.string().min(1),
          imageUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("You do not have required permission (10002)");
        }
        return await createBlogArticle({
          title: input.title,
          slug: input.slug,
          excerpt: input.excerpt,
          content: input.content,
          category: input.category,
          author: ctx.user.name || "Admin",
          imageUrl: input.imageUrl || null,
          published: 1,
        });
      }),
  }),

  twoFactor: router({
    enable: protectedProcedure
      .input(
        z.object({
          method: z.enum(["sms", "authenticator"]),
          phoneNumber: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const result = await enable2FA(ctx.user?.id || 0, input.method, input.phoneNumber);
        return result;
      }),

    disable: protectedProcedure.mutation(async ({ ctx }) => {
      const success = await disable2FA(ctx.user?.id || 0);
      return { success };
    }),

    generateBackupCodes: protectedProcedure.query(async () => {
      const codes = generateBackupCodes(10);
      return { codes };
    }),

    sendOTP: protectedProcedure
      .input(z.object({ phoneNumber: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const code = await sendSMSOTP(input.phoneNumber, ctx.user?.id || 0);
        return { success: true, code };
      }),
  }),

  loanCalculator: router({
    calculate: publicProcedure
      .input(
        z.object({
          loanAmount: z.number().positive(),
          interestRate: z.number().nonnegative(),
          loanTermMonths: z.number().positive(),
        })
      )
      .query(async ({ input }) => {
        const validation = validateLoanRequest(input);
        if (!validation.valid) {
          throw new Error(validation.errors.join(", "));
        }
        return calculateLoanPayment(input.loanAmount, input.interestRate, input.loanTermMonths);
      }),

    getProducts: publicProcedure.query(async () => {
      return getLoanProducts();
    }),

    calculateWithProduct: publicProcedure
      .input(
        z.object({
          productId: z.string(),
          loanAmount: z.number().positive(),
          loanTermMonths: z.number().positive(),
        })
      )
      .query(async ({ input }) => {
        return calculateWithProduct(input.productId, input.loanAmount, input.loanTermMonths);
      }),
  }),

  compliance: router({
    generateMonthly: protectedProcedure
      .input(z.object({ month: z.number(), year: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("You do not have required permission (10002)");
        }
        return await generateMonthlyReport(input.month, input.year);
      }),

    generateQuarterly: protectedProcedure
      .input(z.object({ quarter: z.number(), year: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("You do not have required permission (10002)");
        }
        return await generateQuarterlyReport(input.quarter, input.year);
      }),

    generateAnnual: protectedProcedure
      .input(z.object({ year: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("You do not have required permission (10002)");
        }
        return await generateAnnualReport(input.year);
      }),
  }),

  ai: router({
    chat: publicProcedure
      .input(z.object({ message: z.string(), conversationId: z.string().optional() }))
      .mutation(async ({ input, ctx }) => {
        return await processChatMessage(
          input.conversationId || "default",
          ctx.user?.id || 0,
          input.message
        );
      }),
    faqs: publicProcedure
      .input(z.object({ category: z.string().optional() }))
      .query(async ({ input }) => {
        return getFAQItems(input.category);
      }),
    analytics: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("You do not have required permission (10002)");
      }
      return getChatbotAnalytics();
    }),
  }),

  blockchain: router({
    getMarketplace: publicProcedure
      .input(z.object({ tokenId: z.string() }))
      .query(async ({ input }) => {
        return getTokenMarketplace(input.tokenId);
      }),
    getPerformance: publicProcedure
      .input(z.object({ tokenId: z.string() }))
      .query(async ({ input }) => {
        return getTokenPerformance(input.tokenId);
      }),
    getAnalytics: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("You do not have required permission (10002)");
      }
      return getTokenizationAnalytics();
    }),
    createPool: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string(),
        loans: z.array(z.number()),
        totalAmount: z.number(),
        averageInterestRate: z.number(),
        riskLevel: z.enum(["low", "medium", "high"])
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("You do not have required permission (10002)");
        }
        return createLoanPool(input.name, input.description, input.loans, input.totalAmount, input.averageInterestRate, input.riskLevel);
      }),
  }),

  marketplace: router({
    getPartners: publicProcedure
      .input(z.object({ category: z.string().optional() }))
      .query(async ({ input }) => {
        return getMarketplacePartners(input.category);
      }),
    getServices: publicProcedure
      .input(z.object({ partnerId: z.number().optional() }))
      .query(async ({ input }) => {
        return getPartnerServices(input.partnerId);
      }),
    purchaseService: protectedProcedure
      .input(z.object({
        partnerId: z.number(),
        serviceId: z.number(),
        amount: z.number()
      }))
      .mutation(async ({ input, ctx }) => {
        return await processPartnerTransaction(input.partnerId, input.serviceId, ctx.user?.id || 0, input.amount);
      }),
    getStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("You do not have required permission (10002)");
      }
      return getMarketplaceStatistics();
    }),
  }),
});

export type AppRouter = typeof appRouter;
