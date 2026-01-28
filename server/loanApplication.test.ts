import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("loanApplication.submit", () => {
  it("successfully submits a loan application with valid data", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.loanApplication.submit({
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+233 5XX XXX XXX",
      businessName: "Tech Solutions",
      businessType: "technology",
      businessDescription: "A tech consulting firm",
      loanAmount: "10000",
      loanPurpose: "Equipment",
    });

    expect(result.success).toBe(true);
    expect(result.applicationId).toBeDefined();
  });

  it("rejects submission with missing required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.loanApplication.submit({
        fullName: "",
        email: "john@example.com",
        phone: "+233 5XX XXX XXX",
        businessName: "Tech Solutions",
        businessType: "technology",
        businessDescription: "A tech consulting firm",
        loanAmount: "10000",
        loanPurpose: "Equipment",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Too small");
    }
  });

  it("rejects submission with invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.loanApplication.submit({
        fullName: "John Doe",
        email: "invalid-email",
        phone: "+233 5XX XXX XXX",
        businessName: "Tech Solutions",
        businessType: "technology",
        businessDescription: "A tech consulting firm",
        loanAmount: "10000",
        loanPurpose: "Equipment",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Invalid email");
    }
  });
});
