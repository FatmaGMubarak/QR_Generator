import { useEffect, useMemo, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HiChevronDown } from "react-icons/hi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { ImFilePicture } from "react-icons/im";
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaPhoneAlt,
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
import { createProfile } from "../../store/reducers/profileSlice";
import { fetchCategories } from "../../store/reducers/categorySlice.js";
import { fetchUsers } from "../../store/reducers/auth/authSlice.js";
import notify from "../../hooks/Notifications";
import AnalyzingImageDemo from "../common/AnalyzingImageDemo";
import MenuUploader from "./MenuUploader";

/* -------------------------------------------------------------------------- */
/*                                   config                                   */
/* -------------------------------------------------------------------------- */

const MENU_FIELD = "menu[]";

const IMAGE_TYPES = ["image/png", "image/jpg", "image/jpeg"];
const MAX_IMAGE = 10 * 1024 * 1024;

const SECTION_FIELDS = {
  media: [],
  personal: ["name", "email", "address", "phoneNumber", "bio"],
  menu: ["menuEntries"],
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

const toPreviews = (entries) =>
  entries.map((e) => ({
    id: e.id,
    name: e.file?.name,
    type: e.file?.type,
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

function Section({ icon: Icon, title, subtitle, open, onToggle, errorCount, children }) {
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
            className="flex justify-center items-center font-semibold gap-x-2 cursor-pointer bg-[#fa518f] hover:bg-[#fa518f]/75 text-white px-3 py-2 rounded-xl text-xs"
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

export default function UserInformation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = useSelector((state) => state?.auth?.role);
  const users = useSelector((state) => state?.auth?.users);
  const categories = useSelector((state) => state?.category?.categories);
  const loadingProfile = useSelector((state) => state?.profile?.loading);

  const {
    profile,
    qrProfile,
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
    setProfile,
    setQrProfile,
    setErrors,
    setHasErrors,
    setResetForm,
    setMenuPreviewUrl,
    setQrValue,
  } = useUserOptions();

  const [selectedUser, setSelectedUser] = useState(null);
  const [openSections, setOpenSections] = useState({
    media: true,
    personal: true,
    menu: true,
    social: true,
  });

  const userOptions = useMemo(
    () => users?.map((u) => ({ value: u?.id, label: `${u?.name} - ${u?.phone}` })) || [],
    [users],
  );

  const options = useMemo(
    () => categories?.map((c) => ({ value: c?.id, label: c?.name })) || [],
    [categories],
  );
  useEffect(()=>{
console.log(profile)
  }, [profile])

  const initialValues = useMemo(
    () => ({
      name: profile?.name || "",
      activity: profile?.activity || null,
      bio: profile?.bio || "",
      email: profile?.email || "",
      address: profile?.address || "",
      phoneNumber: profile?.phoneNumber || "",
      facebookURL: profile?.facebookURL || "",
      instagramURL: profile?.instagramURL || "",
      tiktokURL: profile?.tiktokURL || "",
      whatsappNumber: profile?.whatsappNumber || "",
      logoURL: profile?.logoURL || "",
      coverURL: profile?.coverURL || "",
      logoImageFile: null,
      coverImageFile: null,
      menuEntries: profile?.menuFiles || [],
    }),
    [profile]
  );

  async function submitProfilePage(values) {
    try {
      const profileData = new FormData();
      profileData.append("name", values.name);
      if (values.activity?.value) profileData.append("activity_id", values.activity.value);
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

      values.menuEntries.forEach((entry) => {
        if (entry.file instanceof File) {
          profileData.append(MENU_FIELD, entry.file);
        }
      });

      const response = await dispatch(createProfile(profileData)).unwrap();

      if (response) {
        const url = `https://linkaty.online/${response?.slug}`;
        setQrValue(url);
        setProfile((prev) => ({ ...prev, qrValue: url }));
        notify(response?.message || "تم إنشاء الصفحة بنجاح", "success");
        navigate("/home");
      }
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

  useEffect(() => {
    dispatch(fetchCategories());
    if (role === "admin") dispatch(fetchUsers());
  }, [dispatch, role]);

  useEffect(() => {
    sessionStorage.setItem("profileCreated", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    sessionStorage.setItem("QR Profile", JSON.stringify(qrProfile));
  }, [qrProfile]);

  useEffect(() => {
    setHasErrors(Object.keys(formik.errors).length > 0);
    setErrors(formik.errors);
  }, [formik.errors]);

  useEffect(() => {
    setResetForm(() => formik.resetForm);
    return () => setResetForm(null);
  }, [setResetForm]);

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
    setProfile((prev) => ({ ...prev, ...patch }));

    const ok = PUSH_ALWAYS.includes(key) || isValidValue(key, value);
    setQrProfile((prev) => ({ ...prev, ...(ok ? patch : { [key]: "" }) }));
  };

  const applyWhatsapp = (value) => {
    formik.setFieldValue("whatsappNumber", value);
    setWhatsappNumber(value);
    const url = value.trim() ? buildWaUrl(value) : "";
    setWhatsappURL(url);
    setProfile((prev) => ({ ...prev, whatsappNumber: value, whatsappURL: url }));
    const ok = !value || isValidValue("whatsappNumber", value);
    setQrProfile((prev) => ({
      ...prev,
      whatsappNumber: ok ? value : "",
      whatsappURL: ok ? url : "",
    }));
  };

  const handleActivity = (option) => {
    formik.setFieldValue("activity", option);
    setActivity(option);
    setProfile((prev) => ({ ...prev, activity: option }));
    setQrProfile((prev) => ({ ...prev, activity: option }));
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
    setProfile((prev) => ({ ...prev, clientName: user?.name }));
    setQrProfile((prev) => ({ ...prev, clientName: user?.name }));
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
    setProfile((prev) => ({ ...prev, [urlKey]: url }));
    setQrProfile((prev) => ({ ...prev, [urlKey]: url }));
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
    setProfile((prev) => ({ ...prev, [urlKey]: "" }));
    setQrProfile((prev) => ({ ...prev, [urlKey]: "" }));
  };

  const handleMenuChange = (entries) => {
    formik.setFieldValue("menuEntries", entries);
    const previews = toPreviews(entries);
    setMenuPreviewUrl(previews);
    setProfile((prev) => ({ ...prev, menu: previews }));
    setQrProfile((prev) => ({ ...prev, menu: previews }));
  };

  const handleCancel = async () => {
    [v.logoURL, v.coverURL].forEach((u) => u?.startsWith("blob:") && URL.revokeObjectURL(u));
    v.menuEntries.forEach((e) => e.url?.startsWith("blob:") && URL.revokeObjectURL(e.url));

    sessionStorage.removeItem("profileCreated");
    sessionStorage.removeItem("QR Profile");
    formik.resetForm();
    setHasErrors(false);
    setErrors({});
    setProfile({
      name: "",
      clientName: "",
      activity: "",
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
    setQrProfile({
      name: "",
      clientName: "",
      activity: "",
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
    setName("");
    setClientName("");
    setActivity("");
    setBio("");
    setEmail("");
    setAddress("");
    setMenu(null);
    setPhoneNumber("");
    setFacebookURL("");
    setInstagramURL("");
    setTiktokURL("");
    setWhatsappNumber("");
    setWhatsappURL("");
    setQrValue("");
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

  const fieldProps = (key) => ({
    id: key,
    value: v[key],
    error: formik.errors[key],
    touched: formik.touched[key],
    onBlur: formik.handleBlur,
    onChange: handleText(key),
  });

  const socials = [
    { key: "facebookURL", label: "صفحة فيسبوك", icon: FaFacebook, placeholder: "https://facebook.com/username" },
    { key: "instagramURL", label: "صفحة انستجرام", icon: FaInstagram, placeholder: "https://instagram.com/username" },
    { key: "tiktokURL", label: "صفحة تيك توك", icon: FaTiktok, placeholder: "https://tiktok.com/@username" },
  ];

  return (
    <div className="pb-12 w-full text-[#1E293B] px-4 selection:bg-[#FFD600] selection:text-[#1E293B]">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="w-full max-w-3xl mx-auto flex flex-col gap-y-6"
      >


        <Section
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

            <div className="w-full" data-error={formik.errors.activity && formik.touched.activity ? "true" : undefined}>
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
          icon={MdRestaurantMenu}
          title="قائمة الطعام"
          subtitle="ارفع صور أو ملفات PDF لقائمتك"
          open={openSections.menu}
          onToggle={() => toggleSection("menu")}
          errorCount={errorCount("menu")}
        >
          <div data-error={formik.errors.menuEntries && formik.touched.menuEntries ? "true" : undefined}>
            <MenuUploader entries={v.menuEntries} onChange={handleMenuChange} />
            {formik.errors.menuEntries && formik.touched.menuEntries && (
              <p className="flex items-center gap-x-1 text-red-500 text-xs font-bold mt-1.5 mr-1">
                <MdErrorOutline size={14} />
                {formik.errors.menuEntries}
              </p>
            )}
          </div>
        </Section>

        <Section
          icon={MdShare}
          title="حسابات التواصل الاجتماعي"
          subtitle="وسائل الوصول لمنشأتك "
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
            

           <div className="w-full flex justify-between items-center">
              
               
              <button
                type="submit"
                disabled={saving}
                className={`w-[60%] lg:w-[25%] flex justify-center items-center gap-x-3 ${qrProfile.name.length === 0 ? "bg-[#fa518f]/75 cursor-not-allowed" : "bg-[#fa518f] hover:bg-[#fa518f]/75"} bg-[length:200%_auto] hover:bg-right transition-all duration-500 px-4 py-3 text-white rounded-xl shadow-lg shadow-[#4c956c]/20 font-bold tracking-wide active:scale-95`}
              >
                {saving ? (
                  <span className="loader"></span>
                ) : (
                  <>
                    إنشاء الصفحة
                    <FaLongArrowAltLeft />
                  </>
                )}
              </button>

               <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="w-[35%] lg:w-[20%] flex justify-center items-center gap-x-3 bg-gray-600 hover:bg-gray-600/75 bg-[length:200%_auto] hover:bg-right transition-all duration-500 px-4 py-3 text-white rounded-xl shadow-lg shadow-[#4c956c]/20 font-bold tracking-wide active:scale-95"
                >
                  <MdUndo size={18} />
                  إلغاء
                </button>
              
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}