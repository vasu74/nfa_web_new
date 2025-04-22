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
  started_at: string;
  updated_at: string;
}

interface FileAttachment {
  id: number;
  nfa_id: number;
  file_path: string;
  file_name: string;
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

interface TabLink {
  id: string;
  name: string;
  number?: number;
  icon: React.ElementType;
}

const navigationMenu = [
  { name: "All", id: "1" },
  { name: "Completed", id: "5" },
  { name: "Pending", id: "6" },
  { name: "Rejected", id: "7" },
];

const baseUrl = import.meta.env.VITE_API_URL;

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
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
    case "Completed":
      return <FaCheckCircle className="text-green-500" />;
    case "Rejected":
      return <FaTimesCircle className="text-red-500" />;
    case "Pending":
      return <FaClock className="text-yellow-500" />;
    default:
      return null;
  }
};

export default function InitiatorNfa() {
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
  const uniqueProjects = [...new Set(nfa.map((item) => item.project_id))];
  const uniqueTowers = [...new Set(nfa.map((item) => item.tower_id))];
  const uniqueDepartments = [...new Set(nfa.map((item) => item.department_id))];
  const uniqueRecommenders = [
    ...new Set(nfa.map((item) => item.recommender_name)),
  ];

  const fetchNfa = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/nfa/initiator`, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        if (Array.isArray(response.data)) {
          setNfa(response.data);
        } else {
          setNfa(response.data);
        }
      } else {
        if (response.status === 204) {
          setNfa([]);
        } else {
          setNfa([]);
        }
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

  const handleTabChange = (id: string) => {
    setActiveTab(id);
  };

  const handleNfaClick = (nfa: NFA) => {
    navigate(`/mynfa/${nfa.nfa_id}`);
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      project: "",
      tower: "",
      department: "",
      recommender: "",
    });
  };

  const filteredNfas = nfa.filter((item) => {
    // First apply status filter
    const statusMatch = (() => {
      switch (activeTab) {
        case "5":
          return item.status.toLowerCase() === "completed";
        case "6":
          return item.status.toLowerCase() === "pending";
        case "7":
          return item.status.toLowerCase() === "rejected";
        default:
          return true;
      }
    })();

    // Then apply advanced filters
    const projectMatch =
      !filters.project || item.project_id.toString() === filters.project;
    const towerMatch =
      !filters.tower || item.tower_id.toString() === filters.tower;
    const departmentMatch =
      !filters.department ||
      item.department_id.toString() === filters.department;
    const recommenderMatch =
      !filters.recommender || item.recommender_name === filters.recommender;

    return (
      statusMatch &&
      projectMatch &&
      towerMatch &&
      departmentMatch &&
      recommenderMatch
    );
  });

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

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project
              </label>
              <select
                value={filters.project}
                onChange={(e) => handleFilterChange("project", e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Projects</option>
                {uniqueProjects.map((project) => (
                  <option key={project} value={project}>
                    Project {project}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tower
              </label>
              <select
                value={filters.tower}
                onChange={(e) => handleFilterChange("tower", e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Towers</option>
                {uniqueTowers.map((tower) => (
                  <option key={tower} value={tower}>
                    Tower {tower}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) =>
                  handleFilterChange("department", e.target.value)
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Departments</option>
                {uniqueDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    Department {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recommender
              </label>
              <select
                value={filters.recommender}
                onChange={(e) =>
                  handleFilterChange("recommender", e.target.value)
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Recommenders</option>
                {uniqueRecommenders.map((recommender) => (
                  <option key={recommender} value={recommender}>
                    {recommender}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Status Tabs */}
      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {navigationMenu.map((menu) => (
            <button
              key={menu.id}
              onClick={() => handleTabChange(menu.id)}
              className={`
                px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                ${
                  activeTab === menu.id
                    ? "bg-blue-400 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }
                whitespace-nowrap
              `}
            >
              {menu.name}
            </button>
          ))}
        </div>
      </div>

      {/* NFA Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredNfas.map((item) => (
          <div
            key={item.nfa_id}
            onClick={() => navigate(`/initiator/nfa/${item.nfa_id}`)}
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
                <span>Files: {item.files?.length || 0}</span>
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

      {!loading && filteredNfas.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No NFAs found for the selected status
        </div>
      )}
    </div>
  );
}
