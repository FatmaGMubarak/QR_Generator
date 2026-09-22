import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import cover from "../assets/pietro-de-grandi-T7K4aEPoGGk-unsplash.jpg";
import avatar from "../assets/avatar.png";
import { FaFacebook } from "react-icons/fa";
import { BiLogoInstagramAlt } from "react-icons/bi";
import { SiTiktok } from "react-icons/si";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { FaUserLarge } from "react-icons/fa6";
import { getDoc, doc, query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import whatappLogo from '../assets/whatappLogo.png'
import facebookLogo from '../assets/facebookLogo.png'
import instagramLogo from '../assets/instagramLogo.png'
import tiktokLogo from '../assets/tik-tokLogo.png'
import { FaPhone } from "react-icons/fa";
import { MdImageNotSupported } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {fetchProfileById} from '../store/reducers/profileSlice.js'
import { HomeIcon, Mail, Phone } from "lucide-react";


export default function Profile() {
 const [profileNoToken, setProfileNoToken] = useState(null);
const [fbLoading, setFbLoading] = useState(false);
const token = useSelector((state) => state?.auth?.token);
const authInitialized = useSelector((state) => state?.auth?.initialized); 
const profile = useSelector((state) => state?.profile?.profile);
const backendLoading = useSelector((state) => state?.profile?.loading);
const { slug } = useParams();
const dispatch = useDispatch();

  // useEffect(()=>{
  //   dispatch(fetchProfileById(slug))

  // }, [dispatch, slug])

  // useEffect(() => {
  //   const getProfile = async () => {
  //     if (!userName) return;

  //     try {
  //       const q = query(
  //         collection(db, "profiles"),
  //         where("userName", "==", userName)
  //       );

  //       const querySnapshot = await getDocs(q);

  //       if (!querySnapshot.empty) {
  //         const profile = querySnapshot.docs[0].data();
  //         setProfile(profile);
  //       } else {
  //         console.log("No such profile");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching profile:", error);
  //     } finally {

  //       setTimeout(() => setIsLoaded(true), 150);
  //     }
  //   };

  //   getProfile();
  // }, [userName]);

useEffect(() => {
  if (!slug) return;


    dispatch(fetchProfileById(slug))
      .unwrap()
      .catch((err) => {
        console.warn("Backend fetch failed, falling back to Firebase:", err);
      });
  
}, [dispatch, slug]);
// useEffect(() => {
//   if (!slug) return;

//   const getFromFirebase = async () => {
//     setFbLoading(true);
//     try {
//       const q = query(
//         collection(db, "profiles"),
//         where("userName", "==", slug)
//       );
//       const querySnapshot = await getDocs(q);

//       if (!querySnapshot.empty) {
//         setProfileNoToken(querySnapshot.docs[0].data());
//       } else {
//         console.log("No such profile in Firebase either");
//       }
//     } catch (error) {
//       console.error("Error fetching profile from Firebase:", error);
//     } finally {
//       setFbLoading(false);
//     }
//   };

//   if (token) {
//     dispatch(fetchProfileById(slug))
//       .unwrap()
//       .catch((err) => {
//         // backend has no record for this slug (404) — fall back to Firebase
//         console.warn("Backend fetch failed, falling back to Firebase:", err);
//         getFromFirebase();
//       });
//   } else {
//     getFromFirebase();
//   }
// }, [dispatch, slug, token]);

const loading = token ? backendLoading : fbLoading;


  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-[#ffafcc] via-[#ff8fa3] to-[#4c956c] p-6 flex flex-col lg:flex-row gap-6 justify-center items-center overflow-hidden">
      <style>{`
        @keyframes splash-ring {
          0% { transform: scale(0.4); opacity: 0.55; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>

      {loading && (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-white/70 animate-[splash-ring_1.1s_ease-out_infinite]" />
          <span className="relative w-8 h-8 rounded-full bg-white shadow-md" />
        </div>
      )}

      <div
        className={`w-full lg:w-3/4 h-1/4 flex flex-col justify-center items-center bg-white/70 backdrop-blur-md rounded-xl shadow-xl shadow-sky-900/5 border border-white/80 overflow-hidden p-0.5 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          !loading
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-75 translate-y-8 pointer-events-none absolute"
        }`}
      >
        <div className="w-full relative h-[21rem] rounded-xl mb-[2.5rem] flex justify-center items-center">
          {(profile?.cover ?? profileNoToken?.coverURL) ? (<img
            src={profile?.cover ?? profileNoToken?.coverURL }
            alt="Cover"
            className="w-full h-full absolute inset-0 object-cover object-center"
          />) : (<MdImageNotSupported className="text-7xl text-gray-400"/>
          )}
          <div
            className={`absolute w-32 h-32 rounded-full bg-white left-1/2 bottom-0 -translate-x-1/2 translate-y-1/4 overflow-hidden flex justify-center items-center transition-all duration-700 delay-150 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              !loading ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
          >
            {(profile?.logo ?? profileNoToken?.logoURL) ? (
              <img
                src={profile?.logo ?? profileNoToken?.logoURL}
                alt="logo"
                className="object-cover object-center"
              />
            ) : (
              <FaUserLarge className="text-6xl text-gray-400" />
            )}
          </div>
        </div>

        <h1
          className={`text-3xl font-bold bg-gradient-to-r from-[#880d1e] to-[#2f6647] bg-clip-text text-transparent text-center tracking-wide drop-shadow-sm transition-all duration-700 delay-300 ease-out ${
            !loading ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {profile?.name ?? profileNoToken?.name}
        </h1>
        <p
          className={`font-medium text-base text-center text-[#64748B] max-w-md mx-auto leading-relaxed transition-all duration-700 delay-[400ms] ease-out ${
            !loading ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {profile?.about_us ?? profileNoToken?.bio}{" "}
        </p>
        {(profile?.email ?? profileNoToken?.email) && (
                      <div
  dir="rtl"
  className="flex items-center justify-center gap-x-2 my-1 max-w-md mx-auto leading-relaxed"
>
  
  <p
    dir="ltr"
    className="font-medium text-base text-center text-[#64748B]"
  >
   <a href= {`mailto:${profile?.email ?? profileNoToken?.email}`}
   className="font-medium text-base  text-center text-[#64748B] hover:text-[#a53860] transition-colors">{profile?.email}</a>
  </p>
  <Mail className="text-[#64748B]"/>
</div>
                    )}
                    {(profile?.address ?? profileNoToken?.address) && (
                      <div
  dir="rtl"
  className="flex items-center justify-center gap-x-2 my-1 max-w-md mx-auto leading-relaxed"
>
  
  <p
    dir="ltr"
    className="font-medium text-base text-center text-[#64748B]"
  >
    {profile?.address ?? profileNoToken?.address}
  </p>
  <HomeIcon  className="text-[#64748B]"/>
</div>
                    )}
{(profile?.phone ?? profileNoToken?.phoneNumber) && (
                      <div
  dir="rtl"
  className="flex items-center justify-center gap-x-2 my-1 max-w-md mx-auto leading-relaxed"
>
  
  <a
    dir="ltr"
    href={`tel:${profile?.phone ?? profileNoToken?.phoneNumber}`}
    className="font-medium text-base  text-center text-[#64748B] hover:text-[#a53860] transition-colors"
  >
    {profile?.phone ?? profileNoToken?.phoneNumber}
  </a>
  <Phone className="text-[#64748B]"/>
</div>
                    )}
        <div
          className={`w-[85%] grid grid-cols-1 px-3 pb-4 gap-y-5 lg:gap-y-2 transition-all duration-700 delay-[500ms] ease-out ${
            !loading ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {(profile?.menu ?? profileNoToken?.menu) && (
                                  <div className=" flex gap-x-1 justify-center items-center text-red-900  transition-transform hover:-translate-y-1 hover:scale-105 ease-in-out px-3 py-1.5 rounded-lg">
                                    
                                    {/* <img src={facebookLogo} alt="" className="w-9 h-9"/> */}
                                    <div className="flex justify-center items-center lg:gap-x-1">
                                      <a
                                        href={profile?.menu ?? profileNoToken?.menu}
                                        className="font-bold lg:text-sm transition-all "
                                      >
                                       عرض القائمة
                                      </a>
                                      <MdKeyboardDoubleArrowLeft className="text-2xl font-bold" />
                                    </div>
                                  </div>
                                )}
          {(profile?.facebook ?? profileNoToken?.facebookURL) && (
            <div className=" bg-[#1877F2] flex gap-x-1 justify-center items-center text-white  transition-transform hover:-translate-y-1 hover:scale-105 ease-in-out px-3 py-1.5 rounded-lg">
              <FaFacebook className="text-xl" />
              {/* <img src={facebookLogo} alt="" className="w-9 h-9"/> */}
              <div className="flex justify-center items-center lg:gap-x-1">
                <a
                  href={profile?.facebook ?? profileNoToken?.facebookURL}
                  className="font-bold lg:text-sm transition-all "
                >
                  الذهاب الى صفحة فيسبوك
                </a>
                <MdKeyboardDoubleArrowLeft className="text-2xl font-bold" />
              </div>
            </div>
          )}
          {(profile?.instagram ?? profileNoToken?.instagramURL) && (
            <div className="bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white font-bold shadow-lg hover:opacity-90 transition-opacity flex  gap-x-1 justify-center items-center hover:-translate-y-1 hover:scale-105 ease-in-out px-3 py-1.5 rounded-lg">
              <BiLogoInstagramAlt className="text-xl text-white" />
              {/* <img src={instagramLogo} alt="" className="w-9 h-9"/> */}
              <div className="flex items-center justify-center">
                <a
                  href={profile?.instagram ?? profileNoToken?.instagramURL}
                  className="font-bold lg:text-sm  transition-all "
                >
                  الذهاب الى صفحة انستجرام
                </a>
                <MdKeyboardDoubleArrowLeft className="text-2xl font-bold" />
              </div>
            </div>
          )}
          {(profile?.tiktok ?? profileNoToken?.tiktokURL) && (
            <div className="bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] text-white font-bold py-1.5 px-3 rounded-lg shadow-lg hover:opacity-90 flex  gap-x-1 justify-center items-center  transition-transform hover:-translate-y-1 hover:scale-105 ease-in-out">
              <img src={tiktokLogo} alt="" className="w-5 h-5" />
              <div className="flex items-center gap-x-1">
                <a
                  href={profile?.tiktok ?? profileNoToken?.tiktokURL}
                  className="font-bold lg:text-sm  transition-all "
                >
                  الذهاب الى صفحة تيك توك
                </a>
                <MdKeyboardDoubleArrowLeft className="text-2xl font-bold" />
              </div>
            </div>
          )}
          {(profile?.whatsapp ?? profileNoToken?.whatsappURL) && (
            <div className="bg-[#25D366] flex  gap-x-1 justify-center items-center text-white  transition-transform hover:-translate-y-1 hover:scale-105 ease-in-out px-3 py-1.5 rounded-lg">
              <IoLogoWhatsapp className="text-xl" />
              {/* <img src={whatappLogo} alt="" className="w-9 h-9"/> */}
              <div className="flex items-center gap-x-1">
                <a
                  href={profile?.whatsapp ?? profileNoToken?.whatsappURL}
                  className="font-bold lg:text-sm  transition-all "
                >
                  الذهاب الى صفحة واتساب
                </a>
                <MdKeyboardDoubleArrowLeft className="text-2xl font-bold" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}