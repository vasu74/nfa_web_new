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
export type Tower = {
  tower_id: number;
  tower_name: string;
};
import { useEffect, useState } from "react";
import AddTower from "./AddTower";
import axios from "axios";

export default function Tower() {
  const [open, setOpen] = useState(false);
  const [department, setDepartment] = useState<Tower[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDepartment = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/tower/`);
      if (response.status == 200) {
        setDepartment(response.data);
      } else {
        setDepartment([]);
      }
    } catch (error) {
      console.error("Error submitting tower data:", error);
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
        <h2 className="text-lg font-semibold">All Towers</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          {/* add a dialog box to add more department  */}
          <DialogTrigger asChild>
            <Button variant="outline">Add Tower</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Tower</DialogTitle>
              <DialogDescription>Add More Tower For System</DialogDescription>
            </DialogHeader>
            <AddTower onSuccess={handleClose} />
          </DialogContent>
        </Dialog>
      </div>
      <div>
        {department.length > 0 ? (
          department.map((dep, index) => <p key={index}>{dep.tower_name}</p>)
        ) : (
          <p>No Tower found</p>
        )}
      </div>
      s
    </div>
  );
}
