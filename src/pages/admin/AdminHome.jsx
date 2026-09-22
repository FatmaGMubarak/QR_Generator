import React, { useEffect } from 'react'
import Search from '../../components/common/Search'
import CategoriesListing from '../../components/common/CategoriesListing'
import CategoryCard from '../../components/common/CategoryCard'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProfiles } from '../../store/reducers/profileSlice'
import CategorySlideshow from '../../components/common/CategorySlideshow'
import { useLocation } from 'react-router-dom'
import { fetchCategories } from '../../store/reducers/categorySlice'
import ProfileCard from '../../components/common/ProfileCard'
import AnalyzingImageDemo from '../../components/common/AnalyzingImageDemo'
import { Link } from 'react-router-dom'
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";


export default function AdminHome() {
  const profiles = useSelector((state)=> state?.profile?.profiles);
  const loading = useSelector((state)=> state?.profile?.loading);
  const categories = useSelector((state)=> state?.category?.categories);

  const dispatch = useDispatch();

  const location = useLocation();
  const isAdmin = location.pathname.includes("/admin");

  useEffect(()=>{
    dispatch(fetchProfiles());
    dispatch(fetchCategories());
  }, [dispatch]);


  if(loading){
            return(
              <div className='w-full h-screen flex justify-center items-center'>
                <AnalyzingImageDemo />
              </div>
            )
          }

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-[#ffafcc] via-[#ff8fa3] to-[#4c956c] p-4 sm:p-5">
      <div className='w-full h-full mt-[7%]'>
        <CategorySlideshow />
      </div>
      <div className='w-full flex flex-col gap-y-2 justify-center items-center mt-[20%] md:mt-[7%] lg:mt-[3%]'>
        <Search />
        <CategoriesListing />
      </div>

      <div className='w-full flex flex-col gap-y-4 mt-6 sm:mt-4 md:mt-[1%]'>
        <div className='w-full flex justify-between items-center'>
          <h1 className='text-lg sm:text-xl font-bold'>كل المنشأت</h1>
         {categories?.length > 4 &&  <div className='flex items-center gap-x-2 bg-[#397a55] hover:bg-[#2a6041] transition-all ease-in-out text-white px-3 py-2 rounded-lg lg:ml-24'>
            <Link to={"/admin/display-all-categories"}>عرض المزيد </Link>
            <MdKeyboardDoubleArrowLeft className="text-2xl font-bold" />
          </div>}
        </div>
        <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center items-center gap-2'>
          {categories?.slice(0, 4)?.map((cat)=>{
                          return (
                            <CategoryCard key={cat?.id} logoImg={cat?.img} name={cat?.name} id={cat?.id} isAdmin={isAdmin}/>
                          )
                        })}
        </div>
      </div>
      <div className='w-full flex flex-col gap-y-4 mt-6 sm:mt-4 md:mt-[5%]'>
        <div className='w-full flex justify-between items-center'>
          <h1 className='text-lg sm:text-xl font-bold'>الصفحات الشخصية</h1>
         {profiles?.length > 4 &&  <div className='flex items-center gap-x-2 bg-[#397a55] hover:bg-[#2a6041] transition-all ease-in-out text-white px-3 py-2 rounded-lg lg:ml-24'>
            <Link to={"/admin/display-all-profiles"}>عرض المزيد </Link>
            <MdKeyboardDoubleArrowLeft className="text-2xl font-bold" />
          </div>}
        </div>
        <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center items-center gap-2'>
          {profiles?.slice(0, 4)?.map((profile)=>{
          return (
            <ProfileCard key={profile?.id} logoImg={profile?.logo} name={profile?.name} slug={profile?.slug} isAdmin={isAdmin}/>
          )
        })}
        </div>
      </div>

    </div>
  )
}