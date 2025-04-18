import {
  TableOfContents,
  TowerControl,
  Grid2x2Check,
  FolderKanban,
} from "lucide-react";
import { useState } from "react";
import Department from "./Department/Department";
import Area from "./Area/Area";
import Project from "./Project/Project";
import Tower from "./Tower/Tower";
import Role from "./Role/Role";

interface TabLink {
  id: string;
  label: string;
  number?: number;
  icon: React.ElementType;
  content: JSX.Element;
}

const navigationMenu: TabLink[] = [
  {
    id: "1",
    label: "Department",
    number: 24,
    icon: TableOfContents,
    content: <Department />,
  },
  {
    id: "2",
    label: "Area",
    number: 35,
    icon: Grid2x2Check,
    content: <Area />,
  },
  {
    id: "3",
    label: "Projects",
    number: 35,
    icon: FolderKanban,
    content: <Project />,
  },
  {
    id: "4",
    label: "Tower",
    number: 24,
    icon: TowerControl,
    content: <Tower />,
  },
  {
    id: "5",
    label: "Role",
    number: 266,
    icon: TowerControl,
    content: <Role />,
  },
];

export default function Setting() {
  const [activeTab, setActiveTab] = useState<string>("1");
  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold mb-6 text-[#2467FC]">
          NFA Dashboard
        </h2>
      </div>

      {/* Status Tabs */}
      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {navigationMenu.map((menu) => (
            <button
              key={menu.id}
              onClick={() => handleTabChange(menu.id)}
              className={`
                px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                ${
                  activeTab === menu.id
                    ? "bg-blue-400 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }
                whitespace-nowrap
              `}
            >
              {menu.name}
            </button>
          ))}
        </div>
      </div>

      <div>{navigationMenu.find((tab) => tab.id === activeTab)?.content}</div>
    </div>
  );
}
