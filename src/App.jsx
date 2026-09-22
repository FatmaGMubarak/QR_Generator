import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { initialAuth, getActiveUser } from "./store/reducers/auth/authSlice";

import AdminLayout from "./layout/AdminLayout";
import UserLayout from "./layout/UserLayout";


import Login from "./pages/auth/Login";
import ForgetPassword from "./pages/auth/ForgetPassword";

import RequireRole from "./components/auth/RequireRole";

import LandingPage from "./pages/LandingPage";
import Profile from "./pages/Profile";
import DisplayProfile from "./pages/DisplayProfile";
import DisplayAllCategories from "./pages/DisplayAllCategories";
import DisplayAllProfiles from "./pages/DisplayAllProfiles";

import UserHome from "./pages/user/UserHome";
import UserNotificationsPage from "./pages/user/UserNotificationsPage";
import Home from "./pages/Home";
import EditProfile from "./pages/EditProfile";

import AdminHome from "./pages/admin/AdminHome";
import AdminCreateProfile from "./pages/admin/AdminCreateProfile";
import AdminCreateCategory from "./pages/admin/AdminCreateCategory";
import AdminEditCategory from "./pages/admin/AdminEditCategory";
import AdminChangePassword from "./pages/admin/AdminChangePassword";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminDisplaySubscription from "./pages/admin/AdminDisplaySubscription";
import AdminNotificationsPage from "./pages/admin/AdminNotificationsPage";

export default function App() {
  const user = useSelector((state)=>state?.auth?.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initialAuth());
    
  }, [dispatch]);

  useEffect(()=>{
    if(user){
      dispatch(getActiveUser());
    }
  }, [])

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />

      <BrowserRouter>
        <Routes>

          <Route
            path="/"
            element={<LandingPage />}
          />

          <Route
            path="/display-profile/:slug"
            element={<DisplayProfile />}
          />

          <Route
            path="/profile/:slug"
            element={<Profile />}
          />

          <Route
            path="/display-all-categories"
            element={<DisplayAllCategories />}
          />

          <Route
            path="/display-all-profiles"
            element={<DisplayAllProfiles />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/forget-password"
            element={<ForgetPassword />}
          />


          <Route element={<RequireRole allowedRoles={["user"]} />}>

            <Route
              path="/user"
              element={<UserLayout />}
            >
              <Route
                index
                element={<UserHome />}
              />

              <Route
                path="create-profile"
                element={<Home />}
              />

              <Route
                path="profile/:slug/edit"
                element={<EditProfile />}
              />

              <Route
                path="display-profile/:slug"
                element={<DisplayProfile />}
              />

              <Route
                path="display-all-categories"
                element={<DisplayAllCategories />}
              />

              <Route
                path="display-all-profiles"
                element={<DisplayAllProfiles />}
              />

              <Route
                path="notifications-page"
                element={<UserNotificationsPage />}
              />
            </Route>

          </Route>

          <Route
            element={
              <RequireRole
                allowedRoles={["admin", "superAdmin"]}
              />
            }
          >

            <Route
              path="/admin"
              element={<AdminLayout />}
            >
              <Route
                index
                element={<AdminHome />}
              />

              <Route
                path="create-profile"
                element={<AdminCreateProfile />}
              />

              <Route
                path="create-category"
                element={<AdminCreateCategory />}
              />

              <Route
                path="display-all-categories"
                element={<DisplayAllCategories />}
              />

              <Route
                path="display-all-profiles"
                element={<DisplayAllProfiles />}
              />

              <Route
                path="category/:id/edit"
                element={<AdminEditCategory />}
              />

              <Route
                path="change-password"
                element={<AdminChangePassword />}
              />

              <Route
                path="display-profile/:slug"
                element={<DisplayProfile />}
              />

              <Route
                path="profile/:slug/edit"
                element={<EditProfile />}
              />

              <Route
                path="subscriptions"
                element={<AdminSubscriptions />}
              />

              <Route
                path="subscription/:id"
                element={<AdminDisplaySubscription />}
              />

                            <Route
                path="notifications-page"
                element={<AdminNotificationsPage />}
              />

            </Route>

          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}