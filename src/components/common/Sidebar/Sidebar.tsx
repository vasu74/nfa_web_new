import { UserContext } from "@/Provider/UserProvider";
import {
  ArrowUpFromLine,
  Signature,
  Settings,
  House,
  UsersRound,
  ScrollText,
  Loader2,
  Cuboid,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import logo from "@/assets/image_2025_02_18T15_14_58_472Z.png";

import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

interface NavItemType {
  name: string;
  icon: React.ComponentType<any>;
  to?: string;
  pages?: NavItemType[];
}

export interface ProjectView {
  project_id: number;
  description: string;
  name: string;
  priority: string;
  project_status: string;
  logo: string;
  start_date: string;
  end_date: string;
  budget: string;
  client_name: string;
  client_id: number;
  total_elements: number;
  completed_elements: number;
  progress: number;
}

export default function SideBar() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [submenuActive, setSubmenuActive] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const userContext = useContext(UserContext);
  const token = localStorage.getItem("token");
  const [projects, setProjects] = useState<ProjectView[]>([]);
  const navigate = useNavigate();

  const menuItem: NavItemType[] = [
    {
      name: "My NFA",
      icon: ScrollText,
      to: "/",
    },
    {
      name: "Raise NFA",
      icon: ArrowUpFromLine,
      to: "/raisenfa",
    },
    {
      name: "Approvals",
      icon: Signature,
      to: "/approvals",
    },
    {
      name: "Setting",
      icon: Settings,
      to: "/setting",
    },
    {
      name: "Users",
      icon: UsersRound,
      to: "/users",
    },
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const activeMenuIndex = menuItem.findIndex((menu) =>
      menu.pages?.some((page: NavItemType) => page.to === currentPath)
    );

    const activeSubMenu = menuItem[activeMenuIndex]?.pages?.find(
      (page: NavItemType) => page.to === currentPath
    );

    setActiveMenu(activeMenuIndex >= 0 ? activeMenuIndex : null);
    setSubmenuActive(activeSubMenu ? activeSubMenu.name : null);
  }, [location.pathname, menuItem]);

  const isActiveRoute = (item: NavItemType, pathname: string): boolean => {
    if (!item.to) return false;
    if (item.to === pathname) return true;
    if (item.pages) {
      return item.pages.some((page) => isActiveRoute(page, pathname));
    }
    return false;
  };

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (loading) {
    return (
      <div className="flex w-16 items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-20 rounded items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div
      className={`hidden md:flex flex-col h-screen transition-all ease-in-out duration-300 bg-white ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo Section */}
      <div className="h-16 px-4 mb-4 w-full ">
        <Link to="/" className="flex items-center h-full">
          {isCollapsed ? (
            <Cuboid className="w-6 h-6 text-blue-600" />
          ) : (
            <img
              src={logo}
              alt="Jaypee Infratech"
              className="w-full h-full object-cover flex items-center justify-center"
              style={{
                maxWidth: "180px",
                filter: "drop-shadow(0px 1px 1px rgba(0,0,0,0.1))",
              }}
            />
          )}
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="h-[calc(100vh-8rem)] overflow-y-auto py-2">
        <ul className="space-y-1 px-2">
          {menuItem.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item, location.pathname);

            return (
              <li key={item.name}>
                <NavLink
                  to={item.to || "#"}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-colors duration-200
                    ${isCollapsed ? "justify-center px-2" : ""}
                    ${
                      isActive
                        ? "bg-[#EEF2FF] text-[#3B82F6]"
                        : "text-gray-600 hover:bg-gray-50"
                    }
                  `}
                >
                  {Icon && (
                    <Icon
                      className={`${isCollapsed ? "w-5 h-5" : "w-5 h-5"}`}
                    />
                  )}
                  {!isCollapsed && <span>{item.name}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Button */}
      <div className="h-16 px-4 mt-auto">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            flex items-center justify-center gap-2 w-full py-2.5 rounded-lg 
            transition-colors duration-200
            ${isCollapsed ? "px-2" : ""}
            hover:bg-gray-50
            text-gray-600 hover:text-gray-900
          `}
        >
          {isCollapsed ? (
            <ArrowRight className="w-5 h-5" />
          ) : (
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Collapse</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

// Example of menuItemsByRole structure
