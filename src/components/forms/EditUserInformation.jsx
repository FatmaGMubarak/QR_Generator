import { useEffect, useState } from "react";
import { ImFilePicture } from "react-icons/im";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { useUserOptions } from "../../context/UserOptionsContext";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { Formik, Form, Field, useFormik } from "formik";
import * as Yup from "yup";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/firebase";
import { createProfile, updateProfile } from "../../store/reducers/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { FaLongArrowAltLeft } from "react-icons/fa";
import notify from "../../hooks/Notifications";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AnalyzingImageDemo from "../common/AnalyzingImageDemo";
import Select from 'react-select'
import {fetchCategories} from '../../store/reducers/categorySlice.js'


export default function EditUserInformation() {
  
  const location = useLocation();
  const isEditMode = location.pathname.includes("/edit");

  const {slug} = useParams();


  const {
    logoURL,
    coverURL,
    name,
    activity,
    bio,
    email,
    address,
    menu,
    phoneNumber,
    facebookURL,
    instagramURL,
    tiktokURL,
    whatsappURL,
    whatsappNumber,
    editQrProfile,
    errors,
    hasErrors,
    menuPreviewUrl,

    setLogoURL,
    setCoverURL,
    setName,
    setActivity,
    setBio,
    setEmail,
    setAddress,
    setMenu,
    setPhoneNumber,
    setFacebookURL,
    setInstagramURL,
    setTiktokURL,
    setWhatsappURL,
    setEditProfile,
    setWhatsappNumber,
    setEditQrProfile,
    setErrors,
    setHasErrors,
    setResetForm,
    setMenuPreviewUrl,
    setQrValue,
  } = useUserOptions();

  const [openSections, setOpenSections] = useState({
    media: true,
    personal: true,
    social: true,
  });

  const [loading, setLoading] = useState({
    logoURL: false,
    coverURL: false,
  });

  const profile = useSelector((state)=> state?.profile?.profile);

  const loadingProfile = useSelector((state)=> state?.profile?.loading);

   const categories = useSelector((state)=>state?.category?.categories);

const options = categories?.map((cat) => ({
    value: cat?.name,
    label: cat?.name,
  })) || [];

  const dispatch = useDispatch();

  const navigate = useNavigate();

      useEffect(()=>{
    dispatch(fetchCategories());
  }, [])

  useEffect(()=>{
    if(profile){
      const url = `https://scanned-three.vercel.app/profile/${profile.slug}`;
    setQrValue(url);
    setEditProfile((prev)=>({
      ...prev,
      qrValue: url,
    }))
  }
  }, [profile])

  useEffect(() => {
    sessionStorage.setItem("profile", JSON.stringify(profile));
  }, [profile, name, bio, email, address, menu, phoneNumber, facebookURL, instagramURL, tiktokURL, whatsappURL, logoURL, coverURL]);

  useEffect(() => {
    setName(profile?.name || "");
    setActivity(profile?.activity || "");
    setBio(profile?.about_us || "");
      setEmail(profile?.email || "");
      setAddress(profile?.address || "");
      setMenu(profile?.menu || null);
      setPhoneNumber(profile?.phone || "");
      setFacebookURL(profile?.facebook || "");
      setInstagramURL(profile?.instagram || "");
      setTiktokURL(profile?.tiktok || "");
      setWhatsappNumber(profile?.whatsapp.slice(15) || "");
      setWhatsappURL(profile?.whatsapp || "");
      setLogoURL(profile?.logo || null);
      setCoverURL(profile?.cover || null);
      // logoImageFile: null,
      // coverImageFile: null,
  }, [profile]);

  useEffect(() => {
    sessionStorage.setItem("QR Profile Edited", JSON.stringify(editQrProfile));
  }, [editQrProfile]);

    const handleCancel = async () => {
  // Revoke any local object URLs we created for previews to avoid memory leaks
  if (logoURL?.startsWith("blob:")) {
    URL.revokeObjectURL(logoURL);
  }
  if (coverURL?.startsWith("blob:")) {
    URL.revokeObjectURL(coverURL);
  }

  sessionStorage.removeItem("profile");
  sessionStorage.removeItem("QR Profile Edited");
  formik.resetForm();
  setHasErrors(false)
  setErrors({
  })
    setEditProfile({
      name: "",
      userName: "",
    bio: "",
    email: "",
    address: "",
    menu: null,
    phoneNumber: "",
    facebookURL: "",
    instagramURL: "",
    tiktokURL: "",
    whatsappNumber: "",
    whatsappURL: "",
    logoURL: "",
    coverURL: "",
    })
    setEditQrProfile({
      name: "",
      userName: "",
    bio: "",
        email: "",
    address: "",
    menu: null,
    phoneNumber: "",
    facebookURL: "",
    instagramURL: "",
    tiktokURL: "",
    whatsappNumber: "",
    whatsappURL: "",
    logoURL: "",
    coverURL: "",
    });
    setName("")
    setActivity("")
    setBio("")
    setEmail("")
    setAddress("")
    setMenu(null)
    setPhoneNumber("")
    setFacebookURL("")
    setInstagramURL("")
    setTiktokURL("")
    setWhatsappNumber("")
    setWhatsappURL("")
    setQrValue("")
  }

const submitProfilePage = async (values) => {
  if ( profile?.name?.length === 0) {
    return;
  }

  try {
    const profileData = new FormData();
    profileData.append("name", values.name);
    profileData.append("about_us", values.bio);
    profileData.append("email", values.email);
    profileData.append("address", values.address);
    profileData.append("phone", values.phoneNumber);
    profileData.append("facebook", values.facebookURL);
    profileData.append("instagram", values.instagramURL);
    profileData.append("tiktok", values.tiktokURL);
    profileData.append("whatsapp", values.whatsappNumber);

    if (values.logoImageFile instanceof File) {
      profileData.append("logo", values.logoImageFile);
    }
    if (values.coverImageFile instanceof File) {
      profileData.append("cover", values.coverImageFile);
    }
    if (values.menu instanceof File) {
      profileData.append("menu", values.menu);
    }

    let response;

    if (isEditMode) {
      response = await dispatch(updateProfile({slug: slug, newProfileData: profileData})).unwrap();

    } else {
      response = await dispatch(createProfile(profileData)).unwrap();
    }

   

    notify(response.message, "success");
    //navigate("/user");

    // if (!isEditMode) {
    //   handleCancel(); 
    // }
  } catch (err) {
    notify(err.message, "error");
  }
};

//     const createProfilePage = async (values) => {
//     if(hasErrors || profile?.name.length === 0){
//       return;
//     }
//    try{
//  const profileData = new FormData();
//      profileData.append("name", values.name);
//   profileData.append("about_us", values.bio);
//   profileData.append("email", values.email);
//   profileData.append("address", values.address);
//   profileData.append("phone", values.phoneNumber);

//   profileData.append("facebook", values.facebookURL);
//   profileData.append("instagram", values.instagramURL);
//   profileData.append("tiktok", values.tiktokURL);
//   profileData.append("whatsapp", values.whatsappNumber);
//   console.log(values.logoImageFile)
//   console.log(values.coverImageFile)
//   console.log(values.menu)
//     if (values.logoImageFile instanceof File) {
//     profileData.append("logo", values.logoImageFile);
//   }

//   if (values.coverImageFile instanceof File) {
//     profileData.append("cover", values.coverImageFile);
//   }

//   if (values.menu instanceof File) {
//     profileData.append("menu", values.menu);
//   }
//     const response = await dispatch(createProfile(profileData)).unwrap();
//     //  const url = `https://scanned-three.vercel.app/profile/${profile.userName}`;
//     // setQrValue(url);
//     // setEditProfile((prev)=>({
//     //   ...prev,
//     //   qrValue: url,
//     // }))
//     notify(response.message);
//     handleCancel();
//    }catch(err){
// notify(err.message, "error")
//    }
//   };

  const validationSchema = Yup.object({
    logoImageFile: Yup.mixed()
      .nullable()
      .test(
        "fileSize",
        "الحد الأقصى لحجم الصورة هو 10 ميجابايت",
        (value) => !value || value.size <= 10000000,
      )
      .test(
        "fileType",
        "صيغة الملف غير مدعومة",
        (value) =>
          !value ||
          ["image/jpg", "image/jpeg", "image/png"].includes(value.type),
      ),
    coverImageFile: Yup.mixed()
      .nullable()
      .test(
        "fileSize",
        "الحد الأقصى لحجم الصورة هو 10 ميجابايت",
        (value) => !value || value.size <= 10000000,
      )
      .test(
        "fileType",
        "صيغة الملف غير مدعومة",
        (value) =>
          !value ||
          ["image/jpg", "image/jpeg", "image/png"].includes(value.type),
      ),
    name: Yup.string()
      .min(2, "*برجاء كتابة اسم أطول")
      .max(50, "*برجاء كتابة اسم أقصر")
      .required("يجب كتابة اسم المنشأة"),
    bio: Yup.string()
      .min(2, "* برجاء كتابة نبذة أطول")
      .max(500, "*برجاء كتابة نبذة أقصر"),
    email: Yup.string()
      .email("* برجاء إدخال بريد إلكتروني صحيح")
      .required("* البريد الإلكتروني مطلوب")
      .test("valid-email", "* برجاء إدخال بريد إلكتروني حقيقي", (value) => {
        if (!value) return true;

        const blockedValues = [
          "anonymous",
          "anon",
          "test",
          "example",
          "none",
          "noemail",
          "no-email",
          "null",
          "undefined",
        ];

        const emailName = value.split("@")[0].toLowerCase();

        return !blockedValues.includes(emailName);
      }),
    address: Yup.string()
      .min(5, "* برجاء كتابة موقع صحيح")
      .max(200, "* برجاء كتابة موقع أقصر")
      .required("* العنوان مطلوب"),
    menu: Yup.mixed()
      .required("* برجاء رفع قائمة الطعام")
      .test(
        "fileType",
        "* يُسمح فقط بملفات PDF أو JPG أو JPEG أو PNG",
        (value) => {
          if (!value) return true;

          const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

          return allowedTypes.includes(value.type);
        },
      )
      .test("fileSize", "* حجم الملف يجب ألا يتجاوز 5 ميجابايت", (value) => {
        if (!value) return true;

        return value.size <= 5 * 1024 * 1024;
      }),
    phoneNumber: Yup.string().matches(
      /^(?:0|20|\+20)1[0125][0-9]{8}$/,
      "برجاء ادخال رقم هاتف مصرى صحيح",
    ),
    facebookURL: Yup.string()
      .url("برجاء ادخال عنوان صفحة فيسبوك صحيحة.")
      .matches(
        /^(?:https?:\/\/)?(?:www\.|m\.)?(?:facebook\.com|fb\.com)\/.+$/,
        "برجاء ادخال عنوان صفحة فيسبوك صحيحة.",
      ),
    instagramURL: Yup.string()
      .url("برجاء ادخال عنوان صفحة انستجرام صحيحة.")
      .matches(
        /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?(?:\?.*)?$/,
        "برجاء ادخال عنوان صفحة انستجرام صحيحة.",
      ),
    tiktokURL: Yup.string()
      .url("برجاء ادخال عنوان صفحة تيك توك صحيحة.")
      .matches(
        /^(?:https?:\/\/)?(?:www\.)?tiktok\.com\/.+$/,
        "برجاء ادخال عنوان صفحة تيك توك صحيحة.",
      ),
    whatsappNumber: Yup.string().matches(
      /^(?:\+?20|0)?1[0125][0-9]{8}$/,
      "برجاء ادخال رقم واتساب مصري صحيح (مثال: 01096890544 أو 201096890544)",
    ),
  });

  const formik = useFormik({
    initialValues: {
      name: profile?.name || "",
      bio: profile?.about_us || "",
      email: profile?.email || "",
      address: profile?.address || "",
      menu: profile?.menu || null, 
      phoneNumber: profile?.phone || "",
      facebookURL: profile?.facebook || "",
      instagramURL: profile?.instagram || "",
      tiktokURL: profile?.tiktok || "",
      //whatsappNumber: profile?.whatsapp || "",
      whatsappURL: profile?.whatsapp || "",
      logoURL: profile?.logo || "",
      coverURL: profile?.cover || "",
      logoImageFile: null,
      coverImageFile: null,
    },
    validationSchema,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFileChangeSize = async (e, fieldName, successCallback) => {
    const file = e.target.files[0] || e.target.files[1];
    if (!file) return;

    formik.setFieldValue(fieldName, file);
    formik.setFieldTouched(fieldName, true, false);

    const isValidType = ["image/png", "image/jpg", "image/jpeg"].includes(
      file.type,
    );
    const isValidSize = file.size <= 10000000;

    if (!isValidType) {
      formik.setFieldError(fieldName, "صيغة الملف غير مدعومة");

      return;
    }

    if (!isValidSize) {
      formik.setFieldError(fieldName, "الحد الأقصى لحجم الصورة هو 10 ميجابايت");

      return;
    }

    // No upload needed — just create a local preview URL for the selected file.
    // The actual File object is already stored in formik state (logoImageFile /
    // coverImageFile) and gets sent to the backend in submitProfilePage.
    const previewUrl = createLocalPreview(file);
    if (previewUrl) {
      successCallback(previewUrl);
    }
  };

  const createLocalPreview = (file) => {
    try {
      return URL.createObjectURL(file);
    } catch (error) {
      console.error("Failed to create local preview for file:", error);
      return null;
    }
  };

  const deleteImage = (imgName) => {
    if (imgName === "logoURL" && profile?.logo?.length > 0) {
      if (logoURL?.startsWith("blob:")) {
        URL.revokeObjectURL(logoURL);
      }
      formik.setFieldValue("logoImageFile", null);
      setLogoURL("");
      setEditProfile((prev) => ({
        ...prev,
        logoURL: "",
      }));
      setEditQrProfile((prev) => ({ ...prev, logoURL: "" }));
    }
    if (imgName === "coverURL" && profile?.cover?.length > 0) {
      if (coverURL?.startsWith("blob:")) {
        URL.revokeObjectURL(coverURL);
      }
      formik.setFieldValue("coverImageFile", null);
      setCoverURL("");
      setEditProfile((prev) => ({
        ...prev,
        coverURL: "",
      }));
      setEditQrProfile((prev) => ({ ...prev, coverURL: "" }));
    }
  };

  // const getProfile = async () => {
  //   const displayedName = formik.values.name
  //     .toLocaleLowerCase()
  //     .trim()
  //     .replace(/\s+/g, "-");
  //   const q = query(
  //     collection(db, "profiles"),
  //     where("userName", "==", displayedName),
  //   );

  //   const snapshot = await getDocs(q);

  //   if (!snapshot.empty) {
  //     formik.setFieldError("name", "اسم المنشأة موجود بالفعل");

  //     return false;
  //   }
  //   return true;
  // };

  useEffect(() => {
    setHasErrors(Object.keys(formik.errors).length > 0);
    setErrors(formik.errors);
  }, [formik.errors]);

  useEffect(() => {
    setResetForm(() => formik.resetForm);

    return () => setResetForm(null);
  }, [setResetForm]);

  // useEffect(() => {
    // if (profile?.whatsappNumber?.length !== 11 && phoneNumber) {
    //   const value = phoneNumber;
    //   let cleanNumber = value.replace(/\s+/g, "").replace("+", "");
    //   if (cleanNumber.startsWith("01")) {
    //     cleanNumber = "20" + cleanNumber.substring(1);
    //   } else if (cleanNumber.startsWith("1")) {
    //     cleanNumber = "20" + cleanNumber;
    //   }
  //   if (profile?.whatsapp) {
  //     const value = profile?.phone;;
  //     // const generatedWhatsAppURL = `https://wa.me/${cleanNumber}`;
  //     const generatedWhatsAppURL = profile?.whatsapp;

  //     setWhatsappNumber(value);
  //     setWhatsappURL(generatedWhatsAppURL);
  //     setEditProfile((prev) => ({
  //       ...prev,
  //       whatsappNumber: value,
  //       whatsappURL: generatedWhatsAppURL,
  //     }));

  //     formik.setFieldValue("whatsappNumber", value);
  //   }
  // }, [phoneNumber]);




  return (
    <div className=" pb-6 w-full text-[#1E293B] px-4 selection:bg-[#FFD600] selection:text-[#1E293B] rounded-3xl">
      

      <form
        className="w-full max-w-3xl mx-auto flex flex-col gap-y-8"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* SECTION 1: MEDIA */}
        <div className="w-full bg-white rounded-3xl border border-[#E2E8F0] shadow-xl shadow-[#a53860]/5 overflow-hidden transition-all duration-300 hover:border-[#a53860]/40 hover:shadow-[#a53860]/10">
          <button
            type="button"
            onClick={() => toggleSection("media")}
            className="w-full flex justify-between items-center px-6 py-5 bg-[#F8FAFC] border-b border-[#E2E8F0] hover:bg-[#F1F5F9] transition-all group"
          >
            <span className="font-extrabold text-lg text-[#1E293B] group-hover:text-[#a53860] transition-all duration-300">
              أولاً: صور الصفحة (اللوجو والغلاف)
            </span>
            {openSections.media ? (
              <HiChevronUp className="text-2xl text-[#a53860] transition-transform duration-300" />
            ) : (
              <HiChevronDown className="text-2xl text-[#64748B] group-hover:text-[#a53860] transition-transform duration-300" />
            )}
          </button>

          {openSections.media && (
            <div className="p-6 flex flex-col md:flex-row gap-6">
              {/* صورة اللوجو */}
              <div className="w-full md:w-1/2">
                <div className="w-full flex justify-between items-center mb-3">
                  <label
                    htmlFor="logo-upload"
                    className="block text-sm font-bold text-[#475569] mr-1"
                  >
                    صورة اللوجو
                  </label>
                  <div
                    onClick={() => deleteImage("logoURL")}
                    disabled={profile?.logo?.length <= 0}
                    className={`flex justify-center items-center gap-x-2  hover:bg-[#fa518f]/75 text-white px-3 py-2 rounded-xl ${profile?.logoURL?.length > 0 ? "cursor-pointer bg-[#fa518f]" : "cursor-not-allowed bg-[#fa518f]/75"}`}
                  >
                    <button
                      className={`font-semibold ${profile?.logo?.length > 0 ? "cursor-pointer" : "cursor-not-allowed"}`}
                    >
                      ازالة الصورة
                    </button>
                    <RiDeleteBin5Fill className="text-white" />
                  </div>
                </div>

                <div
                  className={`${loading?.logoURL ? "bg-blur-50" : ""}relative w-full h-44 border-2 border-dashed border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] hover:border-[#a53860] rounded-2xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden group/box shadow-sm`}
                >
                  <input
                    disabled={loading?.logoURL}
                    accept="image/png, image/jpeg, image/jpg"
                    id="logo-upload"
                    type="file"
                    className={`absolute inset-0 opacity-0 ${loading?.logoURL ? "cursor-not-allowed" : "cursor-pointer"} z-10`}
                    onChange={async (e) => {
                      await handleFileChangeSize(e, "logoImageFile", (url) => {
                        setLogoURL(url);
                        setEditProfile((prev) => ({ ...prev, logoURL: url }));
                        setEditQrProfile((prev) => ({ ...prev, logoURL: url }));
                      });
                      e.target.value = "";
                    }}
                  />
                  <div
                    className={` ${profile?.logo?.length > 0 ? "p-1" : "p-4"} rounded-md bg-[#F1F5F9] border border-[#E2E8F0] group-hover/box:scale-110 group-hover/box:border-[#a53860]/30 group-hover/box:bg-[#E0F2FE] mb-3 transition-all duration-300`}
                  >
                    {profile?.logo?.length > 0 ? (
                      <img
                        src={logoURL}
                        alt="logo_image"
                        className="w-24 h-20 object-contain"
                      />
                    ) : (
                      <ImFilePicture className="text-2xl text-[#64748B] group-hover/box:text-[#a53860] transition-colors" />
                    )}
                  </div>
                  <p className="text-[#334155] font-bold text-sm group-hover/box:text-[#a53860] transition-colors">
                    اضغط لرفع صورة اللوجو
                  </p>
                  <p className="text-xs text-[#94A3B8] mt-1.5 font-medium">
                    JPG, PNG - يفضل مقاس مربع
                  </p>
                  {formik.errors.logoImageFile &&
                    formik.touched.logoImageFile && (
                      <p className="text-red-500 text-sm mt-1 text-center font-bold">
                        {formik.errors.logoImageFile}
                      </p>
                    )}
                </div>
              </div>

              {/* صورة الغلاف */}
              <div className="w-full md:w-1/2">
                <div className="w-full flex justify-between items-center mb-3">
                  <label
                    htmlFor="cover-upload"
                    className="block text-sm font-bold text-[#475569] mr-1"
                  >
                    صورة الغلاف
                  </label>
                  <div
                    onClick={() => deleteImage("coverURL")}
                    disabled={profile?.cover?.length <= 0}
                    className={`flex justify-center items-center gap-x-2 bg-[#fa518f] hover:bg-[#fa518f]/75 text-white px-3 py-2 rounded-xl ${profile?.coverURL?.length > 0 ? "cursor-pointer bg-[#fa518f]" : "cursor-not-allowed bg-[#fa518f]/75"}`}
                  >
                    <button
                      className={`font-semibold ${profile?.cover?.length > 0 ? "cursor-pointer" : "cursor-not-allowed"}`}
                    >
                      ازالة الصورة
                    </button>
                    <RiDeleteBin5Fill className="text-white" />
                  </div>
                </div>
                <div
                  className={`${loading?.coverURL ? "" : ""}relative w-full h-44 border-2 border-dashed border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] hover:border-[#a53860] rounded-2xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden group/box shadow-sm`}
                >
                  <input
                    id="cover-upload"
                    type="file"
                    accept="image/png, image/jpg, image/jpeg"
                    disabled={loading?.coverURL}
                    className={`absolute inset-0 opacity-0 cursor-pointer z-10 ${loading?.coverURL ? "cursor-not-allowed" : "cursor-pointer"}`}
                    onChange={async (e) => {
                      await handleFileChangeSize(e, "coverImageFile", (url) => {
                        setCoverURL(url);
                        setEditProfile((prev) => ({ ...prev, coverURL: url }));
                        setEditQrProfile((prev) => ({ ...prev, coverURL: url }));
                      });
                      e.target.value = "";
                    }}
                  />
                  <div
                    className={`${profile?.cover?.length > 0 ? "p-1" : "p-4"} rounded-md bg-[#F1F5F9] border border-[#E2E8F0] group-hover/box:scale-110 group-hover/box:border-[#a53860]/30 group-hover/box:bg-[#E0F2FE] mb-3 transition-all duration-300`}
                  >
                    {profile?.cover?.length > 0 ? (
                      <img
                        src={coverURL}
                        alt="cover_image"
                        className="w-24 h-20 object-contain"
                      />
                    ) : (
                      <ImFilePicture className="text-2xl text-[#64748B] group-hover/box:text-[#a53860] transition-colors" />
                    )}
                  </div>
                  <p className="text-[#334155] font-bold text-sm group-hover/box:text-[#a53860] transition-colors">
                    اضغط لرفع صورة الغلاف
                  </p>
                  <p className="text-xs text-[#94A3B8] mt-1.5 font-medium">
                    JPG, PNG - يفضل مقاس أفقي
                  </p>
                  {formik.errors.coverImageFile &&
                    formik.touched.coverImageFile && (
                      <p className="text-red-500 text-sm mt-1 text-center font-bold">
                        {formik.errors.coverImageFile}
                      </p>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: PERSONAL INFO */}
        <div className="w-full bg-white rounded-3xl border border-[#E2E8F0] shadow-xl shadow-[#a53860]/5 overflow-hidden transition-all duration-300 hover:border-[#a53860]/40 hover:shadow-[#a53860]/10">
  <button
    type="button"
    onClick={() => toggleSection("personal")}
    className="w-full flex justify-between items-center px-6 py-5 bg-[#F8FAFC] border-b border-[#E2E8F0] hover:bg-[#F1F5F9] transition-all group"
  >
    <span className="font-extrabold text-lg text-[#1E293B] group-hover:text-[#a53860] transition-all duration-300">
      ثانياً: البيانات الأساسية
    </span>

    {openSections.personal ? (
      <HiChevronUp className="text-2xl text-[#a53860] transition-transform duration-300" />
    ) : (
      <HiChevronDown className="text-2xl text-[#64748B] group-hover:text-[#a53860] transition-transform duration-300" />
    )}
  </button>

  {openSections.personal && (
    <div className="p-6 flex flex-col gap-y-5">

      {/* اسم المنشأة */}
      <div className="w-full">
        <div className="flex items-center gap-x-5 mb-2">
          <label
            htmlFor="name"
            className="block text-sm font-bold text-[#475569] mr-1"
          >
            اسم المنشأة
          </label>

          {formik.errors.name && formik.touched.name && (
            <p className="text-red-500 text-sm text-center font-bold">
              {formik.errors.name}
            </p>
          )}
        </div>

        <input
          type="text"
          id="name"
          name="name"
          value={ name}
//           onBlur={async (e) => {
//             formik.handleBlur(e);
//  const value = e.target.value;

             
//             }}
          onChange={(e) => {
            const value = e.target.value;

            formik.setFieldValue("name", value);
            setName(value);
            setEditProfile((prev) => ({ ...prev, name: value,
              userName: value
                  .toLocaleLowerCase()
                  .trim()
                  .replace(/\s+/g, "-"),
             }));
             setEditQrProfile((prev) => ({
                ...prev,
                name: value,
                userName: value
                  .toLocaleLowerCase()
                  .trim()
                  .replace(/\s+/g, "-"),
              }));
          }}
          className="bg-[#F8FAFC] border border-[#CBD5E1] text-[#1E293B] text-md font-medium rounded-xl focus:bg-white focus:border-[#a53860] focus:shadow-[0_0_15px_rgba(238,38,119,0.15)] block w-full px-5 py-3.5 placeholder:text-[#94A3B8] focus:outline-none transition-all duration-300"
          placeholder="اكتب اسم المنشأة هنا"
          required
        />
      </div>

      {/* نوع المنشأة */}
              <div className="w-full">
                <div className="flex items-center gap-x-5 mb-2">
                  <label
                    htmlFor="activity"
                    className="block text-sm font-bold text-[#475569] mr-1"
                  >
                    نوع المنشأة
                  </label>

                  {formik.errors.activity && formik.touched.activity && (
                    <p className="text-red-500 text-sm text-center font-bold">
                      {formik.errors.activity}
                    </p>
                  )}
                </div>

                <Select
  options={options}
  type="text"
                  id="activity"
                  name="activity"
                  value={profile?.activity || activity}
 placeholder="اكتب نوع المنشأة هنا"
                  required
  className="bg-[#F8FAFC] custom-select__control border border-[#CBD5E1] text-[#1E293B] text-md font-medium rounded-xl focus:bg-white focus:border-[#a53860] focus:shadow-[0_0_15px_rgba(238,38,119,0.15)] block w-full px-5 py-3.5 placeholder:text-[#94A3B8] focus:outline-none transition-all duration-300"
  classNamePrefix="custom-select"
  onChange={(selectedOption) => {

                    formik.setFieldValue("activity", selectedOption);
                    setActivity(selectedOption);
                    setProfile((prev) => ({
                      ...prev,
                      activity: selectedOption,                      
                    }));
                    setQrProfile((prev) => ({
                      ...prev,
                      activity: selectedOption,                      
                    }));
                  }}
/>

                
              </div>

      {/* البريد الإلكتروني */}
      <div className="w-full">
        <div className="flex items-center gap-x-5 mb-2">
          <label
            htmlFor="email"
            className="block text-sm font-bold text-[#475569] mr-1"
          >
            البريد الإلكتروني
          </label>

          {formik.errors.email && formik.touched.email && (
            <p className="text-red-500 text-sm text-center font-bold">
              {formik.errors.email}
            </p>
          )}
        </div>

        <input
          type="email"
          id="email"
          name="email"
          value={ email}
          onBlur={formik.handleBlur}
          onChange={(e) => {
            const value = e.target.value;

            formik.setFieldValue("email", value);
            setEmail(value);
            setEditProfile((prev) => ({ ...prev, email: value }));
            setEditQrProfile((prev) => ({ ...prev, email: value }));
          }}
          className="bg-[#F8FAFC] border border-[#CBD5E1] text-[#1E293B] text-md font-medium rounded-xl focus:bg-white focus:border-[#a53860] focus:shadow-[0_0_15px_rgba(238,38,119,0.15)] block w-full px-5 py-3.5 placeholder:text-[#94A3B8] focus:outline-none transition-all duration-300"
          placeholder="example@email.com"
        />
      </div>

      {/* العنوان */}
      <div className="w-full">
        <div className="flex items-center gap-x-5 mb-2">
          <label
            htmlFor="address"
            className="block text-sm font-bold text-[#475569] mr-1"
          >
            العنوان
          </label>

          {formik.errors.address && formik.touched.address && (
            <p className="text-red-500 text-sm text-center font-bold">
              {formik.errors.address}
            </p>
          )}
        </div>

        <input
          type="text"
          id="address"
          name="address"
          value={ address}
          onBlur={formik.handleBlur}
          onChange={(e) => {
            const value = e.target.value;

            formik.setFieldValue("address", value);
            setAddress(value);
            setEditProfile((prev) => ({ ...prev, address: value }));
            setEditQrProfile((prev) => ({ ...prev, address: value }));
          }}
          className="bg-[#F8FAFC] border border-[#CBD5E1] text-[#1E293B] text-md font-medium rounded-xl focus:bg-white focus:border-[#a53860] focus:shadow-[0_0_15px_rgba(238,38,119,0.15)] block w-full px-5 py-3.5 placeholder:text-[#94A3B8] focus:outline-none transition-all duration-300"
          placeholder="اكتب موقع المنشأة هنا"
        />
      </div>

      {/* رقم الهاتف */}
      <div className="w-full">
        <div className="flex items-center gap-x-5 mb-2">
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-bold text-[#475569] mr-1"
          >
            رقم الهاتف
          </label>

          {formik.errors.phoneNumber && formik.touched.phoneNumber && (
            <p className="text-red-500 text-sm text-center font-bold">
              {formik.errors.phoneNumber}
            </p>
          )}
        </div>

        <input
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          value={phoneNumber}
          onBlur={async (e) => {
            formik.handleBlur(e);

            if (!formik.errors.phoneNumber) {
              const value = e.target.value;

              if (!formik.errors.whatsappNumber) {
                let cleanNumber = value
                  .replace(/\s+/g, "")
                  .replace("+", "");

                if (cleanNumber.startsWith("01")) {
                  cleanNumber = "20" + cleanNumber.substring(1);
                } else if (cleanNumber.startsWith("1")) {
                  cleanNumber = "20" + cleanNumber;
                }

                const generatedWhatsAppURL = `https://wa.me/${cleanNumber}`;

                setWhatsappNumber(value);
                setWhatsappURL(generatedWhatsAppURL);

                setEditQrProfile((prev) => ({
                  ...prev,
                  phoneNumber: value,
                  whatsappNumber: value,
                  whatsappURL: generatedWhatsAppURL,
                }));
              }

              setEditQrProfile((prev) => ({
                ...prev,
                phoneNumber: value,
              }));
            } else {
              setEditQrProfile((prev) => ({
                ...prev,
                phoneNumber: "",
              }));
            }
          }}
          onChange={(e) => {
            const value = e.target.value;

            formik.setFieldValue("phoneNumber", value);
            setPhoneNumber(value);
            setEditProfile((prev) => ({
              ...prev,
              phoneNumber: value,
            }));
          }}
          className="bg-[#F8FAFC] border border-[#CBD5E1] text-[#1E293B] text-md font-medium rounded-xl focus:bg-white focus:border-[#a53860] focus:shadow-[0_0_15px_rgba(238,38,119,0.15)] block w-full px-5 py-3.5 placeholder:text-[#94A3B8] focus:outline-none transition-all duration-300"
          placeholder="اكتب رقم هاتفك هنا"
        />
      </div>

      {/* نبذة عنك */}
      <div className="w-full">
        <div className="flex items-center gap-x-5 mb-2">
          <label
            htmlFor="bio"
            className="block text-sm font-bold text-[#475569] mr-1"
          >
            نبذة عنك
          </label>

          {formik.errors.bio && formik.touched.bio && (
            <p className="text-red-500 text-sm text-center font-bold">
              {formik.errors.bio}
            </p>
          )}
        </div>

        <textarea
          id="bio"
          name="bio"
          value={ bio}
          onBlur={async (e) => {
            formik.handleBlur(e);

            if (!formik.errors.bio) {
              const value = e.target.value;

              setEditQrProfile((prev) => ({
                ...prev,
                bio: value,
              }));
            } else {
              setEditQrProfile((prev) => ({
                ...prev,
                bio: "",
              }));
            }
          }}
          onChange={(e) => {
            const value = e.target.value;

            formik.setFieldValue("bio", value);
            setBio(value);
            setEditProfile((prev) => ({
              ...prev,
              bio: value,
            }));
          }}
          rows={3}
          className="bg-[#F8FAFC] border border-[#CBD5E1] text-[#1E293B] text-md font-medium rounded-xl focus:bg-white focus:border-[#a53860] focus:shadow-[0_0_15px_rgba(238,38,119,0.15)] block w-full px-5 py-3.5 placeholder:text-[#94A3B8] focus:outline-none transition-all duration-300 resize-none"
          placeholder="اكتب نبذة قصيرة عنك..."
        />
      </div>

      {/* قائمة الطعام */}
      <div className="w-full">
  <div className="flex items-center gap-x-5 mb-2">
    <label
      htmlFor="menu"
      className="block text-sm font-bold text-[#475569] mr-1"
    >
      قائمة الطعام
    </label>

    {formik.errors.menu && formik.touched.menu && (
      <p className="text-red-500 text-sm text-center font-bold">
        {formik.errors.menu}
      </p>
    )}
  </div>

  <label
    htmlFor="menu"
    className="group flex items-center gap-x-2 w-full px-5 py-3.5 
    bg-[#F8FAFC] border-2 border-dashed border-[#CBD5E1] rounded-2xl 
    cursor-pointer transition-all duration-300
    hover:border-[#a53860] "
  >
    <div
      className=" flex  rounded-2xl
      bg-[#a53860]/10 text-[#a53860] mb-3
      group-hover:bg-[#a53860] group-hover:text-white
      transition-all duration-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 16V4m0 0L8 8m4-4l4 4M5 16.5v1A2.5 2.5 0 007.5 20h9a2.5 2.5 0 002.5-2.5v-1"
        />
      </svg>
    </div>

    {/* Text */}
    <p className="text-sm font-bold text-[#1E293B] group-hover:text-[#a53860] transition-colors">
      اضغط لرفع قائمة الطعام
    </p>

    {/* <p className="text-xs text-[#94A3B8] mt-2">
      PDF, JPG, JPEG أو PNG — بحد أقصى 5 ميجابايت
    </p> */}

    <input
      type="file"
      id="menu"
      name="menu"
      accept=".pdf,.jpg,.jpeg,.png"
      className="hidden"
      onChange={(e) => {
  const file = e.currentTarget.files?.[0];

  if (!file) return;

  formik.setFieldValue("menu", file);

  const previewUrl = URL.createObjectURL(file);
  setMenuPreviewUrl(previewUrl);

  setEditProfile((prev) => ({
    ...prev,
    menu: previewUrl,
  }));
  setEditQrProfile((prev) => ({
    ...prev,
    menu: previewUrl,
  }));
}}
      onBlur={formik.handleBlur}
    />
  </label>

  {formik.values.menu && (
  <div className="flex items-center justify-between mt-3 px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">

    <div className="flex items-center gap-3 min-w-0">
      <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-lg bg-[#a53860]/10 text-[#a53860]">
        📄
      </div>

      <p className="text-sm font-semibold text-[#334155] truncate">
        {formik.values.menu.name}
      </p>
    </div>

    <div className="flex items-center gap-4 flex-shrink-0">

      {/* Remove */}
      <button
        type="button"
        onClick={() => {
          if (menuPreviewUrl) {
            URL.revokeObjectURL(menuPreviewUrl);
          }

          setMenuPreviewUrl("");
          formik.setFieldValue("menu", null);
          setEditProfile((prev) => ({
            ...prev,
            menu: null,
          }));
        }}
        className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
      >
        إزالة
      </button>

    </div>
  </div>
)}
</div>

    </div>
  )}
</div>

        {/* SECTION 3: SOCIAL MEDIA */}
        <div className="w-full bg-white rounded-3xl border border-[#E2E8F0] shadow-xl shadow-[#a53860]/5 overflow-hidden transition-all duration-300 hover:border-[#a53860]/40 hover:shadow-[#a53860]/10">
          <button
            type="button"
            onClick={() => toggleSection("social")}
            className="w-full flex justify-between items-center px-6 py-5 bg-[#F8FAFC] border-b border-[#E2E8F0] hover:bg-[#F1F5F9] transition-all group"
          >
            <span className="font-extrabold text-lg text-[#1E293B] group-hover:text-[#a53860] transition-all duration-300">
              ثالثاً: حسابات التواصل الاجتماعي
            </span>
            {openSections.social ? (
              <HiChevronUp className="text-2xl text-[#a53860] transition-transform duration-300" />
            ) : (
              <HiChevronDown className="text-2xl text-[#64748B] group-hover:text-[#a53860] transition-transform duration-300" />
            )}
          </button>

          {openSections.social && (
            <div className="p-6 flex flex-col gap-y-5">
              <div className="w-full">
                <div className="flex items-center gap-x-5 mb-2">
                  <label
                    htmlFor="facebook"
                    className="block text-sm font-bold text-[#475569] mr-1"
                  >
                    صفحة فيسبوك
                  </label>
                  {formik.errors.facebookURL && formik.touched.facebookURL && (
                    <p className="text-red-500 text-sm text-center font-bold">
                      {formik.errors.facebookURL}
                    </p>
                  )}
                </div>
                <input
                  type="url"
                  id="facebookURL"
                  name="facebookURL"
                  value={ facebookURL}
                  onBlur={async (e) => {
                    formik.handleBlur(e);
                    if (!formik.errors.facebookURL) {
                      const value = e.target.value;
                      setEditQrProfile((prev) => ({ ...prev, facebookURL: value }));
                    } else {
                      setEditQrProfile((prev) => ({ ...prev, facebookURL: "" }));
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    formik.setFieldValue("facebookURL", value);
                    setFacebookURL(value);
                    setEditProfile((prev) => ({ ...prev, facebookURL: value }));
                  }}
                  className="bg-[#F8FAFC] border border-[#CBD5E1] text-[#1E293B] text-md font-medium rounded-xl focus:bg-white focus:border-[#a53860] focus:shadow-[0_0_15px_rgba(238, 38, 119, 0.15)] block w-full px-5 py-3.5 placeholder:text-[#94A3B8] focus:outline-none transition-all duration-300"
                  placeholder="https://facebook.com/username"
                />
              </div>

              <div className="w-full">
                <div className="flex items-center gap-x-5 mb-2">
                  <label
                    htmlFor="instagram"
                    className="block text-sm font-bold text-[#475569] mr-1"
                  >
                    صفحة انستجرام
                  </label>
                  {formik.errors.instagramURL &&
                    formik.touched.instagramURL && (
                      <p className="text-red-500 text-sm text-center font-bold">
                        {formik.errors.instagramURL}
                      </p>
                    )}
                </div>
                <input
                  type="url"
                  id="instagramURL"
                  name="instagramURL"
                  value={instagramURL}
                  onBlur={async (e) => {
                    formik.handleBlur(e);
                    if (!formik.errors.instagramURL) {
                      const value = e.target.value;
                      setEditQrProfile((prev) => ({
                        ...prev,
                        instagramURL: value,
                      }));
                    } else {
                      setEditQrProfile((prev) => ({
                        ...prev,
                        instagramURL: "",
                      }));
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    formik.setFieldValue("instagramURL", value);
                    setInstagramURL(value);
                    setEditProfile((prev) => ({ ...prev, instagramURL: value }));
                  }}
                  className="bg-[#F8FAFC] border border-[#CBD5E1] text-[#1E293B] text-md font-medium rounded-xl focus:bg-white focus:border-[#a53860] focus:shadow-[0_0_15px_rgba(238, 38, 119, 0.15)] block w-full px-5 py-3.5 placeholder:text-[#94A3B8] focus:outline-none transition-all duration-300"
                  placeholder="https://instagram.com/username"
                />
              </div>

              <div className="w-full">
                <div className="flex items-center gap-x-5 mb-2">
                  <label
                    htmlFor="tiktok"
                    className="block text-sm font-bold text-[#475569] mr-1"
                  >
                    صفحة تيك توك
                  </label>
                  {formik.errors.tiktokURL && formik.touched.tiktokURL && (
                    <p className="text-red-500 text-sm text-center font-bold">
                      {formik.errors.tiktokURL}
                    </p>
                  )}
                </div>
                <input
                  type="url"
                  id="tiktokURL"
                  name="tiktokURL"
                  value={tiktokURL}
                  onBlur={async (e) => {
                    formik.handleBlur(e);
                    if (!formik.errors.tiktokURL) {
                      const value = e.target.value;
                      setEditQrProfile((prev) => ({ ...prev, tiktokURL: value }));
                    } else {
                      setEditQrProfile((prev) => ({ ...prev, tiktokURL: "" }));
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    formik.setFieldValue("tiktokURL", value);
                    setTiktokURL(value);
                    setEditProfile((prev) => ({ ...prev, tiktokURL: value }));
                  }}
                  className="bg-[#F8FAFC] border border-[#CBD5E1] text-[#1E293B] text-md font-medium rounded-xl focus:bg-white focus:border-[#a53860] focus:shadow-[0_0_15px_rgba(238, 38, 119, 0.15)] block w-full px-5 py-3.5 placeholder:text-[#94A3B8] focus:outline-none transition-all duration-300"
                  placeholder="https://tiktok.com/@username"
                />
              </div>

              <div className="w-full">
                <div className="flex items-center gap-x-5 mb-2">
                  <label
                    htmlFor="whatsapp"
                    className="block text-sm font-bold text-[#475569] mr-1"
                  >
                    تواصل عبر واتساب
                  </label>
                  {formik.errors.whatsappURL && formik.touched.whatsappURL && (
                    <p className="text-red-500 text-sm text-center font-bold">
                      {formik.errors.whatsappURL}
                    </p>
                  )}
                </div>
                <input
                  type="text"
                  id="whatappNumber"
                  name="whatappNumber"
                  value={ whatsappNumber}
                  onBlur={(e) => {
                    formik.handleBlur(e);
                    if (!formik.errors.whatsappNumber) {
                      const value = e.target.value;
                      let cleanNumber = value
                        .replace(/\s+/g, "")
                        .replace("+", "");
                      if (cleanNumber.startsWith("01")) {
                        cleanNumber = "20" + cleanNumber.substring(1);
                      } else if (cleanNumber.startsWith("1")) {
                        cleanNumber = "20" + cleanNumber;
                      }
                      const generatedWhatsAppURL = `https://wa.me/${cleanNumber}`;
                      setEditQrProfile((prev) => ({
                        ...prev,
                        whatsappNumber: value,
                        whatsappURL: generatedWhatsAppURL,
                      }));
                    } else {
                      setEditQrProfile((prev) => ({
                        ...prev,
                        whatsappNumber: "",
                        whatsappURL: "",
                      }));
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    setWhatsappNumber(value);

                    let cleanNumber = value
                      .replace(/\s+/g, "")
                      .replace("+", "");
                    if (cleanNumber.startsWith("01")) {
                      cleanNumber = "20" + cleanNumber.substring(1);
                    } else if (cleanNumber.startsWith("1")) {
                      cleanNumber = "20" + cleanNumber;
                    }

                    const generatedWhatsAppURL = `https://wa.me/${cleanNumber}`;
                    setWhatsappURL(generatedWhatsAppURL);

                    setEditProfile((prev) => ({
                      ...prev,
                      whatsappURL: generatedWhatsAppURL,
                      whatsappNumber: value,
                    }));
                  }}
                  className="bg-[#F8FAFC] border border-[#CBD5E1] text-[#1E293B] text-md font-medium rounded-xl focus:bg-white focus:border-[#a53860] focus:shadow-[0_0_15px_rgba(238, 38, 119, 0.15)] block w-full px-5 py-3.5 placeholder:text-[#94A3B8] focus:outline-none transition-all duration-300 text-right"
                  placeholder="201234567890"
                />
              </div>
            </div>
          )}
        </div>

        <div className="w-full flex justify-between items-center px-5 pb-5">
                  
                  <div
                    onClick={() => submitProfilePage(formik.values)}
                    className={`w-[60%] lg:w-[25%] flex justify-center items-center gap-x-3 ${profile?.name?.length === 0 ? 'bg-[#fa518f]/75 cursor-not-allowed'  :'bg-[#fa518f] hover:bg-[#fa518f]/75'} bg-[length:200%_auto] hover:bg-right transition-all duration-500 px-4 py-3 text-white rounded-xl shadow-lg shadow-[#4c956c]/20 font-bold tracking-wide active:scale-95`}
                  >
                    <button
                    className={`${profile?.name?.length === 0 ? 'cursor-not-allowed'  :'cursor-pointer'}`}
                    >{loadingProfile ? <span className="loader"></span> : 'حفظ التعديلات'} </button>
                    <FaLongArrowAltLeft />
                  </div>
                  <div
                    onClick={async () => await handleCancel()}
                    className="w-[35%] lg:w-[20%] flex justify-center items-center gap-x-3 bg-gray-600 hover:bg-gray-600/75 bg-[length:200%_auto] hover:bg-right transition-all duration-500 px-4 py-3 text-white rounded-xl shadow-lg shadow-[#4c956c]/20 font-bold tracking-wide active:scale-95"
                  >
                    <button>الغاء</button>
                    <IoClose  />
                  </div>
                </div>
      </form>
    </div>
  );
}