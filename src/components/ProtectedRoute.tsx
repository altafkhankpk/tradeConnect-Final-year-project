"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { login, logout, updateRole } from "@/features/features"; // Assuming features is for users
import { RootState } from "@/store/store"; // Import RootState type from your store setup

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const UserProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.features.isAuthenticated
  );
  const tokenExists = Cookies.get("access") !== undefined;

  useEffect(() => {
    const role = Cookies.get('role') || '';
    dispatch(updateRole(role));
  }, [pathname]);

  useEffect(() => {
    if (tokenExists) {
      dispatch(login());
    } else {
      dispatch(logout());
    }

    const publicPaths = ["/login", "/register", "/forget-password"];
    const isResetPasswordRoute = pathname.startsWith("/reset-password");

    // Redirect to login if not authenticated and not on a public route
    if (
      (!isAuthenticated || !tokenExists) &&
      !publicPaths.includes(pathname) &&
      !isResetPasswordRoute
    ) {
      router.push("/login");
    }
    // If authenticated, prevent access to login/register/forget-password/reset-password routes
    else if (
      (isAuthenticated || tokenExists) &&
      (publicPaths.includes(pathname) || isResetPasswordRoute)
    ) {
      router.push("/product?page=1"); // Redirect to user dashboard
    }
  }, [isAuthenticated, pathname, router, tokenExists, dispatch]);

  if (
    !isAuthenticated &&
    !pathname.startsWith("/reset-password") &&
    !["/login", "/register", "/forget-password"].includes(pathname)
  ) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default UserProtectedRoute;
