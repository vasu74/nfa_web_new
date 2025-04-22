import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import bg from "@/assets/defaultimage.jpg";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const baseUrl = import.meta.env.VITE_API_URL;

const schmea = z.object({
  name: z.string().min(1, " Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone_no: z.string().min(10, "Phone number is required"),
  profile_picture: z.string().optional(),
  department_id: z.number().min(1, "enter the department"),
  role_id: z.number().min(1, "enter the role"),
  address: z.string().min(1, "enter the address"),
  designation: z.string().min(1, "enter the designation"),
});
type FormFields = z.infer<typeof schmea>;

export type Department = {
  department_id: number;
  department_name: string;
};

export type role = {
  role_id: number;
  role_name: string;
};

interface AddProjectProps {
  roleId?: number;
  initialName?: string;
  initialemail?: string;
  initialpassword?: string;
  initialphone_no?: string;
  initialdesignation?: string;
  DepartmentId?: string;

  designation?: string;
  //   onSuccess: () => void;
}

export default function AddUser({
  roleId,
  initialemail = "",
  initialName = "",
  initialpassword = "",
  initialphone_no = "",
  initialdesignation = "",
  DepartmentId,
}: AddProjectProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(bg);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<role[]>([]);
  const token = localStorage.getItem("token");
  const [selectedRole, setSelectedRole] = useState(roleId?.toString() || ""); // Manage selected value
  const [selectedDepartment, setSelectedDepartment] = useState(
    DepartmentId?.toString() || ""
  ); // Manage selected value

  //   fetch all departemnts
  const fetchDept = async () => {
    try {
      const response = await axios.get(`${baseUrl}/department/`);
      if (response.status === 200) {
        setDepartments(response.data);
      } else {
        setDepartments([]);
      }
    } catch (error) {
      console.error("Error submitting department data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    setValue("role_id", Number(value)); // Correct way to convert string to number
  };

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    setValue("department_id", Number(value)); // Correct way to convert string to number
  };

  const fetchrole = async () => {
    try {
      const response = await axios.get(`${baseUrl}/roles/`);
      if (response.status === 200) {
        setRoles(response.data);
      } else {
        setRoles([]);
      }
    } catch (error) {
      console.error("Error submitting department data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDept();
    fetchrole();
  }, []);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormFields>({
    resolver: zodResolver(schmea),
  });
  console.log(errors);

  //   file upload
  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_location", "client_profile");

    try {
      const response = await axios.post(`${baseUrl}/upload`, formData, {});

      // Validate the response structure to ensure URL exists
      if (response.data?.url) {
        const imageUrll = response.data.url;
        console.log("Uploaded Image URL:", imageUrll);
        setImageUrl(imageUrll); // Update the image URL state
        setValue("profile_picture", imageUrll); // Set image URL in form state
      } else {
        throw new Error("Invalid response format: Missing image URL.");
      }
    } catch (error) {
      console.error("Image upload failed:", error);

      // Optional: Display user-friendly error message
      alert("Failed to upload the image. Please try again.");
    }

    // on submit
  };
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const transformedData = {
      ...data,
    };
    console.log(transformedData);

    try {
      const response = await axios.post(
        `${baseUrl}/user/create`,
        transformedData,
        {
          headers: {
            Authorization: token, // Replace 'token' with your actual token variable
          },
        }
      );
      if (response.data.user_id) {
        navigate("/users");
      } else throw new Error("Try Again");
    } catch (error) {
      setError("root", {
        message: "Invalid credentials", // Use "root" for global errors
      });
    }
  };

  return (
    <>
      <div>
        <h2 className="text-lg font-semibold">Create User</h2>
        <hr className="border-gray-300 mb-2" />
        <form onSubmit={handleSubmit(onSubmit)} className="mb-4 pb-4">
          {/* image upload section  */}
          <div
            className=" h-[100px] w-[100px] rounded-full mt-4 mb-4 flex justify-center items-center relative"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {imageUrl && (
              <label
                htmlFor="file-upload"
                className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 text-white text-sm rounded-full cursor-pointer"
              >
                Add
              </label>
            )}
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0]; // Access the selected file
                if (file) {
                  handleImageUpload(file); // Pass the file to your upload handler
                }
              }}
              className="hidden"
            />
          </div>
          <div className="grid grid-cols-1 mb-6  mt-6 lg:grid-cols-2 gap-2">
            {/* name input  */}
            <div className="flex flex-col gap-1">
              <Label>Name</Label>
              <Input
                {...register("name")}
                type="text"
                placeholder="Enter first Name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* email input  */}
            <div className="flex flex-col  gap-1">
              <Label>Email</Label>
              <Input
                {...register("email")}
                type="text"
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* password */}
            <div className="flex flex-col  gap-1">
              <Label>Password</Label>
              <Input
                {...register("password")}
                type="text"
                placeholder="Enter Password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* designation input  */}
            <div className="flex flex-col gap-1">
              <Label>Designation</Label>
              <Input
                {...register("designation")}
                type="text"
                placeholder="Enter designation"
              />
              {errors.designation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.designation.message}
                </p>
              )}
            </div>

            {/* phone number */}
            <div className="flex flex-col  gap-1">
              <Label className="block text-sm font-medium text-gray-700">
                Phone number
              </Label>
              <Input
                {...register("phone_no")}
                type="text"
                inputMode="numeric"
                placeholder="Enter Phone Number"
              />
              {errors.phone_no && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone_no.message}
                </p>
              )}
            </div>

            {/* roles input  */}
            <div className="flex gap-1 flex-col">
              <Label>Select Role</Label>
              <Select onValueChange={handleRoleChange} value={selectedRole}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Roles</SelectLabel>
                    {roles.length > 0 ? (
                      roles.map((role, index) => (
                        <SelectItem key={index} value={role.role_id.toString()}>
                          {role.role_name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="no-area">
                        No Role Found
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* department input  */}
            {/* roles input  */}
            <div className="flex gap-1 flex-col">
              <Label>Select Department</Label>
              <Select
                onValueChange={handleDepartmentChange}
                value={selectedDepartment}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Roles</SelectLabel>
                    {departments.length > 0 ? (
                      departments.map((role, index) => (
                        <SelectItem
                          key={index}
                          value={role.department_id.toString()}
                        >
                          {role.department_name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="no-area">
                        No Department Found
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* addresss input  */}
            <div className="flex flex-col  gap-1">
              <Label>Address</Label>
              <Input
                {...register("address")}
                type="text"
                placeholder="Enter Address"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              disabled={isSubmitting}
              type="submit"
              className="px-4 py-2  text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none mb-4 focus:bg-indigo-700 text-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
