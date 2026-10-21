import html2canvas from "html2canvas";
import { Utensils } from "lucide-react";
import { useMemo, useState } from "react";
import {
  FaFilePdf,
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
  FaDownload,
  FaImages,
  FaTimes,
  FaExpand,
} from "react-icons/fa";

const PAGE_SIZE = 8;

const getUrl = (item) => {
  if (typeof item === "string") return item;
  return item?.url || item?.path || item?.file_url || item?.file || "";
};

const getName = (item, url, index) => {
  if (typeof item === "object" && item?.name) return item.name;
  try {
    const pathname = new URL(url, window.location.origin).pathname;
    return decodeURIComponent(pathname.split("/").filter(Boolean).pop() || `menu-${index + 1}`);
  } catch {
    return `menu-${index + 1}`;
  }
};

const isPdf = (item, url, name) => {
  const type = typeof item === "object" ? item?.type || item?.mime_type || "" : "";
  return (
    type.toLowerCase().includes("pdf") ||
    /\.pdf$/i.test(name) ||
    /\.pdf(?:$|[?#])/i.test(url)
  );
};

export default function MenuGallery({ menu, pageSize = PAGE_SIZE }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [activePdf, setActivePdf] = useState(null);

  const entries = useMemo(() => {
    const items = Array.isArray(menu) ? menu : menu ? [menu] : [];

    return items
      .map((item, index) => {
        const url = getUrl(item);
        if (!url || typeof url !== "string") return null;

        const name = getName(item, url, index);
        return {
          id: `${url}-${index}`,
          url,
          name,
          isPdf: isPdf(item, url, name),
        };
      })
      .filter(Boolean);
  }, [menu]);

  const pdfs = entries.filter((entry) => entry.isPdf);
  const images = entries.filter((entry) => !entry.isPdf);

  const totalPages = Math.max(1, Math.ceil(images.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const visibleImages = images.slice((safePage - 1) * pageSize, safePage * pageSize);

  const openImage = (image) => setActiveImageIndex(images.findIndex((item) => item.id === image.id));
  const activeImage = activeImageIndex === null ? null : images[activeImageIndex];

  const showPreviousImage = () => {
    setActiveImageIndex((index) => (index === 0 ? images.length - 1 : index - 1));
  };

  const showNextImage = () => {
    setActiveImageIndex((index) => (index === images.length - 1 ? 0 : index + 1));
  };

  

  if (!entries.length) {
    return (
      <section dir="rtl" className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
          <FaImages className="text-2xl" />
        </span>
        <h3 className="text-base font-extrabold text-slate-800">لا توجد قائمة مضافة</h3>
        <p className="mt-2 text-sm text-slate-500">ستظهر صور المنيو أو ملف PDF هنا عند إضافتهما.</p>
      </section>
    );
  }

  return (
    <section dir="rtl" className="w-full space-y-7">
        <div className="w-full flex flex-wrap items-end justify-between gap-3">
          <div className="w-full flex items-center gap-x-3 mb-5 p-3 bg-[#F8FAFC] border-b border-[#E2E8F0] hover:bg-[#F1F5F9] rounded-xl gap-2">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Utensils
                      size={19}
                      className="text-orange-600"
                    />
                  </div> 
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">المنيو</h3>
              <p className="mt-0.5 text-sm text-slate-500">تصفّح صور القائمة أو افتح ملف PDF بالحجم الكامل</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          {images.length > 0 && (
            <span className="rounded-full bg-slate-100 px-3 py-1.5">
              {images.length} {images.length === 1 ? "صورة" : "صور"}
            </span>
          )}
          {pdfs.length > 0 && (
            <span className="rounded-full bg-rose-50 px-3 py-1.5 text-[#a53860]">
              {pdfs.length} PDF
            </span>
          )}
        </div>
        </div>

        

      {/* PDF documents */}
      {pdfs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FaFilePdf className="text-[#a53860]" />
            <h4 className="font-extrabold text-slate-800">القائمة بصيغة PDF</h4>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {pdfs.map((pdf, index) => (
              <article
                key={pdf.id}
                className="group flex min-w-0 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#a53860]/40 hover:shadow-md"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-[#a53860]">
                  <FaFilePdf className="text-2xl" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-slate-800" title={pdf.name}>
                    {pdf.name || `ملف المنيو ${index + 1}`}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500">ملف PDF · قابل للعرض والتنزيل</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={pdf.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <FaExternalLinkAlt />
                      عرض
                    </a>

                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Image gallery */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="font-extrabold text-slate-800">معرض صور المنيو</h4>
              <p className="mt-1 text-xs text-slate-500">اضغط على أي صورة لعرضها بحجم أكبر</p>
            </div>
            {images.length > pageSize && (
              <span className="text-xs font-semibold text-slate-500">
                عرض {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, images.length)} من {images.length}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {visibleImages.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => openImage(image)}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 text-right shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#a53860]/50 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#a53860]/20"
                aria-label={`عرض ${image.name}`}
              >
                <img
                  src={image.url}
                  alt={image.name || `صورة المنيو ${(safePage - 1) * pageSize + index + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  onError={(event) => {
                    event.currentTarget.style.opacity = "0.2";
                  }}
                />
                <span className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80 transition group-hover:opacity-100" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 text-white">
                  <span className="min-w-0 truncate text-xs font-bold drop-shadow" title={image.name}>
                    {image.name || `صفحة ${(safePage - 1) * pageSize + index + 1}`}
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur transition group-hover:bg-white/30">
                    <FaExpand className="text-xs" />
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex flex-wrap items-center justify-center gap-2 pt-2" aria-label="صفحات صور المنيو">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-[#a53860]/40 hover:text-[#a53860] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FaChevronRight />
                السابق
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  aria-current={page === safePage ? "page" : undefined}
                  className={`h-10 min-w-10 rounded-xl px-3 text-sm font-extrabold transition ${
                    page === safePage
                      ? "bg-[#a53860] text-white shadow-md shadow-[#a53860]/20"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-[#a53860]/40 hover:text-[#a53860]"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-[#a53860]/40 hover:text-[#a53860] disabled:cursor-not-allowed disabled:opacity-40"
              >
                التالي
                <FaChevronLeft />
              </button>
            </nav>
          )}
        </div>
      )}

      {activeImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="معاينة صورة المنيو"
          onClick={() => setActiveImageIndex(null)}
        >
          <button
            type="button"
            onClick={() => setActiveImageIndex(null)}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="إغلاق المعاينة"
          >
            <FaTimes />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPreviousImage();
                }}
                className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
                aria-label="الصورة السابقة"
              >
                <FaChevronRight />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNextImage();
                }}
                className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
                aria-label="الصورة التالية"
              >
                <FaChevronLeft />
              </button>
            </>
          )}

          <div className="flex max-h-full max-w-6xl flex-col items-center gap-3" onClick={(event) => event.stopPropagation()}>
            <img
              src={activeImage.url}
              alt={activeImage.name}
              className="max-h-[82vh] max-w-full rounded-xl object-contain shadow-2xl"
            />
            <p className="max-w-full truncate text-sm font-semibold text-white">
              {activeImage.name} <span className="text-white/60">· {activeImageIndex + 1} / {images.length}</span>
            </p>
          </div>
        </div>
      )}

      {activePdf && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/80 p-2 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="معاينة ملف المنيو PDF"
          onClick={() => setActivePdf(null)}
        >
          <div
            className="flex h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-[#a53860]">
                  <FaFilePdf className="text-lg" />
                </span>
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-extrabold text-slate-800">{activePdf.name}</h4>
                  <p className="text-xs text-slate-500">معاينة ملف PDF</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                
                <button
                  type="button"
                  onClick={() => setActivePdf(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                  aria-label="إغلاق ملف PDF"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            <iframe
              title={activePdf.name || "Menu PDF"}
              src={activePdf.url}
              className="min-h-0 flex-1 bg-slate-100"
            />
          </div>
        </div>
      )}
    </section>
  );
}
