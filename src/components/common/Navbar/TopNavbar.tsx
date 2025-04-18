import { UserContext } from "@/Provider/UserProvider";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  BellRing,
  ClipboardCheck,
  LogOut,
  Menu,
  User,
} from "lucide-react";
import bg from "@/assets/defaultimage.jpg";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePicture = ({ user }: { user: any }) => (
  <div className="flex gap-2 items-center bg-gray-200 rounded-full py-1 px-5">
    <div className="text-start">
      <span className="text-sm font-semibold text-stone-800 block">
        {user?.name}
      </span>
      <span className="text-xs block text-stone-500  capitalize">
        {user?.role_name}
      </span>
    </div>
    <div className="rounded-full w-10 h-10 hover:opacity-90 transition">
      <img
        src={user?.profile_picture || bg}
        alt="User profile"
        className="w-full h-full rounded-full object-cover focus:outline-none"
      />
    </div>
  </div>
);

const NavbarProfile = ({
  user,
  onLogout,
  onNavigate,
}: {
  user: any;
  onLogout: () => void;
  onNavigate: (route: string) => void;
}) => (
  <div className="flex gap-4 items-center justify-center ml-auto">
    <Bell />
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <ProfilePicture user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white min-w-40 max-w-60 shadow-lg rounded-lg mr-2 border-gray-200 px-2 py-2">
        <DropdownMenuItem
          onClick={() => onNavigate("user")}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-black focus:outline-none cursor-pointer"
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-black cursor-pointer">
          <ClipboardCheck className="w-5 h-5" />
          <span>Tasks</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onNavigate("notification")}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-black cursor-pointer"
        >
          <BellRing className="w-5 h-5" />
          <span>Notifications</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 hover:bg-red-600 hover:text-white cursor-pointer text-red-600 rounded-b-md"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

export default function TopNavbar() {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  const handleNavigate = (route: string) => {
    navigate(route);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!userContext) {
    throw new Error("HorizontalNavbar must be used within a UserProvider");
  }

  const { user } = userContext;
  return (
    <>
      <div className="h-full w-full flex justify-end items-center">
        <div>
          <NavbarProfile
            user={user}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        </div>
      </div>
    </>
  );
}
