import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  // keep as string in the form state because inputs return strings,
  // but we'll coerce to number before submitting to the API
  loanAmount: string | number;
  loanPurpose: string;
  businessDescription: string;
};

export default function LoanApplicationForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    loanAmount: "",
    loanPurpose: "",
    businessDescription: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitApplication = trpc.loanApplication.submit.useMutation({
    onSuccess: () => {
      toast.success("Application Submitted!", {
        description: "Your loan application has been submitted successfully. We will review it and contact you soon.",
      });
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        businessName: "",
        businessType: "",
        loanAmount: "",
        loanPurpose: "",
        businessDescription: "",
      });
      setIsSubmitting(false);
    },
    onError: (error: any) => {
      toast.error("Submission Failed", {
        description: error?.message || "There was an error submitting your application. Please try again.",
      });
      setIsSubmitting(false);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      businessType: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.businessName || !formData.businessType || !formData.loanAmount) {
      toast.error("Validation Error", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    setIsSubmitting(true);
    // Coerce loanAmount to a number for the API payload
    const payload = {
      ...formData,
      loanAmount: typeof formData.loanAmount === "string" ? Number(formData.loanAmount) : formData.loanAmount,
    } as unknown as Record<string, any>;

    submitApplication.mutate(payload);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="p-8 border-[#D4D0C8] bg-gradient-to-br from-white to-[#F8F7F4]/50">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-[#2A2A2A] mb-2">Loan Application Form</h3>
          <p className="text-[#666666]">Fill out the form below to apply for a loan. Our team will review your application within 24-48 hours.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-[#2A2A2A]">Personal Information</h4>

            <div>
              <Label htmlFor="fullName" className="text-[#2A2A2A]">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="mt-1 border-[#D4D0C8]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="text-[#2A2A2A]">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 border-[#D4D0C8]"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-[#2A2A2A]">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+233 (0) 5XX XXX XXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 border-[#D4D0C8]"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-[#D4D0C8] pt-4">
            <h4 className="font-semibold text-[#2A2A2A]">Business Information</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName" className="text-[#2A2A2A]">Business Name *</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  type="text"
                  placeholder="Enter your business name"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="mt-1 border-[#D4D0C8]"
                  required
                />
              </div>
              <div>
                <Label htmlFor="businessType" className="text-[#2A2A2A]">Business Type *</Label>
                <Select value={formData.businessType} onValueChange={handleSelectChange}>
                  <SelectTrigger className="mt-1 border-[#D4D0C8]">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail & Trade</SelectItem>
                    <SelectItem value="food">Food & Beverage</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="agriculture">Agriculture</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="fashion">Fashion & Design</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="businessDescription" className="text-[#2A2A2A]">Business Description</Label>
              <Textarea
                id="businessDescription"
                name="businessDescription"
                placeholder="Tell us about your business, what you do, and how long you have been operating..."
                value={formData.businessDescription}
                onChange={handleInputChange}
                className="mt-1 border-[#D4D0C8] min-h-24"
              />
            </div>
          </div>

          <div className="space-y-4 border-t border-[#D4D0C8] pt-4">
            <h4 className="font-semibold text-[#2A2A2A]">Loan Information</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loanAmount" className="text-[#2A2A2A]">Loan Amount (₵) *</Label>
                <Input
                  id="loanAmount"
                  name="loanAmount"
                  type="number"
                  placeholder="e.g., 5000"
                  min="1000"
                  max="100000"
                  value={formData.loanAmount}
                  onChange={handleInputChange}
                  className="mt-1 border-[#D4D0C8]"
                  required
                />
                <p className="text-xs text-[#666666] mt-1">Minimum: ₵1,000 | Maximum: ₵100,000</p>
              </div>
              <div>
                <Label htmlFor="loanPurpose" className="text-[#2A2A2A]">Loan Purpose *</Label>
                <Input
                  id="loanPurpose"
                  name="loanPurpose"
                  type="text"
                  placeholder="e.g., Inventory, Equipment, Expansion"
                  value={formData.loanPurpose}
                  onChange={handleInputChange}
                  className="mt-1 border-[#D4D0C8]"
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-t border-[#D4D0C8] pt-4 flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#1B5E3F] hover:bg-[#154B2F] text-white text-base py-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-[#D4D0C8] text-[#2A2A2A] text-base py-6"
              onClick={() => {
                setFormData({
                  fullName: "",
                  email: "",
                  phone: "",
                  businessName: "",
                  businessType: "",
                  loanAmount: "",
                  loanPurpose: "",
                  businessDescription: "",
                });
              }}
            >
              Clear Form
            </Button>
          </div>

          <p className="text-xs text-[#666666] text-center">
            * Required fields. Your information will be kept confidential and used only for loan processing.
          </p>
        </form>
      </Card>
    </div>
  );
}
