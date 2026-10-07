import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { diactivateSubscription, fetchSubscriptions } from '../../store/reducers/subscriptionSlice';
import { useNavigate } from 'react-router-dom';
import notify from '../../hooks/Notifications';
import AnalyzingImageDemo from '../../components/common/AnalyzingImageDemo';
import {CalendarCheck, ClipboardClock, MonitorCheck, OctagonMinus, PartyPopper} from "lucide-react";

export default function AdminSubscriptions() {
    const [filter, setFilter] = useState('all');

  const subscriptions = useSelector((state)=>state?.subscription?.subscriptions);
  const loading = useSelector((state)=>state?.subscription?.loading);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(()=>{
    dispatch(fetchSubscriptions());
  }, [dispatch])
  const navigateToSub = (id) =>{
    navigate(`/admin/subscription/${id}`);
  }

  const handleDiactivation = async (id) => {
try{
    const response = await dispatch(diactivateSubscription(id)).unwrap();
    await dispatch(fetchSubscriptions());
    notify(response.message, "success");
    
}
catch(err){
notify(err?.message || "حدث خطأ ما", "error");
}
  }

  const filteredSubscriptions = useMemo(() => {
    if (!subscriptions) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const renewalLimit = new Date(today);
    renewalLimit.setDate(today.getDate() + 7);

    return subscriptions.filter((sub) => {
        const endDate = new Date(sub.end_date);
        endDate.setHours(0, 0, 0, 0);

        if (filter === 'expired') {
            return endDate < today || sub.status !== 'active';
        }

        if (filter === 'renewal') {
            return (
                sub.status === 'active' &&
                endDate >= today &&
                endDate <= renewalLimit
            );
        }

        return true;
    });
}, [subscriptions, filter]);


const handleWhatsAppReminder = (sub) => {
    const phone = sub?.user?.phone || sub?.phone;

    if (!phone) {
        notify("لا يوجد رقم واتساب لهذا المستخدم", "error");
        return;
    }

    const cleanPhone = phone.replace(/\D/g, "");

    const message =
        `مرحباً ${sub?.user?.name || ''} 🌷\n\n` +
        `نود تذكيرك بأن اشتراكك سينتهي بتاريخ ${sub?.end_date}.\n` +
        `يرجى تجديد الاشتراك للاستمرار في الاستفادة من خدماتنا.\n\n` +
        `شكراً لك`;

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
};

     if(loading){
        return(
          <div className='w-full h-screen flex justify-center items-center'>
            <AnalyzingImageDemo />
          </div>
        )
      }
  return (
    <div
        className="min-h-screen w-full flex items-start justify-start bg-gradient-to-r from-[#ffafcc] via-[#ff8fa3] to-[#4c956c]  px-4 py-10 selection:bg-[#FFD600] selection:text-[#1E293B] mt-[20%] md:mt-[7%] lg:mt-[3%]"
      >
<div className='w-full mt-[1%] md:mt-[7%] lg:mt-[3%]'>
  <div className="space-y-5">

    {/* Subscription Filters */}
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-3">

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">

            {[
                {
                    id: 'all',
                    label: 'كل الاشتراكات',
                    count: subscriptions?.length || 0,
                    icon: <CalendarCheck />,
                },
                {
                    id: 'expired',
                    label: 'لم يتم التجديد',
                    count: subscriptions?.filter((sub) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        const endDate = new Date(sub.end_date);
                        endDate.setHours(0, 0, 0, 0);

                        return endDate < today || sub.status !== 'active';
                    }).length || 0,
                    icon: <OctagonMinus />,
                },
                {
                    id: 'renewal',
                    label: 'قرب موعد التجديد',
                    count: subscriptions?.filter((sub) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        const renewalLimit = new Date(today);
                        renewalLimit.setDate(today.getDate() + 7);

                        const endDate = new Date(sub.end_date);
                        endDate.setHours(0, 0, 0, 0);

                        return (
                            sub.status === 'active' &&
                            endDate >= today &&
                            endDate <= renewalLimit
                        );
                    }).length || 0,
                    icon: <ClipboardClock />,
                },
            ].map((item) => (
                <button
                    key={item.id}
                    onClick={() => setFilter(item.id)}
                    className={`
                        flex-1 flex items-center justify-between
                        px-5 py-3.5 rounded-2xl
                        transition-all duration-300
                        border
                        ${
                            filter === item.id
                                ? 'bg-[#4c956c] text-white border-[#4c956c] shadow-lg shadow-[#4c956c]/25 scale-[1.01]'
                                : 'bg-white/60 text-gray-600 border-gray-200 hover:bg-white hover:border-[#4c956c]/40 hover:text-[#4c956c]'
                        }
                    `}
                >
                    <div className="flex items-center gap-3">
                        <span
                            className={`
                                w-9 h-9 rounded-xl flex items-center justify-center text-lg
                                ${
                                    filter === item.id
                                        ? 'bg-white/20'
                                        : 'bg-gray-100'
                                }
                            `}
                        >
                            {item.icon}
                        </span>

                        <span className="font-bold text-sm">
                            {item.label}
                        </span>
                    </div>

                    <span
                        className={`
                            min-w-[32px] h-7 px-2 rounded-full
                            flex items-center justify-center
                            text-xs font-extrabold
                            ${
                                filter === item.id
                                    ? 'bg-white/20 text-white'
                                    : 'bg-gray-100 text-gray-600'
                            }
                        `}
                    >
                        {item.count}
                    </span>
                </button>
            ))}

        </div>
    </div>


    {/* Table */}
    <div className="bg-white/20 relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-gray-300 rounded-3xl shadow-2xl">
    <table className="w-full text-sm text-left rtl:text-right text-body rounded-3xl">
       <thead className="text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default bg-gray-200">
            <tr className="border-b border-gray-100 bg-gray-50/80  whitespace-nowrap px-6 py-4 text-sm font-extrabold text-gray-500">
                <th scope="col" className="px-6 py-3">
                    الاسم
                </th>
                <th scope="col" className="px-6 py-3">
                    تاريخ الاشتراك
                </th>
                <th scope="col" className="px-6 py-3">
                    تاريخ الانتهاء
                </th>
                <th scope="col" className="px-6 py-3">
                    السعر
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                    الحالة
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                    نوع الاشتراك
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                    اجراءات
                </th>
            </tr>
        </thead>
        <tbody>
            {filteredSubscriptions?.length > 0 ? (
                filteredSubscriptions?.map((sub)=>{
              return (
                <tr
                
                key={sub?.id} className={`${sub?.status === 'active' ? 'bg-neutral-primary hover:bg-white/30' : ' bg-red-400/50 hover:bg-red-400/80'} border-b border-default  hover:cursor-pointer whitespace-nowrap`}>
                <th
                onClick={()=>navigateToSub(sub?.id)}
                scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    {sub?.user_id}
                </th>
                <td
                
                onClick={()=>navigateToSub(sub?.id)}
                className="px-6 py-4 font-medium">
                    {sub?.start_date}
                </td>
                <td
                onClick={()=>navigateToSub(sub?.id)}
                className="px-6 py-4 font-medium">
                    {sub?.end_date}
                </td>
                <td
                onClick={()=>navigateToSub(sub?.id)}
                className="px-6 py-4 font-medium">
                    {sub?.price} ج.م 
                </td>
                <td
                onClick={()=>navigateToSub(sub?.id)}
                className={`px-6 py-4 font-medium  text-center  `}>
                    <span className={`px-5 py-1.5 rounded-2xl ${sub?.status === 'active' ? 'text-[#4c956c] bg-green-100' : 'text-red-700 bg-red-100'}`}>{sub?.status === 'active' ? 'نشط': 'غير نشط'}</span>
                </td>
                <td
                onClick={()=>navigateToSub(sub?.id)}
                className="px-6 py-4 font-medium text-center">
                    {sub?.premium === 1 && (
                        <span className={`px-5 py-1.5 rounded-2xl ml-5 ${sub?.premium === 1 ? 'text-[#4c956c] bg-green-100' : 'text-red-700 bg-red-100'}`}>متميز</span>
                    )}
                    {sub?.isFree === 1 && (
                        <span className={`px-5 py-1.5 rounded-2xl ${sub?.isFree === 0 ? 'text-[#4c956c] bg-green-100' : 'text-red-700 bg-red-100'}`}>مجانى</span>
                    )}
                </td>
                <td className="px-6 py-4 font-medium flex items-center gap-x-1 justify-center">
                    <button
                     onClick={() => handleWhatsAppReminder(sub)}
                    className='bg-orange-100 hover:bg-orange-200 text-orange-600 text-center rounded-lg border border-orange-700 px-6 py-1.5'>تنبيه</button>
                    <button
                    onClick={()=>handleDiactivation(sub?.id)}
                    className='bg-red-100 hover:bg-red-200 text-red-600 text-center rounded-lg border border-red-700 px-6 py-1.5'>ايقاف</button>
                </td>
            </tr>
              )
            })
            ) : (
        <tr>
            <td
                colSpan="7"
                className="py-16 text-center"
            >
                <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-white/70 flex items-center justify-center text-3xl shadow-sm">
                        {filter === 'expired'
                            ? <MonitorCheck className='text-[#4c956c] text-3xl' />
                            : filter === 'renewal'
                            ? <PartyPopper  className='text-[#4c956c] text-3xl'/>
                            : '📋'}
                    </div>

                    <p className="font-extrabold text-gray-800">
                        {filter === 'expired'
                            ? 'لا توجد اشتراكات لم يتم تجديدها'
                            : filter === 'renewal'
                            ? 'لا توجد اشتراكات قريبة من موعد التجديد'
                            : 'لا توجد اشتراكات'}
                    </p>

                    <p className="text-sm text-gray-800">
                        جميع الاشتراكات الحالية محدثة
                    </p>
                </div>
            </td>
        </tr>
    )}
            
        </tbody>
    </table>
</div>
</div>

      </div>
      </div>



  )
}
