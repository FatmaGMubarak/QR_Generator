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
import { HomeIcon, Mail, Phone, ExternalLink, MenuSquare } from "lucide-react";


export default function Profile() {
  const [profileNoToken, setProfileNoToken] = useState(null);
  const [fbLoading, setFbLoading] = useState(false);
  const token = useSelector((state) => state?.auth?.token);
  const authInitialized = useSelector((state) => state?.auth?.initialized);
  const profile = useSelector((state) => state?.profile?.profile);
  const backendLoading = useSelector((state) => state?.profile?.loading);
  const { slug } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!slug) return;

    dispatch(fetchProfileById(slug))
      .unwrap()
      .catch((err) => {
        console.warn("Backend fetch failed, falling back to Firebase:", err);
      });

  }, [dispatch, slug]);

  const loading = token ? backendLoading : fbLoading;

  const displayName = profile?.name ?? profileNoToken?.name;
  const displayCover = profile?.cover ?? profileNoToken?.coverURL;
  const displayLogo = profile?.logo ?? profileNoToken?.logoURL;
  const displayAbout = profile?.about_us ?? profileNoToken?.bio;
  const displayEmail = profile?.email ?? profileNoToken?.email;
  const displayAddress = profile?.address ?? profileNoToken?.address;
  const displayPhone = profile?.phone ?? profileNoToken?.phoneNumber;
  const displayMenu = profile?.menu ?? profileNoToken?.menu;
  const displayFacebook = profile?.facebook ?? profileNoToken?.facebookURL;
  const displayInstagram = profile?.instagram ?? profileNoToken?.instagramURL;
  const displayTiktok = profile?.tiktok ?? profileNoToken?.tiktokURL;
  const displayWhatsapp = profile?.whatsapp ?? profileNoToken?.whatsappURL;

  const socialLinks = [
    displayFacebook && {
      key: "facebook",
      href: displayFacebook,
      label: "فيسبوك",
      icon: FaFacebook,
      className: "bg-[#1877F2] text-white hover:bg-[#1466d6]",
    },
    displayInstagram && {
      key: "instagram",
      href: displayInstagram,
      label: "انستجرام",
      icon: BiLogoInstagramAlt,
      className:
        "bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white hover:opacity-90",
    },
    displayTiktok && {
      key: "tiktok",
      href: displayTiktok,
      label: "تيك توك",
      icon: SiTiktok,
      className:
        "bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] text-white hover:opacity-90",
    },
    displayWhatsapp && {
      key: "whatsapp",
      href: displayWhatsapp,
      label: "واتساب",
      icon: IoLogoWhatsapp,
      className: "bg-[#25D366] text-white hover:bg-[#1fb958]",
    },
  ].filter(Boolean);

  const contactRows = [
    displayEmail && {
      key: "email",
      icon: Mail,
      href: `mailto:${displayEmail}`,
      text: displayEmail,
    },
    displayPhone && {
      key: "phone",
      icon: Phone,
      href: `tel:${displayPhone}`,
      text: displayPhone,
    },
    displayAddress && {
      key: "address",
      icon: HomeIcon,
      href: null,
      text: displayAddress,
    },
  ].filter(Boolean);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#ffafcc] via-[#ff8fa3] to-[#4c956c] px-4 py-10 sm:p-8 flex justify-center items-center overflow-hidden">
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
        dir="rtl"
        className={`w-full max-w-2xl bg-white/90 backdrop-blur-xl rounded-[28px] shadow-2xl shadow-black/10 border border-white/60 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          !loading
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-75 translate-y-8 pointer-events-none absolute"
        }`}
      >
        <div className="relative w-full h-56 sm:h-64">
          {displayCover ? (
            <img
              src={displayCover}
              alt="Cover"
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f1f5f4] to-[#e6ece8]">
              <MdImageNotSupported className="text-6xl text-gray-300" />
            </div>
          )}

          {/* <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/95 to-transparent" /> */}

          <div
            className={`absolute left-1/2 -bottom-14 -translate-x-1/2 w-32 h-32 rounded-full bg-white p-1.5 shadow-xl transition-all duration-700 delay-150 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              !loading ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
          >
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-[#f1f5f4] ring-4 ring-[#4c956c]/15">
              {displayLogo ? (
                <img
                  src={displayLogo}
                  alt="logo"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <FaUserLarge className="text-5xl text-gray-300" />
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="pt-20 pb-8 px-6 sm:px-10 flex flex-col items-center">
          <h1
            className={`text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-[#880d1e] to-[#2f6647] bg-clip-text text-transparent text-center tracking-tight drop-shadow-sm transition-all duration-700 delay-300 ease-out ${
              !loading ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {displayName}
          </h1>

          {displayAbout && (
            <p
              className={`mt-2 font-medium text-[15px] text-center text-[#64748B] max-w-md leading-relaxed transition-all duration-700 delay-[400ms] ease-out ${
                !loading ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {displayAbout}
            </p>
          )}

          {contactRows.length > 0 && (
            <div
              className={`mt-5 w-full flex flex-col items-stretch gap-2 max-w-sm transition-all duration-700 delay-[450ms] ease-out ${
                !loading ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {contactRows.map(({ key, icon: Icon, href, text }) => {
                const content = (
                  <div className=" flex items-center gap-x-3 w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-gray-300">
                    <span className="flex items-center border border-gray-200 justify-center w-8 h-8 rounded-lg bg-gray-100 text-[#397a55] shadow-2xl shrink-0">
                      <Icon className="text-base" />
                    </span>
                    <span
                      dir="ltr"
                      className="font-medium text-sm text-[#475569] truncate text-right w-full"
                    >
                      {text}
                    </span>
                  </div>
                );

                return href ? (
                  <a
                    key={key}
                    href={href}
                    className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md rounded-xl"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={key}>{content}</div>
                );
              })}
            </div>
          )}

          {/* {displayMenu && (
            <a
              href={displayMenu}
              className={`mt-5 w-full max-w-sm flex items-center justify-center gap-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#a53860] to-[#880d1e] text-white font-bold text-sm shadow-lg shadow-[#a53860]/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
                !loading ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <MenuSquare className="text-lg" />
              عرض المنيو
              <MdKeyboardDoubleArrowLeft className="text-xl" />
            </a>
          )} */}

          {socialLinks.length > 0 && (
            <div
              className={`mt-6 w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 transition-all duration-700 delay-[500ms] ease-out ${
                !loading ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {socialLinks.map(({ key, href, label, icon: Icon, className }) => (
                <a
                  key={key}
                  href={href}
                  className={`flex gap-x-1 items-center justify-center gap-y-1.5 px-3 py-3.5 rounded-xl font-bold text-xs shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] active:scale-95 ${className}`}
                >
                  <Icon className="text-xl" />
                  <span className="flex items-center gap-x-1">
                    {label}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}