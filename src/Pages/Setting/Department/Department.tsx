import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// api /department/
const baseUrl = import.meta.env.VITE_API_URL;

import AddDepartment from "./AddDepartment";
import { useEffect, useState } from "react";
import axios from "axios";

export type department = {
  department_id: number;
  department_name: string;
};

export default function Department() {
  const [open, setOpen] = useState(false);
  const [department, setDepartment] = useState<department[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDepartment = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/department/`);
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
        <h2 className="text-lg font-semibold">All Departments</h2>
        {/* add a dialog box to add more department  */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Department</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Department</DialogTitle>
              <DialogDescription>
                Add More Department For System
              </DialogDescription>
            </DialogHeader>
            <AddDepartment onSuccess={handleClose} />
          </DialogContent>
        </Dialog>
      </div>
      <div>
        {department.length > 0 ? (
          department.map((dep, index) => (
            <p key={index}>{dep.department_name}</p>
          ))
        ) : (
          <p>No departments found</p>
        )}
      </div>
    </div>
  );
}
