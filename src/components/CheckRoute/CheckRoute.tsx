"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { fn_checkToken } from "@/api/api";

const CheckRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [loader, setLoader] = useState(true);
  const token: string | null =
    Cookies.get("access") || Cookies.get("agentAccess") || null;
  const [gotologin, setGotoLogin] = useState(false);

  let checkAuth = Cookies.get("role") || null;

  const authPaths = ["/login", "/register", "/forget-password"];
  const moreAuthPaths = pathname.startsWith("/reset-password");

  const agentAuthPaths = ["/agent/auth/login","/agent/auth/forget-password"];
  const agentMoreAuthPaths = pathname.startsWith("/agent/auth");

  const agentAllPath = pathname.startsWith("/agent");

  interface tokenResponse {
    status: number;
    data: {
      status: string;
      role: string
    }
  }

  useEffect(() => {
    setLoader(true);
    const confirmAuth = async () => {
      const response = await fn_checkToken(token) as tokenResponse;
      if (response === null) {
        checkAuth = null;
      }
      if (response?.status !== 200) {
        checkAuth = null;
        Cookies.remove("access");
        Cookies.remove("refresh");
        Cookies.remove("role");
        Cookies.remove("accessAgent");
        Cookies.remove("refreshAgent");
      }
      if (checkAuth) {
        if (checkAuth === "user") {
          if (
            authPaths.includes(pathname) ||
            moreAuthPaths ||
            agentAuthPaths.includes(pathname) ||
            agentMoreAuthPaths ||
            agentAllPath
          ) {
            router.push("/product");
          } else {
            setLoader(false);
            setGotoLogin(false);
          }
        } else {
          if (
            authPaths.includes(pathname) ||
            moreAuthPaths ||
            agentAuthPaths.includes(pathname) ||
            agentMoreAuthPaths
          ) {
            router.push("/agent/newcustomers");
          } else if (!agentAllPath) {
            router.push("/agent/newcustomers");
          } else {
            setLoader(false);
            setGotoLogin(false);
          }
        }
      } else {
        if (
          authPaths.includes(pathname) ||
          moreAuthPaths ||
          agentAuthPaths.includes(pathname) ||
          agentMoreAuthPaths
        ) {
          setLoader(false);
          setGotoLogin(true);
        } else {
          router.push("/login");
        }
      }
    };
    confirmAuth();
  }, [pathname]);

  if (loader && !gotologin) {
    return (
      <div>
        <LoadingScreen />
      </div>
    );
  } else {
    return <div>{children}</div>;
  }
};

export default CheckRoute;
