import { Input } from "@/components/ui/input";
import { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

// const baseUrl = import.meta.env.VITE_BASE_URL;
const baseUrl = import.meta.env.VITE_API_URL;

const areaSchema = z.object({
  area_name: z.string().nonempty("Name is required"),
});

type FormData = z.infer<typeof areaSchema>;

interface AddAreaProps {
  areaId?: number; // ID is needed for editing
  // convert it into string for later
  initialName?: string; // Prefill name if editing
  onSuccess: () => void;
}

export default function AddArea({
  areaId,
  initialName = "",
  onSuccess,
}: AddAreaProps) {
  const [loading, setLoading] = useState(false);
  console.log(baseUrl);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(areaSchema),
    defaultValues: { area_name: initialName },
  });

  useEffect(() => {
    if (initialName) {
      setValue("area_name", initialName);
    }
  }, [initialName, setValue]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setLoading(true);
      const url = areaId
        ? `${baseUrl}/area/update/${areaId}`
        : `${baseUrl}/area/create`;

      const method = areaId ? "put" : "post";

      const response = await axios({
        method,
        url,
        data,
      });

      if (response.status === 200 || response.status === 201) {
        alert(
          areaId ? "area updated successfully!" : "area added successfully!"
        );
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting area data:", error);
    } finally {
      setLoading(false);
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name:</Label>
        <Input {...register("area_name")} id="name" className="col-span-3" />
        {errors.area_name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.area_name.message}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading || isSubmitting}
        className="bg-blue-500 text-white p-2 rounded"
      >
        {loading ? "Submitting..." : areaId ? "Update" : "Submit"}
      </button>
    </form>
  );
}
