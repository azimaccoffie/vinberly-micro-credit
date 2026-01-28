import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, CheckCircle, Clock, AlertCircle, FileText, Download } from "lucide-react";
import { toast } from "sonner";

interface Document {
  id: number;
  type: string;
  fileName: string;
  status: "pending" | "verified" | "rejected";
  uploadedDate: string;
  notes?: string;
}

export default function DocumentVerification() {
  const [applicationId, setApplicationId] = useState("");
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      type: "Business Registration",
      fileName: "business_registration.pdf",
      status: "verified",
      uploadedDate: "2026-01-20",
    },
    {
      id: 2,
      type: "Tax ID",
      fileName: "tax_certificate.pdf",
      status: "pending",
      uploadedDate: "2026-01-20",
    },
    {
      id: 3,
      type: "Bank Statement",
      fileName: "bank_statement_jan_2026.pdf",
      status: "pending",
      uploadedDate: "2026-01-21",
    },
  ]);

  const handleFileUpload = (type: string) => {
    toast.success(`${type} uploaded successfully! Our team will verify it within 24 hours.`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "rejected":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const requiredDocuments = [
    { type: "Business Registration", description: "Official business registration certificate" },
    { type: "Tax ID", description: "Tax Identification Number certificate" },
    { type: "Bank Statement", description: "Last 3 months bank statements" },
    { type: "ID Verification", description: "Government-issued ID or passport" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7F4] to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#1B5E3F] to-[#2A8659] text-white py-16">
        <div className="container">
          <h1 className="text-5xl font-bold mb-4">Document Verification</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Upload and manage your loan application documents
          </p>
        </div>
      </section>

      <div className="container py-12">
        {/* Application ID Lookup */}
        <Card className="p-6 border-[#D4D0C8] mb-12">
          <h2 className="text-xl font-bold text-[#2A2A2A] mb-4">Find Your Application</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Enter your Application ID (e.g., APP-1)"
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              className="border-[#D4D0C8]"
            />
            <Button className="bg-[#1B5E3F] hover:bg-[#154B2F] text-white">Search</Button>
          </div>
        </Card>

        {/* Upload Progress */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#2A2A2A] mb-6">Upload Progress</h2>
          <div className="w-full bg-[#D4D0C8] rounded-full h-3 mb-4">
            <div className="bg-[#1B5E3F] h-3 rounded-full" style={{ width: "66%" }}></div>
          </div>
          <p className="text-[#666666] text-sm">2 of 3 documents verified</p>
        </div>

        {/* Current Documents */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#2A2A2A] mb-6">Your Documents</h2>
          <div className="space-y-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="p-6 border-[#D4D0C8] hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <FileText className="w-8 h-8 text-[#1B5E3F]" />
                    <div className="flex-1">
                      <h3 className="font-bold text-[#2A2A2A]">{doc.type}</h3>
                      <p className="text-sm text-[#666666]">{doc.fileName}</p>
                      <p className="text-xs text-[#999999] mt-1">Uploaded: {doc.uploadedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(doc.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(doc.status)}`}>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="border-[#D4D0C8]">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {doc.notes && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                    <strong>Note:</strong> {doc.notes}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Upload Required Documents */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#2A2A2A] mb-6">Upload Required Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requiredDocuments.map((doc, index) => (
              <Card key={index} className="p-6 border-[#D4D0C8] hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <h3 className="font-bold text-[#2A2A2A] mb-1">{doc.type}</h3>
                  <p className="text-sm text-[#666666]">{doc.description}</p>
                </div>
                <label className="block">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={() => handleFileUpload(doc.type)}
                    className="hidden"
                    id={`file-${index}`}
                  />
                  <Button
                    onClick={() => {
                      const input = document.getElementById(`file-${index}`) as HTMLInputElement;
                      input?.click();
                    }}
                    className="w-full bg-[#1B5E3F] hover:bg-[#154B2F] text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload {doc.type}
                  </Button>
                </label>
              </Card>
            ))}
          </div>
        </div>

        {/* Guidelines */}
        <Card className="p-8 border-[#D4D0C8] bg-[#1B5E3F]/5">
          <h3 className="text-xl font-bold text-[#2A2A2A] mb-4">Document Guidelines</h3>
          <div className="space-y-3 text-[#666666]">
            <p>
              <strong>File Format:</strong> PDF, JPG, or PNG (max 5MB per file)
            </p>
            <p>
              <strong>Quality:</strong> Documents must be clear and legible
            </p>
            <p>
              <strong>Verification Time:</strong> Most documents are verified within 24 hours
            </p>
            <p>
              <strong>Rejection:</strong> If a document is rejected, you'll receive feedback and can resubmit
            </p>
            <p>
              <strong>Privacy:</strong> Your documents are encrypted and securely stored
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
