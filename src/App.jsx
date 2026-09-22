
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AdminHome from './pages/admin/AdminHome';
import Profile from './pages/Profile';
import Login from './pages/auth/Login';
import AdminLayout from './layout/AdminLayout';
import UserLayout from './layout/UserLayout';
import ForgetPassword from './pages/auth/ForgetPassword';
import AdminCreateProfile from './pages/admin/AdminCreateProfile';
import AdminCreateCategory from './pages/admin/AdminCreateCategory';
import AdminChangePassword from './pages/admin/AdminChangePassword';
import { ToastContainer } from 'react-toastify';
import UserHome from './pages/user/UserHome';
import DisplayProfile from './pages/DisplayProfile';
import EditProfile from './pages/EditProfile';
import AdminEditCategory from './pages/admin/AdminEditCategory';
import LandingPage from './pages/LandingPage';
import DisplayAllCategories from './pages/DisplayAllCategories';
import DisplayAllProfiles from './pages/DisplayAllProfiles';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { initialAuth } from './store/reducers/auth/authSlice';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';
import AdminDisplaySubscription from './pages/admin/AdminDisplaySubscription';
import UserNotificationsPage from './pages/user/UserNotificationsPage';

export default function App() {
   const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initialAuth());
  }, [dispatch]);
  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
    <BrowserRouter>
    <Routes>
                
                <Route index element={<LandingPage />} />
                <Route path='display-profile/:slug' element={<DisplayProfile />} />
                      <Route path='profile/:slug' element={<Profile />}/>
                      <Route path='display-all-categories' element={<DisplayAllCategories />}/>
                      <Route path='display-all-profiles' element={<DisplayAllProfiles />}/>
                      


      {/* <Route path='/user' element={<UserLayout />}>

           
            

      </Route> */}
      <Route path='/user'
      element={<UserLayout />}>
 <Route index element={<UserHome />}/>
 <Route path='/user/create-profile' element={<Home />}/>
 <Route path='/user/profile/:slug/edit' element={<EditProfile />}/>
 <Route path='/user/display-profile/:slug' element={<DisplayProfile />} />
 <Route path='/user/display-all-categories' element={<DisplayAllCategories />} />
          <Route path='/user/display-all-profiles' element={<DisplayAllProfiles />} />
          <Route path='/user/notifications-page' element={<UserNotificationsPage />} />
      </Route>
      
      
       <Route path='/login' element={<Login />}/>
      <Route path='/forget-password' element={<ForgetPassword />}/> 

      <Route
          path='/admin'
          element={
            // <RequireRole role="admin">
              <AdminLayout />
            //</RequireRole>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path='create-profile' element={<AdminCreateProfile />} />
          <Route path='create-category' element={<AdminCreateCategory />} />
          <Route path='/admin/display-all-categories' element={<DisplayAllCategories />} />
          <Route path='/admin/display-all-profiles' element={<DisplayAllProfiles />} />
          <Route path='/admin/category/:id/edit' element={<AdminEditCategory />} />
          <Route path='change-password' element={<AdminChangePassword />} />
          <Route path='/admin/display-profile/:slug' element={<DisplayProfile />} />
          <Route path='/admin/profile/:slug/edit' element={<EditProfile />}/>
          <Route path='/admin/subscriptions' element={<AdminSubscriptions />}/>
          <Route path='/admin/subscription/:id' element={<AdminDisplaySubscription />}/>
          <Route path='/admin/notifications-page' element={<UserNotificationsPage />}/>
          </Route >
    </Routes>
    </BrowserRouter>
    </>
  )
}
