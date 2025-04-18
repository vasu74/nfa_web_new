import Dashboard from "@/components/common/Dashboard/Dashboard";
import SideBar from "@/components/common/Sidebar/Sidebar";
import Sidebar from "@/components/common/Sidebar/Sidebar";
import { useState } from "react";

export default function MainLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <>
      <div className="h-full w-full gap-4 p-4 flex text-stone-950 bg-stone-100 ">
        <SideBar />
        <div className="flex-1   h-[100vh] w-full overflow-hidden ">
          <Dashboard />
        </div>
      </div>
    </>
  );
}
