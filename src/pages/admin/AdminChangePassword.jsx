import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../store/reducers/auth/authSlice";
import notify from "../../hooks/Notifications";

const FloatingField = ({
  icon: Icon,
  type = "text",
  label,
  hint,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  showToggle,
  visible,
  onToggle,
  autofocus,
}) => {
  const hasError = Boolean(touched && error);

  return (
    <div className="relative z-0 w-full mb-6 group">
      <Icon
        className={`absolute top-3 right-0 pointer-events-none transition-colors ${
          hasError ? "text-red-400" : "text-gray-600 group-focus-within:text-gray-700"
        }`}
        size={18}
        strokeWidth={1.75}
      />
      <input
        type={showToggle ? (visible ? "text" : "password") : type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder=" "
        autoFocus={autofocus}
        className={`peer block w-full py-2.5 pr-7 ${
          showToggle ? "pl-7" : "pl-1"
        } text-[15px] text-right text-[#284b63] bg-transparent border-0 border-b-[1.5px] appearance-none focus:outline-none focus:ring-0 transition-colors ${
          hasError
            ? "border-red-400 focus:border-red-400"
            : "border-gray-600 focus:border-gray-700"
        }`}
      />
      <label
        htmlFor={name}
        className={`absolute text-[15px] font-semibold duration-300 transform -translate-y-6 scale-75 top-3 right-7 z-10 origin-[100%_0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-3 peer-placeholder-shown:right-7 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:right-0 peer-focus:font-bold ${
          hasError
            ? "text-red-400 peer-focus:text-red-400"
            : "text-gray-600 peer-focus:text-gray-700"
        }`}
      >
        {label}
      </label>
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          tabIndex={-1}
          aria-label={visible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          className="absolute left-0 top-2.5 text-gray-600 hover:text-gray-700 focus:text-gray-700 transition-colors"
        >
          {visible ? (
            <EyeOff size={17} strokeWidth={1.75} />
          ) : (
            <Eye size={17} strokeWidth={1.75} />
          )}
        </button>
      )}
      <div className="min-h-[16px] mt-1 text-right">
        {hasError ? (
          <p className="text-[12px] font-medium text-red-400">{error}</p>
        ) : hint ? (
          <p className="text-[12px] text-gray-600">{hint}</p>
        ) : null}
      </div>
    </div>
  );
};

const forgetPassSchema = Yup.object({
  phone: Yup.string().matches(/^[0-9+\s-]{7,15}$/, "رقم الهاتف غير صالح"),
  password: Yup.string()
    .min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف")
    .required("كلمة المرور مطلوبة"),
  confirm: Yup.string()
    .oneOf([Yup.ref("password")], "كلمتا المرور غير متطابقتين")
    .required("تأكيد كلمة المرور مطلوب"),
});

export default function AdminChangePassword() {
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [done, setDone] = useState(false);

  const user = useSelector((state) => state?.auth?.user);

    const loading = useSelector((state)=> state?.auth?.loading);

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      phone: "",
      password: "",
      confirm: "",
    },
    validationSchema: forgetPassSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const newPasswordData = new FormData();
        newPasswordData.append("user_id", user?.id);
        newPasswordData.append("password", values.password);
        newPasswordData.append("confirmPassword", values.confirm);

        const response = await dispatch(changePassword(newPasswordData)).unwrap();

        notify(response?.message, "success");
        resetForm();
        setDone(true);
      } catch (err) {
        notify(err.message, "error");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fieldProps = (name) => ({
    name,
    value: formik.values[name],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: formik.errors[name],
    touched: formik.touched[name],
  });

  const canSubmit = formik.isValid && formik.dirty && !formik.isSubmitting;

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-r from-[#ffafcc] via-[#ff8fa3] to-[#4c956c] flex items-center justify-center p-5 overflow-hidden mt-[20%] md:mt-[7%] lg:mt-[3%]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800&family=Tajawal:wght@400;500;700&display=swap');`}</style>

      

      <div className="relative w-full max-w-xl flex flex-col bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/10 border border-white/60 p-6 sm:p-8 md:p-10">
        {!done ? (
          <>
            {/* Header */}
            <div className="w-full flex items-start justify-between gap-4 mb-2">
              <div>
                <p className="font-['Cairo'] text-[11px] font-bold tracking-[0.15em] text-[#fa518f] mb-1.5">
                  لوحة التحكم · إدارة المستخدمين
                </p>
                <h1 className="font-['Cairo'] font-extrabold text-2xl sm:text-3xl text-[#1E293B] leading-tight">
                  تغيير كلمة مرور العميل
                </h1>
              </div>
              <div className="shrink-0 bg-[#fa518f] w-14 h-14 rounded-2xl flex justify-center items-center shadow-lg shadow-[#fa518f]/30">
                <ShieldCheck className="text-white" size={24} />
              </div>
            </div>
            <p className="font-['Tajawal'] font-medium text-sm sm:text-base text-[#284b63]/70 w-full mb-8">
              حدد المستخدم عبر رقم هاتفه، ثم عيّن كلمة مرور جديدة تتوافق مع متطلبات الأمان.
            </p>

            <form
              onSubmit={formik.handleSubmit}
              noValidate
              className="font-['Tajawal'] flex flex-col w-full"
            >
              <FloatingField
                icon={Phone}
                type="tel"
                label="رقم هاتف المستخدم"
                {...fieldProps("phone")}
                autofocus={true}
              />

              <div className="mt-1">
                <FloatingField
                  icon={Lock}
                  label="كلمة المرور الجديدة"
                  hint="8 أحرف على الأقل"
                  showToggle
                  visible={showPw}
                  onToggle={() => setShowPw((v) => !v)}
                  {...fieldProps("password")}
                />
                <FloatingField
                  icon={Lock}
                  label="تأكيد كلمة المرور"
                  showToggle
                  visible={showPw2}
                  onToggle={() => setShowPw2((v) => !v)}
                  {...fieldProps("confirm")}
                />
              </div>

              <div className="flex items-center gap-3 mt-2">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-[10px] py-3.5 font-bold text-[15px] text-white shadow-lg transition-all active:scale-[0.99] group ${
                    canSubmit
                      ? "bg-[#fa518f] hover:bg-[#fa518f]/85 shadow-[#fa518f]/25"
                      : "bg-[#fa518f]/40 shadow-none cursor-not-allowed"
                  }`}
                >
                  {loading ?  <span className="loader"></span> : "حفظ كلمة المرور الجديدة"}
                  {!formik.isSubmitting && (
                    <ArrowLeft
                      size={17}
                      strokeWidth={2}
                      className="transition-transform group-hover:-translate-x-1"
                    />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => formik.resetForm()}
                  className="w-[35%] lg:w-[20%] flex justify-center items-center gap-x-3 bg-gray-600/75 hover:bg-gray-600 transition-all duration-300 px-4 py-3 text-white rounded-xl shadow-lg shadow-gray-600/20 font-bold tracking-wide active:scale-95"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center text-center py-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6bb890] to-[#4c956c] flex items-center justify-center mb-5 shadow-lg shadow-[#4c956c]/30">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <h2 className="font-['Cairo'] font-extrabold text-xl text-[#1E293B] mb-2">
              تم تحديث كلمة المرور بنجاح
            </h2>
            <p className="font-['Tajawal'] text-sm text-[#284b63]/60 max-w-xs mb-6">
              يمكن للمستخدم الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.
            </p>
            <button
              onClick={() => setDone(false)}
              className="font-['Tajawal'] font-bold text-sm text-white bg-[#4c956c] hover:bg-[#3a7855] transition-all rounded-xl px-6 py-3 shadow-lg shadow-[#4c956c]/25"
            >
              تغيير كلمة مرور مستخدم آخر
            </button>
          </div>
        )}
      </div>
    </div>
  );
}