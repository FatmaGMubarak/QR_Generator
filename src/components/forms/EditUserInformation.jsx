import { useEffect, useMemo, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { HiChevronDown } from "react-icons/hi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { ImFilePicture } from "react-icons/im";
import { FiExternalLink } from "react-icons/fi";
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaPhoneAlt,
  FaLongArrowAltRight,
  FaLongArrowAltLeft,
} from "react-icons/fa";
import {
  MdEmail,
  MdLocationOn,
  MdStorefront,
  MdCategory,
  MdPerson,
  MdImage,
  MdRestaurantMenu,
  MdShare,
  MdCheckCircle,
  MdErrorOutline,
  MdUndo,
  MdPhotoCamera,
} from "react-icons/md";

import { useUserOptions } from "../../context/UserOptionsContext";
import { createProfile, updateProfile } from "../../store/reducers/profileSlice";
import { fetchCategories } from "../../store/reducers/categorySlice.js";
import { fetchUsers } from "../../store/reducers/auth/authSlice.js";
import notify from "../../hooks/Notifications";
import AnalyzingImageDemo from "../common/AnalyzingImageDemo";
import MenuUploader from "./MenuUploader";


const MENU_FIELD = "menu[]"; 
const MENU_REMOVED_FIELD = "removed_menu[]";

const IMAGE_TYPES = ["image/png", "image/jpg", "image/jpeg"];
const MAX_IMAGE = 10 * 1024 * 1024;

const SECTION_FIELDS = {
  media: [],
  personal: ["name", "email", "address", "phoneNumber", "bio"],
  menu: [],
  social: ["facebookURL", "instagramURL", "tiktokURL", "whatsappNumber"],
};



const optionalMatch = (regex, message) =>
  Yup.string().matches(regex, { message, excludeEmptyString: true });

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "*برجاء كتابة اسم أطول")
    .max(50, "*برجاء كتابة اسم أقصر")
    .required("يجب كتابة اسم المنشأة"),
  bio: Yup.string()
    .min(2, "* برجاء كتابة نبذة أطول")
    .max(500, "*برجاء كتابة نبذة أقصر"),
  email: Yup.string()
    .email("* برجاء إدخال بريد إلكتروني صحيح")
    .test("valid-email", "* برجاء إدخال بريد إلكتروني حقيقي", (value) => {
      if (!value) return true;
      const blocked = [
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
      return !blocked.includes(value.split("@")[0].toLowerCase());
    }),
  address: Yup.string()
    .min(5, "* برجاء كتابة موقع صحيح")
    .max(200, "* برجاء كتابة موقع أقصر")
    .required("* العنوان مطلوب"),
  phoneNumber: optionalMatch(
    /^(?:0|20|\+20)(?:1[0125][0-9]{8}|[2-9][0-9]{7,8})$/,
    "برجاء إدخال رقم هاتف مصري صحيح",
  ),
  facebookURL: optionalMatch(
    /^(?:https?:\/\/)?(?:www\.|m\.)?(?:facebook\.com|fb\.com)\/.+$/i,
    "برجاء إدخال عنوان صفحة فيسبوك صحيحة.",
  ),
  instagramURL: optionalMatch(
    /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?(?:\?.*)?$/i,
    "برجاء إدخال عنوان صفحة انستجرام صحيحة.",
  ),
  tiktokURL: optionalMatch(
    /^(?:https?:\/\/)?(?:www\.)?tiktok\.com\/.+$/i,
    "برجاء إدخال عنوان صفحة تيك توك صحيحة.",
  ),
  whatsappNumber: optionalMatch(
    /^(?:\+?20|0)?1[0125][0-9]{8}$/,
    "برجاء ادخال رقم واتساب مصري صحيح (مثال: 01096890544)",
  ),
});

const isValidValue = (key, value) => {
  try {
    validationSchema.validateSyncAt(key, { [key]: value });
    return true;
  } catch {
    return false;
  }
};


const slugify = (v = "") => v.toLocaleLowerCase().trim().replace(/\s+/g, "-");

const buildWaUrl = (value = "") => {
  let clean = value.replace(/\s+/g, "").replace("+", "");
  if (clean.startsWith("01")) clean = "20" + clean.substring(1);
  else if (clean.startsWith("1")) clean = "20" + clean;
  return `https://wa.me/${clean}`;
};

const waToLocal = (url = "") =>
  !url || url === "https://wa.me/+2"
    ? ""
    : url.replace("https://wa.me/+2", "").replace("https://wa.me/", "");

const safeDecode = (s) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

const toMenuEntries = (menu) => {
  const list = Array.isArray(menu) ? menu : menu ? [menu] : [];
  return list
    .map((item, i) => {
      const url =
        typeof item === "string" ? item : item?.url || item?.path || "";
      if (!url) return null;
      const name = safeDecode(url.split("?")[0].split("/").pop() || `menu-${i + 1}`);
      return {
        id: `remote-${i}`,
        url,
        name,
        type: /\.pdf$/i.test(name) ? "application/pdf" : "image/*",
        remote: true,
      };
    })
    .filter(Boolean);
};

const toPreviews = (entries) =>
  entries.map((e) => ({
    id: e.id,
    name: e.name ?? e.file?.name,
    type: e.type ?? e.file?.type,
    url: e.url,
  }));

const extractMessages = (err) => {
  const out = [];
  const walk = (n) => {
    if (!n) return;
    if (typeof n === "string") out.push(n.trim());
    else if (Array.isArray(n)) n.forEach(walk);
    else if (typeof n === "object") Object.values(n).forEach(walk);
  };
  walk(err?.response?.data?.message ?? err?.message);
  const unique = [...new Set(out.filter(Boolean))];
  return unique.length ? unique : ["حدث خطأ ما"];
};

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: state.isFocused ? "#fff" : "#F8FAFC",
    borderColor: state.isFocused ? "#a53860" : "#CBD5E1",
    boxShadow: state.isFocused ? "0 0 0 4px rgba(165,56,96,0.1)" : "none",
    fontWeight: 500,
    cursor: "pointer",
    "&:hover": { borderColor: "#a53860" },
  }),
  placeholder: (base) => ({ ...base, color: "#94A3B8" }),
  option: (base, state) => ({
    ...base,
    cursor: "pointer",
    fontWeight: 500,
    color: state.isSelected ? "#fff" : "#1E293B",
    backgroundColor: state.isSelected
      ? "#a53860"
      : state.isFocused
        ? "rgba(165,56,96,0.08)"
        : "#fff",
  }),
  menu: (base) => ({ ...base, borderRadius: 12, overflow: "hidden", zIndex: 30 }),
};


function Section({ step, icon: Icon, title, subtitle, open, onToggle, errorCount, children }) {
  return (
    <section className="w-full bg-white rounded-3xl border border-[#E2E8F0] shadow-xl shadow-[#a53860]/5 overflow-hidden transition-colors duration-300 hover:border-[#a53860]/40">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-x-4 px-5 md:px-6 py-5 bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors text-right"
      >
        <div className="flex items-center gap-x-4 min-w-0">
          <span className="relative w-11 h-11 shrink-0 rounded-2xl bg-[#a53860]/10 text-[#a53860] flex items-center justify-center">
            <Icon size={22} />
            
          </span>
          <div className="min-w-0">
            <h2 className="font-extrabold text-base md:text-lg text-[#1E293B]">{title}</h2>
            {subtitle && (
              <p className="text-xs text-[#94A3B8] font-medium mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-x-3 shrink-0">
          {errorCount > 0 && (
            <span className="text-xs font-bold bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-full">
              {errorCount} {errorCount === 1 ? "خطأ" : "أخطاء"}
            </span>
          )}
          <HiChevronDown
            className={`text-2xl text-[#64748B] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <div
        aria-hidden={!open}
        className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="p-5 md:p-6 border-t border-[#E2E8F0]">{children}</div>
        </div>
      </div>
    </section>
  );
}

function TextField({
  id,
  label,
  icon: Icon,
  error,
  touched,
  hint,
  action,
  required,
  multiline,
  className = "",
  value = "",
  maxLength,
  ...rest
}) {
  const showError = Boolean(error && touched);
  const Tag = multiline ? "textarea" : "input";
  const base =
    "w-full bg-[#F8FAFC] border text-[#1E293B] text-sm md:text-base font-medium rounded-xl py-3.5 placeholder:text-[#94A3B8] focus:outline-none focus:bg-white focus:ring-4 transition-all duration-300";
  const state = showError
    ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
    : "border-[#CBD5E1] focus:border-[#a53860] focus:ring-[#a53860]/10";

  return (
    <div className="w-full" data-error={showError ? "true" : undefined}>
      <div className="flex items-center justify-between mb-2 min-h-5">
        <label htmlFor={id} className="block text-sm font-bold text-[#475569] mr-1">
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
        <div className="flex items-center gap-x-3">
          {maxLength && (
            <span
              className={`text-xs font-bold ${value.length > maxLength ? "text-red-500" : "text-slate-400"}`}
            >
              {value.length} / {maxLength}
            </span>
          )}
          {action}
        </div>
      </div>
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className={`absolute right-4 text-slate-400 pointer-events-none ${multiline ? "top-4" : "top-1/2 -translate-y-1/2"}`}
          />
        )}
        <Tag
          id={id}
          name={id}
          value={value}
          rows={multiline ? 4 : undefined}
          aria-invalid={showError}
          className={`${base} ${state} ${Icon ? "pr-12 pl-4" : "px-4"} ${multiline ? "resize-none leading-relaxed" : ""} ${className}`}
          {...rest}
        />
      </div>
      {showError ? (
        <p className="flex items-center gap-x-1 text-red-500 text-xs font-bold mt-1.5 mr-1">
          <MdErrorOutline size={14} />
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-[#94A3B8] font-medium mt-1.5 mr-1">{hint}</p>
      )}
    </div>
  );
}

function ImageUploadCard({ label, hint, url, onPick, onRemove, variant }) {
  const inputRef = useRef(null);
  const [err, setErr] = useState("");
  const [dragging, setDragging] = useState(false);
  const isCover = variant === "cover";

  const handleFile = (file) => {
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) {
      setErr("صيغة الملف غير مدعومة (JPG أو PNG فقط)");
      return;
    }
    if (file.size > MAX_IMAGE) {
      setErr("الحد الأقصى لحجم الصورة هو 10 ميجابايت");
      return;
    }
    setErr("");
    onPick(file);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 min-h-5">
        <span className="text-sm font-bold text-[#475569] mr-1">{label}</span>
        {url && (
          <button
            type="button"
            onClick={() => {
              setErr("");
              onRemove();
            }}
            className={`flex justify-center items-center font-semibold gap-x-2 cursor-pointer bg-[#fa518f]  hover:bg-[#fa518f]/75 text-white px-3 py-2 rounded-xl`}
          >
            
            ازالة
          <RiDeleteBin5Fill />
          </button>
        )}
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`relative group/img w-full h-44 border-2 border-dashed rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#a53860]/10 ${
          dragging
            ? "border-[#a53860] bg-[#a53860]/5"
            : "border-[#CBD5E1] bg-white hover:border-[#a53860] hover:bg-[#F8FAFC]"
        }`}
      >
        {url ? (
          <>
            <img
              src={url}
              alt={label}
              className={`w-full h-full ${isCover ? "object-cover" : "object-contain p-3"}`}
            />
            <div className="absolute inset-0 bg-[#1E293B]/55 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-y-1 text-white">
              <MdPhotoCamera size={26} />
              <span className="text-sm font-bold">تغيير الصورة</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center px-4">
            <div className="p-4 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] mb-3 group-hover/img:scale-110 transition-transform">
              <ImFilePicture className="text-2xl text-[#64748B] group-hover/img:text-[#a53860] transition-colors" />
            </div>
            <p className="text-[#334155] font-bold text-sm group-hover/img:text-[#a53860] transition-colors">
              اضغط أو اسحب الصورة هنا
            </p>
            <p className="text-xs text-[#94A3B8] mt-1 font-medium">{hint}</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {err && (
        <p className="flex items-center gap-x-1 text-red-500 text-xs font-bold mt-1.5 mr-1">
          <MdErrorOutline size={14} />
          {err}
        </p>
      )}
    </div>
  );
}

export default function EditUserInformation() {
  const location = useLocation();
  const isEditMode = location.pathname.includes("/edit");
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    editQrProfile,
    setLogoURL,
    setCoverURL,
    setName,
    setClientName,
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
    setWhatsappNumber,
    setEditProfile,
    setEditQrProfile,
    setErrors,
    setHasErrors,
    setResetForm,
    setMenuPreviewUrl,
    setQrValue,
  } = useUserOptions();

  const users = useSelector((state) => state?.auth?.users);
  const role = useSelector((state) => state?.auth?.role);
  const profile = useSelector((state) => state?.profile?.profile);
  const loadingProfile = useSelector((state) => state?.profile?.loading);
  const categories = useSelector((state) => state?.category?.categories);

  const [selectedUser, setSelectedUser] = useState(null);
  const [openSections, setOpenSections] = useState({
    media: true,
    personal: true,
    menu: true,
    social: true,
  });

  const userOptions = useMemo(
    () =>
      users?.map((u) => ({ value: u?.id, label: `${u?.name} - ${u?.phone}` })) || [],
    [users],
  );
  const options = useMemo(
    () => categories?.map((c) => ({ value: c?.id, label: c?.name })) || [],
    [categories],
  );
  const profileActivity = useMemo(
    () => categories?.find((c) => c?.id === profile?.activity_id),
    [categories, profile],
  );

  const initialValues = useMemo(
    () => ({
      name: profile?.name || "",
      activity: profileActivity
        ? { value: profileActivity.id, label: profileActivity.name }
        : null,
      bio: profile?.about_us || "",
      email: profile?.email || "",
      address: profile?.address || "",
      phoneNumber: profile?.phone || "",
      facebookURL: profile?.facebook || "",
      instagramURL: profile?.instagram || "",
      tiktokURL: profile?.tiktok || "",
      whatsappNumber: waToLocal(profile?.whatsapp),
      logoURL: profile?.logo || "",
      coverURL: profile?.cover || "",
      logoImageFile: null,
      coverImageFile: null,
      menuEntries: toMenuEntries(profile?.menu),
    }),
    [profile, profileActivity],
  );

  async function submitProfilePage(values) {
    try {
      const data = new FormData();
      data.append("name", values.name);
      if (values.activity?.value) data.append("activity_id", values.activity.value);
      data.append("about_us", values.bio);
      data.append("email", values.email);
      data.append("address", values.address);
      data.append("phone", values.phoneNumber);
      data.append("facebook", values.facebookURL);
      data.append("instagram", values.instagramURL);
      data.append("tiktok", values.tiktokURL);
      data.append("whatsapp", values.whatsappNumber);

      if (values.logoImageFile instanceof File) data.append("logo", values.logoImageFile);
      if (values.coverImageFile instanceof File) data.append("cover", values.coverImageFile);

      // new menu files
      values.menuEntries.forEach((e) => {
        if (e.file instanceof File) data.append(MENU_FIELD, e.file);
      });
      initialValues.menuEntries
        .filter((r) => !values.menuEntries.some((e) => e.id === r.id))
        .forEach((r) => data.append(MENU_REMOVED_FIELD, r.url));

      const response = isEditMode
        ? await dispatch(updateProfile({ slug, newProfileData: data })).unwrap()
        : await dispatch(createProfile(data)).unwrap();

      notify(response?.message || "تم حفظ التعديلات بنجاح", "success");
      navigate("/home");
    } catch (err) {
      extractMessages(err).forEach((m) => notify(m, "error"));
    }
  }

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: submitProfilePage,
  });
  const v = formik.values;
  const saving = Boolean(loadingProfile || formik.isSubmitting);

  const syncFromProfile = () => {
    if (!profile) return;
    setName(profile.name || "");
    setClientName(profile.clientName || "");
    setActivity(
      profileActivity ? { value: profileActivity.id, label: profileActivity.name } : null,
    );
    setBio(profile.about_us || "");
    setEmail(profile.email || "");
    setAddress(profile.address || "");
    setMenu(profile.menu || null);
    setMenuPreviewUrl(toPreviews(initialValues.menuEntries));
    setPhoneNumber(profile.phone || "");
    setFacebookURL(profile.facebook || "");
    setInstagramURL(profile.instagram || "");
    setTiktokURL(profile.tiktok || "");

    const waNumber = waToLocal(profile.whatsapp);
    setWhatsappNumber(waNumber);
    setWhatsappURL(waNumber ? profile.whatsapp : "");
    setLogoURL(profile.logo || null);
    setCoverURL(profile.cover || null);
  };

  useEffect(() => {
    dispatch(fetchCategories());
    if (role === "admin") dispatch(fetchUsers());
  }, [dispatch, role]);

  useEffect(() => {
    if (!profile) return;
    const url = `https://linkaty.online/${profile.slug}`;
    setQrValue(url);
    setEditProfile((prev) => ({ ...prev, qrValue: url }));
  }, [profile]);

  useEffect(() => {
    sessionStorage.setItem("profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    sessionStorage.setItem("QR Profile Edited", JSON.stringify(editQrProfile));
  }, [editQrProfile]);

  useEffect(() => {
    syncFromProfile();
  }, [profile, profileActivity]);

  useEffect(() => {
    setHasErrors(Object.keys(formik.errors).length > 0);
    setErrors(formik.errors);
  }, [formik.errors]);

  useEffect(() => {
    setResetForm(() => formik.resetForm);
    return () => setResetForm(null);
  }, [setResetForm]);

  useEffect(() => {
    if (!formik.dirty || saving) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [formik.dirty, saving]);

  const contextSetters = {
    name: setName,
    bio: setBio,
    email: setEmail,
    address: setAddress,
    phoneNumber: setPhoneNumber,
    facebookURL: setFacebookURL,
    instagramURL: setInstagramURL,
    tiktokURL: setTiktokURL,
  };
  const PUSH_ALWAYS = ["name", "email", "address"];

  const handleText = (key) => (e) => {
    const value = e.target.value;
    formik.setFieldValue(key, value);
    contextSetters[key]?.(value);

    const patch = { [key]: value, ...(key === "name" ? { userName: slugify(value) } : {}) };
    setEditProfile((prev) => ({ ...prev, ...patch }));

    const ok = PUSH_ALWAYS.includes(key) || isValidValue(key, value);
    setEditQrProfile((prev) => ({ ...prev, ...(ok ? patch : { [key]: "" }) }));
  };

  const applyWhatsapp = (value) => {
    formik.setFieldValue("whatsappNumber", value);
    setWhatsappNumber(value);
    const url = value.trim() ? buildWaUrl(value) : "";
    setWhatsappURL(url);
    setEditProfile((prev) => ({ ...prev, whatsappNumber: value, whatsappURL: url }));
    const ok = !value || isValidValue("whatsappNumber", value);
    setEditQrProfile((prev) => ({
      ...prev,
      whatsappNumber: ok ? value : "",
      whatsappURL: ok ? url : "",
    }));
  };

  const handleActivity = (option) => {
    formik.setFieldValue("activity", option);
    setActivity(option);
    setEditProfile((prev) => ({ ...prev, activity: option }));
    setEditQrProfile((prev) => ({ ...prev, activity: option }));
  };

  const handleClient = (option) => {
    if (!option) {
      setSelectedUser(null);
      setClientName("");
      return;
    }
    const user = users?.find((u) => u?.id === option.value);
    setSelectedUser(user || null);
    setClientName(user?.name || "");
    setEditProfile((prev) => ({ ...prev, clientName: user?.name }));
    setEditQrProfile((prev) => ({ ...prev, clientName: user?.name }));
  };

  const pickImage = (kind) => (file) => {
    const isLogo = kind === "logo";
    const fileKey = isLogo ? "logoImageFile" : "coverImageFile";
    const urlKey = isLogo ? "logoURL" : "coverURL";
    const old = v[urlKey];
    if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
    const url = URL.createObjectURL(file);

    formik.setFieldValue(fileKey, file);
    formik.setFieldValue(urlKey, url);
    (isLogo ? setLogoURL : setCoverURL)(url);
    setEditProfile((prev) => ({ ...prev, [urlKey]: url }));
    setEditQrProfile((prev) => ({ ...prev, [urlKey]: url }));
  };

  const removeImage = (kind) => () => {
    const isLogo = kind === "logo";
    const fileKey = isLogo ? "logoImageFile" : "coverImageFile";
    const urlKey = isLogo ? "logoURL" : "coverURL";
    const old = v[urlKey];
    if (old?.startsWith("blob:")) URL.revokeObjectURL(old);

    formik.setFieldValue(fileKey, null);
    formik.setFieldValue(urlKey, "");
    (isLogo ? setLogoURL : setCoverURL)("");
    setEditProfile((prev) => ({ ...prev, [urlKey]: "" }));
    setEditQrProfile((prev) => ({ ...prev, [urlKey]: "" }));
  };

  const handleMenuChange = (entries) => {
    formik.setFieldValue("menuEntries", entries);
    const previews = toPreviews(entries);
    setMenuPreviewUrl(previews);
    setEditProfile((prev) => ({ ...prev, menu: previews }));
    setEditQrProfile((prev) => ({ ...prev, menu: previews }));
  };

  const handleDiscard = () => {
    [v.logoURL, v.coverURL].forEach((u) => u?.startsWith("blob:") && URL.revokeObjectURL(u));
    v.menuEntries.forEach((e) => e.url?.startsWith("blob:") && URL.revokeObjectURL(e.url));
    formik.resetForm();
    syncFromProfile();
    setEditQrProfile((prev) => ({
      ...prev,
      logoURL: profile?.logo || "",
      coverURL: profile?.cover || "",
      menu: toPreviews(initialValues.menuEntries),
    }));
    setHasErrors(false);
    setErrors({});
  };

  const handleSave = async () => {
    const errs = await formik.validateForm();
    formik.setTouched(
      Object.keys(formik.values).reduce((acc, k) => ({ ...acc, [k]: true }), {}),
      false,
    );
    if (Object.keys(errs).length) {
      setOpenSections((prev) => {
        const next = { ...prev };
        Object.entries(SECTION_FIELDS).forEach(([section, fields]) => {
          if (fields.some((f) => errs[f])) next[section] = true;
        });
        return next;
      });
      notify("برجاء مراجعة الحقول المطلوبة", "error");
      setTimeout(() => {
        document
          .querySelector('[data-error="true"]')
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
      return;
    }
    await formik.submitForm();
  };

  const toggleSection = (key) => setOpenSections((p) => ({ ...p, [key]: !p[key] }));
  const errorCount = (section) =>
    SECTION_FIELDS[section].filter((k) => formik.errors[k] && formik.touched[k]).length;

  const completion = useMemo(() => {
    const checks = [
      v.name,
      v.activity,
      v.address,
      v.phoneNumber,
      v.bio,
      v.email,
      v.logoURL,
      v.coverURL,
      v.menuEntries.length,
      v.facebookURL || v.instagramURL || v.tiktokURL || v.whatsappNumber,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [v]);

  const fieldProps = (key) => ({
    id: key,
    value: v[key],
    error: formik.errors[key],
    touched: formik.touched[key],
    onBlur: formik.handleBlur,
    onChange: handleText(key),
  });

  const publicUrl = profile?.slug ? `https://linkaty.online/${profile.slug}` : null;

  if (!profile && loadingProfile) {
    return (
      <div className="w-full h-[70vh] flex justify-center items-center">
        <AnalyzingImageDemo />
      </div>
    );
  }

  const socials = [
    { key: "facebookURL", label: "صفحة فيسبوك", icon: FaFacebook, placeholder: "https://facebook.com/username" },
    { key: "instagramURL", label: "صفحة انستجرام", icon: FaInstagram, placeholder: "https://instagram.com/username" },
    { key: "tiktokURL", label: "صفحة تيك توك", icon: FaTiktok, placeholder: "https://tiktok.com/@username" },
  ];

  return (
    <div className="pb-26  w-full text-[#1E293B] px-4 selection:bg-[#FFD600] selection:text-[#1E293B]">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="w-full max-w-3xl mx-auto flex flex-col gap-y-6"
      >
        <div className="w-full bg-white rounded-3xl border border-[#E2E8F0] shadow-xl shadow-[#a53860]/5 p-5 md:p-6">
          <div className="flex items-start justify-between gap-x-4">
            <div className="flex items-center gap-x-3 min-w-0">
              <button
                type="button"
                onClick={() => navigate(-1)}
                title="رجوع"
                className="w-10 h-10 shrink-0 rounded-xl border border-[#E2E8F0] text-[#64748B] hover:text-[#a53860] hover:border-[#a53860]/40 flex items-center justify-center transition-colors"
              >
                <FaLongArrowAltRight />
              </button>
              <div className="min-w-0">
                <h1 className="font-extrabold text-lg md:text-xl truncate">
                  {isEditMode ? "تعديل الصفحة" : "انشاء صفحة جديدة"}
                </h1>
                <p className="text-sm text-[#64748B] font-medium truncate">
                  {v.name || "بدون اسم"}
                </p>
              </div>
            </div>

            {publicUrl && (
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-x-2 shrink-0 text-xs md:text-sm font-bold text-[#a53860] bg-[#a53860]/10 hover:bg-[#a53860]/15 px-3 py-2 rounded-xl transition-colors"
              >
                عرض الصفحة
                <FiExternalLink />
              </a>
            )}
          </div>

        </div>

        <Section
          step={1}
          icon={MdImage}
          title="صور الصفحة"
          subtitle="اللوجو وصورة الغلاف"
          open={openSections.media}
          onToggle={() => toggleSection("media")}
          errorCount={errorCount("media")}
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2">
              <ImageUploadCard
                label="صورة اللوجو"
                hint="JPG, PNG - يفضل مقاس مربع"
                variant="logo"
                url={v.logoURL}
                onPick={pickImage("logo")}
                onRemove={removeImage("logo")}
              />
            </div>
            <div className="w-full md:w-1/2">
              <ImageUploadCard
                label="صورة الغلاف"
                hint="JPG, PNG - يفضل مقاس أفقي"
                variant="cover"
                url={v.coverURL}
                onPick={pickImage("cover")}
                onRemove={removeImage("cover")}
              />
            </div>
          </div>
        </Section>

        <Section
          step={2}
          icon={MdStorefront}
          title="البيانات الأساسية"
          subtitle="اسم المنشأة ووسائل الوصول إليك"
          open={openSections.personal}
          onToggle={() => toggleSection("personal")}
          errorCount={errorCount("personal")}
        >
          <div className="flex flex-col gap-y-5">
            <TextField
              {...fieldProps("name")}
              label="اسم المنشأة"
              icon={MdStorefront}
              required
              placeholder="اكتب اسم المنشأة هنا"
            />

            {role === "admin" && (
              <div className="w-full">
                <label className="flex items-center gap-x-2 text-sm font-bold text-[#475569] mb-2 mr-1">
                  <MdPerson size={16} className="text-slate-400" />
                  اسم العميل
                </label>
                <Select
                  options={userOptions}
                  styles={selectStyles}
                  value={userOptions.find((o) => o.value === selectedUser?.id) || null}
                  placeholder="برجاء اختيار اسم العميل"
                  noOptionsMessage={() => "لا توجد نتائج"}
                  isClearable
                  onChange={handleClient}
                />
              </div>
            )}

            <div className="w-full">
              <label className="flex items-center gap-x-2 text-sm font-bold text-[#475569] mb-2 mr-1">
                <MdCategory size={16} className="text-slate-400" />
                نوع المنشأة
              </label>
              <Select
                inputId="activity"
                options={options}
                styles={selectStyles}
                value={v.activity}
                placeholder="اختر نوع المنشأة"
                noOptionsMessage={() => "لا توجد نتائج"}
                onChange={handleActivity}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <TextField
                {...fieldProps("phoneNumber")}
                label="رقم الهاتف"
                icon={FaPhoneAlt}
                type="tel"
                dir="ltr"
                className="text-left"
                placeholder="01012345678"
              />
              <TextField
                {...fieldProps("email")}
                label="البريد الإلكتروني"
                icon={MdEmail}
                type="email"
                dir="ltr"
                className="text-left"
                placeholder="example@email.com"
              />
            </div>

            <TextField
              {...fieldProps("address")}
              label="العنوان"
              icon={MdLocationOn}
              required
              placeholder="اكتب موقع المنشأة هنا"
            />

            <TextField
              {...fieldProps("bio")}
              label="نبذة عنك"
              multiline
              maxLength={500}
              placeholder="اكتب نبذة قصيرة عنك..."
            />
          </div>
        </Section>

        <Section
          step={3}
          icon={MdRestaurantMenu}
          title="قائمة الطعام"
          subtitle="ارفع صور أو ملفات PDF لقائمتك"
          open={openSections.menu}
          onToggle={() => toggleSection("menu")}
          errorCount={errorCount("menu")}
        >
          <MenuUploader entries={v.menuEntries} onChange={handleMenuChange} />
        </Section>

        <Section
          step={4}
          icon={MdShare}
          title="حسابات التواصل الاجتماعي"
          subtitle="كلها اختيارية"
          open={openSections.social}
          onToggle={() => toggleSection("social")}
          errorCount={errorCount("social")}
        >
          <div className="flex flex-col gap-y-5">
            {socials.map(({ key, label, icon, placeholder }) => (
              <TextField
                key={key}
                {...fieldProps(key)}
                label={label}
                icon={icon}
                type="url"
                dir="ltr"
                className="text-left"
                placeholder={placeholder}
              />
            ))}

            <TextField
              id="whatsappNumber"
              value={v.whatsappNumber}
              error={formik.errors.whatsappNumber}
              touched={formik.touched.whatsappNumber}
              onBlur={formik.handleBlur}
              onChange={(e) => applyWhatsapp(e.target.value)}
              label="تواصل عبر واتساب"
              icon={FaWhatsapp}
              type="tel"
              dir="ltr"
              className="text-left"
              placeholder="01012345678"
              action={
                v.phoneNumber &&
                !formik.errors.phoneNumber &&
                v.phoneNumber !== v.whatsappNumber ? (
                  <button
                    type="button"
                    onClick={() => applyWhatsapp(v.phoneNumber)}
                    className="text-xs font-bold text-[#a53860] hover:underline"
                  >
                    استخدم رقم الهاتف
                  </button>
                ) : null
              }
            />
          </div>
        </Section>

        <div className="sticky bottom-4 z-20">
          <div className="w-full flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur border border-[#E2E8F0] rounded-2xl shadow-2xl shadow-[#a53860]/10 px-4 py-3">
            <div className="flex items-center gap-x-2 text-sm font-bold">
              {formik.dirty ? (
                <>
                  <span className="text-amber-600">لديك تعديلات غير محفوظة</span>
                </>
              ) : (
                <>
                  <MdCheckCircle className="text-[#4c956c]" size={18} />
                  <span className="text-[#4c956c]">كل التعديلات محفوظة</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-x-3 w-full sm:w-auto">
              {formik.dirty && (
                <button
                  type="button"
                  onClick={handleDiscard}
                  disabled={saving}
                  className="flex items-center justify-center gap-x-2 px-4 py-3 rounded-xl border border-[#CBD5E1] text-[#475569] hover:bg-slate-50 font-bold text-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  <MdUndo size={18} />
                  إلغاء
                </button>
              )}
              <button
                type="submit"
                disabled={!formik.dirty || saving}
                className={`flex-1 sm:flex-none sm:min-w-44 flex justify-center items-center gap-x-3 px-5 py-3 rounded-xl text-white font-bold tracking-wide transition-all duration-300 active:scale-95 ${
                  formik.dirty && !saving
                    ? "bg-[#fa518f] hover:bg-[#fa518f]/85 shadow-lg shadow-[#fa518f]/25"
                    : "bg-[#fa518f]/50 cursor-not-allowed"
                }`}
              >
                {saving ? (
                  <span className="loader"></span>
                ) : (
                  <>
                    {isEditMode ? "حفظ التعديلات" : "انشاء الصفحة"}
                    <FaLongArrowAltLeft />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}