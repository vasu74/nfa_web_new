import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
const baseUrl = import.meta.env.VITE_BASE_URL;

export type Area = {
  area_name: string;
  area_id: number;
};

import { useEffect, useState } from "react";
import AddArea from "./AddArea";
import axios from "axios";

export default function Area() {
  const [open, setOpen] = useState(false);
  const [department, setDepartment] = useState<Area[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDepartment = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/area/`);
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
        <h2 className="text-lg font-semibold">All Area</h2>
        {/* add a dialog box to add more department  */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Area</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Area</DialogTitle>
              <DialogDescription>Add More Area For System</DialogDescription>
            </DialogHeader>
            <AddArea onSuccess={handleClose} />
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <div>
          {department.length > 0 ? (
            department.map((dep, index) => <p key={index}>{dep.area_name}</p>)
          ) : (
            <p>No Area found</p>
          )}
        </div>
      </div>
    </div>
  );
}
