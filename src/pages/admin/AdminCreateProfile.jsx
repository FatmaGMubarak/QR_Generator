import { useEffect, useRef, useState } from "react";

import { ImFilePicture } from "react-icons/im";

import { RiDeleteBin5Fill } from "react-icons/ri";

import { FaLongArrowAltLeft } from "react-icons/fa";

import { HandCoins, X } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import { createCategory } from "../../store/reducers/categorySlice";

import notify from "../../hooks/Notifications";

import { useNavigate } from "react-router-dom";

import Select from "react-select";

import Toggle from "../../components/common/ui/Toggle";

import { createSubscription } from "../../store/reducers/subscriptionSlice";

import { FiDollarSign } from "react-icons/fi";

import AnalyzingImageDemo from "../../components/common/AnalyzingImageDemo";

import { fetchUsers } from "../../store/reducers/auth/authSlice";

export default function AdminCreateProfile() {
  const [name, setName] = useState("");

  const [profileLimit, setProfileLimit] = useState(1);

  const [selectedUser, setSelectedUser] = useState("");

  const [price, setPrice] = useState("");

  const [active, setActive] = useState(true);

  const [premium, setPremium] = useState(true);

  const [free, setFree] = useState(false);

  const [billingCycle, setBillingCycle] = useState("monthly");

  const [error, setError] = useState("");

  const inputRef = useRef(null);

  const users = useSelector((state) => state?.auth?.users);

  const loading = useSelector((state) => state?.subscription?.loading);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const isValid = name?.trim().length >= 2;

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const options =
    users?.slice(0, 5)?.map((user) => ({
      value: user?.id,
      label: `${user?.name} - ${user?.phone}`,
    })) || [];

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!name?.trim()) {
        setError("برجاء كتابة الاسم");

        return;
      }

      setError("");

      const subscriptionData = new FormData();

      subscriptionData.append("user_id", selectedUser?.id);

      subscriptionData.append("profile_limit", profileLimit);

      subscriptionData.append("price", price);

      subscriptionData.append("status", active ? "active" : "inactive");

      subscriptionData.append("type", billingCycle);

      subscriptionData.append("premium", premium ? 1 : 0);

      subscriptionData.append("isFree", free ? 1 : 0);

      const response = await dispatch(
        createSubscription(subscriptionData),
      ).unwrap();

      notify(response.message, "success");

      navigate("/admin");
    } catch (err) {
      notify(err.message[0]?.profile_limit[0], "error");
    }
  };

  const handleCancel = () => {
    setName(null);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <AnalyzingImageDemo />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-[#ffafcc] via-[#ff8fa3] to-[#4c956c]  px-4 py-10 selection:bg-[#FFD600] selection:text-[#1E293B]">
      <form
        onSubmit={handleSubmit}
        className="w-full lg:w-[50%] bg-white rounded-3xl border border-[#E2E8F0] shadow-xl shadow-[#a53860]/5 p-8 flex flex-col items-center gap-y-7 mt-[20%] md:mt-[7%] lg:mt-[7%]"
      >
        <div className="text-center">
          <h1 className="font-extrabold text-xl text-[#1E293B]">
            انشاء اشتراك صفحة شخصية
          </h1>

          <p className="text-sm text-[#64748B] mt-1.5 font-medium">
            برجاء ادخال بيانات العميل
          </p>
        </div>

        {/* name field */}

        <div className="w-full">
          <label
            htmlFor="name"
            className="block text-sm font-bold text-[#475569] mb-2 mr-1"
          >
            اسم العميل
          </label>

          <Select
            options={options}
            value={
              options.find((option) => option.value === selectedUser?.id) ||
              null
            }
            placeholder="برجاء اختيار اسم العميل"
            className="font-semibold"
            classNamePrefix="custom-select"
            onChange={(selectedOption) => {
              setName(selectedOption?.label?.split("-")[0].trim());

              setSelectedUser(
                users?.find((u) => u?.id === selectedOption?.value),
              );
            }}
          />
        </div>

        {/* Profile Limit Field */}

        <div className="w-full">
          <label
            htmlFor="price"
            className="block text-sm font-semibold text-slate-600 mb-2"
          >
            عدد الصفحات المسموحة
          </label>

          <div className="relative">
            <HandCoins
              className="absolute top-1/2 -translate-y-1/2 right-3.5 text-slate-400"
              size={16}
            />

            <input
              id="profileLimit"
              type="number"
              min="1"
              value={profileLimit}
              autoFocus
              onBlur={(e) => {
                if (e.target.value === "") {
                  setProfileLimit(1);
                }
              }}
              onChange={(e) => {
                setProfileLimit(e.target.value);

                if (error) setError("");
              }}
              placeholder="اكتب عدد الصفحات المسموح بها"
              className="bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium rounded-lg focus:bg-white focus:border-[#a53860] focus:ring-4 focus:ring-[#a53860]/10 block w-full pr-10 pl-4 py-3 placeholder:text-slate-400 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Price Field */}

        <div className="w-full">
          <label
            htmlFor="price"
            className="block text-sm font-semibold text-slate-600 mb-2"
          >
            السعر
          </label>

          <div className="relative">
            <FiDollarSign
              className="absolute top-1/2 -translate-y-1/2 right-3.5 text-slate-400"
              size={16}
            />

            <input
              id="price"
              type="number"
              min="0"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);

                if (error) setError("");
              }}
              placeholder="اكتب السعر"
              className="bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium rounded-lg focus:bg-white focus:border-[#a53860] focus:ring-4 focus:ring-[#a53860]/10 block w-full pr-10 pl-4 py-3 placeholder:text-slate-400 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Billing Cycle - segmented control */}

        <div className="w-full">
          <label className="block text-sm font-semibold text-slate-600 mb-2">
            دورة الفوترة
          </label>

          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-lg">
            {[
              { key: "monthly", label: "شهري" },

              { key: "yearly", label: "سنوي" },
            ].map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setBillingCycle(option.key)}
                className={`py-2 rounded-md text-sm font-semibold transition-all ${
                  billingCycle === option.key
                    ? "bg-white text-[#a53860] shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}

        <div className="w-full flex flex-col gap-y-1 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="text-sm font-semibold text-slate-700">نشط</p>

              <p className="text-xs text-slate-400 mt-0.5">
                إتاحة الاشتراك للمستخدمين
              </p>
            </div>

            <Toggle value={active} onChange={setActive} />
          </div>

          <div className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="text-sm font-semibold text-slate-700">متميز</p>

              <p className="text-xs text-slate-400 mt-0.5">
                تمييز الباقة عن غيرها
              </p>
            </div>

            <Toggle value={premium} onChange={setPremium} />
          </div>

          <div className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="text-sm font-semibold text-slate-700">مجانًا</p>

              <p className="text-xs text-slate-400 mt-0.5">
                إتاحة الباقة بدون مقابل
              </p>
            </div>

            <Toggle value={free} onChange={setFree} />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm font-bold -mt-3 self-start mr-1">
            {error}
          </p>
        )}

        <div className="w-full flex gap-x-3 justify-between">
          <button
            type="submit"
            className={`w-full flex justify-center items-center gap-x-3 px-4 py-3.5 rounded-xl text-white font-bold tracking-wide transition-all duration-300 active:scale-95

              ${
                isValid
                  ? "bg-[#fa518f] hover:bg-[#fa518f]/85 shadow-lg shadow-[#fa518f]/25"
                  : "bg-[#fa518f]/50 cursor-not-allowed"
              }`}
          >
            {loading ? <span className="loader"></span> : "حفظ"}

            <FaLongArrowAltLeft />
          </button>

          <button
            onClick={handleCancel}
            type="button"
            className={`w-full flex justify-center items-center gap-x-3 px-4 py-3.5 rounded-xl text-white font-bold tracking-wide transition-all duration-300 active:scale-95

              bg-gray-600/90 hover:bg-gray-600`}
          >
            الغاء
            <X />
          </button>
        </div>
      </form>
    </div>
  );
}
