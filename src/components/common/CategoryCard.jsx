import { useState } from "react";
import { ArrowLeft, Image, Pencil, Trash2 } from "lucide-react";

import logo from "../../assets/facebookLogo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  deleteCategory,
  fetchCategories,
} from "../../store/reducers/categorySlice";
import notify from "../../hooks/Notifications";
import DeleteModal from "../../components/common/DeleteModal"

export default function CategoryCard({ logoImg, name, id }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();
  const isAdmin = location.pathname.includes("/admin");

  const dispatch = useDispatch();

  const handleEdit = () => {
    navigate(`/admin/category/${id}/edit`);
  };

  const handleCancelModal = () =>{
    setIsModalOpen(false);
  }

  const handleDelete = async () => {
    try {
      const response = await dispatch(deleteCategory(id)).unwrap();
      await dispatch(fetchCategories());
      notify(response.message, "success");
    } catch (err) {
      notify(err.message, "error");
    }
  };

  if(isModalOpen) return(
    <DeleteModal onConfirm={handleDelete} onCancel={handleCancelModal} message={"هل أنت متأكد أنك تريد حذف هذا المنشأ"} isOpen={isModalOpen}/>
  )
  return (
    <div
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

            {logoImg ? (
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
            ) : (
              <Image className="text-gray-500 text-lg" />
            )}
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
            صفحة المطعم
          </p>
        </div>

        {isAdmin && (
          <div className="flex justify-center items-center gap-2 mt-5">
            <button
              onClick={handleEdit}
              className="
                flex items-center gap-2
                px-4 py-2
                rounded-lg
                bg-[#397a55] hover:bg-[#2a6041]
                text-white
                text-sm font-semibold
                transition-colors duration-200
              "
            >
              <Pencil size={16} />
              تعديل
            </button>

            <button
              onClick={()=>setIsModalOpen(true)}
              className="
                flex items-center gap-2
                px-4 py-2
                rounded-lg
                bg-white
                border border-red-200
                text-red-600
                text-sm font-semibold
                hover:bg-red-50
                transition-colors duration-200
              "
            >
              <Trash2 size={16} />
              حذف
            </button>
          </div>
        )}
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
