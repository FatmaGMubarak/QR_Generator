import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Wallet, Link2, MessageCircle, Save, RotateCcw, Settings2, CheckCheck, X } from "lucide-react";
import { FaLongArrowAltLeft } from "react-icons/fa";

import notify from "../../hooks/Notifications";
import AnalyzingImageDemo from "../../components/common/AnalyzingImageDemo";
import { createSettings, fetchSettings, updateSettings } from "../../store/reducers/settingsSlice";

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

export default function AdminSettingsPage() {
  const dispatch = useDispatch();

  const settings = useSelector((state) => state?.settings?.settings);
  const loading = useSelector((state) => state?.settings?.loading);

  const [form, setForm] = useState(EMPTY);
  const [saved, setSaved] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (!settings) return;
    const next = {
      walletLink: settings["willet-link"] ?? "",
      instaLink: settings["insta-link"] ?? "",
      whatsMessage: settings["whats_message"] ?? "",
    };
    setForm(next);
    setSaved(next);
  }, [settings]);

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(saved),
    [form, saved],
  );

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
    if (!validate()) return;

    try {
      setSaving(true);

      const data = new FormData();
      data.append("willet-link", form.walletLink.trim());
      data.append("insta-link", form.instaLink.trim());
      data.append("whats_message", form.whatsMessage);

      const response = await dispatch(createSettings(data)).unwrap();

      setSaved({
        walletLink: form.walletLink.trim(),
        instaLink: form.instaLink.trim(),
        whatsMessage: form.whatsMessage,
      });
      notify(response?.message || "تم حفظ الاعدادات بنجاح", "success");
    } catch (err) {
      notify(err?.message || "حدث خطأ ما", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(saved);
    setErrors({});
  };

  if (loading && !settings) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <AnalyzingImageDemo />
      </div>
    );
  }

  const inputBase =
    "bg-slate-50 border text-slate-800 text-sm font-medium rounded-lg focus:bg-white focus:ring-4 block w-full pr-10 pl-4 py-3 placeholder:text-slate-400 focus:outline-none transition-all";
  const inputOk =
    "border-slate-200 focus:border-[#a53860] focus:ring-[#a53860]/10";
  const inputBad = "border-red-400 focus:border-red-500 focus:ring-red-500/10";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-[#ffafcc] via-[#ff8fa3] to-[#4c956c] px-4 py-10 selection:bg-[#FFD600] selection:text-[#1E293B]">
      <form
        onSubmit={handleSubmit}
        className="w-full lg:w-[50%] bg-white rounded-3xl border border-[#E2E8F0] shadow-xl shadow-[#a53860]/5 p-8 flex flex-col items-center gap-y-7 mt-[20%] md:mt-[7%] lg:mt-[7%]"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#a53860]/10 to-[#4c956c]/15 ring-4 ring-[#4c956c]/10 flex items-center justify-center">
            <Settings2 className="text-[#a53860]" size={26} />
          </div>
          <h1 className="mt-4 font-extrabold text-xl text-[#1E293B]">
            اعدادات الدفع والتواصل
          </h1>
          <p className="text-sm text-[#64748B] mt-1.5 font-medium max-w-sm">
            حدد روابط الدفع ورسالة الواتساب التي تصل للعملاء
          </p>
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
              value={form.walletLink}
              onChange={setField("walletLink")}
              placeholder="https://"
              className={`${inputBase} text-left ${errors.walletLink ? inputBad : inputOk}`}
            />
          </div>
          {errors.walletLink && (
            <p className="text-red-500 text-xs font-bold mt-1.5 mr-1">
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
              value={form.instaLink}
              onChange={setField("instaLink")}
              placeholder="https://ipn.eg/..."
              className={`${inputBase} text-left ${errors.instaLink ? inputBad : inputOk}`}
            />
          </div>
          {errors.instaLink && (
            <p className="text-red-500 text-xs font-bold mt-1.5 mr-1">
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
            <span
              className={`text-xs font-bold ${
                form.whatsMessage.length > MAX_MESSAGE
                  ? "text-red-500"
                  : "text-slate-400"
              }`}
            >
              {form.whatsMessage.length} / {MAX_MESSAGE}
            </span>
          </div>
          <div className="relative">
            <MessageCircle
              className="absolute top-3.5 right-3.5 text-slate-400"
              size={7}
            />
            <textarea
              id="whatsMessage"
              rows={5}
              value={form.whatsMessage}
              onChange={setField("whatsMessage")}
              placeholder="اكتب نص الرسالة التي سترسل للعميل..."
              className={`${inputBase} resize-none leading-relaxed ${errors.whatsMessage ? inputBad : inputOk}`}
            />
          </div>
          {errors.whatsMessage && (
            <p className="text-red-500 text-xs font-bold mt-1.5 mr-1">
              {errors.whatsMessage}
            </p>
          )}

         
        </div>

        {/* Actions */}
        <div className="w-full flex gap-x-3 justify-between">
          <button
            type="submit"
            disabled={saving || !isDirty}
            className={`w-full flex justify-center items-center gap-x-3 px-4 py-3.5 rounded-xl text-white font-bold tracking-wide transition-all duration-300 active:scale-95 ${
              isDirty && !saving
                ? "bg-[#fa518f] hover:bg-[#fa518f]/85 shadow-lg shadow-[#fa518f]/25"
                : "bg-[#fa518f]/50 cursor-not-allowed"
            }`}
          >
            {saving ? (
              <span className="loader"></span>
            ) : (
              <>
                <Save size={18} />
                حفظ الاعدادات
                <FaLongArrowAltLeft />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={!isDirty || saving}
            className={`w-full flex justify-center items-center gap-x-3 px-4 py-3.5 rounded-xl text-white font-bold tracking-wide transition-all duration-300 active:scale-95 ${
              isDirty && !saving
                ? "bg-gray-600/90 hover:bg-gray-600"
                : "bg-gray-600/40 cursor-not-allowed"
            }`}
          >
            الغاء
            <X size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}