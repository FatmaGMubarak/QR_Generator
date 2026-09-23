import React, { useState } from "react";

import {
  LayoutGrid,
  Utensils,
  Shirt,
  ShoppingCart,
  Coffee,
  Pill,
  Smartphone,
  Sparkles,
  Wrench,
  MoreHorizontal,
} from "lucide-react";

export default function CategoriesListing() {
  const [activeCategory, setActiveCategory] = useState(0);

  const categories = [
    {
      id: 0,
      name: "الكل",
      icon: LayoutGrid,
    },
    {
      id: 1,
      name: "مطاعم",
      icon: Utensils,
    },
    {
      id: 2,
      name: "ملابس",
      icon: Shirt,
    },
    {
      id: 3,
      name: "سوبر ماركت",
      icon: ShoppingCart,
    },
    {
      id: 4,
      name: "مقاهي",
      icon: Coffee,
    },
    {
      id: 5,
      name: "صيدليات",
      icon: Pill,
    },
    {
      id: 6,
      name: "إلكترونيات",
      icon: Smartphone,
    },
    {
      id: 7,
      name: "تجميل",
      icon: Sparkles,
    },
    {
      id: 8,
      name: "خدمات",
      icon: Wrench,
    },
    {
      id: 9,
      name: "أخرى",
      icon: MoreHorizontal,
    },
  ];

  return (
    <div
      dir="rtl"
      className="
        w-full
        px-2 sm:px-4 lg:px-6
        py-3 sm:py-5
      "
    >
      <style>{`
        .categories-scroll::-webkit-scrollbar { display: none; }
        .categories-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div
        className="
          relative
          w-full
          max-w-[1250px]
          mx-auto

          categories-scroll
          overflow-x-auto
          overflow-y-hidden

          snap-x
          snap-mandatory
          sm:snap-none

          rounded-[18px] sm:rounded-[22px] lg:rounded-[28px]

          border
          border-[#e3eee7]

          bg-white/85
          backdrop-blur-xl

          p-1.5 sm:p-2 lg:p-2.5

          shadow-[0_12px_40px_-18px_rgba(57,122,85,0.25)]

          scrollbar-hide
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -top-16
            right-1/3
            h-32
            w-36
            rounded-full
            bg-[#e6f3ea]
            opacity-50
            blur-3xl
          "
        />

        <ul
          className="
            relative
            z-10

            flex
            items-center

            justify-start
            lg:justify-center

            gap-1
            sm:gap-1.5
            lg:gap-2

            min-w-max
          "
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <li key={cat.id} className="shrink-0 snap-start">
                <button
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    group
                    relative
                    flex
                    items-center
                    justify-center
                    gap-1 sm:gap-1.5 lg:gap-2

                    overflow-hidden

                    rounded-[13px]
                    sm:rounded-[15px]
                    lg:rounded-[18px]

                    px-2.5
                    sm:px-3
                    lg:px-4

                    py-1.5
                    sm:py-2
                    lg:py-2.5

                    min-h-[38px]
                    sm:min-h-[42px]
                    lg:min-h-[46px]

                    font-['Tajawal']
                    text-[10.5px]
                    sm:text-[11px]
                    lg:text-[12.5px]

                    font-bold
                    whitespace-nowrap

                    transition-all
                    duration-300
                    ease-out

                    active:scale-95

                    ${
                      isActive
                        ? `
                          bg-[#397a55]
                          text-white

                          shadow-[0_8px_20px_-8px_rgba(57,122,85,0.7)]

                          -translate-y-[1px]
                        `
                        : `
                          bg-[#f7faf8]
                          text-[#667d72]

                          border
                          border-transparent

                          hover:bg-[#edf6f0]
                          hover:text-[#397a55]
                          hover:border-[#d5e7db]

                          hover:-translate-y-1

                          hover:shadow-[0_8px_18px_-10px_rgba(57,122,85,0.35)]
                        `
                    }
                  `}
                >
                  <span
                    className={`
                      pointer-events-none
                      absolute
                      inset-0

                      -translate-x-full

                      bg-gradient-to-r
                      from-transparent
                      via-white/20
                      to-transparent

                      transition-transform
                      duration-700

                      ${!isActive ? "group-hover:translate-x-full" : ""}
                    `}
                  />

                  <span
                    className={`
                      relative
                      z-10

                      flex
                      shrink-0

                      h-5
                      w-5
                      sm:h-6
                      sm:w-6
                      lg:h-7
                      lg:w-7

                      items-center
                      justify-center

                      rounded-lg
                      sm:rounded-xl

                      transition-all
                      duration-300

                      ${
                        isActive
                          ? "bg-white/15 text-white"
                          : `
                            bg-white
                            text-[#709184]

                            shadow-sm

                            group-hover:bg-[#397a55]
                            group-hover:text-white

                            group-hover:rotate-[-6deg]
                            group-hover:scale-110
                          `
                      }
                    `}
                  >
                    <Icon
                      size={13}
                      className="sm:w-[14px] sm:h-[14px] lg:w-[15px] lg:h-[15px]"
                      strokeWidth={1.9}
                    />
                  </span>

                  <span className="relative z-10">{cat.name}</span>

                  {isActive && (
                    <span
                      className="
                        relative
                        z-10

                        h-1.5
                        w-1.5

                        shrink-0

                        rounded-full

                        bg-[#cce8d6]

                        shadow-[0_0_8px_rgba(204,232,214,0.9)]
                      "
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
