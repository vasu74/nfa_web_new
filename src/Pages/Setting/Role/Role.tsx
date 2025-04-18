import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
const baseUrl = import.meta.env.VITE_API_URL;
// api /Role/
export type Role = {
  role_id: number;
  role_name: string;
};

import { useEffect, useState } from "react";
import AddRole from "./AddRole";
import axios from "axios";

export default function Role() {
  const [open, setOpen] = useState(false);
  const [department, setDepartment] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDepartment = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/roles/`);
      if (response.status == 200) {
        setDepartment(response.data);
      } else {
        setDepartment([]);
      }
    } catch (error) {
      console.error("Error submitting department data:", error);
      // alert("An error occurred while submitting the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">All Role</h2>
        {/* add a dialog box to add more Role  */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Role</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Role</DialogTitle>
              <DialogDescription>Add More Role For System</DialogDescription>
            </DialogHeader>
            <AddRole onSuccess={handleClose} />
          </DialogContent>
        </Dialog>
      </div>
      <div>
        {department.length > 0 ? (
          department.map((dep, index) => <p key={index}>{dep.role_name}</p>)
        ) : (
          <p>No role found</p>
        )}
      </div>
    </div>
  );
}
