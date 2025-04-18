import { Input } from "@/components/ui/input";
import { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const baseUrl = import.meta.env.VITE_API_URL;

const ProjectSchema = z.object({
  tower_name: z.string().nonempty("Project Name is required"),
  project_id: z.number().min(1, "Select an Area"), // Use string to handle select values properly
});

type FormData = z.infer<typeof ProjectSchema>;

interface AddTowerProps {
  projectId?: number;
  initialName?: string;
  TowerId?: string;
  onSuccess: () => void;
}

export type Project = {
  project_name: string;
  project_id: number;
};

export default function AddTower({
  TowerId,
  projectId,
  initialName = "",
  onSuccess,
}: AddTowerProps) {
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<Project[]>([]);
  const [selectedproject, setSelectedproject] = useState(
    projectId?.toString() || ""
  ); // Manage selected value

  const fetchproject = async () => {
    try {
      const response = await axios.get(`${baseUrl}/project/`);
      if (response.status === 200) {
        setProject(response.data);
      } else {
        setProject([]);
      }
    } catch (error) {
      console.error("Error fetching areas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchproject();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      tower_name: initialName || "",
      project_id: projectId?.toString() || "",
    },
  });

  useEffect(() => {
    if (initialName) {
      setValue("tower_name", initialName);
    }
    if (projectId) {
      setValue("project_id", projectId.toString());
    }
  }, [initialName, projectId, setValue]);

  const handleProjectChange = (value: string) => {
    setSelectedproject(value);
    setValue("project_id", Number(value));
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setLoading(true);
      const url = projectId
        ? `${baseUrl}/tower/${TowerId}`
        : `${baseUrl}/tower/create`;

      const method = projectId ? "put" : "post";

      const response = await axios({
        method,
        url,
        data,
      });

      if (response.status === 200 || response.status === 201) {
        alert(
          projectId
            ? "tower updated successfully!"
            : "tower added successfully!"
        );
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting tower data:", error);
    } finally {
      setLoading(false);
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
      <div className="flex flex-col gap-4">
        {/* Project Name Field */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="name">Tower Name:</Label>
          <Input {...register("tower_name")} id="name" className="col-span-3" />
          {errors.tower_name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.tower_name.message}
            </p>
          )}
        </div>

        {/* Select Area Field */}
        <div className="flex flex-col gap-1">
          <Label>Select Project</Label>
          <Select onValueChange={handleProjectChange} value={selectedproject}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an Area" />
            </SelectTrigger>
            <SelectContent>
              {project.length > 0 ? (
                project.map((project) => (
                  <SelectItem
                    key={project.project_id}
                    value={project.project_id.toString()}
                  >
                    {project.project_name}
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
            <p className="text-red-500 text-sm mt-1">
              {errors.project_id.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || isSubmitting}
        className="bg-blue-500 text-white p-2 rounded"
      >
        {loading
          ? "Submitting..."
          : projectId
          ? "Update Project"
          : "Add Project"}
      </button>
    </form>
  );
}
