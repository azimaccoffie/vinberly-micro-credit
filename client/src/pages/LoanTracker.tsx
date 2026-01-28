import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, Clock, XCircle, AlertCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function LoanTracker() {
  const [applicationId, setApplicationId] = useState("");
  const [email, setEmail] = useState("");
  const [searched, setSearched] = useState(false);

  const trackLoan = trpc.loanApplication.getById.useQuery(
    { id: parseInt(applicationId) },
    { enabled: false }
  );

  const handleSearch = async () => {
    if (!applicationId || !email) {
      toast.error("Please enter both Application ID and Email");
      return;
    }

    setSearched(true);
    trackLoan.refetch();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case "rejected":
        return <XCircle className="w-8 h-8 text-red-600" />;
      case "processing":
        return <Clock className="w-8 h-8 text-blue-600" />;
      default:
        return <AlertCircle className="w-8 h-8 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "approved":
        return "Your loan has been approved! Our team will contact you shortly with disbursement details.";
      case "rejected":
        return "Unfortunately, your application was not approved at this time. Please contact us for feedback.";
      case "processing":
        return "Your application is being reviewed by our team. We'll update you within 24-48 hours.";
      default:
        return "Your application has been received and is pending review.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7F4] to-white">
      <div className="container py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2A2A2A] mb-4">Track Your Loan Application</h1>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Enter your Application ID and email address to check the status of your loan application.
          </p>
        </div>

        {/* Search Form */}
        <Card className="max-w-2xl mx-auto p-8 border-[#D4D0C8] mb-12">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#2A2A2A] mb-2">Application ID</label>
              <Input
                placeholder="e.g., APP-1"
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
                className="border-[#D4D0C8]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2A2A2A] mb-2">Email Address</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-[#D4D0C8]"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={trackLoan.isLoading}
              className="w-full bg-[#1B5E3F] hover:bg-[#154B2F] text-white text-base py-6"
            >
              <Search className="w-4 h-4 mr-2" />
              {trackLoan.isLoading ? "Searching..." : "Track Application"}
            </Button>
          </div>
        </Card>

        {/* Results */}
        {searched && trackLoan.data && (
          <Card className="max-w-2xl mx-auto p-8 border-[#D4D0C8] bg-gradient-to-br from-white to-[#F8F7F4]/50">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">{getStatusIcon(trackLoan.data.status)}</div>
              <h2 className="text-3xl font-bold text-[#2A2A2A] mb-2 capitalize">{trackLoan.data.status}</h2>
              <div className={`inline-block px-4 py-2 rounded-full ${getStatusColor(trackLoan.data.status)}`}>
                {trackLoan.data.status.charAt(0).toUpperCase() + trackLoan.data.status.slice(1)}
              </div>
            </div>

            <p className="text-center text-[#666666] mb-8 text-lg">{getStatusMessage(trackLoan.data.status)}</p>

            <div className="space-y-4 mb-8 border-t border-[#D4D0C8] pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#666666] mb-1">Application ID</p>
                  <p className="text-lg font-semibold text-[#2A2A2A]">APP-{trackLoan.data.id}</p>
                </div>
                <div>
                  <p className="text-sm text-[#666666] mb-1">Applicant Name</p>
                  <p className="text-lg font-semibold text-[#2A2A2A]">{trackLoan.data.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-[#666666] mb-1">Business Name</p>
                  <p className="text-lg font-semibold text-[#2A2A2A]">{trackLoan.data.businessName}</p>
                </div>
                <div>
                  <p className="text-sm text-[#666666] mb-1">Loan Amount</p>
                  <p className="text-lg font-semibold text-[#1B5E3F]">₵{trackLoan.data.loanAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-[#666666] mb-1">Application Date</p>
                  <p className="text-lg font-semibold text-[#2A2A2A]">
                    {new Date(trackLoan.data.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#666666] mb-1">Last Updated</p>
                  <p className="text-lg font-semibold text-[#2A2A2A]">
                    {new Date(trackLoan.data.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#1B5E3F]/5 border border-[#1B5E3F]/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-[#2A2A2A]">
                <strong>Next Steps:</strong> Our team will contact you at {trackLoan.data.email} with updates. If you have any questions, please call us at +233 (0) 598 656 465.
              </p>
            </div>

            <Button
              onClick={() => {
                setApplicationId("");
                setEmail("");
                setSearched(false);
              }}
              variant="outline"
              className="w-full border-[#1B5E3F] text-[#1B5E3F]"
            >
              Search Another Application
            </Button>
          </Card>
        )}

        {searched && trackLoan.error && (
          <Card className="max-w-2xl mx-auto p-8 border-[#D4D0C8] bg-red-50">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-800 mb-2">Application Not Found</h2>
              <p className="text-red-700 mb-6">
                We couldn't find an application matching the provided ID and email. Please check your details and try again.
              </p>
              <Button
                onClick={() => {
                  setApplicationId("");
                  setEmail("");
                  setSearched(false);
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Try Again
              </Button>
            </div>
          </Card>
        )}

        {!searched && (
          <div className="max-w-2xl mx-auto text-center text-[#666666]">
            <p>Enter your application details above to check the status of your loan application.</p>
          </div>
        )}
      </div>
    </div>
  );
}
