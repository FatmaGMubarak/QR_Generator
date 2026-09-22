import React from "react";
import { useNavigate } from "react-router-dom";
import { House } from "lucide-react";

import { useUserOptions } from "../../../context/UserOptionsContext";

export default function Topbar() {
  const { setMode } = useUserOptions();

  const navigate = useNavigate();

  return (
    <nav
      className={`
        fixed
        top-0
        end-0
        z-50
        bg-gradient-to-r from-[#ffafcc] via-[#ff8fa3] to-[#4c956c]
        w-full
        border-b border-[#e5e7eb]
      `}
    >
      <div
        className="
          max-w-screen-xl
          mx-auto
          flex
          items-center
          justify-between
          p-4
          lg:mr-20
        "
      >
        <button
          type="button"
          onClick={() => navigate("/")}
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
                navigate("/login");
                setMode("login")
            }}
            className="
              rounded-xl
              border
              border-[#cfe1d6]
              bg-white
              px-4
              py-2
              font-['Tajawal']
              text-[12px]
              font-bold
              text-[#397a55]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#f2f8f4]
              hover:border-[#a9cdb6]
              hover:shadow-[0_8px_18px_-10px_rgba(57,122,85,0.5)]
              active:scale-95
            "
          >
            تسجيل الدخول
          </button>

          {/* Create page */}
          <button
            type="button"
            onClick={() => {
              navigate("/login");
              setMode("signup");
            }}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-[#4c956c]
              to-[#397a55]
              px-4
              py-2
              font-['Tajawal']
              text-[12px]
              font-bold
              text-white
              shadow-[0_8px_18px_-8px_rgba(57,122,85,0.6)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-[0_12px_22px_-8px_rgba(57,122,85,0.7)]
              active:scale-95
            "
          >
            انشاء صفحة
          </button>
        </div>
      </div>
    </nav>
  );
}