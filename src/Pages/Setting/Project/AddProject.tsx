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

const baseUrl = import.meta.env.VITE_APIS_URL;

const ProjectSchema = z.object({
  project_name: z.string().nonempty("Project Name is required"),
  area_id: z.number().min(1, "Select an Area"), // Use string to handle select values properly
});

type FormData = z.infer<typeof ProjectSchema>;

interface AddProjectProps {
  areaId?: number;
  initialName?: string;
  projectId?: string;
  onSuccess: () => void;
}

export type Area = {
  area_name: string;
  area_id: number;
};

export default function AddProject({
  areaId,
  projectId,
  initialName = "",
  onSuccess,
}: AddProjectProps) {
  const [loading, setLoading] = useState(false);
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedArea, setSelectedArea] = useState(areaId?.toString() || ""); // Manage selected value

  const fetchArea = async () => {
    try {
      const response = await axios.get(`${baseUrl}/area/`);
      if (response.status === 200) {
        setAreas(response.data);
      } else {
        setAreas([]);
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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      project_name: initialName || "",
      area_id: areaId ?? undefined, // Avoid string conversion
    },
  });

  useEffect(() => {
    if (initialName) {
      setValue("project_name", initialName);
    }
    if (areaId) {
      setValue("area_id", Number(areaId));
    }
  }, [initialName, areaId, setValue]);

  const handleAreaChange = (value: string) => {
    setSelectedArea(value);
    setValue("area_id", Number(value)); // Correct way to convert string to number
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setLoading(true);
      const url = projectId
        ? `${baseUrl}/project/update/${projectId}`
        : `${baseUrl}/project/create`;

      const method = projectId ? "put" : "post";

      const response = await axios({
        method,
        url,
        data,
      });

      if (response.status === 200 || response.status === 201) {
        alert(
          projectId
            ? "Project updated successfully!"
            : "Project added successfully!"
        );
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting project data:", error);
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
          <Label htmlFor="name">Project Name:</Label>
          <Input
            {...register("project_name")}
            id="name"
            className="col-span-3"
          />
          {errors.project_name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.project_name.message}
            </p>
          )}
        </div>

        {/* Select Area Field */}
        <div className="flex flex-col gap-1">
          <Label>Select Area</Label>
          <Select onValueChange={handleAreaChange} value={selectedArea}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an Area" />
            </SelectTrigger>
            <SelectContent>
              {areas.length > 0 ? (
                areas.map((area) => (
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
            <p className="text-red-500 text-sm mt-1">
              {errors.area_id.message}
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
