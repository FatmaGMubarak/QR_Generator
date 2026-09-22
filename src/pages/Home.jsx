import React, { useEffect, useState } from "react";
import UserInformation from "../components/forms/UserInformation";
import QrCard from "../components/common/QrCard";
import { FaDownload } from "react-icons/fa";
import { useUserOptions } from "../context/UserOptionsContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { FaUserLarge } from "react-icons/fa6";
import { db } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";
import whatappLogo from '../assets/whatappLogo.png'
import facebookLogo from '../assets/facebookLogo.png'
import instagramLogo from '../assets/instagramLogo.png'
import tiktokLogo from '../assets/tik-tokLogo.png'
import { FaFacebook } from "react-icons/fa";
import { BiLogoInstagramAlt } from "react-icons/bi";
import { SiTiktok } from "react-icons/si";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaCircle } from "react-icons/fa";
import { FaWhatsappSquare } from "react-icons/fa";
import { MdImageNotSupported } from "react-icons/md";
import { FaPhone } from "react-icons/fa";

import { HomeIcon, Mail, Phone } from "lucide-react";
import { useDispatch } from "react-redux";
import { createProfile } from "../store/reducers/profileSlice";
import { Formik } from "formik";







export default function Home() {
  const { profile, qrProfile, setProfile, setQrProfile,
     setLogoURL,
    setCoverURL,
    setName,
    setBio,
    setEmail,
    setAddress,
    setMenu,
    setPhoneNumber,
    setFacebookURL,
    setInstagramURL,
    setTiktokURL,
    setWhatsappURL,
    setWhatsappNumber,
    errors,
    hasErrors,
    setHasErrors,
    setErrors,
    qrValue, setQrValue,
    resetForm,
    menuPreviewUrl
   } = useUserOptions();


  const downloadPDF = async () => {
    const element = document.getElementById("qr-code");

    const canvas = await html2canvas(element);

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();

    pdf.addImage(imgData, "PNG", 10, 10, 100, 0);

    pdf.save(
      `${qrProfile?.name ? qrProfile.name + " profile.pdf" : "profile.pdf"}`,
    );
  };

  // useEffect(() => {
  //   sessionStorage.setItem("profileCreated", JSON.stringify(profile));
  // }, [profile]);



  

  // const createProfilePage = async (profile) => {
  //   if(hasErrors || profile?.name.length === 0){
  //     return;
  //   }
  //   const doc = await addDoc(collection(db, "profiles"), profile);
  //   const url = `https://scanned-three.vercel.app/profile/${profile.userName}`;
  //   setQrValue(url);
  //   setProfile((prev)=>({
  //     ...prev,
  //     qrValue: url,
  //   }))
  // };




  return (
    <div className="w-full min-h-screen bg-gradient-to-r  from-[#ffafcc] via-[#ff8fa3] to-[#4c956c]  p-6 flex flex-col lg:flex-row gap-3 justify-between items-start mt-[20%] md:mt-[7%] lg:mt-[7%]">
      {/* Right Section */}
       <div className="w-full lg:w-[65%] bg-white/70 backdrop-blur-md rounded-3xl shadow-xl shadow-sky-900/5 border border-white/80 overflow-hidden">
              <div className="pt-12">
                  {/* Header Section */}
            <h1 className="font-black text-4xl bg-gradient-to-r from-[#880d1e]  to-[#2f6647] bg-clip-text text-transparent text-center tracking-wide drop-shadow-sm">
              أنشىء صفحتك الشخصية
            </h1>
            <p className="font-medium text-base text-center text-[#64748B] mt-3 mb-12 max-w-md mx-auto leading-relaxed">
              أدخل بياناتك لإنشاء صفحة شخصية يمكن مشاركتها عبر رمز QR الفريد الخاص
              بك{" "}
            </p>
              </div>
              <UserInformation/>
              
            </div>

      {/* Left Section: */}
      <div className="w-full lg:w-[35%] lg:top-6 flex flex-col gap-y-10">

        <div className=" flex flex-col items-center bg-white/70 backdrop-blur-md py-6 rounded-3xl border border-sky-100/80 shadow-lg shadow-sky-900/5">
        <div className="bg-white p-2 rounded-2xl shadow-xl shadow-sky-200/40 border border-slate-100 flex flex-col items-center gap-y-3 w-full max-w-[400px] transform hover:scale-[1.02] transition-transform duration-300">
          <div className="flex justify-center items-center gap-x-2 bg-[#ffe2e7]  px-4 py-1.5 rounded-full">
            <span className="text-[#93244c] text-sm font-extrabold tracking-wider ">
           معاينة مباشرة
          </span>
          <FaCircle className="text-[#93244c] animate-[pulse_3s_ease-in-out_infinite] ease-in-out"/>
          </div>

          <div className="w-full p-1 bg-gradient-to-tr from-[#ffafcc]/10 to-[#EC4899]/10 rounded-2xl border border-sky-100/50 shadow-inner">
             <div className={`w-full relative h-[21rem] rounded-xl mb-[2.5rem] flex justify-center items-center`}>
                      {profile?.coverURL ? (
                        <img
                        src={profile?.coverURL === "" ? null : profile?.coverURL}
                        alt="Cover"
                        className="w-full h-full rounded-2xl absolute inset-0 object-cover object-center"
                      />
                      ) : (<MdImageNotSupported className="text-4xl text-gray-400"/>
)}
                      <div className="absolute w-32 h-32 rounded-full bg-white left-1/2 bottom-0 -translate-x-1/2 translate-y-1/4 overflow-hidden flex justify-center items-center">
                        {profile?.logoURL ? (
                          <img
                            src={profile?.logoURL === "" ? null : profile?.logoURL}
                            alt="logo"
                            className="object-cover object-center"
                          />
                        ) : (
                          <FaUserLarge className="text-6xl text-gray-400" />
                        )}
                      </div>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[#880d1e]  to-[#2f6647] bg-clip-text text-transparent text-center tracking-wide drop-shadow-sm">
                      {profile?.name}
                    </h1>
                    <p className="font-medium text-base text-center text-[#64748B] max-w-md mx-auto leading-relaxed">
                      {profile?.bio}{" "}
                    </p>
                    {profile?.email && (
                      <div
  dir="rtl"
  className="flex items-center justify-center gap-x-2 my-3 max-w-md mx-auto leading-relaxed"
>
  
  <p
    dir="ltr"
    className="font-medium text-base text-center text-[#64748B]"
  >
    {profile?.email}
  </p>
  <Mail className="text-[#64748B]"/>
</div>
                    )}
                    {profile?.address && (
                      <div
  dir="rtl"
  className="flex items-center justify-center gap-x-2 my-3 max-w-md mx-auto leading-relaxed"
>
  
  <p
    dir="ltr"
    className="font-medium text-base text-center text-[#64748B]"
  >
    {profile?.address}
  </p>
  <HomeIcon  className="text-[#64748B]"/>
</div>
                    )}
                    {profile?.phoneNumber && (
                      <div
  dir="rtl"
  className="flex items-center justify-center gap-x-2 mb-3 max-w-md mx-auto leading-relaxed"
>
  
  <p
    dir="ltr"
    className="font-medium text-base text-center text-[#64748B]"
  >
    {profile?.phoneNumber}
  </p>
  <Phone  className="text-[#64748B]"/>
</div>
                    )}

                    {menuPreviewUrl && (
                        <div className=" flex gap-x-1 justify-center items-center text-red-900  transition-transform hover:-translate-y-1 hover:scale-105 ease-in-out px-3 py-1.5 rounded-lg">
                          
                          {/* <img src={facebookLogo} alt="" className="w-9 h-9"/> */}
                          <div className="flex justify-center items-center lg:gap-x-1">
                            <a
                              href={menuPreviewUrl}
                              className="font-bold lg:text-sm transition-all "
                            >
                             عرض القائمة
                            </a>
                            <MdKeyboardDoubleArrowLeft className="text-2xl font-bold" />
                          </div>
                        </div>
                      )}
                    <div className="grid grid-cols-1 px-3 pb-4 gap-y-5 lg:gap-y-2">
                      {profile?.facebookURL && (
                        <div className=" bg-[#1877F2] flex gap-x-1 justify-center items-center text-white  transition-transform hover:-translate-y-1 hover:scale-105 ease-in-out px-3 py-1.5 rounded-lg">
                          <FaFacebook className="text-xl"/>
                          {/* <img src={facebookLogo} alt="" className="w-9 h-9"/> */}
                          <div className="flex justify-center items-center lg:gap-x-1">
                            <a
                              href={profile?.facebookURL}
                              className="font-bold lg:text-sm transition-all "
                            >
                              الذهاب الى صفحة فيسبوك
                            </a>
                            <MdKeyboardDoubleArrowLeft className="text-2xl font-bold" />
                          </div>
                        </div>
                      )}
                      {profile?.instagramURL && (
                        <div className="bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white font-bold shadow-lg hover:opacity-90 transition-opacity flex  gap-x-1 justify-center items-center hover:-translate-y-1 hover:scale-105 ease-in-out px-3 py-1.5 rounded-lg">
                          <BiLogoInstagramAlt className="text-xl text-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5]"/>
                          {/* <img src={instagramLogo} alt="" className="w-9 h-9"/> */}
                          <div className="flex items-center justify-center">
                            <a
                              href={profile?.instagramURL}
                              className="font-bold lg:text-sm  transition-all "
                            >
                              الذهاب الى صفحة انستجرام
                            </a>
                            <MdKeyboardDoubleArrowLeft className="text-2xl font-bold" />
                          </div>
                        </div>
                      )}
                      {profile?.tiktokURL && (
                        <div className="bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] text-white font-bold py-1.5 px-3 rounded-lg shadow-lg hover:opacity-90 flex  gap-x-1 justify-center items-center  transition-transform hover:-translate-y-1 hover:scale-105 ease-in-out">
                          <img src={tiktokLogo} alt="" className="w-5 h-5"/>
                          <div className="flex items-center gap-x-1">
                            <a
                              href={profile?.tiktokURL}
                              className="font-bold lg:text-sm  transition-all "
                            >
                              الذهاب الى صفحة تيك توك
                            </a>
                            <MdKeyboardDoubleArrowLeft className="text-2xl font-bold" />
                          </div>
                        </div>
                      )}
                      {profile?.whatsappURL.slice(14) && profile?.whatsappURL.slice(14).length == 12 && (
                        <div className="bg-[#25D366] flex  gap-x-1 justify-center items-center text-white  transition-transform hover:-translate-y-1 hover:scale-105 ease-in-out px-3 py-1.5 rounded-lg">
                          
                          <IoLogoWhatsapp  className="text-xl"/>
{/* <img src={whatappLogo} alt="" className="w-9 h-9"/> */}
                          <div className="flex items-center gap-x-1">
                            <a
                              href={profile?.whatsappURL}
                              className="font-bold lg:text-sm  transition-all "
                            >
                             الذهاب الى  صفحة واتساب
                            </a>
                            <MdKeyboardDoubleArrowLeft className="text-2xl font-bold" />
                            
                          </div>
                        </div>
                      )}
                    </div>
          </div>

        </div>
      </div>

      <div className=" flex flex-col items-center bg-white/70 backdrop-blur-md px-4 py-12 rounded-3xl border border-sky-100/80 shadow-lg shadow-sky-900/5">
        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-sky-200/40 border border-slate-100 flex flex-col items-center gap-y-6 w-full max-w-[320px] transform hover:scale-[1.02] transition-transform duration-300">
          <span className="text-[#93244c] text-sm font-extrabold tracking-wider bg-[#ffe2e7] px-4 py-1.5 rounded-full">
            بطاقة التعريف الخاصة بك
          </span>

          <div className="p-4 bg-gradient-to-tr from-[#ffafcc]/10 to-[#EC4899]/10 rounded-2xl border border-sky-100/50 shadow-inner">
            <QrCard endodedData={qrValue} />
          </div>

          <button
            className="w-full flex justify-center items-center gap-x-3 bg-[#fa518f] hover:bg-[#fa518f]/75 bg-[length:200%_auto] hover:bg-right transition-all duration-500 px-6 py-4 text-white rounded-xl shadow-lg shadow-[#4c956c]/20 font-bold tracking-wide active:scale-95"
            onClick={() => downloadPDF()}
          >
            <span>تحميل بطاقة PDF</span>
            <FaDownload className="text-sm animate-bounce" />
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
