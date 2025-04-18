import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const data = {
  nfa_id: 6,
  project_id: 1,
  tower_id: 1,
  area_id: 1,
  department_id: 1,
  priority: "Medium",
  subject: "a new area selection for pipes",
  description: "<ul><li><p> nbgvyhihi</p></li></ul>",
  reference: "hello ",
  recommender: 5,
  last_recommender: 5,
  initiator_id: 1,
  approvals: [
    {
      id: 10,
      nfa_id: 6,
      approver_id: 5,
      order_value: 1,
      status: "Waiting",
      comments: "",
      approver_name: "Om_advisor",
      started_at: "0001-01-01T00:00:00Z",
      completed_at: "0001-01-01T00:00:00Z",
    },
  ],
  files: [
    {
      id: 7,
      nfa_id: 6,
      file_path: "",
      file_name:
        "1744957361675654190-11.02.16-Foundsgiving-Studio-EMP-21-768x548.jpg",
    },
  ],
  status: "Pending",
  initiator_name: "Om Singhal",
  recommender_name: "Om_advisor",
  last_recommender_name: "Om_advisor",
  project_name: "Kosmos",
  tower_name: "Tower A",
  area_name: "Wish Town",
  department_name: "Manager",
};

interface Approval {
  id: number;
  nfa_id: number;
  approver_id: number;
  order_value: number;
  status: string;
  comments: string;
  approver_name: string;
  started_at: string;
  completed_at: string;
}

interface FileAttachment {
  id: number;
  nfa_id: number;
  file_path: string;
  file_name: string;
}

interface TabLink {
  id: string;
  name: string;
  number?: number;
  icon: React.ElementType;
}

interface NFA {
  nfa_id: number;
  status: string;
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
  approvals: Approval[];
  files: FileAttachment[];
  initiator_name: string;
  recommender_name: string;
  last_recommender_name: string;
  project_name: string;
  tower_name: string;
  area_name: string;
  department_name: string;
}

type Props = {
  nfa: NFA;
};

export default function InititatorNfaScreen({ nfa = data }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Waiting":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <Card className="p-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">NFA Details</CardTitle>
          {nfa.status === "Initaited" && (
            <Button variant="destructive">Withdraw</Button>
          )}
        </CardHeader>

        <CardContent>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">NFA ID:</p>
                <p>{nfa.nfa_id}</p>
              </div>
              <div>
                <p className="font-medium">Status:</p>
                <p>{nfa.status}</p>
              </div>
              <div>
                <p className="font-medium">Priority:</p>
                <p>{nfa.priority}</p>
              </div>
              <div>
                <p className="font-medium">Project:</p>
                <p>{nfa.project_name}</p>
              </div>
              <div>
                <p className="font-medium">Tower:</p>
                <p>{nfa.tower_name}</p>
              </div>
              <div>
                <p className="font-medium">Area:</p>
                <p>{nfa.area_name}</p>
              </div>
              <div>
                <p className="font-medium">Department:</p>
                <p>{nfa.department_name}</p>
              </div>
              <div>
                <p className="font-medium">Initiator:</p>
                <p>{nfa.initiator_name}</p>
              </div>
              <div>
                <p className="font-medium">Recommender:</p>
                <p>{nfa.recommender_name}</p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Subject</h2>
            <p>{nfa.subject}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <div dangerouslySetInnerHTML={{ __html: nfa.description }} />
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Reference</h2>
            <p>{nfa.reference}</p>
          </div>

          <Separator className="my-6" />

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Approvals</h2>
            <div className="space-y-4">
              {nfa.approvals.map((approval) => (
                <div key={approval.id} className="border rounded-lg p-4">
                  <div className="font-medium">{approval.approver_name}</div>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">Order: {approval.order_value}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Status:</span>
                      <Badge className={getStatusColor(approval.status)}>
                        {approval.status}
                      </Badge>
                    </div>
                    {approval.comments && (
                      <p className="text-sm">Comments: {approval.comments}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h2 className="text-lg font-semibold mb-4">Attachments</h2>
            <div className="space-y-2">
              {nfa.files.map((file) => (
                <div key={file.id} className="border rounded-lg p-3">
                  <p className="text-sm">{file.file_name}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
