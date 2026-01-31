import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegistrationTest() {
  const [testResult, setTestResult] = useState<string>("");
  
  const registerMutation = trpc.auth.register.useMutation();

  const handleTestRegistration = async () => {
    try {
      setTestResult("Testing registration...");
      const result = await registerMutation.mutateAsync({
        fullName: "Test User",
        email: `test-${Date.now()}@example.com`,
        password: "password123",
        businessName: "Test Business",
        businessType: "Retail"
      });
      setTestResult(`Success: ${JSON.stringify(result)}`);
    } catch (error: any) {
      setTestResult(`Error: ${error.message || JSON.stringify(error)}`);
      console.error("Registration test error:", error);
    }
  };

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Registration Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleTestRegistration} disabled={registerMutation.isPending}>
          {registerMutation.isPending ? "Testing..." : "Test Registration"}
        </Button>
        {testResult && (
          <div className="p-4 bg-gray-100 rounded">
            <pre className="whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}