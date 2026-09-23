import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import qr from '../../assets/qr-code.png'
import {
  //Mail,
  Lock,
  User,
  Phone,
  //Building2,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
//import { FcGoogle } from "react-icons/fc";

import { useFormik } from "formik";
import * as Yup from "yup";
import { login, register } from "../../store/reducers/auth/authSlice";
import { useUserOptions } from "../../context/UserOptionsContext";
import notify from "../../hooks/Notifications";

const FloatingField = forwardRef(({
  icon: Icon,
  type = "text",
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
  autoFocus,
}, ref) => {
  const hasError = Boolean(touched && error);

  return (
    <div className="relative z-0 w-full mb-9 group focus:scale-105 duration-300 transition-all">
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
        autoFocus={autoFocus}
        ref={ref}
        className={`peer block w-full py-1.5 pr-7 pl-1 text-sm text-right text-[#4c956c] bg-transparent border-0 border-b-[1.5px] appearance-none focus:outline-none focus:ring-0 ${
          hasError
            ? "border-red-400 focus:border-red-400"
            : "border-[#4c956c] focus:border-[#4c956c]"
        }`}
      />
      <label
        htmlFor={name}
        className={`absolute text-base font-semibold duration-300 transform -translate-y-6 scale-75 top-2 right-7 -z-10 origin-[100%_0] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-placeholder-shown:top-3 peer-placeholder-shown:right-7 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:right-0 peer-focus:font-bold ${
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
          className="absolute left-0 top-2.5 text-[#7d9a91] hover:text-[#397a55] focus:text-[#7d9a91] transition-colors"
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
});

// Base rules shared by both modes
const baseSchema = {
  // email: Yup.string()
  //   .email("البريد الإلكتروني غير صالح")
  //   .required("البريد الإلكتروني مطلوب"),
  phone: Yup.string()
    .matches(/^[0-9+\s-]{7,15}$/, "رقم الهاتف غير صالح")
    .required("رقم الهاتف مطلوب"),
  password: Yup.string()
    .min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف")
    .required("كلمة المرور مطلوبة"),
};

const loginSchema = Yup.object(baseSchema);

const signupSchema = Yup.object({
  ...baseSchema,
  userName: Yup.string().required("اسم المستخدم مطلوب"),
  // lastName: Yup.string().required("الاسم الأخير مطلوب"),
  confirm: Yup.string()
    .oneOf([Yup.ref("password")], "كلمتا المرور غير متطابقتين")
    .required("تأكيد كلمة المرور مطلوب"),
  
  //company: Yup.string().required("اسم الشركة مطلوب"),
});

export default function Login() {
  const {mode, setMode} = useUserOptions();
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const isLogin = mode === "login";

  const navigate = useNavigate()

  const dispatch = useDispatch();

  const phoneRef = useRef(null);

useEffect(() => {
  if (isLogin) {
    phoneRef.current?.focus();
  }
}, [isLogin]);

  const formik = useFormik({
    initialValues: {
      //email: "",
      password: "",
      confirm: "",
      userName: "",
      //lastName: "",
      phone: "",
      //company: "",
    },
    validationSchema: isLogin ? loginSchema : signupSchema,
    onSubmit: (values, { setSubmitting }) => {
      isLogin? loginAccount(values) : registerAccount(values)
      setSubmitting(false);
    },
  });

  const switchMode = (next) => {
    setMode(next);
    formik.setTouched({});
    formik.setErrors({});
  };

  const fieldProps = (name) => ({
    name,
    value: formik.values[name],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: formik.errors[name],
    touched: formik.touched[name],
  });



  const loginAccount = async (values) =>{
    try{
      const formData = new FormData();
      formData.append("phone", values?.phone)
      formData.append("password", values?.password)
      const response = await dispatch(login(formData)).unwrap();
      if(response.token){
        notify("تم تسجيل الدخول بنجاح", "success")
        navigate("/user")
      }
    } catch(err){
        notify(err.message, "error")
    }
  }

  const registerAccount = async (values) =>{
    try{
      const formData = new FormData();
      formData.append("name", values?.userName);
      formData.append("phone", values?.phone);
      formData.append("password", values?.password);
      formData.append("confirmPassword", values?.confirm);
      const response = await dispatch(register(formData)).unwrap();
       if(response?.token){
        
        const loginFormData = new FormData();
        loginFormData.append("phone", values?.phone);
        loginFormData.append("password", values?.password);
        await dispatch(login(loginFormData)).unwrap();
        notify("تم انشاء حساب بنجاح", "success");
                navigate("/user");

      }
      
    } catch(err){
        notify(err.message, "error");
    }
  }

  return (
    
    <div className="w-full min-h-screen md:min-h-screen lg:h-screen flex items-center bg-gradient-to-br from-[#ffafcc] via-[#ff8fa3] to-[#4c956c] overflow-hidden">
      <div
  className="
    w-full
    min-h-screen
    grid
    grid-cols-1
    lg:grid-cols-[0.85fr_1.15fr]
    overflow-hidden
    border border-[#dce9e1]
    shadow-[0_25px_70px_-20px_rgba(57,122,85,0.25)]
  "
>
        <aside className="relative flex flex-col justify-between overflow-hidden">
          <div className="absolute w-full h-[340px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.45),transparent_70%)] blur-[10px] -top-20 -left-24" />
            
          <img src={qr} alt="" className="w-full object-cover h-full shadow-xl" />
        </aside>

       <section
        className="
          flex
          flex-col
          justify-center
          p-7
          md:p-11
          w-full
          mx-auto
        
        "
      >
          <div className={`border border-gray-100 rounded-xl ${isLogin ? 'py-24' : 'py-8'} w-full shadow-xl bg-white`}>
            <div
            className="
              flex
              items-center
              p-1
              rounded-2xl
              bg-[#f4f8f5]
              border border-[#e7efe9]
              mb-8
              w-[80%]
              mx-auto
            "
          >
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`
                flex-1
                py-2.5
                rounded-xl
                font-['Tajawal']
                text-[13px]
                font-bold
                transition-all
                duration-300
                ${
                  isLogin
                    ? "bg-[#397a55] text-white shadow-[0_4px_15px_-5px_rgba(40,70,55,0.25)]"
                    : "text-[#84958e] hover:text-[#397a55]"
                }
              `}
            >
              تسجيل الدخول
            </button>

            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`
                flex-1
                py-2.5
                rounded-xl
                font-['Tajawal']
                text-[13px]
                font-bold
                transition-all
                duration-300
                ${
                  !isLogin
                    ? "bg-[#397a55] text-white shadow-[0_4px_15px_-5px_rgba(40,70,55,0.25)]"
                    : "text-[#84958e] hover:text-[#397a55]"
                }
              `}
            >
              إنشاء حساب
            </button>
          </div>

          <h2 className="font-['Cairo'] font-extrabold text-2xl text-[#1c3b30] mb-1.5 mr-20">
            {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </h2>
          <p className="font-['Tajawal'] text-[13.5px] text-[#567268] mb-7 mr-20">
            {isLogin
              ? "أدخل بياناتك للوصول إلى حسابك"
              : "املأ البيانات التالية لإنشاء حسابك"}
          </p>

          <form
            onSubmit={formik.handleSubmit}
            noValidate
            className="font-['Tajawal'] flex flex-col w-[75%] mx-auto"
          >
            {!isLogin && (
              <div className="flex flex-col md:flex-row gap-0 md:gap-4">
                <FloatingField icon={User} label="اسم المستخدم" {...fieldProps("userName")} autoFocus={mode === 'signup'} />
                {/* <FloatingField icon={User} label="الاسم الأخير" {...fieldProps("lastName")} /> */}
              </div>
            )}

            <FloatingField icon={Phone} type="tel" label="رقم الهاتف" {...fieldProps("phone")} ref={phoneRef}/>

            {/* <FloatingField
              icon={Mail}
              type="email"
              label="البريد الإلكتروني"
              {...fieldProps("email")}
            /> */}

            <FloatingField
              icon={Lock}
              label="كلمة المرور"
              showToggle
              visible={showPw}
              onToggle={() => setShowPw((v) => !v)}
              {...fieldProps("password")}
            />

            {!isLogin && (
              <>
                <FloatingField
                  icon={Lock}
                  label="تأكيد كلمة المرور"
                  showToggle
                  visible={showPw2}
                  onToggle={() => setShowPw2((v) => !v)}
                  {...fieldProps("confirm")}
                />
                
                  
                  {/* <FloatingField icon={Building2} label="اسم الشركة" {...fieldProps("company")} /> */}
                
              </>
            )}

            {isLogin && (
              <div className="flex items-center justify-end text-[13px] -mt-1.5 mb-6">
                <Link
                  to={"/forget-password"}
                  className="font-semibold text-[#397a55] hover:underline"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="flex items-center justify-center gap-2 rounded-[10px] py-3.5 font-bold text-[15px] text-white bg-gradient-to-r from-[#4c956c] to-[#397a55] hover:from-[#ff8fa3] hover:to-[#4c956c] shadow-[0_8px_18px_-6px_rgba(57,122,85,0.55)] transition-all active:scale-[0.99] group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLogin ? "دخول" : "إنشاء الحساب"}
              <ArrowLeft
                size={17}
                strokeWidth={2}
                className="transition-transform group-hover:-translate-x-1"
              />
            </button>
            {/* <button className="flex items-center justify-center gap-2 mt-5 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-5 rounded-xl border border-gray-300 shadow-sm transition-colors">
  <FcGoogle className="text-xl" />
  المتابعة باستخدام Google
</button> */}
          </form>

          <p className="text-center font-['Tajawal'] text-[13.5px] text-[#567268] mt-6">
            {isLogin ? (
              <>
                ليس لديك حساب؟{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="font-bold text-[#397a55]"
                >
                  أنشئ حسابًا الآن
                </button>
              </>
            ) : (
              <>
                لديك حساب بالفعل؟{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="font-bold text-[#397a55]"
                >
                  سجّل الدخول
                </button>
              </>
            )}
          </p>
          </div>
        </section>
      </div>
    </div>
  );
}