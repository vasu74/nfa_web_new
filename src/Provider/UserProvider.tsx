import axios, { AxiosError } from "axios";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const baseUrl = import.meta.env.VITE_API_URL;
export type User = {
  name: string;
  email: string;
  id: number;
};

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

// Utility function to handle errors
const getErrorMessage = (error: AxiosError | unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return "Unauthorized. Please log in.";
    }
    if (error.response?.status === 403) {
      return "Access denied. Please contact your administrator.";
    }
    if (error.code === "ECONNABORTED") {
      return "Request timed out. Please try again later.";
    }
    return error.response?.data?.message || "Failed to fetch user data.";
  }
  return "An unexpected error occurred.";
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const source = axios.CancelToken.source();
        setLoading(true);
        const response = await axios.get<User>(`${baseUrl}/get_user`, {
          headers: { Authorization: token },
          timeout: 5000,
          cancelToken: source.token,
        });
        setUser(response.data);
        setError(null);
      } catch (error) {
        const message = getErrorMessage(error);
        setError(message);
        setUser(null);
        if (message.includes("Unauthorized")) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Cleanup: Cancel request on unmount
    return () => axios.CancelToken.source().cancel("Operation canceled.");
  }, [navigate]);

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
