import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { initialAuth, getActiveUser } from "./store/reducers/auth/authSlice";

import AdminLayout from "./layout/AdminLayout";
import UserLayout from "./layout/UserLayout";

import Login from "./pages/auth/Login";
import ForgetPassword from "./pages/auth/ForgetPassword";

import RequireRole from "./components/auth/RequireRole";
import RootRedirect from "./components/auth/RootRedirect";

import LandingPage from "./pages/LandingPage";
import Profile from "./pages/Profile";
import DisplayProfile from "./pages/DisplayProfile";
import DisplayAllCategories from "./pages/DisplayAllCategories";
import DisplayAllProfiles from "./pages/DisplayAllProfiles";
import Home from "./pages/Home";
import EditProfile from "./pages/EditProfile";

import UserHome from "./pages/user/UserHome";
import UserDashboard from "./pages/user/UserDashboard";
import UserNotificationsPage from "./pages/user/UserNotificationsPage";

import AdminHome from "./pages/admin/AdminHome";
import AdminCreateSubscription from "./pages/admin/AdminCreateSubscription";
import AdminCreateCategory from "./pages/admin/AdminCreateCategory";
import AdminEditCategory from "./pages/admin/AdminEditCategory";
import AdminChangePassword from "./pages/admin/AdminChangePassword";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminDisplaySubscription from "./pages/admin/AdminDisplaySubscription";
import AdminNotificationsPage from "./pages/admin/AdminNotificationsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

const ADMIN_ROLES = ["admin", "superAdmin"];
const ALL_ROLES = ["user", ...ADMIN_ROLES];

const isAdminRole = (role) => ADMIN_ROLES.includes(role);

function RoleLayout() {
  const role = useSelector((state) => state?.auth?.role);
  return isAdminRole(role) ? <AdminLayout /> : <UserLayout />;
}

function RoleSwitch({ user, admin }) {
  const role = useSelector((state) => state?.auth?.role);
  return isAdminRole(role) ? admin : user;
}

function PublicOrRoleLayout() {
  const authUser = useSelector((state) => state?.auth?.user);
  return authUser ? <RoleLayout /> : <Outlet />;
}

export default function App() {
  const user = useSelector((state) => state?.auth?.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initialAuth());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(getActiveUser());
    }
  }, [ dispatch]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />

          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} />

          <Route element={<PublicOrRoleLayout />}>
            <Route path="/display-profile/:slug" element={<DisplayProfile />} />
            <Route path="/display-all-categories" element={<DisplayAllCategories />} />
            <Route path="/display-all-profiles" element={<DisplayAllProfiles />} />
          </Route>

          <Route element={<RequireRole allowedRoles={ALL_ROLES} />}>
            <Route element={<RoleLayout />}>
              <Route
                path="/home"
                element={<RoleSwitch user={<UserHome />} admin={<AdminHome />} />}
              />
              <Route
                path="/notifications-page"
                element={
                  <RoleSwitch
                    user={<UserNotificationsPage />}
                    admin={<AdminNotificationsPage />}
                  />
                }
              />

              {/* Shared pages */}
              <Route path="/create-profile" element={<Home />} />
              <Route path="/profile/:slug/edit" element={<EditProfile />} />

              {/* User only */}
              <Route element={<RequireRole allowedRoles={["user"]} />}>
                <Route path="/dashboard" element={<UserDashboard />} />
              </Route>

              {/* Admin only */}
              <Route element={<RequireRole allowedRoles={ADMIN_ROLES} />}>
                <Route path="/create-subscription" element={<AdminCreateSubscription />} />
                <Route path="/create-category" element={<AdminCreateCategory />} />
                <Route path="/category/:id/edit" element={<AdminEditCategory />} />
                <Route path="/change-password" element={<AdminChangePassword />} />
                <Route path="/subscriptions" element={<AdminSubscriptions />} />
                <Route path="/subscription/:id" element={<AdminDisplaySubscription />} />
                <Route path="/settings" element={<AdminSettingsPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="/:slug" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}