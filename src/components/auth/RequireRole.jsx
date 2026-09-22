import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getActiveUser } from "../../store/reducers/auth/authSlice";

export default function RequireRole({ allowedRoles }) {
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);
  const initialized = useSelector((state) => state.auth.initialized);

  if (!initialized) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    if (role === "admin" || role === "superAdmin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/user" replace />;
  }

  return <Outlet />;
}