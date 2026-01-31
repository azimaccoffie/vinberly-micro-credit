import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

export default function TestComponent() {
  const registerMutation = trpc.auth.register.useMutation();

  useEffect(() => {
    const testRegistration = async () => {
      try {
        console.log("Making registration request...");
        const result = await registerMutation.mutateAsync({
          fullName: "Test User",
          email: "test@example.com",
          password: "password123",
          businessName: "Test Business",
          businessType: "Retail"
        });
        console.log("Registration result:", result);
      } catch (error) {
        console.error("Registration error:", error);
      }
    };

    testRegistration();
  }, []);

  return <div>Testing TRPC registration...</div>;
}