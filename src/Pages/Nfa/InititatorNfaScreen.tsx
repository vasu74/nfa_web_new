import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FileText, Image, Clock, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
type Approval = {
  id: number;
  nfa_id: number;
  approver_id: number;
  order_value: number;
  status: string;
  comments: string;
  started_at: string; // ISO timestamp
  completed_at: string; // ISO timestamp
  approver_name: string;
  approver_email: string;
};

type File = {
  id: number;
  nfa_id: number;
  file_path: string;
  file_name: string;
};

type Details = {
  nfa_id: number;
  project_id: number;
  tower_id: number;
  area_id: number;
  department_id: number;
  priority: string;
  subject: string;
  description: string;
  reference: string;
  recommender: number;
  last_recommender: number;
  initiator_id: number;
  approvals: Approval[] | null;
  files: File[] | null;
  status: string;
  initiator_name: string;
  initiator_email: string;
  recommender_name: string;
  recommender_email: string;
  last_recommender_name: string;
  last_recommender_email: string;
  project_name: string;
  tower_name: string;
  area_name: string;
  department_name: string;
};

type NFAData = {
  approvals: Approval[];
  details: Details;
  files: File[];
};

const baseUrl = import.meta.env.VITE_API_URL;
export default function InititatorNfaScreen() {
  const { id } = useParams<{ id: string }>();
  const token = localStorage.getItem("token");
  const [nfa, setNfa] = useState<NFAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNfa();
  }, [id]);

  const fetchNfa = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${baseUrl}/nfa/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setNfa(response.data);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to fetch NFA details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Waiting":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Waiting":
        return <Clock className="w-4 h-4" />;
      case "Approved":
        return <CheckCircle2 className="w-4 h-4" />;
      case "Rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (["pdf"].includes(extension || "")) {
      return <FileText className="w-5 h-5" />;
    }
    if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) {
      return <Image className="w-5 h-5" />;
    }
    return <FileText className="w-5 h-5" />;
  };

  const handleWithdraw = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/nfa/${id}/withdraw`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status === 200) {
        fetchNfa(); // Refresh the data
      }
    } catch (error) {
      console.error(error);
      setError("Failed to withdraw NFA. Please try again later.");
    }
  };

  const handlePdfDownload = async () => {
    try {
      const response = await axios.get(`${baseUrl}/pdf/generate/${id}`, {
        headers: {
          Authorization: token,
        },
        responseType: "blob",
      });
      if (response.status === 200) {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `NFA_${id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to download PDF. Please try again later.");
      toast.error("Failed to download PDF. Please try again later.");
    }
  };
  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!nfa) {
    return <div className="p-6 text-red-500">No NFA data found</div>;
  }

  return (
    <div className="">
      <div className="bg-white ">
        <div className="flex flex-row items-center justify-between p-4 bg-blue-50 border-b border-blue-100">
          <h1 className="text-xl font-bold text-blue-800">NFA Details</h1>
          {nfa.details.status === "Pending" && (
            <Button variant="destructive" onClick={handleWithdraw}>
              Withdraw
            </Button>
          )}
          {nfa.details.status === "Completed" && (
            <Button className="bg-green-500" onClick={handlePdfDownload}>
              Download Pdf
            </Button>
          )}
        </div>

        <div className="p-4">
          <div className="mb-6">
            <h2 className="text-base font-semibold mb-3 text-blue-700">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="font-medium text-blue-600">NFA ID:</p>
                <p className="text-gray-800">{nfa.details.nfa_id}</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-blue-600">Status:</p>
                <Badge className={getStatusColor(nfa.details.status)}>
                  {nfa.details.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-blue-600">Priority:</p>
                <p className="text-gray-800">{nfa.details.priority}</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-blue-600">Project:</p>
                <p className="text-gray-800">{nfa.details.project_name}</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-blue-600">Tower:</p>
                <p className="text-gray-800">{nfa.details.tower_name}</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-blue-600">Area:</p>
                <p className="text-gray-800">{nfa.details.area_name}</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-blue-600">Department:</p>
                <p className="text-gray-800">{nfa.details.department_name}</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-blue-600">Initiator:</p>
                <p className="text-gray-800">{nfa.details.initiator_name}</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-blue-600">Recommender:</p>
                <p className="text-gray-800">{nfa.details.recommender_name}</p>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="mb-6">
            <h2 className="text-base font-semibold mb-3 text-blue-700">
              Subject
            </h2>
            <p className="text-gray-800">{nfa.details.subject}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-base font-semibold mb-3 text-blue-700">
              Description
            </h2>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: nfa.details.description }}
            />
          </div>

          <div className="mb-6">
            <h2 className="text-base font-semibold mb-3 text-blue-700">
              Reference
            </h2>
            <p className="text-gray-800">{nfa.details.reference}</p>
          </div>

          <Separator className="my-4" />

          <div className="mb-6">
            <h2 className="text-base font-semibold mb-3 text-blue-700">
              Approvals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {nfa.approvals.map((approval) => (
                <div
                  key={approval.id}
                  className={`border rounded-lg p-3 ${getStatusColor(
                    approval.status
                  )}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-800">
                      {approval.approver_name}
                    </div>
                    {getStatusIcon(approval.status)}
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">
                      Order: {approval.order_value}
                    </p>
                    {approval.comments && (
                      <div className="mt-1">
                        <p className="text-sm font-medium text-gray-600">
                          Comments:
                        </p>
                        <p className="text-sm text-gray-800">
                          {approval.comments}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <h2 className="text-base font-semibold mb-3 text-blue-700">
              Attachments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {nfa.files.map((file) => (
                <div
                  key={file.id}
                  className="border rounded-lg p-3 hover:bg-blue-50 transition-colors"
                >
                  <a
                    href={`https://nfa.blueinvent.com/api/get_file?file=${file.file_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-800 hover:text-blue-600"
                  >
                    {getFileIcon(file.file_name)}
                    <span className="text-sm truncate">{file.file_name}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
