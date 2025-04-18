import { Plus } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { UsersTable } from "./TenantsTable";

export interface User {
  id: number;
  employee_id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  first_access: string; // ISO date string
  last_access: string; // ISO date string
  profile_picture: string;
  is_admin: boolean;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  phone_no: string;
  role_id: number;
  role_name: string;
}

export interface Client {
  client_id: number;
  user_id: number;
  organization: string;
  user: User;
}

export default function Tenants() {
  const navigate = useNavigate();
  // const onHandleProject = () => {
  //   navigate(`/createtenant`);
  // };

  return (
    <>
      <div className="flex items-center gap-1 flex-col w-full">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-2xl font-semibold mb-6 text-[#2467FC]">Users</h2>
          <button
            onClick={() => navigate(`/addUser`)}
            className="flex gap-1 items-center justify-center bg-violet-500 px-2 py-1 rounded-md text-white font-semibold hover:bg-violet-700 transition"
          >
            <Plus className="w-4 h-4" />
            Create User
          </button>
        </div>

        <div className="w-full h-full">
          <div className=" w-full h-full overflow-x-auto">
            <UsersTable />
          </div>
        </div>
      </div>
    </>
  );
}
