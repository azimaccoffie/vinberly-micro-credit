import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, TrendingUp, Users, DollarSign, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState("30days");

  // Application trends data
  const applicationTrends = [
    { month: "Jan", applications: 45, approved: 38, rejected: 7 },
    { month: "Feb", applications: 52, approved: 44, rejected: 8 },
    { month: "Mar", applications: 38, approved: 32, rejected: 6 },
    { month: "Apr", applications: 61, approved: 51, rejected: 10 },
    { month: "May", applications: 55, approved: 47, rejected: 8 },
    { month: "Jun", applications: 73, approved: 62, rejected: 11 },
  ];

  // Loan disbursement data
  const loanDisbursement = [
    { week: "Week 1", amount: 125000 },
    { week: "Week 2", amount: 189000 },
    { week: "Week 3", amount: 156000 },
    { week: "Week 4", amount: 203000 },
  ];

  // Application status breakdown
  const statusBreakdown = [
    { name: "Approved", value: 284, fill: "#1B5E3F" },
    { name: "Pending", value: 45, fill: "#D4A574" },
    { name: "Rejected", value: 50, fill: "#E8664A" },
    { name: "Processing", value: 38, fill: "#2A8659" },
  ];

  // Top performing referrers
  const topReferrers = [
    { name: "Ama Osei", referrals: 12, rewards: 3600 },
    { name: "Kwesi Mensah", referrals: 9, rewards: 2700 },
    { name: "Abena Boateng", referrals: 8, rewards: 2400 },
    { name: "Yaw Asante", referrals: 7, rewards: 2100 },
    { name: "Nana Ama", referrals: 6, rewards: 1800 },
  ];

  // Key metrics
  const metrics = [
    {
      label: "Total Applications",
      value: "417",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Total Disbursed",
      value: "₵673,000",
      change: "+18%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      label: "Approval Rate",
      value: "68%",
      change: "+5%",
      icon: CheckCircle,
      color: "text-emerald-600",
    },
    {
      label: "Avg Loan Size",
      value: "₵15,800",
      change: "+3%",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ];

  const handleExport = () => {
    toast.success("Analytics report exported as CSV!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7F4] to-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#2A2A2A] mb-2">Analytics Dashboard</h1>
        <p className="text-[#666666]">Comprehensive business metrics and performance insights</p>
      </div>

      {/* Date Range Selector */}
      <div className="flex gap-2 mb-8">
        {["7days", "30days", "90days", "1year"].map((range) => (
          <Button
            key={range}
            onClick={() => setDateRange(range)}
            className={`${
              dateRange === range
                ? "bg-[#1B5E3F] text-white"
                : "border-[#D4D0C8] text-[#2A2A2A] hover:bg-[#F8F7F4]"
            }`}
            variant={dateRange === range ? "default" : "outline"}
          >
            {range === "7days" && "Last 7 Days"}
            {range === "30days" && "Last 30 Days"}
            {range === "90days" && "Last 90 Days"}
            {range === "1year" && "Last Year"}
          </Button>
        ))}
        <Button onClick={handleExport} className="ml-auto bg-[#1B5E3F] hover:bg-[#154B2F] text-white">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="p-6 border-[#D4D0C8]">
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${metric.color}`} />
                <span className="text-green-600 text-sm font-semibold">{metric.change}</span>
              </div>
              <p className="text-[#666666] text-sm mb-1">{metric.label}</p>
              <p className="text-2xl font-bold text-[#2A2A2A]">{metric.value}</p>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Application Trends */}
        <Card className="p-6 border-[#D4D0C8]">
          <h3 className="text-xl font-bold text-[#2A2A2A] mb-4">Application Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={applicationTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="applications" fill="#1B5E3F" name="Total Applications" />
              <Bar dataKey="approved" fill="#2A8659" name="Approved" />
              <Bar dataKey="rejected" fill="#E8664A" name="Rejected" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Loan Disbursement */}
        <Card className="p-6 border-[#D4D0C8]">
          <h3 className="text-xl font-bold text-[#2A2A2A] mb-4">Weekly Disbursement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={loanDisbursement}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip formatter={(value) => `₵${value.toLocaleString()}`} />
              <Line type="monotone" dataKey="amount" stroke="#1B5E3F" strokeWidth={2} dot={{ fill: "#1B5E3F" }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Status Breakdown & Top Referrers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Status Breakdown */}
        <Card className="p-6 border-[#D4D0C8]">
          <h3 className="text-xl font-bold text-[#2A2A2A] mb-4">Application Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusBreakdown} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                {statusBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Referrers */}
        <Card className="p-6 border-[#D4D0C8]">
          <h3 className="text-xl font-bold text-[#2A2A2A] mb-4">Top Referrers</h3>
          <div className="space-y-4">
            {topReferrers.map((referrer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#F8F7F4] rounded">
                <div>
                  <p className="font-bold text-[#2A2A2A]">{referrer.name}</p>
                  <p className="text-sm text-[#666666]">{referrer.referrals} referrals</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#1B5E3F]">₵{referrer.rewards.toLocaleString()}</p>
                  <p className="text-xs text-[#999999]">rewards earned</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Business Summary */}
      <Card className="p-8 border-[#D4D0C8] bg-gradient-to-r from-[#1B5E3F]/5 to-[#D4A574]/5">
        <h3 className="text-xl font-bold text-[#2A2A2A] mb-4">Business Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-[#666666] text-sm mb-1">Average Processing Time</p>
            <p className="text-2xl font-bold text-[#2A2A2A]">2.3 days</p>
            <p className="text-xs text-[#999999] mt-1">↓ 15% from last month</p>
          </div>
          <div>
            <p className="text-[#666666] text-sm mb-1">Customer Satisfaction</p>
            <p className="text-2xl font-bold text-[#2A2A2A]">4.8/5.0</p>
            <p className="text-xs text-[#999999] mt-1">Based on 127 reviews</p>
          </div>
          <div>
            <p className="text-[#666666] text-sm mb-1">Default Rate</p>
            <p className="text-2xl font-bold text-[#2A2A2A]">2.1%</p>
            <p className="text-xs text-[#999999] mt-1">Industry average: 3.5%</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
