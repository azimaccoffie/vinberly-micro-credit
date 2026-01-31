import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl, getMockLoginUrl } from "@/const";
import { LogIn, User } from "lucide-react";
import { toast } from "sonner";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const { user } = useAuth();

  // If user is already authenticated, redirect to dashboard
  if (user) {
    window.location.href = "/dashboard";
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    // In a real implementation, you would:
    // 1. Validate credentials against your auth system
    // 2. Create a session/token
    // 3. Redirect to dashboard
    
    // For now, show a success message and redirect
    toast.success("Login successful!");
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
  };

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Access your Vinberly Micro-Credit account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button 
              type="submit" 
              className="w-full mb-4"
            >
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </Button>
            
            <div className="w-full space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <Button 
                asChild
                variant="outline" 
                className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50 gap-2"
              >
                <a href={getLoginUrl()}>
                  <User className="h-4 w-4" /> OAuth Login
                </a>
              </Button>
              
              <Button 
                asChild
                variant="outline" 
                className="w-full border-amber-600 text-amber-700 hover:bg-amber-50 gap-2"
              >
                <a href={getMockLoginUrl()}>
                  Demo Login
                </a>
              </Button>
            </div>
            
            <p className="mt-6 text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button 
                onClick={() => {
                  toast.info("Taking you to registration...");
                  setTimeout(() => {
                    window.location.href = "/register";
                  }, 500);
                }}
                className="text-primary underline hover:text-primary/80 transition-colors"
              >
                Create one
              </button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}