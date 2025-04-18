import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const baseUrl = import.meta.env.VITE_API_URL;

const schema = z.object({
  email: z.string().email("Invalid Email Address"),
  password: z.string().min(8, "Password must be a least of 6 characters"),
});

interface LocationState {
  from?: {
    pathname: string;
  };
}

type FormFields = z.infer<typeof schema>;

export default function LoginForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingIp, setIsLoadingIp] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error("Failed to fetch IP address:", error);
        setError("root", {
          message: "Failed to initialize security check. Please try again.",
        });
      } finally {
        setIsLoadingIp(false);
      }
    };
    fetchIp();
  }, [setError]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (isLoadingIp) {
      setError("root", {
        message: "Security check in progress. Please wait.",
      });
      return;
    }

    const formattedData = {
      ...data,
      ip: ipAddress,
    };

    try {
      const response = await axios.post(`${baseUrl}/login`, formattedData);

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        const redirect =
          (location.state as LocationState)?.from?.pathname || "/";
        navigate(redirect);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("root", {
            message: "Invalid email or password",
          });
        } else if (error.response?.status === 429) {
          setError("root", {
            message: "Too many attempts. Please try again later.",
          });
        } else {
          setError("root", {
            message: "An error occurred. Please try again later.",
          });
        }
      } else {
        setError("root", {
          message: "Network error. Please check your connection.",
        });
      }
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <Input
              {...register("email")}
              type="text"
              placeholder="Email address"
              className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              style={{
                WebkitBoxShadow: "0 0 0px 1000px white inset",
                WebkitTextFillColor: "black",
              }}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1 animate-fade-in">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-blue-600" />
            </div>
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="new-password"
              className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              style={{
                WebkitBoxShadow: "0 0 0px 1000px white inset",
                WebkitTextFillColor: "black",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors duration-200"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1 animate-fade-in">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-700"
          >
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a
            href="#"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
          >
            Forgot your password?
          </a>
        </div>
      </div>

      <Button
        disabled={isSubmitting || isLoadingIp}
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      {errors.root && (
        <div className="rounded-md bg-red-50 p-4 animate-fade-in">
          <p className="text-red-500 text-sm text-center">
            {errors.root.message}
          </p>
        </div>
      )}
    </form>
  );
}
