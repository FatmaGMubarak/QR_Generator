import React, { useState } from "react";
import { Search as SearchIcon, ArrowLeft, X } from "lucide-react";

export default function Search({ onSearch }) {
const [value, setValue] = useState("");

const handleSubmit = (e) => {
e.preventDefault();
onSearch?.(value.trim());
};

const handleChange = (e) => {
const newValue = e.target.value;

setValue(newValue);

// Filter immediately while typing
onSearch?.(newValue.trim());

};

const clearSearch = () => {
setValue("");
onSearch?.("");
};

return ( <form
   dir="rtl"
   onSubmit={handleSubmit}
   className="
     group
     relative
     w-full
     max-w-[650px]
     mx-auto
     px-4
   "
 > <label htmlFor="search" className="sr-only">
البحث </label>

  <div
    className="
      relative
      flex
      items-center
      h-[62px]
      rounded-[22px]
      bg-white
      border
      border-[#dce9e1]
      shadow-[0_12px_35px_-15px_rgba(57,122,85,0.25)]
      transition-all
      duration-300
      focus-within:border-[#9fc9ad]
      focus-within:shadow-[0_15px_40px_-12px_rgba(57,122,85,0.35)]
      focus-within:ring-[#397a55]/[0.06]
    "
  >
    {/* Search icon */}
    <div
      className="
        absolute
        right-5
        flex
        items-center
        justify-center
        w-9
        h-9
        rounded-xl
        bg-[#edf6f0]
        text-[#397a55]
        transition-all
        duration-300
        group-focus-within:bg-[#397a55]
        group-focus-within:text-white
        group-focus-within:scale-105
      "
    >
      <SearchIcon size={18} strokeWidth={2} />
    </div>

    <input
      id="search"
      type="search"
      value={value}
      onChange={handleChange}
      placeholder="ابحث باسم المنشأة ..."
      autoComplete="off"
      className="
        peer
        w-full
        h-full
        bg-transparent
        border-none
        outline-none
        ring-0
        px-[75px]
        pl-[100px]
        font-['Tajawal']
        text-[13px]
        font-medium
        text-[#244238]
        placeholder:text-[#9aaaa3]
        placeholder:transition-colors
        focus:placeholder:text-[#b6c5be]
      "
    />

   

    {/* Search button */}
    <button
      type="submit"
      className="
        absolute
        left-1.5
        top-1.5
        bottom-1.5
        flex
        items-center
        justify-center
        gap-2
        min-w-[92px]
        px-4
        rounded-[17px]
        bg-gradient-to-r
        from-[#4c956c]
        to-[#397a55]
        text-white
        font-['Tajawal']
        text-[12px]
        font-bold
        shadow-[0_7px_18px_-8px_rgba(57,122,85,0.75)]
        transition-all
        duration-300
        hover:from-[#397a55]
        hover:to-[#2f654a]
        hover:shadow-[0_10px_22px_-8px_rgba(57,122,85,0.8)]
        hover:-translate-y-[1px]
        active:scale-[0.97]
      "
    >
      <span>بحث</span>

      <ArrowLeft
        size={14}
        strokeWidth={2.2}
        className="
          transition-transform
          duration-300
          group-hover:-translate-x-1
        "
      />
    </button>
  </div>
</form>

);
}
