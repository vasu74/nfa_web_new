// DnD Kit imports
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import axios from "axios";
import { GripVertical, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_URL;

export type Hierachy = {
  hierarchy_id: number;
  user_id: number;
  department_id: number;
  order_value: number;
};
interface Approver {
  id: number;
  name: string;
  department: string;
  email: string;
}

function ApproverCard({
  approver,
  onSelect,
}: {
  approver: Approver;
  onSelect: (approver: Approver) => void;
}) {
  return (
    <div
      className="cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => onSelect(approver)}
    >
      <h2>{approver.name}</h2>
      <div className="text-sm text-gray-500">{approver.department}</div>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <UserPlus className="h-4 w-4" />
      </Button>
    </div>
  );
}

// sortable item
function SortableApprover({
  approver,
  index,
  onRemove,
}: {
  approver: Approver;
  index: number;
  onRemove: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: approver.id,
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border rounded-md p-4 mb-2 flex items-center gap-3"
    >
      {/* Drag handle */}
      <div className="cursor-grab" {...attributes} {...listeners}>
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>

      {/* Approver label (Approver 1, 2, etc.) */}
      <Badge variant="outline" className="mr-2">
        Approver {index + 1}
      </Badge>

      <div className="flex-grow">
        <div className="font-medium">{approver.name}</div>
        <div className="text-sm text-gray-500">{approver.department}</div>
      </div>

      {/* Remove button */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
        onClick={() => onRemove(approver.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function DepartmentUser() {
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const { departmentId } = useParams<{ departmentId: string }>();
  const [selectedApprovers, setSelectedApprovers] = useState<Approver[]>([]);
  const [departmentApprover, setDepartmentApprover] = useState<Hierachy[]>([]);

  //   fetch hierachy
  const fetchHierachy = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/hierarchies/${departmentId}`
      );
      if (response.status === 200) {
        setDepartmentApprover(response.data);
      } else {
        setDepartmentApprover([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  console.log("departmentApprover", departmentApprover);

  const fetchApprover = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/user/advisor`);
      if (response.status === 200) {
        setApprovers(response.data);
      } else {
        setApprovers([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchApprover();
      await fetchHierachy();
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (departmentId && departmentApprover.length > 0 && approvers.length > 0) {
      console.log("Fetching department-specific approvers");

      const approverIds = departmentApprover
        .filter((entry) => entry.department_id === Number(departmentId))
        .map((entry) => entry.user_id);

      console.log("Approvers IDs:", approverIds);

      const departmentSpecificApprovers = approverIds
        .map((id) => approvers.find((a) => a.id === id))
        .filter(Boolean) as Approver[]; // Ensures valid type

      console.log("Filtered Approvers in Order:", departmentSpecificApprovers);

      setSelectedApprovers(departmentSpecificApprovers);
    }
  }, [departmentId, approvers, departmentApprover]);

  useEffect(() => {
    console.log("Updated Selected Approvers:", selectedApprovers);
  }, [selectedApprovers]);

  const availableApprovers = approvers.filter(
    (approver) =>
      !selectedApprovers.some((selected) => selected.id === approver.id)
  );

  // Add an approver to the selected list
  const handleSelectApprover = (approver: Approver) => {
    if (!selectedApprovers.find((a) => a.id === approver.id)) {
      setSelectedApprovers((prev) => [...prev, approver]);
    }
  };

  // Remove an approver
  const handleRemoveApprover = (id: number) => {
    setSelectedApprovers((prev) => prev.filter((a) => a.id !== id));
  };

  // Drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Reorder selected approvers on drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSelectedApprovers((items) => {
      const oldIndex = items.findIndex((a) => a.id === active.id);
      const newIndex = items.findIndex((a) => a.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const handleSubmit = async () => {
    // Hardcode or parse departmentId as needed
    const numericDepartmentId = departmentId ? parseInt(departmentId, 10) : 23;

    const data = {
      department_id: numericDepartmentId, // Single department_id
      users: selectedApprovers.map((approver) => ({
        user_id: approver.id, // Mapping approvers to user_id objects
      })),
    };

    try {
      console.log(data);
      const response = await axios.post(`${baseUrl}/hierarchies/crreate`, data);
      if (response.status === 200 || response.status === 201) {
        alert("created");
        navigate("/users");
      } else {
        alert("not created");
        navigate("/users");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-4 space-y-8">
        <h1 className="text-2xl font-bold">
          Approvals for Department:{" "}
          <span className="text-blue-600">{departmentId}</span>
        </h1>

        {/* SELECTED APPROVERS */}
        <div className="border rounded-md p-4 bg-gray-50 min-h-[200px]">
          <h2 className="text-xl font-semibold mb-4">Selected Approvers</h2>
          {selectedApprovers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No approvers selected. Drag approvers here or select from
              available approvers below.
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={selectedApprovers.map((a) => a.id)}
                strategy={verticalListSortingStrategy}
              >
                {selectedApprovers.map((approver, index) => (
                  <SortableApprover
                    key={approver.id}
                    approver={approver}
                    index={index}
                    onRemove={handleRemoveApprover}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* AVAILABLE APPROVERS */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Approvers</h2>
          {availableApprovers.length === 0 ? (
            <div className="col-span-2 text-center py-4 text-gray-500 border rounded-md">
              All approvers have been selected
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {availableApprovers.map((approver) => (
                <ApproverCard
                  key={approver.id}
                  approver={approver}
                  onSelect={handleSelectApprover}
                />
              ))}
            </div>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end">
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </>
  );
}
