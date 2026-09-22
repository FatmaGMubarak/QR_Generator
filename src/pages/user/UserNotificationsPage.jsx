import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import notify from '../../hooks/Notifications';
import AnalyzingImageDemo from '../../components/common/AnalyzingImageDemo';
import {fetchNotifications} from '../../store/reducers/notificationSlice'
import NotificationRow from '../../components/user/ui/NotificationRow';

export default function UserNotificationsPage() {
   const notifications = useSelector((state)=>state?.notification?.notifications);
  const loading = useSelector((state)=>state?.subscription?.loading);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(()=>{
    dispatch(fetchNotifications());
  }, [dispatch])
  // const navigateToSub = (id) =>{
  //   navigate(`/admin/subscription/${id}`);
  // }

//   const handleDiactivation = async (id) => {
// try{
//     const response = await dispatch(diactivateSubscription(id)).unwrap();
//     await dispatch(fetchSubscriptions());
//     notify(response.message, "success");
    
// }
// catch(err){
// notify(err?.message || "حدث خطأ ما", "error");
// }
//   }
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
            <tr className="border-b border-gray-100 bg-gray-50/80">

                  <th className="whitespace-nowrap px-6 py-4 text-xs font-extrabold text-gray-500">
                    نوع الإشعار
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-xs font-extrabold text-gray-500">
                    الإشعار
                  </th>

                  <th className="min-w-[280px] px-6 py-4 text-xs font-extrabold text-gray-500">
                    التفاصيل
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-center text-xs font-extrabold text-gray-500">
                    المتبقي
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-center text-xs font-extrabold text-gray-500">
                    تاريخ الانتهاء
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-center text-xs font-extrabold text-gray-500">
                    الحالة
                  </th>

                </tr>
        </thead>
        <tbody>
            {notifications?.map((notific)=>{
              return (
               <NotificationRow key={notific?.id}
               notification={notific?.data}
               />
              )
            })}
            
        </tbody>
    </table>
</div>
</div>

      </div>



  )
}
