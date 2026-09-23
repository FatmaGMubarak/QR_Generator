import React, { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

import logo from "../../assets/facebookLogo.png";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/reducers/categorySlice";

export default function ProfileCard({logoImg, name, activity,slug, isAdmin}) {
  const categories = useSelector((state)=>state?.category?.categories);
  const dispatch = useDispatch();
  const location = useLocation();
  const isUser = location.pathname.includes("/user");
  const general = !location.pathname.includes("/admin") && !location.pathname.includes("/user");
  const profileActivity = categories?.find((cat)=>cat?.id === activity);
  useEffect(()=>{
    dispatch(fetchCategories());
  }, [dispatch])
  return (
    <div
      dir="rtl"
      className="
        group
        relative
        w-full
        lg:w-[30%]
        min-w-[220px]
        overflow-hidden
        rounded-[24px]
        border border-[#e3eee7]
        bg-white
        p-3
        shadow-[0_8px_30px_-12px_rgba(45,85,67,0.18)]
        transition-all
        duration-500
        ease-out
        hover:-translate-y-2
        hover:border-[#b9d8c5]
        hover:shadow-[0_22px_45px_-15px_rgba(57,122,85,0.30)]
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -top-16
          -right-16
          h-40
          w-40
          rounded-full
          bg-[#e5f2e9]
          opacity-0
          blur-2xl
          transition-all
          duration-500
          group-hover:opacity-100
          group-hover:scale-150
        "
      />

      {/* Small decorative circle */}
      <div
        className="
          pointer-events-none
          absolute
          -bottom-8
          -left-8
          h-20
          w-20
          rounded-full
          bg-[#f8e8eb]
          opacity-0
          blur-xl
          transition-all
          duration-700
          group-hover:opacity-70
        "
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Logo */}
        <div className="flex justify-center pt-3">
          <div
            className="
              relative
              flex
              h-[76px]
              w-[76px]
              items-center
              justify-center
              rounded-[22px]
              bg-[#f2f8f4]
              border border-[#e1eee6]
              shadow-sm
              transition-all
              duration-500
              ease-out
              group-hover:scale-110
              group-hover:-rotate-2
              group-hover:bg-white
              group-hover:border-[#c9e1d1]
              group-hover:shadow-[0_12px_25px_-10px_rgba(57,122,85,0.35)]
            "
          >
            {/* Logo glow */}
            <div
              className="
                absolute
                inset-2
                rounded-[18px]
                bg-[#4c956c]/10
                opacity-0
                blur-md
                transition-opacity
                duration-500
                group-hover:opacity-100
              "
            />

            <img
              src={logoImg}
              alt={name}
              className="
                relative
                z-10
                h-14
                w-14
                rounded-2xl
                object-cover
                transition-transform
                duration-500
                group-hover:scale-105
              "
            />
          </div>
        </div>

        {/* Text */}
        <div className="mt-5 text-center">
          <h5
            className="
              font-['Cairo']
              text-lg
              font-extrabold
              tracking-tight
              text-[#244238]
              transition-colors
              duration-300
              group-hover:text-[#397a55]
            "
          >
           {name}
          </h5>

          <p
            className="
              mt-1
              text-[11px]
              font-medium
              text-[#91a39b]
              transition-colors
              duration-300
              group-hover:text-[#71877c]
            "
          >
            صفحة ال{profileActivity?.name}
          </p>
        </div>

        {/* Button */}
        <div className="mt-5 flex justify-center">
          <a
            href={isAdmin ? `/admin/display-profile/${slug}` :isUser ? `/user/display-profile/${slug}` : `/profile/${slug}`}
            className="
              group/button
              relative
              flex
              w-full
              items-center
              justify-center
              gap-2
              overflow-hidden
              rounded-xl
              bg-[#397a55]
              px-4
              py-2.5
              text-[12px]
              font-bold
              text-white
              shadow-[0_8px_18px_-8px_rgba(57,122,85,0.65)]
              transition-all
              duration-300
              hover:bg-[#2f654a]
              hover:shadow-[0_12px_22px_-8px_rgba(57,122,85,0.7)]
              active:scale-[0.97]
            "
          >
            {/* Button shine */}
            <span
              className="
                absolute
                inset-0
                -translate-x-full
                bg-gradient-to-r
                from-transparent
                via-white/20
                to-transparent
                transition-transform
                duration-700
                group-hover/button:translate-x-full
              "
            />

            <span className="relative z-10">عرض الصفحة</span>

            <ArrowLeft
              size={15}
              strokeWidth={2}
              className="
                relative
                z-10
                transition-transform
                duration-300
                group-hover/button:-translate-x-1
              "
            />
          </a>
        </div>
      </div>

      {/* Bottom accent */}
      <div
        className="
          absolute
          bottom-0
          left-1/2
          h-[3px]
          w-0
          -translate-x-1/2
          rounded-full
          bg-gradient-to-r
          from-[#4c956c]
          to-[#397a55]
          transition-all
          duration-500
          group-hover:w-[55%]
        "
      />
    </div>
  );
}
