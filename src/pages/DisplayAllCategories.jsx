import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";

import { fetchCategories } from "../store/reducers/categorySlice";
import CategoryCard from "../components/common/CategoryCard";

const PAGE_SIZE = 9; 

export default function DisplayAllCategories() {
  const dispatch = useDispatch();

  const categories = useSelector((state) => state?.category?.categories) || [];
  const loading = useSelector((state) => state?.category?.loading);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const totalPages = Math.max(1, Math.ceil(categories.length / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      //setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return categories.slice(start, start + PAGE_SIZE);
  }, [categories, currentPage]);

  const goToPage = (page) => {
    const clamped = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(clamped);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = useMemo(() => {
    const maxButtons = 5;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8  mt-[20%] sm:mt-[7%]">
      <h2 className="mb-6 text-center font-['Cairo'] text-2xl font-extrabold text-[#244238]">
        المنشأت
      </h2>

      {loading ? (
        <div className="flex flex-wrap justify-center gap-5">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div
              key={i}
              className="h-[220px] w-full min-w-[220px] animate-pulse rounded-[24px] border border-[#e3eee7] bg-[#f2f8f4] lg:w-[30%]"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-[#91a39b]">
          <Inbox size={40} />
          <p className="font-['Cairo'] text-sm font-semibold">
            لا توجد فئات لعرضها
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-5">
            {paginatedCategories.map((category) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                logoImg={category.img}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-lg border border-[#e3eee7] bg-white
                  text-[#397a55]
                  transition-colors duration-200
                  hover:bg-[#f2f8f4]
                  disabled:cursor-not-allowed disabled:opacity-40
                "
                aria-label="الصفحة السابقة"
              >
                <ChevronRight size={18} />
              </button>

              {pageNumbers[0] > 1 && (
                <>
                  <button
                    onClick={() => goToPage(1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold text-[#397a55] hover:bg-[#f2f8f4]"
                  >
                    1
                  </button>
                  {pageNumbers[0] > 2 && <span className="px-1 text-[#91a39b]">…</span>}
                </>
              )}

              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`
                    flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold
                    transition-colors duration-200
                    ${
                      page === currentPage
                        ? "bg-[#2f6647] text-white"
                        : "text-white hover:bg-[#2f6647]/50 hover:text-white border border-[#2f6647]"
                    }
                  `}
                >
                  {page}
                </button>
              ))}

              {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                  {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                    <span className="px-1 text-[#91a39b]">…</span>
                  )}
                  <button
                    onClick={() => goToPage(totalPages)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold text-[#397a55] hover:bg-[#f2f8f4]"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-lg border border-[#e3eee7] bg-white
                  text-[#397a55]
                  transition-colors duration-200
                  hover:bg-[#f2f8f4]
                  disabled:cursor-not-allowed disabled:opacity-40
                "
                aria-label="الصفحة التالية"
              >
                <ChevronLeft size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}