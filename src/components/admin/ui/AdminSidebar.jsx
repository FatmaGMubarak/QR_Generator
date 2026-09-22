import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Shield,
  ContactRound,
  Group,
  LockKeyhole,
  User,
  ChevronLeft,
  Receipt,
  Menu,
} from "lucide-react";


import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { logOut } from "../../../store/reducers/auth/authSlice";
import useUserInformationLogic from "../../../hooks/useUserInformationLogic";
import { useUserOptions } from "../../../context/UserOptionsContext";
import notify from "../../../hooks/Notifications";

const links = [
  { to: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, end: true },
  {
    to: "/admin/create-profile",
    label: "إنشاء ملف شخصى",
    icon: ContactRound,
    end: true,
  },
  {
    to: "/admin/create-category",
    label: "إنشاء منشأة",
    icon: Group,
    end: true,
  },
  {
    to: "/admin/subscriptions",
    label: "الاشتراكات",
    icon: Receipt,
    end: true,
  },
  {
    to: "/admin/change-password",
    label: "إعدادات كلمة السر",
    icon: LockKeyhole,
    end: true,
  },
  //{ to: "/admin/users", label: "المستخدمون", icon: Users },
  //{ to: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export default function AdminSidebar() {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isSidebarOpen, setIsSidebarOpen } = useUserOptions();

  const ssUser = JSON.parse(sessionStorage.getItem("user"));

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const token = useSelector((state) => state?.auth?.token);

  const storedUser = useSelector((state) => state?.auth?.user);

  const user = ssUser ?? storedUser;

  const goToProfile = () => {
    navigate("/admin/profile");
  };

  const handleLogout = async () => {
    try {
      if (!token) return;
      const response = await dispatch(logOut()).unwrap();
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      notify(response.message, "success");
      navigate("/login");
    } catch (error) {
      notify(error.message, "error");
    }
  };

  if (!token) return;

  return (
   <>
    <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="فتح القائمة"
        className="lg:hidden fixed top-4 right-0 z-[60] w-10 h-10 rounded-full bg-[#ff8fa3] text-white flex items-center justify-center shadow-lg"
      >
        <Menu size={20} strokeWidth={2} />
      </button>
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
        />
      
      )}
    <aside
      className={`
        fixed z-50 top-0 right-0 h-screen w-64 flex flex-col justify-between p-4
        bg-[#4c956c] backdrop-blur-md border-l border-white/30 shadow-xl
        transition-all duration-500 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
        lg:translate-x-0
        ${isSidebarOpen ? "lg:w-60" : "lg:w-20"}
      `}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@700;800&family=Tajawal:wght@400;500;700&display=swap');`}</style>
       
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`${isSidebarOpen ? 'flex' : 'hidden'} sm:flex absolute left-0 -translate-x-1/2 translate-y-1/3 w-10 h-10 rounded-full bg-white flex justify-center items-center z-50`}
      >
        <MdKeyboardDoubleArrowRight
          className={`text-[#4c956c] text-3xl ${isSidebarOpen ? "transition-all ease-in-out duration-500" : "-rotate-180 transition-all ease-in-out duration-500"}`}
        />
      </button>

      <div>
        {/* brand mark */}
        {/* <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl border-[1.5px] border-white/85 bg-white/15 font-['Cairo'] font-extrabold text-lg text-white">
            <Shield className="text-xs" />
          </div>
          {isSidebarOpen && (
            <span className="font-['Cairo'] font-extrabold text-white text-base">
              لوحة الإدارة
            </span>
          )}
        </div> */}

        {/* profile card */}
        <button
          type="button"
          onClick={goToProfile}
          title="عرض الملف الشخصي"
          className={`
            group w-full flex items-center mb-6
            rounded-2xl border border-white/20 bg-white/10
            backdrop-blur-sm transition-all duration-300
            hover:bg-white/20 hover:border-white/35
            hover:shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)]
            active:scale-[0.98]
            ${isSidebarOpen ? "gap-3 px-3 py-2.5 justify-between" : "justify-center py-2.5"}
          `}
        >
          <div className={`flex items-center ${isSidebarOpen ? "gap-3" : ""}`}>
            <div
              className="
                relative flex h-10 w-10 shrink-0 items-center justify-center
                overflow-hidden rounded-xl
                bg-gradient-to-br from-white/90 to-white/60
                text-[#397a55] ring-2 ring-white/40
                transition-all duration-300
                group-hover:ring-white/70 group-hover:scale-105
              "
            >
              {user?.avatar || user?.image ? (
                <img
                  src={user.avatar || user.image}
                  alt="صورة المستخدم"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={19} strokeWidth={2.2} />
              )}
              <span
                className="
                  absolute bottom-0 left-0 h-2.5 w-2.5 rounded-full
                  border-2 border-[#4c956c] bg-[#8bd4a8]
                "
              />
            </div>

            {isSidebarOpen && (
              <div className="flex flex-col items-start text-right overflow-hidden">
                <span className="font-['Tajawal'] text-[13px] font-bold text-white truncate max-w-[110px]">
                  {user?.name || "المستخدم"}
                </span>
                <span className="font-['Tajawal'] text-[10.5px] font-medium text-white/70 truncate max-w-[110px]">
                  عرض الملف الشخصي
                </span>
              </div>
            )}
          </div>

          {isSidebarOpen && (
            <ChevronLeft
              size={16}
              className="
                shrink-0 text-white/60 transition-all duration-300
                group-hover:text-white group-hover:-translate-x-0.5
              "
            />
          )}
        </button>

        {/* nav links */}
        <nav className="flex flex-col gap-1.5 font-['Tajawal']">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white/25 text-white font-bold shadow-[0_4px_10px_-2px_rgba(0,0,0,0.15)]"
                    : "text-white/85 hover:bg-white/15 hover:text-white"
                }`
              }
            >
              <Icon size={18} strokeWidth={1.9} />
              {isSidebarOpen && label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* logout */}
      <div className="w-full flex justify-center items-center">
        <button
          type="button"
          onClick={handleLogout}
          className=" flex items-center gap-2 px-7 py-2.5 border border-white/85 shadow-lg rounded-xl text-sm font-medium font-['Tajawal'] text-white/85 hover:bg-white/15 hover:text-white transition-all"
        >
          <LogOut size={18} strokeWidth={1.9} />
          {isSidebarOpen && " تسجيل الخروج"}
        </button>
      </div>
    </aside>
   </>
  );
}