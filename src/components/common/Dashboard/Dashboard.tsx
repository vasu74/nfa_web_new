import { Outlet } from "react-router-dom";
import TopNavbar from "../Navbar/TopNavbar";
import { cn } from "@/lib/utils";

interface DashboardProps {
  className?: string;
}

export default function Dashboard({ className }: DashboardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg flex flex-col h-full overflow-hidden shadow-sm",
        className
      )}
    >
      <header className="sticky top-0 z-10 h-16 border-b border-slate-200 bg-white">
        <TopNavbar />
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
