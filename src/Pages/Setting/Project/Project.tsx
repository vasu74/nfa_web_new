import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useEffect, useState } from "react";
import AddProject from "./AddProject";
import axios from "axios";

export type Project = {
  project_name: string;
  project_id: number;
};

const baseUrl = import.meta.env.VITE_API_URL;

export default function Project() {
  const [open, setOpen] = useState(false);
  const [department, setDepartment] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDepartment = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/project/`);
      if (response.status == 200) {
        if (Array.isArray(response.data)) {
          setDepartment(response.data);
        } else {
          setDepartment([]);
        }
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
        <h2 className="text-lg font-semibold">All Projects</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          {/* add a dialog box to add more department  */}
          <DialogTrigger asChild>
            <Button variant="outline">Add Project</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Project</DialogTitle>
              <DialogDescription>Add More Project For System</DialogDescription>
            </DialogHeader>
            <AddProject onSuccess={handleClose} />
          </DialogContent>
        </Dialog>
      </div>
      <div>
        {department.length > 0 ? (
          department.map((dep, index) => <p key={index}>{dep.project_name}</p>)
        ) : (
          <p>No Project found</p>
        )}
      </div>
    </div>
  );
}
