import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CreditCard, TrendingDown, Calendar, DollarSign, Download, Send, LayoutDashboard, Wallet, History, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

interface LoanDetails {
  loanAmount: number;
  loanBalance: number;
  totalRepaid: number;
  interestRate: number;
  loanTerm: number;
  paymentsCompleted: number;
  totalPayments: number;
  nextPaymentDate: string;
  nextPaymentAmount: number;
}

export default function CustomerDashboard() {
  const [customerId, setCustomerId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loanDetails] = useState<LoanDetails>({
    loanAmount: 10000,
    loanBalance: 7500,
    totalRepaid: 2500,
    interestRate: 2.5,
    loanTerm: 12,
    paymentsCompleted: 3,
    totalPayments: 12,
    nextPaymentDate: "2026-02-15",
    nextPaymentAmount: 875,
  });

  const handleLogin = () => {
    if (!customerId) {
      toast.error("Please enter your Customer ID");
      return;
    }
    setIsLoggedIn(true);
    toast.success("Logged in successfully!");
  };

  const handlePayment = () => {
    toast.success("Redirecting to payment gateway...");
  };

  const handleDownloadStatement = () => {
    toast.success("Loan statement downloaded!");
  };

  const repaymentProgress = (loanDetails.paymentsCompleted / loanDetails.totalPayments) * 100;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-6xl mx-auto py-4">
        {!isLoggedIn ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Card className="max-w-md w-full p-8 border-emerald-100 shadow-xl">
              <div className="flex flex-col items-center text-center gap-4 mb-8">
                <div className="h-16 w-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <LayoutDashboard className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-emerald-900">Customer Portal</h2>
                  <p className="text-muted-foreground text-sm">Enter your Customer ID to manage your loan</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-emerald-900">Customer ID</label>
                  <Input
                    placeholder="e.g., CUST-001"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="border-emerald-200 focus-visible:ring-emerald-500"
                  />
                </div>
                <Button
                  onClick={handleLogin}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white h-12"
                >
                  Access Dashboard
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-emerald-900">Welcome Back</h1>
                <p className="text-muted-foreground">Account: <span className="font-mono font-medium text-emerald-700">{customerId}</span></p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleDownloadStatement} className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  <Download className="h-4 w-4 mr-2" /> Statement
                </Button>
                <Button variant="ghost" onClick={() => { setIsLoggedIn(false); setCustomerId(""); }} className="text-rose-600 hover:bg-rose-50 hover:text-rose-700">
                  Sign Out
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-none shadow-sm bg-emerald-50">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Loan Amount</p>
                    <p className="text-2xl font-bold text-emerald-900">₵{loanDetails.loanAmount.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-amber-50">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Remaining Balance</p>
                    <p className="text-2xl font-bold text-amber-900">₵{loanDetails.loanBalance.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-blue-50">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Total Repaid</p>
                    <p className="text-2xl font-bold text-blue-900">₵{loanDetails.totalRepaid.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-purple-50">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-bold text-purple-800 uppercase tracking-wider">Interest Rate</p>
                    <p className="text-2xl font-bold text-purple-900">{loanDetails.interestRate}%</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-emerald-100 shadow-sm overflow-hidden">
                <div className="bg-emerald-900 p-6 text-white">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-emerald-400" />
                      <h3 className="font-bold">Next Payment Due</h3>
                    </div>
                    <Badge className="bg-emerald-800 text-emerald-100 border-none">{loanDetails.nextPaymentDate}</Badge>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-emerald-300 text-xs uppercase tracking-widest font-bold">Amount to Pay</p>
                      <p className="text-4xl font-bold">₵{loanDetails.nextPaymentAmount.toLocaleString()}</p>
                    </div>
                    <Button onClick={handlePayment} size="lg" className="bg-[#E8664A] hover:bg-[#D85438] text-white px-8">
                      Pay Now
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-emerald-900 uppercase">Repayment Progress</h4>
                      <span className="text-xs font-medium text-muted-foreground">{loanDetails.paymentsCompleted} / {loanDetails.totalPayments} Payments</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-emerald-50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-600 rounded-full transition-all duration-1000"
                          style={{ width: `${repaymentProgress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground font-bold">
                        <span>START</span>
                        <span>{Math.round(repaymentProgress)}% COMPLETE</span>
                        <span>END</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <History className="h-5 w-5 text-emerald-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { date: "Jan 15", amount: 875, status: "Success" },
                      { date: "Dec 15", amount: 875, status: "Success" },
                      { date: "Nov 15", amount: 875, status: "Success" },
                    ].map((payment, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-emerald-900">₵{payment.amount}</p>
                            <p className="text-[10px] text-muted-foreground uppercase">{payment.date}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-[10px] uppercase border-none">
                          {payment.status}
                        </Badge>
                      </div>
                    ))}
                    <Button variant="link" className="w-full text-emerald-700 text-xs">View All Transactions</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
