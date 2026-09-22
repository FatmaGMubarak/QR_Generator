import React, { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function DeleteModal({ onConfirm, onCancel, message, isOpen }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onCancel}
      className="
        fixed inset-0 z-50 flex items-center justify-center
        bg-[#1b2b22]/50 backdrop-blur-sm
        px-4
        animate-[fadeIn_.18s_ease-out]
      "
    >
      

      <div
        role="alertdialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="
          relative w-full max-w-[380px]
          rounded-[22px] bg-white
          shadow-[0_25px_60px_-15px_rgba(17,34,25,0.35)]
          animate-[popIn_.22s_cubic-bezier(0.16,1,0.3,1)]
          overflow-hidden
        "
      >
        <button
          type="button"
          onClick={onCancel}
          aria-label="إغلاق"
          className="
            absolute top-3 left-3 flex h-8 w-8 items-center justify-center
            rounded-full text-[#9aa8a0]
            transition-colors duration-200
            hover:bg-[#f3f6f4] hover:text-[#526b60]
          "
        >
          <X size={16} strokeWidth={2.2} />
        </button>

        <div className="flex flex-col items-center px-7 pt-9 pb-7 text-center">
          <div
            className="
              flex h-14 w-14 items-center justify-center rounded-2xl
              bg-red-50 text-red-600 ring-1 ring-red-100
              mb-5
            "
          >
            <AlertTriangle size={26} strokeWidth={2} />
          </div>

          <h2 className="font-['Tajawal'] text-[16px] font-bold text-[#1f2f27] leading-relaxed max-w-[260px]">
            {message || "هل أنت متأكد من الحذف؟"}
          </h2>

          <p className="font-['Tajawal'] text-[12.5px] text-[#7d8d85] mt-2 mb-7">
            لا يمكن التراجع عن هذا الإجراء بعد تنفيذه
          </p>

          <div className="flex w-full gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="
                flex-1 rounded-xl border border-[#e3e8e5] bg-white
                px-4 py-2.5
                font-['Tajawal'] text-[13px] font-bold text-[#526b60]
                transition-all duration-200
                hover:bg-[#f6f8f7] hover:border-[#d5ddd9]
                active:scale-[0.97]
              "
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="
                flex-1 rounded-xl
                bg-gradient-to-b from-red-600 to-red-700
                px-4 py-2.5
                font-['Tajawal'] text-[13px] font-bold text-white
                shadow-[0_10px_20px_-8px_rgba(185,28,28,0.55)]
                transition-all duration-200
                hover:-translate-y-0.5 hover:shadow-[0_14px_24px_-8px_rgba(185,28,28,0.6)]
                active:scale-[0.97]
              "
            >
              حذف
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}