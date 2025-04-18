import axios from "axios";
import { useEffect, useState } from "react";

export type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  created_at: string;
  updated_at: string;
  first_access: string;
  last_access: string;
  profile_picture: string;
  address: string;
  phone_no: string;
  role_id: number;
  role_name: string;
  department_id: number;
  department_name: string;
};

const baseUrl = import.meta.env.VITE_API_URL;
export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
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
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-xl font-semibold text-gray-600">
          Loading details...
        </h2>
      </div>
    );
  }
  return (
    <>
      <h2 className="text-lg font-semibold">AllUsers</h2>
      <hr className="border-gray-300 mb-2" />
      <div>
        {users.map((user) => (
          <div key={user.id}>
            <h2>{user.name}</h2>
          </div>
        ))}
      </div>
    </>
  );
}
