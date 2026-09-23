import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  House,
  User,
  Settings,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  ChevronLeft,
  Bell,
} from "lucide-react";

import { useUserOptions } from "../../../context/UserOptionsContext";
import { logOut } from "../../../store/reducers/auth/authSlice";
import notify from "../../../hooks/Notifications";
import NotificationCard from "../../user/ui/NotificationCard";
import { fetchNotifications } from "../../../store/reducers/notificationSlice";
// import { logout } from "../../../store/reducers/auth/authSlice";

export default function AdminTopbar() {
  const { isSidebarOpen, setMode } = useUserOptions();

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const notifications = useSelector(
    (state) => state.notification.notifications,
  );

  const isLoggedIn = Boolean(token);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [profileOpen, setProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const haveAlert = notifications.length > 0;

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const goToProfile = () => {
    setProfileOpen(false);
    navigate("/profile");
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

  return (
    <nav
      className={`
        fixed
        top-0
        end-0
        z-50
        bg-gradient-to-r from-[#ffafcc] via-[#ff8fa3] to-[#4c956c]
        ${isSidebarOpen ? "w-[85rem]" : "w-full"}
        border-b border-[#e5e7eb]
      `}
    >
      {/* <nav
      className={`
        fixed
        top-0
        end-0
        z-50
        bg-gradient-to-r from-[#ffafcc] via-[#ff8fa3] to-[#4c956c]
        ${
          token ? isSidebarOpen
            ? "w-[85rem]"
            : "w-[95rem]"  : "w-full"
           
        }
        shadow-[0_5px_25px_-15px_rgba(57,122,85,0.25)]
      `}
    > */}
      <div
        className="
          max-w-screen-xl
          
          flex
          items-center
          justify-between
          p-4
          mr-4
          lg:mr-20
        "
      >
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="
            group
            flex
            items-center
            gap-3
            w-fit
            select-none
          "
        >
          <div
            className="
              relative
              flex
              items-center
              justify-center
              w-11
              h-11
              rounded-[14px]
              bg-gradient-to-br
              from-[#4c956c]
              to-[#397a55]
              shadow-[0_8px_20px_-8px_rgba(57,122,85,0.65)]
              transition-all
              duration-300
              group-hover:scale-105
              group-hover:-rotate-2
              group-hover:shadow-[0_12px_25px_-8px_rgba(57,122,85,0.75)]
            "
          >
            <span
              className="
                absolute
                inset-0
                rounded-[14px]
                bg-white/10
                opacity-0
                transition-opacity
                duration-300
                group-hover:opacity-100
              "
            />

            <House
              size={21}
              strokeWidth={2.2}
              className="
                relative
                z-10
                text-white
                transition-transform
                duration-300
                group-hover:scale-110
              "
            />
          </div>

          {/* Brand */}
          <span
            className="
              font-['Cairo']
              text-[18px]
              font-extrabold
              tracking-tight
              text-[#244238]
              transition-colors
              duration-300
              group-hover:text-[#397a55]
            "
          >
            دليل المنشآت
          </span>
        </button>

        <div className="flex items-center gap-x-2 sm:gap-x-5">
          <div className="relative">
            <button
              className="bg-red-100 rounded-full p-3 transition-all hover:bg-red-200 relative"
              onClick={() => setIsNotificationOpen((prev) => !prev)}
            >
              <Bell className="text-[#34744f]" size={22} />
              {haveAlert && (
                <span className="absolute bottom-3 w-2 h-2 bg-red-500 rounded-full left-1/4"></span>
              )}
            </button>

            {isNotificationOpen && (
              <div
                ref={notificationRef}
                dir="rtl"
                className="
        absolute top-full -left-40 sm:left-0 mt-3
        w-[300px] sm:w-[390px]
        overflow-hidden
        rounded-2xl
        border border-gray-100
        bg-white
        shadow-[0_18px_50px_-12px_rgba(0,0,0,0.20)]
        z-50
      "
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e9f5ee]">
                      <Bell size={18} className="text-[#34744f]" />
                    </div>

                    <div>
                      <h3 className="font-['Tajawal'] text-sm font-extrabold text-[#0B2D48]">
                        الإشعارات
                      </h3>

                      <p className="mt-0.5 text-[11px] font-medium text-gray-400">
                        لديك {notifications.length} إشعار
                      </p>
                    </div>
                  </div>

                  {haveAlert && (
                    <span className="flex min-w-[25px] h-6 items-center justify-center rounded-full bg-red-500 px-2 text-[11px] font-bold text-white">
                      {notifications.length}
                    </span>
                  )}
                </div>

                {/* Notifications list */}
                <div className="max-h-[430px] overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-gray-200">
                  {notifications?.length > 0 ? (
                    <div className="space-y-2">
                      {notifications.slice(0, 2).map((notific, index) => (
                        <NotificationCard
                          key={notific.id || index}
                          notification={notific}
                          setIsNotificationOpen={setIsNotificationOpen}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
                        <Bell size={24} className="text-gray-300" />
                      </div>

                      <h4 className="mt-4 text-sm font-bold text-gray-600">
                        لا توجد إشعارات
                      </h4>

                      <p className="mt-1 text-xs text-gray-400">
                        ستظهر الإشعارات الجديدة هنا
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications?.length > 0 && (
                  <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-3 text-center">
                    <button
                      onClick={() => {
                        navigate("/admin/notifications-page");
                        setIsNotificationOpen(false);
                      }}
                      className="
              text-xs
              font-bold
              text-[#34744f]
              transition-colors
              hover:text-[#285c3d]
            "
                    >
                      عرض كل الإشعارات
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            //onClick={goToProfile}
            title="عرض الملف الشخصي"
            className={`
            group w-[10rem] sm:w-[13rem] flex items-center 
            rounded-2xl border border-white/20 bg-white/50
            backdrop-blur-sm transition-all duration-300
            hover:bg-white/20 hover:border-white/35
            hover:shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)]
            active:scale-[0.98]
             gap-3 px-3 py-2.5 justify-end
             
             " 
          `}
          >
            <div className={`flex items-center gap-3 `}>
              <div
                className="
              hidden
                relative sm:flex h-10 w-10 shrink-0 items-center justify-center
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

              <div className="flex flex-col items-start text-right overflow-hidden">
                <span className="font-['Tajawal'] text-[13px] font-bold text-[#244238] truncate max-w-[110px]">
                  {user?.name || "المستخدم"}
                </span>
                <span className="font-['Tajawal'] text-[10.5px] font-medium text-[#244238] truncate max-w-[110px]">
                  عرض الملف الشخصي
                </span>
              </div>
            </div>

            <ChevronLeft
              size={16}
              className="
                shrink-0 text-[#244238] transition-all duration-300
                group-hover:text-white group-hover:-translate-x-0.5
              "
            />
          </button>
        </div>
      </div>
    </nav>
  );
}
