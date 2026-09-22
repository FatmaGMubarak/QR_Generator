import {useState} from 'react'
import {
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";

import { useFormik } from "formik";
import * as Yup from "yup";

const FloatingField = ({
  icon: Icon,
  type = "password",
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  showToggle,
  visible,
  onToggle,
}) => {
  const hasError = Boolean(touched && error);

  return (
    <div className="relative z-0 w-full mb-6 group focus:scale-105 duration-300 transition-all">
      <Icon
        className={`absolute top-3 right-0 pointer-events-none ${
          hasError ? "text-red-400" : "text-[#4c956c]"
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
        className={`peer block w-full py-2.5 pr-7 pl-1 text-sm text-right text-[#1c3b30] bg-transparent border-0 border-b-[1.5px] appearance-none focus:outline-none focus:ring-0 ${
          hasError
            ? "border-red-400 focus:border-red-400"
            : "border-[#4c956c] focus:border-[#4c956c]"
        }`}
      />
      <label
        htmlFor={name}
        className={`absolute text-base font-semibold duration-300 transform -translate-y-6 scale-75 top-3 right-7 -z-10 origin-[100%_0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-3 peer-placeholder-shown:right-7 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:right-0 peer-focus:font-bold ${
          hasError ? "text-red-400 peer-focus:text-red-400" : "text-[#4c956c] peer-focus:text-[#397a55]"
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
          className="absolute left-0 top-2.5 text-[#7d9a91] hover:text-[#397a55] focus:text-white transition-colors"
        >
          {visible ? (
            <EyeOff size={17} strokeWidth={1.75} />
          ) : (
            <Eye size={17} strokeWidth={1.75} />
          )}
        </button>
      )}
      {hasError && (
        <p className="mt-1 text-[12px] text-red-400 text-right">{error}</p>
      )}
    </div>
  );
};

// Base rules shared by both modes
const baseSchema = {
  password: Yup.string()
    .min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف")
    .required("كلمة المرور مطلوبة"),
};


const signupSchema = Yup.object({
  ...baseSchema,
  confirm: Yup.string()
    .oneOf([Yup.ref("password")], "كلمتا المرور غير متطابقتين")
    .required("تأكيد كلمة المرور مطلوب")
});

export default function PasswordConfirm() {
     const [showPw, setShowPw] = useState(false);
      const [showPw2, setShowPw2] = useState(false);

       const formik = useFormik({
          initialValues: {
            email: "",
            password: "",
            confirm: "",
            firstName: "",
            lastName: "",
            phone: "",
            company: "",
          },
          validationSchema: signupSchema,
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
    <form onSubmit={formik.handleSubmit} className="w-full max-w-md flex flex-col items-center">
                   <FloatingField
                                icon={Lock}
                                label="كلمة المرور"
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
    
                  
                </form>
  )
}
