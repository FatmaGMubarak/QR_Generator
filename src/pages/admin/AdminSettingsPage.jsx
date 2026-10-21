import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Wallet,
  Link2,
  MessageCircle,
  Save,
  Settings2,
  X,
  Pencil,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { FaLongArrowAltLeft } from "react-icons/fa";

import notify from "../../hooks/Notifications";
import AnalyzingImageDemo from "../../components/common/AnalyzingImageDemo";
import {
  createSettings,
  fetchSettings,
  updateSettings,
} from "../../store/reducers/settingsSlice";
import { MdUndo } from "react-icons/md";

const MAX_MESSAGE = 1000;
const EMPTY = { walletLink: "", instaLink: "", whatsMessage: "" };

const isValidUrl = (value) => {
  if (!value) return true; // optional
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

// API field name -> form field name
const API_TO_FORM_KEY = {
  "willet-link": "walletLink",
  "insta-link": "instaLink",
  whats_message: "whatsMessage",
};

/**
 * Normalises server errors such as:
 *   { message: [ { "willet-link": ["..."], "insta-link": ["..."] } ] }
 * (also supports a plain object, a string, or an array of strings)
 * into { fieldErrors: { walletLink: "...", ... }, messages: ["...", ...] }
 */
const parseServerErrors = (err) => {
  const fieldErrors = {};
  const messages = [];
  const raw = err?.message ?? err;

  const collect = (node) => {
    if (!node) return;
    if (typeof node === "string") {
      messages.push(node.trim());
    } else if (Array.isArray(node)) {
      node.forEach(collect);
    } else if (typeof node === "object") {
      Object.entries(node).forEach(([apiKey, value]) => {
        const list = (Array.isArray(value) ? value : [value])
          .filter((v) => typeof v === "string")
          .map((v) => v.trim());
        if (!list.length) return;
        const formKey = API_TO_FORM_KEY[apiKey];
        if (formKey) fieldErrors[formKey] = list.join(" - ");
        messages.push(...list);
      });
    }
  };

  collect(raw);
  return { fieldErrors, messages };
};

// Map API payload -> form shape
const toForm = (settings) => ({
  walletLink: settings?.["willet-link"] ?? "",
  instaLink: settings?.["insta-link"] ?? "",
  whatsMessage: settings?.["whats_message"] ?? "",
});

// Decide whether the backend already holds a settings record
const hasExistingSettings = (settings) => {
  if (!settings || typeof settings !== "object") return false;
  if (settings.id) return true;
  const f = toForm(settings);
  return Boolean(f.walletLink || f.instaLink || f.whatsMessage);
};

export default function AdminSettingsPage() {
  const dispatch = useDispatch();

  const settings = useSelector((state) => state?.settings?.settings);
  const loading = useSelector((state) => state?.settings?.loading);

  const [form, setForm] = useState(EMPTY);
  const [saved, setSaved] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  const exists = hasExistingSettings(settings);
  // First-time setup is always editable; existing settings start read-only.
  const canEdit = !exists || editing;

  /* ---------------------------- data loading ---------------------------- */
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (!settings) return;
    const next = toForm(settings);
    setForm(next);
    setSaved(next);
  }, [settings]);

  /* ------------------------------ derived ------------------------------- */
  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(saved),
    [form, saved],
  );

  // For a brand-new record, require at least one value before enabling save.
  const hasAnyValue = Boolean(
    form.walletLink.trim() || form.instaLink.trim() || form.whatsMessage.trim(),
  );
  const canSubmit = canEdit && !saving && isDirty && (exists || hasAnyValue);

  // Warn before leaving the tab with unsaved changes
  useEffect(() => {
    if (!isDirty || !canEdit) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty, canEdit]);

  /* ------------------------------ handlers ------------------------------ */
  const setField = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!isValidUrl(form.walletLink.trim())) {
      next.walletLink = "برجاء ادخال رابط صحيح يبدأ بـ https://";
    }
    if (!isValidUrl(form.instaLink.trim())) {
      next.instaLink = "برجاء ادخال رابط صحيح يبدأ بـ https://";
    }
    if (form.whatsMessage.length > MAX_MESSAGE) {
      next.whatsMessage = `الحد الأقصى ${MAX_MESSAGE} حرف`;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || !validate()) return;

    const clean = {
      walletLink: form.walletLink.trim(),
      instaLink: form.instaLink.trim(),
      whatsMessage: form.whatsMessage,
    };

    try {
      setSaving(true);

      const data = new FormData();
      data.append("willet-link", clean.walletLink);
      data.append("insta-link", clean.instaLink);
      data.append("whats_message", clean.whatsMessage);

      const response = exists
        ? await dispatch(updateSettings(data)).unwrap()
        : await dispatch(createSettings(data)).unwrap();

      setForm(clean);
      setSaved(clean);
      setEditing(false);
      notify(
        response?.message ||
          (exists ? "تم تحديث الاعدادات بنجاح" : "تم حفظ الاعدادات بنجاح"),
        "success",
      );

      // Pull the fresh record (also gives us the id after the first create)
      dispatch(fetchSettings());
    } catch (err) {
      const { fieldErrors, messages } = parseServerErrors(err);

      // Show each server message under its own field
      if (Object.keys(fieldErrors).length) {
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }

      // And as toasts (one per message)
      if (messages.length) {
        messages.forEach((msg) => notify(msg, "error"));
      } else {
        notify("حدث خطأ ما", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(saved);
    setErrors({});
    if (exists) setEditing(false);
  };

  const handleCopy = useCallback(async (key, value) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      notify("تعذر النسخ", "error");
    }
  }, []);

  /* ------------------------------- states ------------------------------- */
  if (loading && !settings) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <AnalyzingImageDemo />
      </div>
    );
  }

  const inputBase =
    "border text-slate-800 text-sm font-medium rounded-lg block w-full pr-10 pl-4 py-3 placeholder:text-slate-400 focus:outline-none transition-all";
  const inputEditable =
    "bg-slate-50 focus:bg-white focus:ring-4";
  const inputReadonly = "bg-slate-100/70 cursor-default select-text";
  const inputOk =
    "border-slate-200 focus:border-[#a53860] focus:ring-[#a53860]/10";
  const inputBad = "border-red-400 focus:border-red-500 focus:ring-red-500/10";

  const fieldClass = (key) =>
    `${inputBase} ${canEdit ? inputEditable : inputReadonly} ${
      errors[key] ? inputBad : inputOk
    }`;

  /* Small helper: link field with copy/open actions in read-only mode */
  const LinkActions = ({ fieldKey, value }) =>
    !canEdit && value ? (
      <div className="absolute top-1/2 -translate-y-1/2 left-2 flex items-center gap-x-1">
        <button
          type="button"
          onClick={() => handleCopy(fieldKey, value)}
          title="نسخ الرابط"
          className="p-1.5 rounded-md text-slate-400 hover:text-[#a53860] hover:bg-white transition-colors"
        >
          {copiedKey === fieldKey ? (
            <Check size={15} className="text-[#4c956c]" />
          ) : (
            <Copy size={15} />
          )}
        </button>
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          title="فتح الرابط"
          className="p-1.5 rounded-md text-slate-400 hover:text-[#a53860] hover:bg-white transition-colors"
        >
          <ExternalLink size={15} />
        </a>
      </div>
    ) : null;

  const remaining = MAX_MESSAGE - form.whatsMessage.length;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-[#ffafcc] via-[#ff8fa3] to-[#4c956c] px-4 py-10 selection:bg-[#FFD600] selection:text-[#1E293B]">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full lg:w-[50%] bg-white rounded-3xl border border-[#E2E8F0] shadow-xl shadow-[#a53860]/5 p-8 flex flex-col items-center gap-y-7 mt-[20%] md:mt-[7%] lg:mt-[6%]"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center w-full">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#a53860]/10 to-[#4c956c]/15 ring-4 ring-[#4c956c]/10 flex items-center justify-center">
            <Settings2 className="text-[#a53860]" size={26} />
          </div>
          <h1 className="mt-4 font-extrabold text-xl text-[#1E293B]">
            اعدادات الدفع والتواصل
          </h1>
          <p className="text-sm text-[#64748B] mt-1.5 font-medium max-w-sm">
            حدد روابط الدفع ورسالة الواتساب التي تصل للعملاء
          </p>

          {/* Mode badge */}
          <div className="mt-4">
            {!exists ? (
              <span className="inline-flex items-center gap-x-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-[#FFD600]/20 text-[#8a6d00]">
                <Sparkles size={13} />
                لم يتم إعداد الإعدادات بعد — ابدأ بإضافتها
              </span>
            ) : editing ? (
              <span className="inline-flex items-center gap-x-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-[#a53860]/10 text-[#a53860]">
                <Pencil size={13} />
                وضع التعديل
                {isDirty && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fa518f] animate-pulse" />
                )}
              </span>
            ) : (
              <span className="inline-flex items-center gap-x-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-[#4c956c]/10 text-[#4c956c]">
                <Check size={13} />
                الاعدادات محفوظة
              </span>
            )}
          </div>
        </div>

        {/* Wallet link */}
        <div className="w-full">
          <label
            htmlFor="walletLink"
            className="block text-sm font-semibold text-slate-600 mb-2"
          >
            رابط المحفظة
          </label>
          <div className="relative">
            <Wallet
              className="absolute top-1/2 -translate-y-1/2 right-3.5 text-slate-400"
              size={16}
            />
            <input
              id="walletLink"
              type="url"
              dir="ltr"
              readOnly={!canEdit}
              value={form.walletLink}
              onChange={setField("walletLink")}
              placeholder={canEdit ? "https://" : "غير محدد"}
              aria-invalid={!!errors.walletLink}
              className={`${fieldClass("walletLink")} text-left ${!canEdit ? "pl-[5rem]" : ""}`}
            />
            <LinkActions fieldKey="walletLink" value={form.walletLink} />
          </div>
          {errors.walletLink && (
            <p className="flex items-center gap-x-1 text-red-500 text-xs font-bold mt-1.5 mr-1">
              <AlertCircle size={12} />
              {errors.walletLink}
            </p>
          )}
        </div>

        {/* Instapay link */}
        <div className="w-full">
          <label
            htmlFor="instaLink"
            className="block text-sm font-semibold text-slate-600 mb-2"
          >
            رابط انستاباي
          </label>
          <div className="relative">
            <Link2
              className="absolute top-1/2 -translate-y-1/2 right-3.5 text-slate-400"
              size={16}
            />
            <input
              id="instaLink"
              type="url"
              dir="ltr"
              readOnly={!canEdit}
              value={form.instaLink}
              onChange={setField("instaLink")}
              placeholder={canEdit ? "https://ipn.eg/..." : "غير محدد"}
              aria-invalid={!!errors.instaLink}
              className={`${fieldClass("instaLink")} text-left ${!canEdit ? "pl-[5rem]" : ""}`}
            />
            <LinkActions fieldKey="instaLink" value={form.instaLink} />
          </div>
          {errors.instaLink && (
            <p className="flex items-center gap-x-1 text-red-500 text-xs font-bold mt-1.5 mr-1">
              <AlertCircle size={12} />
              {errors.instaLink}
            </p>
          )}
        </div>

        {/* WhatsApp message */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="whatsMessage"
              className="block text-sm font-semibold text-slate-600"
            >
              رسالة الواتساب
            </label>
            {canEdit && (
              <span
                className={`text-xs font-bold ${
                  remaining < 0
                    ? "text-red-500"
                    : remaining < 100
                      ? "text-amber-500"
                      : "text-slate-400"
                }`}
              >
                {form.whatsMessage.length} / {MAX_MESSAGE}
              </span>
            )}
          </div>
          <div className="relative">
            <MessageCircle
              className="absolute top-3.5 right-3.5 text-slate-400"
              size={16}
            />
            <textarea
              id="whatsMessage"
              rows={5}
              readOnly={!canEdit}
              value={form.whatsMessage}
              onChange={setField("whatsMessage")}
              placeholder={
                canEdit ? "اكتب نص الرسالة التي سترسل للعميل..." : "غير محدد"
              }
              aria-invalid={!!errors.whatsMessage}
              className={`${fieldClass("whatsMessage")} resize-none leading-relaxed`}
            />
          </div>
          {errors.whatsMessage && (
            <p className="flex items-center gap-x-1 text-red-500 text-xs font-bold mt-1.5 mr-1">
              <AlertCircle size={12} />
              {errors.whatsMessage}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-y-3">
          {!canEdit ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="w-full flex justify-center items-center gap-x-3 px-4 py-3.5 rounded-xl text-white font-bold tracking-wide transition-all duration-300 active:scale-95 bg-[#fa518f] hover:bg-[#fa518f]/85 shadow-lg shadow-[#fa518f]/25"
            >
              <Pencil size={18} />
              تعديل الاعدادات
            </button>
          ) : (
            <div className="w-full flex gap-x-3 justify-between">
              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full flex justify-center items-center gap-x-3 px-4 py-3.5 rounded-xl text-white font-bold tracking-wide transition-all duration-300 active:scale-95 ${
                  canSubmit
                    ? "bg-[#fa518f] hover:bg-[#fa518f]/85 shadow-lg shadow-[#fa518f]/25"
                    : "bg-[#fa518f]/50 cursor-not-allowed"
                }`}
              >
                {saving ? (
                  <span className="loader"></span>
                ) : (
                  <>
                    <Save size={18} />
                    {exists ? "حفظ التعديلات" : "حفظ الاعدادات"}
                    <FaLongArrowAltLeft />
                  </>
                )}
              </button>

              {/* Show cancel when editing existing settings, or when a new form has input */}
              {(exists || isDirty) && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className={`w-full flex justify-center items-center gap-x-3 px-4 py-3.5 rounded-xl text-white font-bold tracking-wide transition-all duration-300 active:scale-95 ${
                    saving
                      ? "bg-gray-600/40 cursor-not-allowed"
                      : "bg-gray-600/90 hover:bg-gray-600"
                  }`}
                >
                  <MdUndo size={18} />
                  إلغاء
                </button>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}