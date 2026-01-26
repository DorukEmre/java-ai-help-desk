import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/auth/useAuth";

interface Props {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { isUserLoggedIn, user } = useAuth();

  // Redirect to login page if not logged in
  if (!isUserLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home page if user role is not allowed
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
