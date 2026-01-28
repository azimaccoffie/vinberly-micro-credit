import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CreditCard, Lock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export default function PaymentPage() {
  const [customerId, setCustomerId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<"select" | "confirm" | "success">("select");

  const paymentMethods: PaymentMethod[] = [
    {
      id: "stripe",
      name: "Stripe",
      icon: "💳",
      description: "Credit/Debit Card, Apple Pay, Google Pay",
    },
    {
      id: "paystack",
      name: "Paystack",
      icon: "🏦",
      description: "Card, Bank Transfer, Mobile Money",
    },
    {
      id: "mtn",
      name: "MTN Mobile Money",
      icon: "📱",
      description: "Pay directly from your MTN wallet",
    },
    {
      id: "vodafone",
      name: "Vodafone Cash",
      icon: "📞",
      description: "Pay directly from your Vodafone wallet",
    },
  ];

  const handleSelectMethod = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  const handleConfirmPayment = () => {
    if (!customerId || !paymentAmount || !selectedMethod) {
      toast.error("Please fill in all fields");
      return;
    }

    if (parseFloat(paymentAmount) <= 0) {
      toast.error("Payment amount must be greater than 0");
      return;
    }

    setPaymentStep("confirm");
  };

  const handleProcessPayment = () => {
    toast.success("Processing payment...");
    setTimeout(() => {
      setPaymentStep("success");
      toast.success("Payment completed successfully!");
    }, 2000);
  };

  if (paymentStep === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8F7F4] to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 border-[#D4D0C8] text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#2A2A2A] mb-2">Payment Successful!</h2>
          <p className="text-[#666666] mb-6">Your payment of ₵{paymentAmount} has been processed successfully.</p>
          <div className="bg-[#F8F7F4] p-4 rounded mb-6 text-left">
            <div className="flex justify-between mb-2">
              <span className="text-[#666666]">Transaction ID:</span>
              <span className="font-bold text-[#2A2A2A]">TXN-{Date.now()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-[#666666]">Amount:</span>
              <span className="font-bold text-[#2A2A2A]">₵{paymentAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666666]">Method:</span>
              <span className="font-bold text-[#2A2A2A]">{paymentMethods.find((m) => m.id === selectedMethod)?.name}</span>
            </div>
          </div>
          <Button
            onClick={() => {
              setPaymentStep("select");
              setCustomerId("");
              setPaymentAmount("");
              setSelectedMethod(null);
            }}
            className="w-full bg-[#1B5E3F] hover:bg-[#154B2F] text-white"
          >
            Make Another Payment
          </Button>
        </Card>
      </div>
    );
  }

  if (paymentStep === "confirm") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8F7F4] to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 border-[#D4D0C8]">
          <h2 className="text-2xl font-bold text-[#2A2A2A] mb-6">Confirm Payment</h2>
          <div className="bg-[#F8F7F4] p-4 rounded mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-[#666666]">Customer ID:</span>
              <span className="font-bold text-[#2A2A2A]">{customerId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666666]">Payment Amount:</span>
              <span className="font-bold text-[#2A2A2A]">₵{paymentAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666666]">Payment Method:</span>
              <span className="font-bold text-[#2A2A2A]">{paymentMethods.find((m) => m.id === selectedMethod)?.name}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setPaymentStep("select")}
              variant="outline"
              className="flex-1 border-[#D4D0C8]"
            >
              Back
            </Button>
            <Button
              onClick={handleProcessPayment}
              className="flex-1 bg-[#1B5E3F] hover:bg-[#154B2F] text-white"
            >
              <Lock className="w-4 h-4 mr-2" />
              Confirm & Pay
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7F4] to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#1B5E3F] to-[#2A8659] text-white py-16">
        <div className="container">
          <h1 className="text-5xl font-bold mb-4">Make a Payment</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Pay your Vinberly loan securely using your preferred payment method
          </p>
        </div>
      </section>

      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          {/* Payment Details */}
          <Card className="p-8 border-[#D4D0C8] mb-8">
            <h2 className="text-2xl font-bold text-[#2A2A2A] mb-6">Payment Details</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-[#2A2A2A] mb-2">Customer ID</label>
                <Input
                  placeholder="e.g., CUST-001"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="border-[#D4D0C8]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#2A2A2A] mb-2">Payment Amount (₵)</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="border-[#D4D0C8]"
                />
              </div>
            </div>
          </Card>

          {/* Payment Methods */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#2A2A2A] mb-6">Select Payment Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <Card
                  key={method.id}
                  onClick={() => handleSelectMethod(method.id)}
                  className={`p-6 border-2 cursor-pointer transition-all ${
                    selectedMethod === method.id
                      ? "border-[#1B5E3F] bg-[#1B5E3F]/5"
                      : "border-[#D4D0C8] hover:border-[#1B5E3F]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{method.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#2A2A2A]">{method.name}</h3>
                      <p className="text-sm text-[#666666]">{method.description}</p>
                    </div>
                    {selectedMethod === method.id && (
                      <CheckCircle className="w-5 h-5 text-[#1B5E3F]" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Security Notice */}
          <Card className="p-6 border-[#D4D0C8] bg-blue-50 mb-8">
            <div className="flex gap-3">
              <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-blue-900 mb-1">Secure Payment</h3>
                <p className="text-sm text-blue-800">
                  Your payment information is encrypted and processed securely. We never store your full card details.
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <Button
            onClick={handleConfirmPayment}
            className="w-full bg-[#1B5E3F] hover:bg-[#154B2F] text-white text-base py-6"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  );
}
