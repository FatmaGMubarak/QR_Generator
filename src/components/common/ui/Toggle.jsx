import React from "react";

export default function Toggle({ value, onChange }) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />

      <div
        className="
          relative
          w-9 h-5
          bg-gray-400
          rounded-full
          transition-colors
          peer-checked:bg-[#fa518f]

          after:content-['']
          after:absolute
          after:top-[2px]
          after:left-[2px]
          after:bg-white
          after:rounded-full
          after:h-4
          after:w-4
          after:transition-transform

          peer-checked:after:translate-x-4
        "
      />
    </label>
  );
}