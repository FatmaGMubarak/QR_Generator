import { CheckCheck, Eye, MessageCircleWarning } from 'lucide-react';
import React, { useEffect } from 'react'
import notify from '../../../hooks/Notifications';
import { useDispatch } from 'react-redux';
import { fetchNotifications, markRead } from '../../../store/reducers/notificationSlice';

export default function NotificationCard({notification, setIsNotificationOpen}) {
  const dispatch = useDispatch();
    
  const handleRead = async() => {
    try{
      const response = await dispatch(markRead(notification?.id)).unwrap();
      if(response){
        notify(response.messgae, "success");
        await(dispatch(fetchNotifications()));
        setIsNotificationOpen(false);
      }

    }catch(err){
      notify(err.message || "برجاء المحاولة مرة أخرى" , "error")
    }
  }

 const isSubscriptionExpiring =
    notification?.data?.type === "الاشتراك على وشك الانتهاء";

  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-xl
        border
        p-3.5
        transition-all
        duration-200
        hover:shadow-sm

        ${
          isSubscriptionExpiring
            ? "border-amber-100 bg-amber-50/50 hover:bg-amber-50"
            : "border-gray-100 bg-white hover:bg-gray-50"
        }
      `}
    >
      {/* Small indicator */}
      <span
        className={`
          absolute right-0 top-4 h-8 w-[3px] rounded-l-full
          ${
            isSubscriptionExpiring
              ? "bg-amber-400"
              : "bg-[#34744f]"
          }
        `}
      />

      <div className="flex gap-3">
        {/* Icon */}
        <div
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl

            ${
              isSubscriptionExpiring
                ? "bg-amber-100"
                : "bg-[#e9f5ee]"
            }
          `}
        >
          <MessageCircleWarning
            size={19}
            className={
              isSubscriptionExpiring
                ? "text-amber-600"
                : "text-[#34744f]"
            }
          />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Title + status */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-['Tajawal'] text-[13px] font-extrabold leading-5 text-[#0B2D48]">
              {notification?.title}
            </h4>

            {isSubscriptionExpiring && (
              <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-700">
                قريبًا
              </span>
            )}
          </div>

          {/* Message */}
          <p className="mt-1.5 text-[11px] font-medium leading-5 text-gray-500">
            {notification?.data?.message}
          </p>

          {/* Subscription information */}
          {isSubscriptionExpiring && (
            <div className="mt-3 flex items-center justify-between rounded-lg bg-white/80 px-3 py-2 border border-amber-100/80">
              <span className="text-[10px] font-semibold text-gray-400">
                متبقي
              </span>

              <span className="text-[11px] font-extrabold text-amber-600">
                {notification?.data?.days_remaining} أيام
              </span>

              <span className="h-3 w-px bg-gray-200" />

              <span className="text-[10px] font-semibold text-gray-400">
                الانتهاء
              </span>

              <span className="text-[10px] font-bold text-gray-600">
                {notification?.data?.end_date}
              </span>
            </div>
          )}

          <div className='w-full flex items-center justify-between'>
            {/* Action */}
          {isSubscriptionExpiring && (
            <button
              className="
                mt-2.5
                text-[10px]
                font-extrabold
                text-[#34744f]
                transition-colors
                hover:text-[#285c3d]
                hover:underline
              "
            >
              تجديد الاشتراك ←
            </button>
          )}

          <button
          onClick={handleRead}
          className='flex items-center gap-x-1 mt-2.5
                text-[10px]
                font-extrabold
                text-[#34744f]
                transition-colors
                hover:text-[#285c3d]
                hover:underline '>
            <span> تحديد كمقروء</span>
            <CheckCheck className='text-xs'/>
           
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}