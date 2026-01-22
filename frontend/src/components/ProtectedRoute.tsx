import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";


const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isUserLoggedIn } = useAuth();

  // Redirect to login page if not logged in
  if (!isUserLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
