import { useEffect, useState } from "react";

import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";

import { useFormik } from "formik";
import * as Yup from "yup";

import { useDispatch, useSelector } from "react-redux";

import {
  changePassword,
  fetchUsers,
} from "../../store/reducers/auth/authSlice";

import notify from "../../hooks/Notifications";

import Select from "react-select";

const changePasswordSchema = Yup.object({
  password: Yup.string()
    .min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف")
    .required("كلمة المرور مطلوبة"),

  confirm: Yup.string()
    .oneOf([Yup.ref("password")], "كلمتا المرور غير متطابقتين")
    .required("تأكيد كلمة المرور مطلوب"),
});

export default function AdminChangePassword() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [done, setDone] = useState(false);

  const dispatch = useDispatch();

  const users = useSelector((state) => state?.auth?.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const options =
    users?.map((user) => ({
      value: user?.id,
      label: `${user?.name} - ${user?.phone}`,
    })) || [];

  const formik = useFormik({
    initialValues: {
      password: "",
      confirm: "",
    },

    validationSchema: changePasswordSchema,

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!selectedUser?.id) {
        notify("برجاء اختيار العميل أولاً", "error");
        setSubmitting(false);
        return;
      }

      try {
        const newPasswordData = new FormData();

        //newPasswordData.append("user_id", selectedUser.id);
        newPasswordData.append("phone", selectedUser.phone);

        newPasswordData.append("password", values.password);
        newPasswordData.append("confirmPassword", values.confirm);

        const response = await dispatch(
          changePassword(newPasswordData)
        ).unwrap();

        notify(response?.message, "success");

        resetForm();
        setSelectedUser(null);
        setDone(true);
      } catch (err) {
        notify(
          err?.message || "حدث خطأ أثناء تغيير كلمة المرور",
          "error"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const passwordError =
    formik.touched.password && formik.errors.password;

  const confirmError =
    formik.touched.confirm && formik.errors.confirm;

  const canSubmit =
    selectedUser?.id &&
    formik.isValid &&
    formik.dirty &&
    !formik.isSubmitting;

  const handleCancel = () => {
    formik.resetForm();
    setSelectedUser(null);
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-r from-[#ffafcc] via-[#ff8fa3] to-[#4c956c] flex items-center justify-center p-5 overflow-hidden mt-[20%] md:mt-[7%] lg:mt-[3%]">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800&family=Tajawal:wght@400;500;700&display=swap');
        `}
      </style>

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
                <ShieldCheck
                  className="text-white"
                  size={24}
                />
              </div>
            </div>

            <p className="font-['Tajawal'] font-medium text-sm sm:text-base text-[#284b63]/70 w-full mb-8">
              حدد المستخدم، ثم عيّن كلمة مرور جديدة تتوافق مع
              متطلبات الأمان.
            </p>

            <form
              onSubmit={formik.handleSubmit}
              noValidate
              className="font-['Tajawal'] flex flex-col w-full"
            >
              {/* User */}
              <div className="w-full mb-6">
                <label className="block text-sm font-bold text-[#475569] mb-2 mr-1">
                  اسم العميل
                </label>

                <Select
                  options={options}
                  value={
                    options.find(
                      (option) =>
                        option.value === selectedUser?.id
                    ) || null
                  }
                  placeholder="برجاء اختيار اسم العميل"
                  className="font-semibold"
                  classNamePrefix="custom-select"
                  isClearable
                  onChange={(selectedOption) => {
                    if (!selectedOption) {
                      setSelectedUser(null);
                      return;
                    }

                    const user = users?.find(
                      (u) => u?.id === selectedOption.value
                    );

                    setSelectedUser(user || null);
                  }}
                />
              </div>

              {/* Password */}
              <div className="w-full">
  <label
    htmlFor="password"
    className="block text-sm font-bold text-[#475569] mb-2 mr-1"
  >
    كلمة المرور الجديدة
  </label>

  <div className="relative">
    <input
      id="password"
      name="password"
      type={showPw ? "text" : "password"}
      value={formik.values.password}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      placeholder="اكتب كلمة المرور الجديدة"
      className="bg-[#F8FAFC] border border-[#CBD5E1] text-[#1E293B] text-md font-medium rounded-xl focus:bg-white focus:border-[#a53860] focus:shadow-[0_0_15px_rgba(238,38,119,0.15)] block w-full px-5 py-2.5 pr-12 placeholder:text-[#94A3B8] focus:outline-none transition-all duration-300"
    />

    <button
      type="button"
      onClick={() => setShowPw((prev) => !prev)}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#a53860] transition-colors"
    >
      {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>

  {formik.touched.password && formik.errors.password && (
    <p className="text-red-500 text-xs mt-1 mr-1">
      {formik.errors.password}
    </p>
  )}
</div>

              {/* Confirm Password */}
             <div className="w-full">
  <label
    htmlFor="confirm"
    className="block text-sm font-bold text-[#475569] mb-2 mr-1"
  >
    تأكيد كلمة المرور
  </label>

  <div className="relative">
    <input
      id="confirm"
      name="confirm"
      type={showPw2 ? "text" : "password"}
      value={formik.values.confirm}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      placeholder="أعد كتابة كلمة المرور"
      className="bg-[#F8FAFC] border border-[#CBD5E1] text-[#1E293B] text-md font-medium rounded-xl focus:bg-white focus:border-[#a53860] focus:shadow-[0_0_15px_rgba(238,38,119,0.15)] block w-full px-5 py-2.5 pr-12 placeholder:text-[#94A3B8] focus:outline-none transition-all duration-300"
    />

    <button
      type="button"
      onClick={() => setShowPw2((prev) => !prev)}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#a53860] transition-colors"
    >
      {showPw2 ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>

  {formik.touched.confirm && formik.errors.confirm && (
    <p className="text-red-500 text-xs mt-1 mr-1">
      {formik.errors.confirm}
    </p>
  )}
</div>

              {/* Buttons */}
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
                  {formik.isSubmitting ? (
                    <span className="loader" />
                  ) : (
                    <>
                      حفظ كلمة المرور الجديدة

                      <ArrowLeft
                        size={17}
                        strokeWidth={2}
                        className="transition-transform group-hover:-translate-x-1"
                      />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
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
              <ShieldCheck
                size={28}
                className="text-white"
              />
            </div>

            <h2 className="font-['Cairo'] font-extrabold text-xl text-[#1E293B] mb-2">
              تم تحديث كلمة المرور بنجاح
            </h2>

            <p className="font-['Tajawal'] text-sm text-[#284b63]/60 max-w-xs mb-6">
              يمكن للمستخدم الآن تسجيل الدخول باستخدام كلمة
              المرور الجديدة.
            </p>

            <button
              onClick={() => {
                setDone(false);
                setSelectedUser(null);
                formik.resetForm();
              }}
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