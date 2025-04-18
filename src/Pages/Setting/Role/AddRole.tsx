import { Input } from "@/components/ui/input";
import { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

const baseUrl = import.meta.env.VITE_API_URL;
const roleSchema = z.object({
  role_name: z.string().nonempty("Name is required"),
});

type FormData = z.infer<typeof roleSchema>;

interface AddroleProps {
  departmentId?: string; // ID is needed for editing
  initialName?: string; // Prefill name if editing
  onSuccess: () => void;
}

export default function AddRole({
  departmentId,
  initialName = "",
  onSuccess,
}: AddroleProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: { role_name: initialName },
  });

  useEffect(() => {
    if (initialName) {
      setValue("role_name", initialName);
    }
  }, [initialName, setValue]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setLoading(true);
      const url = departmentId
        ? `${baseUrl}/roles/update/${departmentId}`
        : `${baseUrl}/roles/create`;

      const method = departmentId ? "put" : "post";

      const response = await axios({
        method,
        url,
        data,
      });

      if (response.status === 200 || response.status === 201) {
        alert(
          departmentId
            ? "Department updated successfully!"
            : "Department added successfully!"
        );
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting role data:", error);
    } finally {
      setLoading(false);
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name:</Label>
        <Input {...register("role_name")} id="name" className="col-span-3" />
        {errors.role_name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.role_name.message}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading || isSubmitting}
        className="bg-blue-500 text-white p-2 rounded"
      >
        {loading ? "Submitting..." : departmentId ? "Update" : "Submit"}
      </button>
    </form>
  );
}
