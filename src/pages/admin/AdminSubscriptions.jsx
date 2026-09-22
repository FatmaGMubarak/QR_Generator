import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { diactivateSubscription, fetchSubscriptions } from '../../store/reducers/subscriptionSlice';
import { useNavigate } from 'react-router-dom';
import notify from '../../hooks/Notifications';
import AnalyzingImageDemo from '../../components/common/AnalyzingImageDemo';

export default function AdminSubscriptions() {
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
            {subscriptions?.map((sub)=>{
              return (
                <tr
                
                key={sub?.id} className="bg-neutral-primary border-b border-default hover:bg-white/30 hover:cursor-pointer whitespace-nowrap">
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
                    <span className={`px-5 py-1.5 rounded-2xl ml-5 ${sub?.premium === 1 ? 'text-[#4c956c] bg-green-100' : 'text-red-700 bg-red-100'}`}>{sub?.premium === 1 ? 'متميز' : 'غير متميز'}</span>
                    <span className={`px-5 py-1.5 rounded-2xl ${sub?.isFree === 0 ? 'text-[#4c956c] bg-green-100' : 'text-red-700 bg-red-100'}`}>{sub?.isFree === 1 ? 'مجانى' : 'مدفوع'}</span>
                </td>
                <td className="px-6 py-4 font-medium flex items-center gap-x-1 justify-center">
                    <button className='bg-orange-100 hover:bg-orange-200 text-orange-600 text-center rounded-lg border border-orange-700 px-6 py-1.5'>تنبيه</button>
                    <button
                    onClick={()=>handleDiactivation(sub?.id)}
                    className='bg-red-100 hover:bg-red-200 text-red-600 text-center rounded-lg border border-red-700 px-6 py-1.5'>ايقاف</button>
                </td>
            </tr>
              )
            })}
            
        </tbody>
    </table>
</div>
</div>

      </div>



  )
}
