import React, { useState } from 'react';
import { Mail, Settings, ArrowLeft, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';
import OtpInputs from '../../components/common/OtpInputs';
import PasswordConfirm from '../../components/common/PasswordConfirm';

const FloatingField = ({
  icon: Icon,
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  touched,
}) => {
  const hasError = Boolean(touched && error);

  return (
    <div className="relative z-0 w-full mb-6 group transition-transform duration-300 focus-within:scale-[1.02]">
      <Icon
        className={`absolute top-3.5 right-3 pointer-events-none transition-colors ${
          hasError ? "text-red-400" : "text-[#4c956c]"
        }`}
        size={18}
        strokeWidth={1.75}
      />
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder=" "
        className={`peer block w-full py-2.5 pr-10 pl-3 text-base font-semibold text-right text-[#1c3b30] bg-transparent border-[1.5px] rounded-xl appearance-none focus:outline-none focus:ring-0 transition-colors ${
          hasError
            ? "border-red-400 focus:border-red-400"
            : "border-[#4c956c]/50 focus:border-[#4c956c]"
        }`}
      />
      <label
        htmlFor={name}
        className={`absolute text-lg font-bold duration-300 transform -translate-y-6 scale-75 -top-1 right-2 z-10 origin-[100%_0] 
          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:right-10 peer-placeholder-shown:text-gray-400
          peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:right-3 peer-focus:font-bold ${
          hasError ? "text-red-400 peer-focus:text-red-400" : "text-[#4c956c] peer-focus:text-[#397a55]"
        }`}
      >
        {label}
      </label>
      {hasError && (
        <p className="mt-1 text-[12px] text-red-400 text-right">{error}</p>
      )}
    </div>
  );
};

const baseSchema = Yup.object().shape({
  email: Yup.string()
    .email("البريد الإلكتروني غير صالح")
    .required("البريد الإلكتروني مطلوب"),
});

export default function ForgetPassword() {
  const [step, setStep] = useState("mail");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      password: "",
      confirm: "",
    },
    validationSchema: baseSchema,
    onSubmit: (values, { setSubmitting }) => {
      console.log(values);
      setSubmitting(false);
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

  return (
    <div dir="rtl" className="min-h-screen w-full bg-gradient-to-br from-[#ffafcc] via-[#ff8fa3] to-[#4c956c] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800&family=Tajawal:wght@400;500;700&display=swap');`}</style>

      <div className={`w-full max-w-xl min-h-[550px] flex flex-col ${step === 'mail' || step === 'password' ? 'justify-between' : 'gap-y-10'} items-center bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/80 p-6 sm:p-8 md:p-10 transition-all duration-500`}>
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center w-full">
          <div className="bg-[#4c956c] w-12 h-12 rounded-xl flex justify-center items-center shadow-md mb-3">
            <Settings className="text-white" size={24} />
          </div>
          <h1 className="font-['Cairo'] font-extrabold text-2xl sm:text-3xl text-[#1c3b30] mb-2">
            نسيت كلمة المرور؟
          </h1>
          <p className="font-['Cairo'] font-semibold text-sm sm:text-base text-[#1c3b30]/80 max-w-md">
            أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق
          </p>
        </div>

        {/* Stepper Steps */}
        <div className="flex items-center justify-center w-full max-w-xs sm:max-w-sm my-6 dir-ltr">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#4c956c] flex justify-center items-center transition-transform ${step === 'mail' ? 'scale-110 ring-4 ring-[#4c956c]/30' : ''}`}>
            <Mail className="text-white" size={20} />
          </div>
          
          <div className={`flex-1 h-1 transition-colors duration-300 ${step === 'otp' || step === 'password' ? 'bg-[#4c956c]' : 'bg-white/90'}`} />

          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex justify-center items-center transition-all ${step === 'otp' || step === 'password' ? 'bg-[#4c956c]' : 'bg-white/90'} ${step === 'otp' ? 'scale-110 ring-4 ring-[#4c956c]/30' : ''}`}>
            <ShieldCheck className={step === 'otp' || step === 'password' ? 'text-white' : 'text-[#1c3b30]'} size={20} />
          </div>

          <div className={`flex-1 h-1 transition-colors duration-300 ${step === 'password' ? 'bg-[#4c956c]' : 'bg-white/90'}`} />

          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex justify-center items-center transition-all ${step === 'password' ? 'bg-[#4c956c]' : 'bg-white/90'} ${step === 'password' ? 'scale-110 ring-4 ring-[#4c956c]/30' : ''}`}>
            <KeyRound className={step === 'password' ? 'text-white' : 'text-[#1c3b30]'} size={20} />
          </div>
        </div>

        {step === 'mail' && (
          <>
            {/* Form Section */}
            <form onSubmit={formik.handleSubmit} className="w-full max-w-md flex flex-col items-center">
              <FloatingField
                icon={Mail}
                type="email"
                label="البريد الإلكترونى"
                {...fieldProps("email")}
              />

              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 px-5 font-bold text-base text-white bg-gradient-to-r from-[#4c956c] to-[#397a55] hover:from-[#ff8fa3] hover:to-[#4c956c] shadow-[0_8px_18px_-6px_rgba(57,122,85,0.55)] transition-all active:scale-[0.98] group disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                إرسال رمز التحقق
                <ArrowLeft
                  size={18}
                  strokeWidth={2}
                  className="transition-transform group-hover:-translate-x-1"
                />
              </button>
            </form>

            {/* Footer Section */}
            <div className="text-center font-['Tajawal'] text-sm text-[#567268]">
              هل تذكرت كلمة السر؟{" "}
              <button
                type="button"
                className="font-bold text-[#397a55] hover:text-[#76b491] transition-colors duration-200 cursor-pointer mr-1"
                onClick={() => navigate("/login")}
              >
                تسجيل الدخول
              </button>
            </div>
          </>
        )}

        {step === 'otp' && (
          <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center">
            {/* Centralized Grid */}
            {/* <div className="grid grid-cols-6 gap-2 sm:gap-3 w-full justify-center items-center justify-items-center" dir="ltr">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  maxLength={1}
                  className="w-10 h-14 sm:w-12 sm:h-16 rounded-xl bg-white/50 border-2 border-[#4c956c]/40 text-center font-bold text-xl text-[#1c3b30] shadow-sm focus:border-[#4c956c] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4c956c]/30 transition-all duration-200"
                />
              ))}
            </div> */}
            <OtpInputs />

            {/* OTP Action Button */}
            <button
              type="button"
              className="w-full mt-8 flex items-center justify-center gap-2 rounded-xl py-3.5 px-5 font-bold text-base text-white bg-gradient-to-r from-[#4c956c] to-[#397a55] hover:from-[#ff8fa3] hover:to-[#4c956c] shadow-[0_8px_18px_-6px_rgba(57,122,85,0.55)] transition-all active:scale-[0.98] cursor-pointer"
            >
              تأكيد الرمز
              <ArrowLeft size={18} strokeWidth={2} />
            </button>
            <button
  type="button"
  onClick={() => setStep('mail')}
  className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-[#397a55] hover:text-[#4c956c] transition-colors cursor-pointer"
>
  <ArrowRight size={18} />
  <span>الرجوع للخطوة السابقة</span>
</button>
          </div>
        )}

        {step === 'password' && (
            <>
            <PasswordConfirm /> 
            <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 px-5 font-bold text-base text-white bg-gradient-to-r from-[#4c956c] to-[#397a55] hover:from-[#ff8fa3] hover:to-[#4c956c] shadow-[0_8px_18px_-6px_rgba(57,122,85,0.55)] transition-all active:scale-[0.98] group disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                   حفظ كلمة السر الجديدة
                    <ArrowLeft
                      size={18}
                      strokeWidth={2}
                      className="transition-transform group-hover:-translate-x-1"
                    />
                  </button>
                  <button
  type="button"
  onClick={() => setStep('otp')}
  className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-[#397a55] hover:text-[#4c956c] transition-colors cursor-pointer"
>
  <ArrowRight size={18} />
  <span>الرجوع للخطوة السابقة</span>
</button>
            </>
        )}

      </div>
    </div>
  );
}