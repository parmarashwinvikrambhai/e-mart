import type { ReactNode } from "react";
import { Outlet, NavLink } from "react-router-dom";
import  admin1  from "../assets/admin_logo.png";
import { CalendarArrowDown, PackagePlus, ScrollText } from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/apiClient";
import toast from "react-hot-toast";



interface Props {
  children?: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      dispatch(logoutUser());
      toast.success("Logout successfully", {
        style: {
          borderRadius: "8px",
          background: "#1e40af",
          color: "#fff",
          fontWeight: 600,
          padding: "12px 16px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#1e40af",
        },
      });
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-5 flex flex-col gap-2">
        <div className="ml-4">
          <img src={admin1} alt="Logo" className="w-36" />
        </div>

        <NavLink
          to="add-item"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded hover:bg-gray-100 text-gray-700 ${
              isActive ? "bg-gray-200 font-semibold" : ""
            }`
          }
        >
          <span>
            <PackagePlus size={21} className="text-gray-700" />
          </span>{" "}
          Add Items
        </NavLink>

        <NavLink
          to="item-list"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded hover:bg-gray-100 text-gray-700 ${
              isActive ? "bg-gray-200 font-semibold" : ""
            }`
          }
        >
          <span>
            <ScrollText size={21} className="text-gray-700" />
          </span>{" "}
          List Items
        </NavLink>

        <NavLink
          to="orders"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded hover:bg-gray-100 text-gray-700 ${
              isActive ? "bg-gray-200 font-semibold" : ""
            }`
          }
        >
          <span>
            <CalendarArrowDown size={21} className="text-gray-700" />
          </span>{" "}
          Orders
        </NavLink>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-end items-center p-4 bg-white border-b border-gray-200">
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
          {children}
        </main>
      </div>
    </div>
  );
}
