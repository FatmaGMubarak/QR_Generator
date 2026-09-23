import React, { useEffect, useState } from "react";

import Search from "../components/common/Search";
import CategoriesListing from "../components/common/CategoriesListing";
import CategorySlideshow from "../components/common/CategorySlideshow";

import { useDispatch, useSelector } from "react-redux";
import { fetchHomeProfiles } from "../store/reducers/profileSlice";
import { fetchHomeCategories } from "../store/reducers/categorySlice";

import { useLocation, Link } from "react-router-dom";

import ProfileCard from "../components/common/ProfileCard";
import Topbar from "../components/common/ui/Topbar";
import AnalyzingImageDemo from "../components/common/AnalyzingImageDemo";

import { MdKeyboardDoubleArrowLeft } from "react-icons/md";

export default function LandingPage() {
  const homeProfiles = useSelector(
    (state) => state?.profile?.homeProfiles || []
  );

  const loading = useSelector((state) => state?.profile?.loading);

  const dispatch = useDispatch();
  const location = useLocation();

  const isAdmin = location.pathname.includes("/admin");

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchHomeProfiles());
    dispatch(fetchHomeCategories());
  }, [dispatch]);

  const normalizeSearchText = (value) => {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  };

  const normalizedSearch = normalizeSearchText(searchQuery);

  const filteredProfiles = homeProfiles.filter((profile) => {
    const matchesCategory =
      selectedCategory === null ||
      Number(profile?.activity_id) === Number(selectedCategory);

    if (!matchesCategory) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    const profileName = normalizeSearchText(profile?.name);

    return profileName.includes(normalizedSearch);
  });

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <AnalyzingImageDemo />
      </div>
    );
  }

  return (
    <>
      <Topbar />

      <div
        className="
          w-full
          min-h-screen
          bg-gradient-to-r
          from-[#ffafcc]
          via-[#ff8fa3]
          to-[#4c956c]
          p-4
          sm:p-5
        "
      >
        <div className="w-full h-full mt-[7%]">
          <CategorySlideshow />
        </div>

        <div
          className="
            w-full
            flex
            flex-col
            gap-y-2
            justify-center
            items-center
            mt-[20%]
            md:mt-[7%]
            lg:mt-[3%]
          "
        >
          <Search onSearch={setSearchQuery} />

          <CategoriesListing onCategorySelect={setSelectedCategory} />
        </div>

        <div
          className="
            w-full
            flex
            flex-col
            gap-y-4
            mt-6
            sm:mt-4
            lg:pr-5
          "
        >
          <div className="w-full flex justify-between items-center">
            <h1 className="text-lg sm:text-xl font-bold">كل المنشآت</h1>

            {filteredProfiles?.length > 4 && (
              <div
                className="
                  flex
                  items-center
                  gap-x-2
                  bg-[#397a55]
                  hover:bg-[#2a6041]
                  transition-all
                  ease-in-out
                  text-white
                  px-3
                  py-2
                  rounded-lg
                  lg:ml-24
                "
              >
                <Link to="/display-all-profiles">عرض المزيد</Link>

                <MdKeyboardDoubleArrowLeft className="text-2xl font-bold" />
              </div>
            )}
          </div>

          {filteredProfiles?.length > 0 ? (
            <div
              className="
                w-full
                grid
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-4
                justify-center
                items-center
                gap-2
              "
            >
              {filteredProfiles.slice(0, 4).map((profile) => (
                <ProfileCard
                  key={profile?.id}
                  logoImg={profile?.logo}
                  name={profile?.name}
                  slug={profile?.slug}
                  isAdmin={isAdmin}
                  activity={profile?.activity_id}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center w-full py-10">
              <p className="text-gray-600 font-semibold text-lg">
                لا توجد منشآت في هذا التصنيف
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}