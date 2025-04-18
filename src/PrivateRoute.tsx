import axios from "axios";
import { Loader2 } from "lucide-react";

import { PropsWithChildren, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_URL;
export default function PrivateRoute({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();
  const [userRole, setUserRole] = useState<string | null>(null);

  const validateToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const data = { SessionData: token };
    try {
      const response = await axios.post(`${baseUrl}/validate-session`, data, {
        headers: {
          Authorization: token,
        },
      });
      if (response.data.message) {
        setUserRole(response.data.role_name);
        setIsLoading(false);
      } else {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    validateToken();

    const intervalId = setInterval(validateToken, 10000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (
      !isLoading &&
      location.pathname === "/tenant" &&
      userRole !== "superadmin"
    ) {
      navigate("/", { replace: true });
    }
  }, [isLoading, location.pathname, userRole, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen ">
        <Loader2 className=" w-8 h-8 animate-spin" />
      </div>
    );
  }
  return <>{children}</>;
}
