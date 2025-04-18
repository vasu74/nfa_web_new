import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaFile,
  FaUser,
  FaBuilding,
  FaMapMarkerAlt,
  FaSitemap,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFilter,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Approval {
  id: number;
  nfa_id: number;
  approver_id: number;
  order_value: number;
  status: string;
  comments: string;
  approver_name: string;
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

const navigationMenu = [
  { name: "All", id: "1" },
  { name: "Approved", id: "5" },
  { name: "Pending", id: "6" },
  { name: "Rejected", id: "7" },
];

const baseUrl = import.meta.env.VITE_API_URL;

const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Approved":
      return <FaCheckCircle className="text-green-500" />;
    case "Rejected":
      return <FaTimesCircle className="text-red-500" />;
    case "Pending":
      return <FaClock className="text-yellow-500" />;
    default:
      return null;
  }
};

export default function ApprovalNfa() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("1");
  const token = localStorage.getItem("token");
  const [nfa, setNfa] = useState<NFA[]>([]);
  const [loading, setLoading] = useState(false);

  // New state variables for filters
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    project: "",
    tower: "",
    department: "",
    recommender: "",
  });

  // Get unique values for filter options

  const fetchNfa = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/pending_approvals`, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        if (Array.isArray(response.data)) {
          setNfa(response.data);
        } else {
          setNfa([response.data]);
        }
      } else {
        setNfa([]);
      }
    } catch {
      console.log("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNfa();
  }, []);

  console.log(nfa);

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold mb-6 text-[#2467FC]">
          NFA Dashboard
        </h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-500 transition-colors"
        >
          <FaFilter />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* NFA Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
        {nfa.map((item) => (
          <div
            key={item.nfa_id}
            onClick={() => navigate(`/approvals/nfa/${item.nfa_id}`)}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                  {item.subject}
                </h2>
                <p className="text-sm text-gray-500">NFA ID: {item.nfa_id}</p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 flex-shrink-0 ${getStatusColor(
                  item.status
                )}`}
              >
                {getStatusIcon(item.status)} {item.status}
              </div>
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex items-center text-sm text-gray-600">
                <FaUser className="mr-2" />
                <span>Recommender: {item.recommender_name}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FaFile className="mr-2" />
                <span>Files: {item.files.length}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <FaBuilding className="mr-2" />
                <span>Department: {item.department_id}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <FaSitemap className="mr-2" />
                <span>Tower: {item.tower_id}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <FaMapMarkerAlt className="mr-2" />
                <span>Area: {item.area_id}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <FaUser className="mr-2" />
                <span>Approvers: {item.approvals.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {!loading && nfa.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No NFAs found for the selected status
        </div>
      )}
    </div>
  );
}
