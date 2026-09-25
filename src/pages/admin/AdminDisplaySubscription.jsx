import { useEffect, useState } from "react";
import { FiArrowLeft, FiX, FiDollarSign, FiTag } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Toggle from "../../components/common/ui/Toggle";
import notify from "../../hooks/Notifications";
import { createSubscription, renewSubscription, fetchSubscriptions, updateSubscription } from "../../store/reducers/subscriptionSlice";
import AnalyzingImageDemo from "../../components/common/AnalyzingImageDemo";
import { fetchUsers } from "../../store/reducers/auth/authSlice";
import Select from "react-select";


export default function AdminDisplaySubscription() {
  const { id } = useParams();

  const subscriptions = useSelector((state) => state?.subscription?.subscriptions) || [];
  const selectedSubscription = subscriptions.find((sub) => sub?.id == id);
  

  const [name, setName] = useState(selectedSubscription?.name || "");
  const [selectedUser, setSelectedUser] = useState(selectedSubscription?.user_id);
  const [price, setPrice] = useState(selectedSubscription?.price || "");
  const [active, setActive] = useState(selectedSubscription?.status === "active");
  const [premium, setPremium] = useState(Boolean(selectedSubscription?.premium));
  const [free, setFree] = useState(Boolean(selectedSubscription?.isFree));
  const [billingCycle, setBillingCycle] = useState(selectedSubscription?.type || "monthly");
  const [error, setError] = useState("");
   const users = useSelector((state) => state?.auth?.users);
  const loading = useSelector((state) => state?.subscription?.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = users?.find((u)=>u?.id === selectedUser)


  
    useEffect(() => {
      dispatch(fetchUsers());
    }, [dispatch]);
  
    const options =
      users?.slice(0, 5)?.map((user) => ({
        value: user?.id,
        label: `${user?.name} - ${user?.phone}`,
      })) || [];

useEffect(() => {
  if (selectedSubscription) {
    setSelectedUser(selectedSubscription.user_id || "");
    setPrice(selectedSubscription.price || "");
    setActive(selectedSubscription.status === "active");
    setPremium(Boolean(selectedSubscription.premium));
    setFree(Boolean(selectedSubscription.isFree));
    setBillingCycle(selectedSubscription.type || "monthly");
  }
}, [selectedSubscription]);

  useEffect(()=>{
    dispatch(fetchSubscriptions());
  }, [])

  const isValid =  String(price).trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!String(price).trim()) {
      setError("برجاء كتابة السعر");
      return;
    }

    setError("");
    try {
      const subscriptionData = new FormData();
      subscriptionData.append("user_id", selectedUser);
      subscriptionData.append("price", price);
      subscriptionData.append("status", active ? "active" : "inactive");
      subscriptionData.append("type", billingCycle);
      subscriptionData.append("premium", premium ? 1 : 0);
      subscriptionData.append("isFree", free ? 1 : 0);

      const response = await dispatch(updateSubscription({id: id, updatedData: subscriptionData})).unwrap();
      notify(response.message, "success");
      navigate("/admin/subscriptions");
    } catch (err) {
      notify(err?.message || "حدث خطأ ما", "error");
    }
  };

  const handleCancel = () => {
    if (selectedSubscription) {
      setName(selectedSubscription.name || "");
      setPrice(selectedSubscription.price || "");
      setActive(selectedSubscription.status === "active");
      setPremium(Boolean(selectedSubscription.premium));
      setFree(Boolean(selectedSubscription.isFree));
      setBillingCycle(selectedSubscription.type || "monthly");
    }
  };

  const handleRenew = async () =>{
    try{
      const renewData = new FormData();
      renewData.append("type", billingCycle);
       const response = await dispatch(
      renewSubscription({ id: id, renewData: renewData })
    ).unwrap();
      notify(response.message, "success");
    }
    catch(err){
      notify(err.message, "error");
    }
  }

  const handleUpdate = async () =>{
    try{
      const response = await dispatch(renewSubscription({id: id, renewData: billingCycle}).unwrap());
      notify(response.message, "success");
    }
    catch(err){
      notify(err.message, "error");
    }
  }

     if(loading){
        return(
          <div className='w-full h-screen flex justify-center items-center'>
            <AnalyzingImageDemo />
          </div>
        )
      }

  return (
     <div
        className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-[#ffafcc] via-[#ff8fa3] to-[#4c956c]  px-4 py-10 selection:bg-[#FFD600] selection:text-[#1E293B]"
      >
        <form
          onSubmit={handleSubmit}
          className="w-full lg:w-[50%] bg-white rounded-3xl border border-[#E2E8F0] shadow-xl shadow-[#a53860]/5 p-8 flex flex-col items-center gap-y-7 mt-[20%] md:mt-[7%] lg:mt-[7%]"
        >
        {/* Header */}
        <div className="text-center border-b border-slate-100 pb-6">
          <h1 className="font-bold text-2xl text-slate-800">
            تعديل الاشتراك
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            برجاء إدخال بيانات الاشتراك
          </p>
        </div>

        {/* Name Field */}
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
    options.find((option) => option.value === selectedUser) || null
  }
  placeholder="برجاء اختيار اسم العميل"
  className="font-semibold"
  classNamePrefix="custom-select"
  onChange={(selectedOption) => {
    setSelectedUser(selectedOption?.value || "");
    setName(selectedOption?.label?.split(" - ")[0]?.trim() || "");
  }}
/>
        </div>

        {/* Price Field */}
        <div className="w-full">
          <label htmlFor="price" className="block text-sm font-semibold text-slate-600 mb-2">
            السعر
          </label>
          <div className="relative">
            <FiDollarSign className="absolute top-1/2 -translate-y-1/2 right-3.5 text-slate-400" size={16} />
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
         <div className="w-full flex items-center justify-between mb-3">
           <label className="block text-sm font-semibold text-slate-600 ">
            دورة الفوترة
          </label>
              <button
              onClick={handleRenew}
              className='bg-green-100 font-semibold hover:bg-green-200 text-green-600 text-center rounded-lg border border-green-700 px-6 py-1.5'>تجديد</button>
         </div>
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
              <p className="text-xs text-slate-400 mt-0.5">إتاحة الاشتراك للمستخدمين</p>
            </div>
            <Toggle value={active} onChange={setActive} />
          </div>
          <div className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="text-sm font-semibold text-slate-700">متميز</p>
              <p className="text-xs text-slate-400 mt-0.5">تمييز الباقة عن غيرها</p>
            </div>
            <Toggle value={premium} onChange={setPremium} />
          </div>
          <div className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="text-sm font-semibold text-slate-700">مجانًا</p>
              <p className="text-xs text-slate-400 mt-0.5">إتاحة الباقة بدون مقابل</p>
            </div>
            <Toggle value={free} onChange={setFree} />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm font-semibold -mt-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="w-full flex gap-x-3 pt-2">
          <button
            type="submit"
            disabled={!isValid || loading}
            className={`w-full flex justify-center items-center gap-x-2 px-4 py-3 rounded-xl text-white text-sm font-bold transition-all duration-200 active:scale-[0.98] ${
              isValid && !loading
                ? "bg-[#fa518f] hover:bg-[#fa518f]/85 shadow-lg shadow-[#fa518f]/25"
                  : "bg-[#fa518f]/50 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <span className="loader" />
            ) : (
              <>
                {id ? "حفظ التعديلات" : "إنشاء الاشتراك"}
                <FiArrowLeft size={16} />
              </>
            )}
          </button>
          <button
            onClick={handleCancel}
            type="button"
            className="w-full flex justify-center items-center gap-x-2 px-4 py-3 rounded-xl text-slate-600 text-sm font-bold bg-slate-100 hover:bg-slate-200 transition-all duration-200 active:scale-[0.98]"
          >
            إلغاء
            <FiX size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}