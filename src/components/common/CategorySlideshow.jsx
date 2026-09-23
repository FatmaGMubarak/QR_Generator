import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/reducers/categorySlice";

// const slides = [
//   {
//     id: 1,
//     image:
//       "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop",
//     title: "اكتشف أفضل المطاعم حولك",
//     subtitle: "تنوع من المأكولات يرضي كل الأذواق",
//   },
//   {
//     id: 2,
//     image:
//       "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop",
//     title: "تسوق من أفضل المتاجر",
//     subtitle: "منتجات مختارة بعناية من منشآت موثوقة",
//   },
//   {
//     id: 3,
//     image:
//       "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1600&auto=format&fit=crop",
//     title: "خدمات تلبي احتياجاتك اليومية",
//     subtitle: "دليلك الشامل لكل ما تبحث عنه",
//   },
// ];

const AUTOPLAY_MS = 2000;

export default function CategorySlideshow() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const categories = useSelector((state)=>state?.category?.categories);
  const dispatch = useDispatch();

  const timerRef = useRef(null);
  const touchStartX = useRef(null);

  const count = categories.length;

  const goTo = useCallback(
    (i) => {
      setIndex(((i % count) + count) % count);
    },
    [count]
  );

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  useEffect(()=>{
    dispatch(fetchCategories());
  }, [dispatch])

  useEffect(() => {
    if (paused) return;

    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_MS);

    return () => clearInterval(timerRef.current);
  }, [paused, count]);


  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") next();
      if (e.key === "ArrowRight") prev();
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [next, prev]);


  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;

    const delta =
      e.changedTouches[0].clientX - touchStartX.current;

    if (Math.abs(delta) > 50) {
      delta > 0 ? prev() : next();
    }

    touchStartX.current = null;
  };

  return (
    <div
      dir="rtl"
      className="
        relative
        w-full
        max-w-6xl
        mx-auto
        overflow-hidden
        rounded-2xl
        bg-gray-200
        shadow-[0_8px_30px_rgba(15,23,42,0.08)]
        border border-gray-200/70
        select-none
        
      "
      style={{ aspectRatio: "16 / 7" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="عرض شرائح الفئات"
    >


      <div
        className="
          flex
          h-full
          transition-transform
          duration-700
          ease-[cubic-bezier(0.4,0,0.2,1)]
        "
        style={{
          width: `${count * 100}%`,
          transform: `translateX(${index * (100 / count)}%)`,
        }}
      >
        {categories?.length > 0 &&
        categories?.slice(0, 5).map((slide, i) => (
          <div
            key={slide.id}
            className="
              relative
              h-full
              flex-shrink-0
              overflow-hidden
            "
            style={{
              width: `${100 / count}%`,
            }}
            aria-hidden={i !== index}
          >
            {/* Image */}

            <img
              src={slide.img}
              alt={slide.name}
              draggable={false}
              className={`
                absolute
                inset-0
                w-full
                h-full
                object-cover
                transition-transform
                duration-[5000ms]
                ease-out
                ${
                  i === index
                    ? "scale-[1.03]"
                    : "scale-100"
                }
              `}
            />

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-l
                from-black/65
                via-black/20
                to-black/5
              "
            />

            {/* Bottom fade */}

            <div
              className="
                absolute
                inset-x-0
                bottom-0
                h-32
                bg-gradient-to-t
                from-black/30
                to-transparent
              "
            />

            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-start
                px-6
                sm:px-10
                lg:px-14
              "
            >
              <div
                className={`
                  max-w-xl
                  text-right
                  transition-all
                  duration-700
                  ${
                    i === index
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-3"
                  }
                `}
              >
                {/* Small label */}

                {/* <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    mb-4
                    px-3
                    py-1.5
                    rounded-full
                    bg-white/10
                    backdrop-blur-md
                    border border-white/20
                    text-white
                    text-xs
                    font-medium
                  "
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />

                  اكتشف المزيد
                </div> */}

                {/* Title */}

                <h2
                  className="
                    text-white
                    text-2xl
                    sm:text-3xl
                    lg:text-4xl
                    font-bold
                    leading-tight
                    tracking-tight
                    drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]
                  "
                >
                  {slide.name}
                </h2>

                {/* Subtitle */}

                
              </div>
            </div>
          </div>
        ))}
      </div>


      <button
        onClick={prev}
        aria-label="السابق"
        className="
          absolute
          top-1/2
          -translate-y-1/2
          right-4
          sm:right-6
          w-10
          h-10
          sm:w-11
          sm:h-11
          rounded-full
          bg-white/90
          backdrop-blur-sm
          border
          border-white/40
          text-gray-700
          flex
          items-center
          justify-center
          shadow-[0_4px_12px_rgba(0,0,0,0.12)]
          hover:bg-white
          hover:shadow-[0_6px_16px_rgba(0,0,0,0.16)]
          hover:scale-105
          active:scale-95
          transition-all
          duration-200
          z-20
        "
      >
        <ChevronRight
          size={20}
          strokeWidth={2}
        />
      </button>

      <button
        onClick={next}
        aria-label="التالي"
        className="
          absolute
          top-1/2
          -translate-y-1/2
          left-4
          sm:left-6
          w-10
          h-10
          sm:w-11
          sm:h-11
          rounded-full
          bg-white/90
          backdrop-blur-sm
          border
          border-white/40
          text-gray-700
          flex
          items-center
          justify-center
          shadow-[0_4px_12px_rgba(0,0,0,0.12)]
          hover:bg-white
          hover:shadow-[0_6px_16px_rgba(0,0,0,0.16)]
          hover:scale-105
          active:scale-95
          transition-all
          duration-200
          z-20
        "
      >
        <ChevronLeft
          size={20}
          strokeWidth={2}
        />
      </button>

      <div
        className="
          absolute
          bottom-5
          left-1/2
          -translate-x-1/2
          flex
          items-center
          gap-1.5
          z-20
          px-2.5
          py-2
          rounded-full
          bg-black/20
          backdrop-blur-md
          border border-white/10
        "
      >
        {categories.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`الشريحة ${i + 1}`}
            aria-current={i === index}
            className={`
              rounded-full
              transition-all
              duration-300
              ${
                i === index
                  ? "w-7 h-1.5 bg-white"
                  : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
              }
            `}
          />
        ))}
      </div>


      <div
        className="
          absolute
          top-5
          left-5
          px-3
          py-1.5
          rounded-full
          bg-black/20
          backdrop-blur-md
          border border-white/10
          text-white
          text-xs
          font-medium
          z-20
        "
      >
        {String(index + 1).padStart(2, "0")} /{" "}
        {String(count).padStart(2, "0")}
      </div>
    </div>
  );
}
