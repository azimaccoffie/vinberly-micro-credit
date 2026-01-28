import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, AlertCircle, Download, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getApplications = trpc.loanApplication.getAll.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const updateApplicationStatus = trpc.loanApplication.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Application status updated successfully");
      getApplications.refetch();
    },
    onError: () => {
      toast.error("Failed to update application status");
    },
  });

  useEffect(() => {
    if (getApplications.data) {
      const filtered = statusFilter === "all" 
        ? getApplications.data 
        : getApplications.data.filter((app: any) => app.status === statusFilter);
      setApplications(filtered);
      setIsLoading(false);
    }
  }, [getApplications.data, statusFilter]);

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F8F7F4] to-white">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-[#E8664A] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#2A2A2A] mb-2">Access Denied</h2>
          <p className="text-[#666666]">You do not have permission to access the admin dashboard.</p>
        </Card>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "processing":
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
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

  const handleStatusChange = (applicationId: number, newStatus: string) => {
    updateApplicationStatus.mutate({ applicationId, newStatus: newStatus as "pending" | "processing" | "approved" | "rejected" });
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Full Name", "Email", "Phone", "Business Name", "Loan Amount", "Status", "Date"];
    const rows = applications.map((app: any) => [
      app.id,
      app.fullName,
      app.email,
      app.phone,
      app.businessName,
      app.loanAmount,
      app.status,
      new Date(app.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row: any) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `loan-applications-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Applications exported as CSV");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7F4] to-white">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#2A2A2A] mb-2">Loan Applications Dashboard</h1>
          <p className="text-[#666666]">Manage and track all incoming loan applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 border-[#D4D0C8]">
            <p className="text-[#666666] text-sm mb-2">Total Applications</p>
            <p className="text-3xl font-bold text-[#1B5E3F]">{getApplications.data?.length || 0}</p>
          </Card>
          <Card className="p-6 border-[#D4D0C8]">
            <p className="text-[#666666] text-sm mb-2">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">
              {getApplications.data?.filter((a: any) => a.status === "pending").length || 0}
            </p>
          </Card>
          <Card className="p-6 border-[#D4D0C8]">
            <p className="text-[#666666] text-sm mb-2">Approved</p>
            <p className="text-3xl font-bold text-green-600">
              {getApplications.data?.filter((a: any) => a.status === "approved").length || 0}
            </p>
          </Card>
          <Card className="p-6 border-[#D4D0C8]">
            <p className="text-[#666666] text-sm mb-2">Processing</p>
            <p className="text-3xl font-bold text-blue-600">
              {getApplications.data?.filter((a: any) => a.status === "processing").length || 0}
            </p>
          </Card>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-[#D4D0C8]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => getApplications.refetch()} className="bg-[#1B5E3F] hover:bg-[#154B2F] text-white">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExportCSV} variant="outline" className="border-[#D4D0C8]">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Applications Table */}
        <Card className="border-[#D4D0C8] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F7F4] border-b border-[#D4D0C8]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2A2A2A]">Applicant</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2A2A2A]">Business</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2A2A2A]">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2A2A2A]">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2A2A2A]">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2A2A2A]">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.length > 0 ? (
                  applications.map((app: any) => (
                    <tr key={app.id} className="border-b border-[#D4D0C8] hover:bg-[#F8F7F4]/50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-[#2A2A2A]">{app.fullName}</p>
                          <p className="text-sm text-[#666666]">{app.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[#2A2A2A]">{app.businessName}</p>
                        <p className="text-sm text-[#666666]">{app.businessType}</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#1B5E3F]">₵{app.loanAmount}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(app.status)}
                          <Badge className={getStatusColor(app.status)}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#666666]">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Select value={app.status} onValueChange={(newStatus) => handleStatusChange(app.id, newStatus)}>
                          <SelectTrigger className="w-32 border-[#D4D0C8] text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <p className="text-[#666666]">No applications found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
