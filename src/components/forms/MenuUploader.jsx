import { useRef, useState } from "react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaFilePdf } from "react-icons/fa";
import { ImFilePicture } from "react-icons/im";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB per file
export const MAX_MENU_FILES = 10;

const formatSize = (bytes) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const makeId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

/**
 * Controlled multi-file uploader for the menu (images and/or PDFs).
 *
 * entries: [{ id, file: File, url: blobUrl }]
 * onChange(nextEntries)
 * error: optional string from formik
 */
export default function MenuUploader({ entries = [], onChange, error }) {
  const inputRef = useRef(null);
  const [rejected, setRejected] = useState([]);
  const [dragging, setDragging] = useState(false);

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return;

    const accepted = [];
    const problems = [];
    let slots = MAX_MENU_FILES - entries.length;

    incoming.forEach((file) => {
      const isDuplicate = [...entries, ...accepted].some(
        (e) => e.file?.name === file.name && e.file?.size === file.size,
      );

      if (!ALLOWED_TYPES.includes(file.type)) {
        problems.push(`${file.name}: صيغة غير مدعومة (PDF, JPG, PNG فقط)`);
      } else if (file.size > MAX_SIZE) {
        problems.push(`${file.name}: الحجم يتجاوز 5 ميجابايت`);
      } else if (isDuplicate) {
        problems.push(`${file.name}: تم رفع هذا الملف بالفعل`);
      } else if (slots <= 0) {
        problems.push(`${file.name}: الحد الأقصى ${MAX_MENU_FILES} ملفات`);
      } else {
        accepted.push({ id: makeId(), file, url: URL.createObjectURL(file) });
        slots -= 1;
      }
    });

    setRejected(problems);
    if (accepted.length) onChange([...entries, ...accepted]);
  };

  const removeEntry = (id) => {
    const target = entries.find((e) => e.id === id);
    if (target?.url?.startsWith("blob:")) URL.revokeObjectURL(target.url);
    setRejected([]);
    onChange(entries.filter((e) => e.id !== id));
  };

  const clearAll = () => {
    entries.forEach(
      (e) => e.url?.startsWith("blob:") && URL.revokeObjectURL(e.url),
    );
    setRejected([]);
    onChange([]);
  };

  const reachedLimit = entries.length >= MAX_MENU_FILES;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 flex-wrap gap-y-1">
        <div className="flex items-center gap-x-5">
          <span className="block text-sm font-bold text-[#475569] mr-1">
            قائمة الطعام
          </span>
          {error && (
            <p className="text-red-500 text-sm font-bold">{error}</p>
          )}
        </div>

        {entries.length > 0 && (
          <div className="flex items-center gap-x-3">
            <span className="text-xs font-bold text-[#64748B]">
              {entries.length} / {MAX_MENU_FILES} ملفات
            </span>
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
            >
              حذف الكل
            </button>
          </div>
        )}
      </div>

      {/* Dropzone */}
      <label
        htmlFor="menu-files"
        onDragOver={(e) => {
          e.preventDefault();
          if (!reachedLimit) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!reachedLimit) addFiles(e.dataTransfer.files);
        }}
        className={`group flex flex-col sm:flex-row items-center justify-center gap-x-3 gap-y-1 w-full px-5 py-4 border-2 border-dashed rounded-2xl transition-all duration-300 ${
          reachedLimit
            ? "bg-slate-100 border-[#CBD5E1] cursor-not-allowed opacity-70"
            : dragging
              ? "bg-[#a53860]/5 border-[#a53860] cursor-copy"
              : "bg-[#F8FAFC] border-[#CBD5E1] hover:border-[#a53860] cursor-pointer"
        }`}
      >
        <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[#a53860]/10 text-[#a53860] group-hover:bg-[#a53860] group-hover:text-white transition-all duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16V4m0 0L8 8m4-4l4 4M5 16.5v1A2.5 2.5 0 007.5 20h9a2.5 2.5 0 002.5-2.5v-1"
            />
          </svg>
        </div>
        <div className="text-center sm:text-right">
          <p className="text-sm font-bold text-[#1E293B] group-hover:text-[#a53860] transition-colors">
            {reachedLimit
              ? "تم الوصول للحد الأقصى من الملفات"
              : entries.length > 0
                ? "اضغط لاضافة المزيد من الصفحات"
                : "اضغط أو اسحب الملفات هنا لرفع قائمة الطعام"}
          </p>
          <p className="text-xs text-[#94A3B8] mt-0.5 font-medium">
            صور (JPG, PNG) أو PDF — حتى {MAX_MENU_FILES} ملفات، كل ملف بحد أقصى
            5 ميجابايت
          </p>
        </div>

        <input
          ref={inputRef}
          id="menu-files"
          type="file"
          multiple
          disabled={reachedLimit}
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/png,image/jpeg"
          className="hidden"
          onChange={(e) => {
            addFiles(e.currentTarget.files);
            e.currentTarget.value = ""; // allow re-selecting the same file
          }}
        />
      </label>

      {/* Rejected files */}
      {rejected.length > 0 && (
        <ul className="mt-3 flex flex-col gap-y-1 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {rejected.map((msg, i) => (
            <li key={i} className="text-xs font-bold text-red-600">
              • {msg}
            </li>
          ))}
        </ul>
      )}

      {/* Previews */}
      {entries.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {entries.map((entry, index) => {
            // Entry is either a newly picked file { id, file, url }
            // or a file already saved on the server { id, name, type, url, remote }
            const { id, file, url } = entry;
            const fileName = entry.name ?? file?.name ?? "";
            const fileType = entry.type ?? file?.type ?? "";
            const isPdf =
              fileType === "application/pdf" ||
              /\.pdf($|\?)/i.test(fileName || url || "");
            return (
              <div
                key={id}
                className="relative group/card bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#a53860]/40 transition-all"
              >
                {/* Order badge */}
                <span className="absolute top-2 right-2 z-10 min-w-6 h-6 px-1.5 flex items-center justify-center rounded-full bg-[#1E293B]/80 text-white text-xs font-bold">
                  {index + 1}
                </span>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeEntry(id)}
                  title="ازالة الملف"
                  aria-label={`ازالة ${fileName}`}
                  className="absolute top-2 left-2 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-[#fa518f] hover:bg-[#fa518f]/80 text-white shadow transition-colors"
                >
                  <RiDeleteBin5Fill size={13} />
                </button>

                {/* Thumbnail (click to open full file) */}
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="فتح الملف"
                  className="block h-32 bg-[#F1F5F9]"
                >
                  {isPdf ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-y-1 text-red-500">
                      <FaFilePdf size={36} />
                      <span className="text-xs font-extrabold tracking-wider">
                        PDF
                      </span>
                    </div>
                  ) : url ? (
                    <img
                      src={url}
                      alt={fileName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#64748B]">
                      <ImFilePicture size={28} />
                    </div>
                  )}
                </a>

                {/* Meta */}
                <div className="px-3 py-2">
                  <p className="text-xs font-bold text-[#334155] truncate" dir="ltr">
                    {fileName}
                  </p>
                  <p className="text-[11px] font-medium text-[#94A3B8] mt-0.5">
                    {entry.remote ? "محفوظ على الصفحة" : formatSize(file.size)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}