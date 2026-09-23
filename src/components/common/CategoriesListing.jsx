import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeCategories } from "../../store/reducers/categorySlice";

export default function CategoriesListing({ onCategorySelect }) {
const categories = useSelector(
(state) => state?.category?.homeCategories || []
);

const dispatch = useDispatch();

const [activeCategory, setActiveCategory] = useState(null);

useEffect(() => {
dispatch(fetchHomeCategories());
}, [dispatch]);

// Make the first category active once the API data arrives
useEffect(() => {
if (categories.length > 0 && activeCategory === null) {
const firstCategoryId = categories[0]?.id;

  setActiveCategory(firstCategoryId);
  onCategorySelect?.(firstCategoryId);
}

}, [categories, activeCategory, onCategorySelect]);

const handleCategoryClick = (categoryId) => {
setActiveCategory(categoryId);
onCategorySelect?.(categoryId);
};

return ( <div
   dir="rtl"
   className="
     w-full
     px-2 sm:px-4 lg:px-6
     py-3 sm:py-5
   "
 > <style>{`
.categories-scroll::-webkit-scrollbar {
display: none;
}

    .categories-scroll {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>

  <div
    className="
      relative
      w-fit
      max-w-full
      mx-auto
      categories-scroll
      overflow-x-auto
      overflow-y-hidden
      snap-x
      snap-mandatory
      sm:snap-none
      rounded-[18px]
      sm:rounded-[22px]
      lg:rounded-[28px]
      border
      border-[#e3eee7]
      bg-white/85
      backdrop-blur-xl
      p-1.5
      sm:p-2
      lg:p-2.5
      shadow-[0_12px_40px_-18px_rgba(57,122,85,0.25)]
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
      {categories.length > 0 ? (
        categories.map((cat) => {
          const isActive = activeCategory === cat.id;

          return (
            <li
              key={cat.id}
              className="shrink-0 snap-start"
            >
              <button
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className={`
                  group
                  relative
                  flex
                  items-center
                  justify-center
                  gap-1
                  sm:gap-1.5
                  lg:gap-2
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
                    ${
                      !isActive
                        ? "group-hover:translate-x-full"
                        : ""
                    }
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
                  <img
                    src={cat?.img}
                    alt=""
                    className="
                      w-[18px]
                      h-[18px]
                      lg:w-[20px]
                      lg:h-[20px]
                      rounded-full
                      object-cover
                    "
                  />
                </span>

                <span className="relative z-10">
                  {cat?.name}
                </span>

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
        })
      ) : (
        <li className="px-6 py-3">
          <p className="text-sm font-semibold text-gray-500">
            لا توجد بيانات للعرض
          </p>
        </li>
      )}
    </ul>
  </div>
</div>

);
}
