"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { login, logout } from "@/features/agentFeatures";
import { RootState } from "@/store/store";
import LoadingSpinner from "./LoadingSpinner"; // Import the loading spinner

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const AgentProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.agentFeatures.isAuthenticated
  );
  const tokenExists = Cookies.get("agentAccess") !== undefined;

  console.log(tokenExists,'dfaaaaaaaaaaaaaaaa');
  
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  console.log(registrationId);
  
  const [loading, setLoading] = useState(true); // Loading state

  // Public paths that don't require authentication
  const publicPaths = [
    "/agent/auth/login",
    "/agent/auth/register",
    "/agent/forget-password",
    "/agent/reset-password"
  ];

  // Paths for multi-step registration
  const registrationPaths = [
    "/agent/auth/register/account/createaccount_1",
    "/agent/auth/register/account/createaccount_2",
    "/agent/auth/register/account/createaccount_3",
    "/agent/auth/register/account/createaccount_4",
    "/agent/auth/register/account/createaccount_5",
    "/agent/auth/register/account/createaccount_6",
    "/agent/auth/register/account/createaccount_7",
    "/agent/auth/register/account/createaccount_8"
  ];

  useEffect(() => {
    // Access localStorage safely
    const id = typeof window !== "undefined" ? localStorage.getItem("agentId") : null;
    setRegistrationId(id);

    if (tokenExists) {
      dispatch(login());
    } else {
      dispatch(logout());
    }

    // Redirect logic
    if (
      (!isAuthenticated || !tokenExists) &&
      !publicPaths.includes(pathname) &&
      !registrationPaths.includes(pathname) && !id
    ) {
      router.push("/agent/auth/login");
    } else if (
      (isAuthenticated || tokenExists || id) &&
      publicPaths.includes(pathname)
    ) {
      // router.push("/agent/newcustomers");
    }

    // Set loading to false after processing
    setLoading(false);
  }, [isAuthenticated, pathname, router, tokenExists, dispatch]);

  // Show loading spinner if loading
  if (loading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};

export default AgentProtectedRoute;
