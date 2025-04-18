import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  LandPlot,
  Loader2,
  FileText,
  FileImage,
  File as FileIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import axios from "axios";
import RichTextEditor from "./text-editor/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DepartmentSelection from "./DepartmentSelection";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_URL;

export type department = {
  department_id: number;
  department_name: string;
};

export type User = {
  name: string;
  email: string;
  id: number;
};

export type Area = {
  area_name: string;
  area_id: number;
};

export type Tower = {
  tower_name: string;
  tower_id: number;
};
export type Project = {
  project_name: string;
  project_id: number;
};

const nfatypeSchema = z.object({
  reference: z.string().min(1, "required"),
  description: z.string().min(1, "required"),
  priority: z.string().min(1, "required"),
  subject: z.string().min(1, "required"),
  department_id: z.number().optional(),
  last_recommender: z.number().min(1, "required"),
  recommender: z.number(),
  tower_id: z.number().optional(),
  area_id: z.number().min(1, "required"),
  project_id: z.number().min(1, "required"),
  approval_list: z.array(
    z.object({
      approver_id: z.number(),
      order_value: z.number(),
    })
  ),
  // file section pending - now added after file upload
});
type FormData = z.infer<typeof nfatypeSchema>;

interface AddNfaProps {
  areaId?: number;
  projectId?: number;
  towerId?: number;
  last_recommender?: number;
  priority?: string;
  departmentId?: number;
  recommenderId?: number;
}

export type Hierachy = {
  hierarchy_id: number;
  user_id: number;
  department_id: number;
  order_value: number;
};

export default function AddNfa({
  areaId,
  projectId,
  towerId,
  last_recommender,
  priority,
  departmentId,
  recommenderId,
}: AddNfaProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [departmentApprover, setDepartmentApprover] = useState<Hierachy[]>([]);
  const [department, setDepartment] = useState<department[]>([]);
  const [area, setArea] = useState<Area[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState(
    departmentId?.toString() || ""
  );
  const [selectedrecommender, setSelectedrecommender] = useState(
    recommenderId?.toString() || ""
  );
  const [selectedLastrecommender, setSelectedLastrecommender] = useState(
    last_recommender?.toString() || ""
  );
  const [tower, setTower] = useState<Tower[]>([]);
  const [project, setProject] = useState<Project[]>([]);
  const [approvers, setApprovers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedArea, setSelectedArea] = useState(areaId?.toString() || "");
  const [selectedproject, setSelectedproject] = useState(
    projectId?.toString() || ""
  );
  const [selectedTower, setSelectedTower] = useState(towerId?.toString() || "");

  const [searchTerm, setSearchTerm] = useState("");
  const [searchLastTerm, setSearchLastTerm] = useState("");

  // New state for handling multi-file upload
  const [files, setFiles] = useState<File[]>([]);

  // Helper function to pick an icon based on file type
  function getFileIcon(file: File) {
    if (file.type.includes("pdf")) {
      return <FileText className="w-6 h-6 text-red-500" />;
    } else if (file.type.includes("image")) {
      return <FileImage className="w-6 h-6 text-blue-500" />;
    } else {
      return <FileIcon className="w-6 h-6 text-gray-500" />;
    }
  }

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredLastUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchLastTerm.toLowerCase())
  );

  const handleAreaChange = (value: string) => {
    setSelectedArea(value);
    setValue("area_id", Number(value)); // ✅ Set new area value
    setSelectedproject(""); // ✅ Reset project selection
    setValue("project_id", null as unknown as number); // ✅ Reset project ID in form state
  };

  const handleSelectionChange = (value: any) => {
    console.log(value);
    setValue("approval_list", value);
  };

  const handleDepartment = (value: string) => {
    setSelectedDepartment(value);
    setValue("department_id", Number(value));
  };

  const handlerecommander = (value: string) => {
    setSelectedrecommender(value);
    setValue("recommender", Number(value));
  };

  const handleLastrecommander = (value: string) => {
    setSelectedLastrecommender(value);
    setValue("last_recommender", Number(value));
  };

  const handleProjectChange = (value: string) => {
    setSelectedproject(value);
    setValue("project_id", Number(value));
    setSelectedTower(""); // ✅ Reset tower selection
    setValue("tower_id", null as unknown as number); // Reset tower ID in form state
  };

  const handleTowerChange = (value: string) => {
    setSelectedTower(value);
    setValue("tower_id", Number(value));
  };

  // Updated file input change handler to append new files
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const incomingFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...incomingFiles]);
  };

  // Remove a file from the selected files
  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // fetch Hierachy
  const fetchHierachy = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/hierarchies/${Number(selectedDepartment)}`
      );
      if (response.status === 200) {
        setDepartmentApprover(response.data);
      } else {
        setDepartmentApprover([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // fetchApprovers
  const fetchApprover = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/user/advisor`);
      if (response.status === 200) {
        setApprovers(response.data);
      } else {
        setApprovers([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // fetch Users
  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/user/`);
      if (response.status === 200) {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchApprover();
  }, []);

  // fetch Area
  const fetchArea = async () => {
    try {
      const response = await axios.get(`${baseUrl}/area/`);
      if (response.status === 200) {
        setArea(response.data);
      } else {
        setArea([]);
      }
    } catch (error) {
      console.error("Error fetching areas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArea();
  }, []);

  useEffect(() => {
    if (selectedDepartment !== "") {
      fetchHierachy();
    }
  }, [selectedDepartment]);

  // fetch project
  const fetchproject = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/project/${Number(selectedArea)}`
      );
      if (response.status === 200) {
        setProject(response.data);
      } else {
        setProject([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // fetch Tower
  const fetchtower = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/tower/${Number(selectedproject)}`
      );
      if (response.status === 200) {
        setTower(response.data);
      } else {
        setTower([]);
      }
    } catch (error) {
      console.error("Error fetching towers:", error);
    } finally {
      setLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(nfatypeSchema),
    defaultValues: {
      area_id: areaId ?? undefined,
      priority: priority,
      department_id: departmentId,
      recommender: recommenderId,
      tower_id: towerId,
      project_id: projectId,
    },
  });
  console.log(errors);

  useEffect(() => {
    if (selectedArea) {
      fetchproject();
    } else {
      setProject([]);
    }
  }, [selectedArea]);

  useEffect(() => {
    if (selectedproject) {
      fetchtower();
    } else {
      setTower([]);
    }
  }, [selectedproject]);

  const fetchDepartment = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/department/`);
      if (response.status === 200) {
        setDepartment(response.data);
      } else {
        setDepartment([]);
      }
    } catch (error) {
      console.error("Error submitting department data:", error);
    } finally {
      setLoading(false);
    }
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDepartment();
  }, []);

  console.log("error", errors);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      // 1. Create a FormData instance and append all selected files.
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("file", file);
      });

      // 2. Upload files to the API.
      const uploadResponse = await axios.post(`${baseUrl}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload Response:", uploadResponse.data);

      // 3. Prepare final payload by combining form data and the files uploaded.
      const finalPayload = {
        ...data,
        files: uploadResponse.data.files, // using file details from upload response
      };
      console.log("Final NFA Payload:", finalPayload);

      // 4. Raise the NFA by sending the final payload to the NFA endpoint.
      // (Assuming the NFA creation endpoint is `${baseUrl}/nfa`)
      const nfaResponse = await axios.post(
        `${baseUrl}/nfa/create`,
        finalPayload,
        { headers: { Authorization: token } }
      );
      if (nfaResponse.status === 201) {
        alert("NFA created successfully");
        navigate("/");
      } else {
        alert("Try Again");
        navigate("/");
      }
    } catch (error) {
      console.error("Error during file upload or NFA creation:", error);
      alert("Failed to create NFA");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-600">
            Loading details...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg ">
        <h2 className="text-2xl font-semibold mb-6 text-[#2467FC]">
          Raise NFA
        </h2>

        <hr className="border-gray-200 mb-6" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subject input */}
            <div className="space-y-2">
              <Label className="text-gray-700">Subject</Label>
              <Input
                {...register("subject")}
                type="text"
                placeholder="Enter Subject"
                className="w-full"
              />
              {errors.subject && (
                <p className="text-red-500 text-sm">{errors.subject.message}</p>
              )}
            </div>

            {/* Reference input */}
            <div className="space-y-2">
              <Label className="text-gray-700">Reference</Label>
              <Input
                {...register("reference")}
                type="text"
                placeholder="Enter reference"
                className="w-full"
              />
              {errors.reference && (
                <p className="text-red-500 text-sm">
                  {errors.reference.message}
                </p>
              )}
            </div>

            {/* Rich text editor for description */}
            <div className="space-y-2 lg:col-span-2">
              <Label className="text-gray-700">Description</Label>
              <RichTextEditor
                value={watch("description")}
                onChange={(value) =>
                  setValue("description", value, { shouldValidate: true })
                }
              />
            </div>

            {/* Area selection */}
            <div className="space-y-2">
              <Label className="text-gray-700">Select Area</Label>
              <Select onValueChange={handleAreaChange} value={selectedArea}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an Area" />
                </SelectTrigger>
                <SelectContent>
                  {area.length > 0 ? (
                    area.map((area) => (
                      <SelectItem
                        key={area.area_id}
                        value={area.area_id.toString()}
                      >
                        {area.area_name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="no-area">
                      No Area Found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.area_id && (
                <p className="text-red-500 text-sm">{errors.area_id.message}</p>
              )}
            </div>

            {/* Project selection */}
            {selectedArea && project.length >= 0 && (
              <div className="space-y-2">
                <Label className="text-gray-700">Select Project</Label>
                <Select
                  onValueChange={handleProjectChange}
                  value={selectedproject}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a Project" />
                  </SelectTrigger>
                  <SelectContent>
                    {project.length > 0 ? (
                      project.map((proj) => (
                        <SelectItem
                          key={proj.project_id}
                          value={proj.project_id.toString()}
                        >
                          {proj.project_name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="no-area">
                        No Project Found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.project_id && (
                  <p className="text-red-500 text-sm">
                    {errors.project_id.message}
                  </p>
                )}
              </div>
            )}

            {/* Tower selection */}
            {selectedArea && selectedproject && tower.length >= 0 && (
              <div className="space-y-2">
                <Label className="text-gray-700">Select Tower</Label>
                <Select onValueChange={handleTowerChange} value={selectedTower}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a Tower" />
                  </SelectTrigger>
                  <SelectContent>
                    {tower.length > 0 ? (
                      tower.map((tow) => (
                        <SelectItem
                          key={tow.tower_id}
                          value={tow.tower_id.toString()}
                        >
                          {tow.tower_name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="no-area">
                        No Tower Found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.tower_id && (
                  <p className="text-red-500 text-sm">
                    {errors.tower_id.message}
                  </p>
                )}
              </div>
            )}

            {/* Priority selection */}
            <div className="space-y-2">
              <Label className="text-gray-700">Select Priority</Label>
              <Select
                onValueChange={(value) => setValue("priority", value)}
                value={watch("priority")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-red-500 text-sm">
                  {errors.priority.message}
                </p>
              )}
            </div>

            {/* Department selection */}
            <div className="space-y-2">
              <Label className="text-gray-700">Select Department</Label>
              <Select
                onValueChange={handleDepartment}
                value={selectedDepartment}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Department" />
                </SelectTrigger>
                <SelectContent>
                  {department.length > 0 ? (
                    department.map((dept) => (
                      <SelectItem
                        key={dept.department_id}
                        value={dept.department_id.toString()}
                      >
                        {dept.department_name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="no-area">
                      No Department Found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.department_id && (
                <p className="text-red-500 text-sm">
                  {errors.department_id.message}
                </p>
              )}
            </div>

            {/* Recommender selection */}
            <div className="space-y-2">
              <Label className="text-gray-700">Select Recommender</Label>
              <Select
                onValueChange={handlerecommander}
                value={selectedrecommender}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Recommender" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="no-user">
                      No Recommender Found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.recommender && (
                <p className="text-red-500 text-sm">
                  {errors.recommender.message}
                </p>
              )}
            </div>

            {/* Last Recommender selection */}
            <div className="space-y-2">
              <Label className="text-gray-700">Select Last Recommender</Label>
              <Select
                onValueChange={handleLastrecommander}
                value={selectedLastrecommender}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Last Recommender" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchLastTerm}
                      onChange={(e) => setSearchLastTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  {filteredLastUsers.length > 0 ? (
                    filteredLastUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="no-user">
                      No Recommender Found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.last_recommender && (
                <p className="text-red-500 text-sm">
                  {errors.last_recommender.message}
                </p>
              )}
            </div>

            {/* Department Selection Component */}
            {selectedDepartment && (
              <div className="lg:col-span-2">
                <DepartmentSelection
                  allApprovers={approvers}
                  selectApprover={departmentApprover}
                  onSuccess={handleSelectionChange}
                />
              </div>
            )}

            {/* File upload area */}
            <div className="lg:col-span-2 space-y-2">
              <Label className="text-gray-700">
                Upload Files (Images/PDFs)
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors duration-200">
                <label className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <FileIcon className="h-8 w-8 text-gray-400" />
                    <div className="text-sm text-gray-600">
                      <span className="text-indigo-600 hover:text-indigo-500">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </div>
                    <div className="text-xs text-gray-500">
                      PNG, JPG, PDF up to 10MB
                    </div>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        {getFileIcon(file)}
                        <div className="flex-grow">
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {file.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              disabled={isSubmitting}
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Create NFA"
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
