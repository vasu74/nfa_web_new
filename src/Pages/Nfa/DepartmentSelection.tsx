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

import { GripVertical, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";

const baseUrl = import.meta.env.VITE_API_URL;

interface Approver {
  id: number;
  name: string;
  department: string;
  email: string;
}

export type User = {
  name: string;
  email: string;
  id: number;
  department?: string;
};

interface AddNfaProps {
  allApprovers: User[];
  onSuccess: (data: any) => void; // Accepts an array of objects
  selectApprover: Hierachy[];
}

export type Hierachy = {
  hierarchy_id: number;
  user_id: number;
  department_id: number;
  order_value: number;
};

function ApproverCard({
  approver,
  onSelect,
}: {
  approver: User;
  onSelect: (approver: User) => void;
}) {
  return (
    <div
      className="cursor-pointer p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md"
      onClick={() => onSelect(approver)}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-medium text-gray-900">{approver.name}</h2>
          <div className="text-sm text-gray-500">{approver.department}</div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-100"
        >
          <UserPlus className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );
}

// sortable item
function SortableApprover({
  approver,
  index,
  onRemove,
}: {
  approver: User;
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
      className="bg-white border rounded-lg p-4 mb-3 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div
        className="cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>

      <Badge variant="outline" className="bg-gray-50">
        Approver {index + 1}
      </Badge>

      <div className="flex-grow">
        <div className="font-medium text-gray-900">{approver.name}</div>
        <div className="text-sm text-gray-500">{approver.department}</div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
        onClick={() => onRemove(approver.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function DepartmentSelection({
  allApprovers,
  selectApprover,
  onSuccess,
}: AddNfaProps) {
  const [approvers, setApprovers] = useState<User[]>(allApprovers);
  const [selectedApprovers, setSelectedApprovers] = useState<User[]>([]);
  const [departmentApprover, setDepartmentApprover] =
    useState<Hierachy[]>(selectApprover);

  useEffect(() => {
    console.log("Fetching department-specific approvers");

    const approverIds = departmentApprover.map((entry) => entry.user_id);

    console.log("Approvers IDs:", approverIds);

    const departmentSpecificApprovers = approverIds
      .map((id) => approvers.find((a) => a.id === id))
      .filter(Boolean) as Approver[]; // Ensures valid type

    console.log("Filtered Approvers in Order:", departmentSpecificApprovers);

    setSelectedApprovers(departmentSpecificApprovers);
  }, [allApprovers, departmentApprover]);

  //   send the data to parents
  useEffect(() => {
    console.log("Updated Selected Approvers:", selectedApprovers);

    const data = selectedApprovers.map((approver, index) => ({
      approver_id: approver.id,
      order_value: index + 1, // Mapping approvers to approver_id
    }));

    onSuccess(data); // Call onSuccess with the prepared data
  }, [selectedApprovers, onSuccess]); // Ensure onSuccess is included in the dependency array

  const availableApprovers = approvers.filter(
    (approver) =>
      !selectedApprovers.some((selected) => selected.id === approver.id)
  );

  const handleSelectApprover = (approver: User) => {
    if (!selectedApprovers.find((a) => a.id === approver.id)) {
      setSelectedApprovers((prev) => [...prev, approver]);
    }
  };

  // Remove an approver
  const handleRemoveApprover = (id: number) => {
    setSelectedApprovers((prev) => prev.filter((a) => a.id !== id));
  };

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

  return (
    <div className="space-y-6">
      {/* SELECTED APPROVERS */}
      <div className="border rounded-lg p-6 bg-gray-50 min-h-[200px] shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Selected Approvers
        </h2>
        {selectedApprovers.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <p className="mb-2">No approvers selected</p>
            <p className="text-sm">
              Drag approvers here or select from available approvers below
            </p>
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
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Available Approvers
        </h2>
        {availableApprovers.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-white rounded-lg border-2 border-dashed border-gray-300">
            All approvers have been selected
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </div>
  );
}
