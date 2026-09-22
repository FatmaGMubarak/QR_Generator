import { useEffect, useRef, useState } from "react";
import { ImFilePicture } from "react-icons/im";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createCategory, updateCategory } from "../../store/reducers/categorySlice";
import notify from "../../hooks/Notifications";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminEditCategory() {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const {id} = useParams();

    const loading = useSelector((state)=> state?.category?.loading);


  const dispatch = useDispatch();

  const navigate = useNavigate();

  const isValid = name.trim().length >= 2;

  const acceptFile = (file) => {
    if (!file) return;
    const validTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (!validTypes.includes(file.type)) {
      setError("صيغة الملف غير مدعومة");
      return;
    }
    if (file.size > 10000000) {
      setError("الحد الأقصى لحجم الصورة هو 10 ميجابايت");
      return;
    }
    setError("");
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(null);
    setPreviewUrl("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    try{
      e.preventDefault();
    if (!name.trim()) {
      setError("برجاء كتابة الاسم");
      return;
    }
   
    setError("");
    const newCategoryData = new FormData();
    newCategoryData.append("name", name);
    if(imageFile){
        newCategoryData.append("img", imageFile);
    }
    const response = await dispatch(updateCategory({id: id, newCategoryData: newCategoryData})).unwrap();
    notify(response.message, "success");
    navigate("/admin")
    }catch(err){
notify(err.message, "error");
    }
  };

  const handleCancel = () =>{
    setName("");
    setImageFile(null);
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-[#ffafcc] via-[#ff8fa3] to-[#4c956c]  px-4 py-10 selection:bg-[#FFD600] selection:text-[#1E293B]"
    >
      <form
        onSubmit={handleSubmit}
        className=" w-[50%] bg-white rounded-3xl border border-[#E2E8F0] shadow-xl shadow-[#a53860]/5 p-8 flex flex-col items-center gap-y-7"
      >
        <div className="text-center">
          <h1 className="font-extrabold text-xl text-[#1E293B]">
           تعديل منشأة
          </h1>
          <p className="text-sm text-[#64748B] mt-1.5 font-medium">
           برجاء ادخال اسم وصورة للمنشأة
          </p>
        </div>

        {/* circular image upload */}
        <div className="relative w-36 h-36">
          <label
            htmlFor="avatar-upload"
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              acceptFile(e.dataTransfer.files?.[0]);
            }}
            className={`group/avatar relative w-36 h-36 rounded-full flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300
              ${
                previewUrl
                  ? "border-2 border-[#a53860]"
                  : "border-2 border-dashed border-[#CBD5E1] hover:border-[#a53860] bg-[#F8FAFC] hover:bg-white"
              }
              ${isDragging ? "border-[#a53860] bg-[#FBEAF0] scale-105" : ""}
            `}
          >
            <input
              ref={inputRef}
              id="avatar-upload"
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              className="hidden"
              onChange={(e) => acceptFile(e.target.files?.[0])}
            />

            {previewUrl ? (
              <img
                src={previewUrl}
                alt="الصورة الشخصية"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-y-2 px-4 text-center">
                <ImFilePicture className="text-2xl text-[#94A3B8] group-hover/avatar:text-[#a53860] transition-colors" />
                <span className="text-xs font-bold text-[#64748B] group-hover/avatar:text-[#a53860] transition-colors">
                  ارفع صورة
                </span>
              </div>
            )}

            {previewUrl && (
              <div className="absolute inset-0 bg-black/0 group-hover/avatar:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100">
                <span className="text-white text-xs font-bold">تغيير الصورة</span>
              </div>
            )}
          </label>

          {previewUrl && (
            <button
              type="button"
              onClick={removeImage}
              aria-label="ازالة الصورة"
              className="absolute -bottom-1 -left-1 w-9 h-9 rounded-full bg-[#fa518f] hover:bg-[#fa518f]/80 text-white flex items-center justify-center shadow-md transition-all duration-300 active:scale-90"
            >
              <RiDeleteBin5Fill className="text-sm" />
            </button>
          )}
        </div>

        {/* name field */}
        <div className="w-full">
          <label
            htmlFor="name"
            className="block text-sm font-bold text-[#475569] mb-2 mr-1"
          >
            الاسم
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            placeholder="اكتب اسمك هنا"
            className="bg-[#F8FAFC] border border-[#CBD5E1] text-[#1E293B] text-md font-medium rounded-xl focus:bg-white focus:border-[#a53860] focus:shadow-[0_0_15px_rgba(238,38,119,0.15)] block w-full px-5 py-3.5 placeholder:text-[#94A3B8] focus:outline-none transition-all duration-300"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm font-bold -mt-3 self-start mr-1">
            {error}
          </p>
        )}

       <div className="w-full flex gap-x-3 justify-between">
         <button
          type="submit"
          className={`w-full flex justify-center items-center gap-x-3 px-4 py-3.5 rounded-xl text-white font-bold tracking-wide transition-all duration-300 active:scale-95
            ${
              isValid
                ? "bg-[#fa518f] hover:bg-[#fa518f]/85 shadow-lg shadow-[#fa518f]/25"
                : "bg-[#fa518f]/50 cursor-not-allowed"
            }`}
        >
         {loading ?  <span className="loader"></span> : 'تعديل المنشأة'} 
          <FaLongArrowAltLeft />
        </button>
         <button
         onClick={handleCancel}
          type="button"
          className={`w-full flex justify-center items-center gap-x-3 px-4 py-3.5 rounded-xl text-white font-bold tracking-wide transition-all duration-300 active:scale-95
            bg-gray-600/90 hover:bg-gray-600`}
        >
         الغاء
          <X />
        </button>
       </div>
      </form>
    </div>
  );
}