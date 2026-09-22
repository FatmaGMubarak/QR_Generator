import { AlertTriangle, CalendarDays, CircleCheck, Clock3, Info } from 'lucide-react';
import React from 'react'

export default function NotificationRow({notification}) {
  const isExpiring =
    notification?.type === "الاشتراك على وشك الانتهاء";

  const isExpired =
    notification?.type === "انتهى الاشتراك";

  const isSuccess =
    notification?.type === "تم تجديد الاشتراك";

  const Icon = isExpiring
    ? AlertTriangle
    : isExpired
    ? AlertTriangle
    : isSuccess
    ? CircleCheck
    : Info;

  const iconWrapper = isExpiring
    ? "bg-amber-100 text-amber-600"
    : isExpired
    ? "bg-red-100 text-red-600"
    : isSuccess
    ? "bg-green-100 text-green-600"
    : "bg-blue-100 text-blue-600";

  const badgeStyle = isExpiring
    ? "bg-amber-50 text-amber-700 border-amber-200"
    : isExpired
    ? "bg-red-50 text-red-700 border-red-200"
    : isSuccess
    ? "bg-green-50 text-green-700 border-green-200"
    : "bg-blue-50 text-blue-700 border-blue-200";

  const statusText = isExpiring
    ? "قريبًا"
    : isExpired
    ? "منتهي"
    : isSuccess
    ? "مكتمل"
    : "جديد";

  return (
    <tr
      className="
        group
        border-b
        border-gray-100
        transition-all
        duration-200
        hover:bg-white/30
      "
    >

      {/* Type */}
      <td className="px-6 py-5">

        <div className="flex items-center gap-3">

          <div
            className={`
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              ${iconWrapper}
            `}
          >
            <Icon size={19} />
          </div>

          <span
            className="
              max-w-[170px]
              text-xs
              font-extrabold
              leading-5
              text-[#0B2D48]
            "
          >
            {notification?.type}
          </span>

        </div>

      </td>

      {/* Title */}
      <td className="px-6 py-5">

        <div className="flex flex-col gap-1">

          <span className="text-sm font-extrabold text-[#0B2D48]">
            {notification?.title}
          </span>

        </div>

      </td>

      {/* Message */}
      <td className="px-6 py-5">

        <p
          className="
            max-w-[380px]
            text-xs
            font-semibold
            leading-6
            text-gray-500
          "
        >
          {notification?.message}
        </p>

      </td>

      {/* Days remaining */}
      <td className="px-6 py-5 text-center">

        {notification?.days_remaining !== undefined ? (
          <div className="inline-flex flex-col items-center">

            <div
              className="
                flex
                items-center
                gap-1.5
                rounded-xl
                bg-amber-50
                px-3
                py-2
                text-amber-700
              "
            >
              <Clock3 size={14} />

              <span className="text-xs font-extrabold whitespace-nowrap">
                {notification?.days_remaining}  أيام
              </span>

              

            </div>

            

          </div>
        ) : (
          <span className="text-xs text-gray-300">
            —
          </span>
        )}

      </td>

      {/* End date */}
      <td className="px-6 py-5 text-center">

        {notification?.end_date ? (
          <div className="inline-flex items-center gap-2">

            <CalendarDays
              size={15}
              className="text-gray-400"
            />

            <span className="text-xs font-bold text-gray-600 whitespace-nowrap">
              {notification.end_date}
            </span>

          </div>
        ) : (
          <span className="text-xs text-gray-300">
            —
          </span>
        )}

      </td>

      {/* Status */}
      <td className="px-6 py-5 text-center">

        <span
          className={`
            inline-flex
            items-center
            gap-1.5
            rounded-full
            border
            px-3
            py-1.5
            text-[10px]
            font-extrabold
            ${badgeStyle}
          `}
        >
          <span
            className={`
              h-1.5
              w-1.5
              rounded-full
              ${
                isExpiring
                  ? "bg-amber-500"
                  : isExpired
                  ? "bg-red-500"
                  : isSuccess
                  ? "bg-green-500"
                  : "bg-blue-500"
              }
            `}
          />

          {statusText}
        </span>

      </td>

    </tr>
  );
}
