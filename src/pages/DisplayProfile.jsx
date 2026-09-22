import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Pencil,
  Trash2,
  MessageCircle,
  Music2,
  ImageIcon,
  User,
  Utensils,
} from "lucide-react";
import { SlSocialFacebook } from "react-icons/sl";
import { SiInstagram } from "react-icons/si";


import { deleteProfile, fetchProfileById } from "../store/reducers/profileSlice.js";

import cover from "../assets/pietro-de-grandi-T7K4aEPoGGk-unsplash.jpg";
import avatar from "../assets/avatar.png";
import notify from "../hooks/Notifications.js";
import AdminTopbar from "../components/admin/ui/AdminTopbar.jsx";
import DeleteModal from "../components/common/DeleteModal.jsx";

export default function DisplayProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const profile = useSelector((state) => state?.profile?.profile);
  const loading = useSelector((state) => state?.profile?.loading);

  const location = useLocation();

  const isAdmin = location.pathname.includes("/admin");
  const general = !location.pathname.includes("/admin") && !location.pathname.includes("/user")

  useEffect(() => {
    if (slug) {
      dispatch(fetchProfileById(slug));
    }
  }, [dispatch, slug]);

  const handleCancelModal = () =>{
    setIsModalOpen(false);
  }

  const handleEdit = () => {
    if(isAdmin){
      navigate(`/admin/profile/${slug}/edit`);
    }
    else{
      navigate(`/user/profile/${slug}/edit`);
    }
  };

  const handleDelete = async () => {
    try{
        const response = await dispatch(deleteProfile(slug)).unwrap();
        if(isAdmin){
            navigate(`/admin`);
        }else{
navigate(`/user`);
        }
        notify(response.message, "success");
    }catch(err){
        notify(err.message, "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#ffafcc] via-[#ff8fa3] to-[#4c956c] flex items-center justify-center">
        <div className="w-8 h-8 border-[3px] border-gray-200 border-t-[#2f6647] rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#ffafcc] via-[#ff8fa3] to-[#4c956c] flex items-center justify-center">
        <div className="text-center">
          <User className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-700">
            الملف الشخصي غير موجود
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            لم نتمكن من العثور على هذا الملف الشخصي.
          </p>
        </div>
      </div>
    );
  }

  if(isModalOpen) return(
    <DeleteModal onConfirm={handleDelete} onCancel={handleCancelModal} message={"هل أنت متأكد أنك تريد حذف هذه الصفحة الشخصية"} isOpen={isModalOpen}/>
  )

  return (
    <>
    {general && <AdminTopbar />}
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-r from-[#ffafcc] via-[#ff8fa3] to-[#4c956c] px-4 py-6 sm:px-6 lg:px-8  mt-[20] md:mt-[7%]"
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              الصفحة الشخصية
            </h1>

            <p className="text-sm text-black mt-1">
              عرض وإدارة معلومات ملفك الشخصي
            </p>
          </div>

          {!general && (
            <div className="flex items-center gap-2">

            <button
              onClick={handleEdit}
              className="
                flex items-center gap-2
                px-4 py-2
                rounded-lg
                bg-[#2f6647]
                text-white
                text-sm font-semibold
                hover:bg-[#285a3e]
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


        {/* Profile */}
        <div className="bg-white/70 border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

          {/* Cover */}
          <div className="relative h-48 sm:h-56 lg:h-64">

            <img
              src={profile?.cover || cover}
              alt="Cover"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

            {/* Logo */}
            <div className="absolute right-6 sm:right-8 -bottom-12">

              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-1.5 shadow-md">

                <div className="w-full h-full rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">

                  <img
                    src={profile?.logo || avatar}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />

                </div>
              </div>

            </div>
          </div>


          {/* Identity */}
          <div className="px-6 sm:px-8 pt-16 pb-7 border-b border-gray-100">

            <h2 className="text-2xl font-bold text-gray-800">
              {profile?.name}
            </h2>

            {profile?.about_us && (
              <p className="text-gray-500 text-sm leading-6 mt-2 max-w-2xl">
                {profile.about_us}
              </p>
            )}

          </div>


          {/* Information */}
          <div className="p-6 sm:p-8">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">


              {/* Contact */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">

                <div className="w-full flex items-center gap-x-3 mb-5 p-3 bg-[#F8FAFC] border-b border-[#E2E8F0] hover:bg-[#F1F5F9] rounded-xl">

                  <div className="w-10 h-10 rounded-lg bg-green-200 flex items-center justify-center">
                    <Phone
                      size={19}
                      className="text-[#2f6647]"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800">
                      معلومات الاتصال
                    </h3>

                    <p className="text-xs text-gray-400 mt-0.5">
                      بيانات التواصل
                    </p>
                  </div>

                </div>


                <div className="space-y-4">

                  {profile?.email && (
                    <ContactItem
                      icon={<Mail size={18} />}
                      label="البريد الإلكتروني"
                      value={profile.email}
                      href={`mailto:${profile.email}`}
                    />
                  )}

                  {profile?.phone && (
                    <ContactItem
                      icon={<Phone size={18} />}
                      label="رقم الهاتف"
                      value={profile.phone}
                      href={`tel:${profile.phone}`}
                    />
                  )}

                  {profile?.address && (
                    <ContactItem
                      icon={<MapPin size={18} />}
                      label="العنوان"
                      value={profile.address}
                    />
                  )}

                  {!profile?.email &&
                    !profile?.phone &&
                    !profile?.address && (
                      <p className="text-sm text-gray-400">
                        لا توجد معلومات اتصال
                      </p>
                    )}

                </div>
              </div>


              {/* Social Media */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">

                <div className="w-full flex items-center gap-x-3 mb-5 p-3 bg-[#F8FAFC] border-b border-[#E2E8F0] hover:bg-[#F1F5F9] rounded-xl">

                  <div className="w-10 h-10 rounded-lg bg-purple-200 flex items-center justify-center">
                    <ExternalLink
                      size={19}
                      className="text-purple-600"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800">
                      مواقع التواصل
                    </h3>

                    <p className="text-xs text-gray-400 mt-0.5">
                      حسابات التواصل الاجتماعي
                    </p>
                  </div>

                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {profile?.facebook && (
                    <SocialItem
                      icon={<SlSocialFacebook size={18} />}
                      label="فيسبوك"
                      href={profile.facebook}
                    />
                  )}

                  {profile?.instagram && (
                    <SocialItem
                      icon={<SiInstagram size={18} />}
                      label="انستجرام"
                      href={profile.instagram}
                    />
                  )}

                  {profile?.tiktok && (
                    <SocialItem
                      icon={<Music2 size={18} />}
                      label="تيك توك"
                      href={profile.tiktok}
                    />
                  )}

                  {profile?.whatsapp && (
                    <SocialItem
                      icon={<MessageCircle size={18} />}
                      label="واتساب"
                      href={profile.whatsapp}
                    />
                  )}

                  {!profile?.facebook &&
                    !profile?.instagram &&
                    !profile?.tiktok &&
                    !profile?.whatsapp && (
                      <p className="text-sm text-gray-400 col-span-full">
                        لا توجد حسابات مرتبطة
                      </p>
                    )}

                </div>
              </div>

            </div>


            {/* Menu */}
            {profile?.menu && (
              <div
                className="
                bg-white
                  mt-5
                  border border-gray-200
                  rounded-xl
                  px-5 py-4
                  flex flex-col sm:flex-row
                  sm:items-center
                  sm:justify-between
                  gap-4
                  hover:border-orange-200
                  transition-colors duration-200
                "
              >

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Utensils
                      size={19}
                      className="text-orange-600"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800">
                      القائمة الإلكترونية
                    </h3>

                    <p className="text-xs text-gray-400 mt-0.5">
                      رابط القائمة الخاصة بك
                    </p>
                  </div>

                </div>


                <a
                  href={profile.menu}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex items-center justify-center gap-2
                    px-4 py-2.5
                    rounded-lg
                    border border-gray-200
                    bg-white
                    text-gray-700
                    text-sm font-semibold
                    hover:bg-gray-50
                    hover:border-gray-300
                    transition-colors duration-200
                  "
                >
                  عرض القائمة
                  <ExternalLink size={16} />
                </a>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
    </>
  );
}


/* ============================================================
   Contact Item
============================================================ */

function ContactItem({
  icon,
  label,
  value,
  href,
}) {
  const content = (
    <div
      className="
        flex items-center gap-3
        p-2.5
        rounded-lg
        hover:bg-gray-50
        transition-colors duration-200
      "
    >

      <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-xs text-gray-400 mb-0.5">
          {label}
        </p>

        <p
          dir="ltr"
          className="
            text-sm
            font-medium
            text-gray-700
            truncate
          "
        >
          {value}
        </p>

      </div>

    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <a href={href}>
      {content}
    </a>
  );
}


/* ============================================================
   Social Item
============================================================ */

function SocialItem({
  icon,
  label,
  href,
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        group
        flex items-center justify-between
        px-3 py-2.5
        rounded-lg
        border border-gray-200
        bg-white
        hover:bg-gray-50
        hover:border-gray-300
        transition-all duration-200
      "
    >

      <div className="flex items-center gap-2.5">

        <div className="text-gray-500 group-hover:text-[#2f6647] transition-colors">
          {icon}
        </div>

        <span className="text-sm font-medium text-gray-700">
          {label}
        </span>

      </div>

      <ExternalLink
        size={14}
        className="
          text-gray-300
          group-hover:text-gray-500
          transition-colors
        "
      />

    </a>
  );
}
