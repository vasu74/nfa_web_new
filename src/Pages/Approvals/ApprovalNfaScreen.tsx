import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FileText, Image, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
export default function ApprovalNfaScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const token = localStorage.getItem("token");
  const [nfa, setNfa] = useState<NFAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAction, setSelectedAction] = useState<
    "approve" | "reject" | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchNfa();
  }, [id]);

  const fetchNfa = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${baseUrl}/nfa/${id}`, {
        headers: {
          Authorization: token,
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

  const handleWithdraw = async (text: string) => {
    if (!comment.trim()) {
      setActionError("Please enter a comment before proceeding");
      return;
    }

    setIsSubmitting(true);
    setActionError(null);

    const formatteddata = {
      nfa_id: Number(id),
      action: text,
      comment: comment.trim(),
    };

    try {
      const response = await axios.put(
        `${baseUrl}/reject_approve`,
        formatteddata,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        setComment("");
        setSelectedAction(null);
        setIsDialogOpen(false);
        fetchNfa();
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        setActionError(
          error.response?.data?.message ||
            "Failed to process the request. Please try again later."
        );
      } else {
        setActionError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActionClick = (action: "approve" | "reject") => {
    setSelectedAction(action);
    setComment("");
    setActionError(null);
    setIsDialogOpen(true);
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
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center gap-2">
                <Button
                  variant="destructive"
                  onClick={() => handleActionClick("reject")}
                >
                  Reject
                </Button>
                <Button
                  className="bg-green-300"
                  onClick={() => handleActionClick("approve")}
                >
                  Approve
                </Button>
              </div>
            </div>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAction} NFA</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Input
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`Enter your comment for ${selectedAction}...`}
                className="w-full"
              />
              {actionError && (
                <p className="text-sm text-red-500">{actionError}</p>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setComment("");
                  setActionError(null);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant={
                  selectedAction === "reject" ? "destructive" : "default"
                }
                onClick={() => handleWithdraw(selectedAction!)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : `Confirm ${selectedAction}`}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
