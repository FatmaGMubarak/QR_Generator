import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RootRedirect() {
  const user = useSelector((state) => state?.auth?.user);
  const initialized = useSelector((state) => state?.auth?.initialized);

  // Wait until auth state is restored to avoid flashing the wrong page
  if (!initialized) {
    return null;
  }

  // Not logged in -> landing page
  if (!user) {
    return <Navigate to="/landing" replace />;
  }

  // Logged in (user or admin) -> /home, which renders the right page per role
  return <Navigate to="/home" replace />;
}