import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Share2, TrendingUp, Gift, Users } from "lucide-react";
import { toast } from "sonner";

export default function ReferralProgram() {
  const [referralCode] = useState("REF-VINBERLY-2026");
  const [referralLink] = useState(`https://vinberly.manus.space?ref=${referralCode}`);
  const [referralEmail, setReferralEmail] = useState("");
  const [referralName, setReferralName] = useState("");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleReferral = () => {
    if (!referralEmail || !referralName) {
      toast.error("Please enter both name and email");
      return;
    }

    toast.success(`Referral sent to ${referralName}! They'll receive an invitation email.`);
    setReferralEmail("");
    setReferralName("");
  };

  const stats = [
    { label: "Total Referrals", value: "12", icon: Users },
    { label: "Completed", value: "8", icon: TrendingUp },
    { label: "Rewards Earned", value: "₵2,400", icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7F4] to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#1B5E3F] to-[#2A8659] text-white py-16">
        <div className="container">
          <h1 className="text-5xl font-bold mb-4">Referral Program</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Earn rewards by referring friends and fellow entrepreneurs to Vinberly
          </p>
        </div>
      </section>

      <div className="container py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6 border-[#D4D0C8] text-center">
                <Icon className="w-8 h-8 text-[#1B5E3F] mx-auto mb-3" />
                <p className="text-[#666666] text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-[#2A2A2A]">{stat.value}</p>
              </Card>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#2A2A2A] mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Share Your Code",
                description: "Share your unique referral code with friends and entrepreneurs",
              },
              {
                step: "2",
                title: "They Apply",
                description: "Your referral applies for a loan using your referral code",
              },
              {
                step: "3",
                title: "Earn Rewards",
                description: "When they get approved, you earn ₵300 in rewards!",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-[#1B5E3F] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-[#2A2A2A] mb-2">{item.title}</h3>
                <p className="text-[#666666]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Share Section */}
        <Card className="p-8 border-[#D4D0C8] mb-12 bg-gradient-to-br from-white to-[#F8F7F4]/50">
          <h2 className="text-2xl font-bold text-[#2A2A2A] mb-6">Share Your Referral Code</h2>

          <div className="space-y-6">
            {/* Referral Code */}
            <div>
              <label className="block text-sm font-semibold text-[#2A2A2A] mb-2">Your Referral Code</label>
              <div className="flex gap-2">
                <Input
                  value={referralCode}
                  readOnly
                  className="border-[#D4D0C8] bg-white"
                />
                <Button
                  onClick={() => copyToClipboard(referralCode)}
                  className="bg-[#1B5E3F] hover:bg-[#154B2F] text-white"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Referral Link */}
            <div>
              <label className="block text-sm font-semibold text-[#2A2A2A] mb-2">Your Referral Link</label>
              <div className="flex gap-2">
                <Input
                  value={referralLink}
                  readOnly
                  className="border-[#D4D0C8] bg-white"
                />
                <Button
                  onClick={() => copyToClipboard(referralLink)}
                  className="bg-[#1B5E3F] hover:bg-[#154B2F] text-white"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  window.open(`https://wa.me/?text=Join me at Vinberly Micro-Credit! ${referralLink}`, "_blank");
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share on WhatsApp
              </Button>
              <Button
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?text=Check out Vinberly Micro-Credit! ${referralLink}`, "_blank");
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share on Twitter
              </Button>
            </div>
          </div>
        </Card>

        {/* Refer Someone */}
        <Card className="p-8 border-[#D4D0C8] bg-gradient-to-br from-white to-[#F8F7F4]/50">
          <h2 className="text-2xl font-bold text-[#2A2A2A] mb-6">Refer Someone Directly</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#2A2A2A] mb-2">Their Name</label>
              <Input
                placeholder="John Doe"
                value={referralName}
                onChange={(e) => setReferralName(e.target.value)}
                className="border-[#D4D0C8]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2A2A2A] mb-2">Their Email</label>
              <Input
                type="email"
                placeholder="john@example.com"
                value={referralEmail}
                onChange={(e) => setReferralEmail(e.target.value)}
                className="border-[#D4D0C8]"
              />
            </div>
            <Button
              onClick={handleReferral}
              className="w-full bg-[#1B5E3F] hover:bg-[#154B2F] text-white text-base py-6"
            >
              Send Referral Invitation
            </Button>
          </div>
        </Card>

        {/* Terms */}
        <div className="mt-12 p-6 bg-[#1B5E3F]/5 border border-[#1B5E3F]/20 rounded-lg">
          <h3 className="font-bold text-[#2A2A2A] mb-3">Program Terms</h3>
          <ul className="text-sm text-[#666666] space-y-2">
            <li>• Earn ₵300 for each successful referral that gets approved</li>
            <li>• Rewards are credited to your account within 7 business days</li>
            <li>• No limit on how many people you can refer</li>
            <li>• Referrals must be new customers (not existing Vinberly clients)</li>
            <li>• Your referral must complete the full application process</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
