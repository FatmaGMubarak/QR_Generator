import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RootRedirect() {
  const user = useSelector((state) => state?.auth?.user);
  const initialized = useSelector((state) => state?.auth?.initialized);

  if (!initialized) {
    return null;
  }


  if (!user) {
    return <Navigate to="/landing" replace />;
  }

  return <Navigate to="/home" replace />;
}