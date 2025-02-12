"use client";
import Link from "next/link";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logout } from "@/features/agentFeatures";
import AgentProtectedRoute from "@/components/AgentProtectedRoute";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Agent() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const agentAccess = Cookies.get("agentAccess");
    if (agentAccess) {
      // Redirect to customer page if logged in
      router.push("/agent/newcustomers"); // Update this path as necessary
    }
  }, [router]);

  const handleLogout = () => {
    // Remove tokens from cookies
    Cookies.remove("agentAccess");
    Cookies.remove("agentRefresh");

    // Update Redux state
    dispatch(logout());

    // Redirect to login page
    router.push("/agent/auth/login");
  };

  return (
    <AgentProtectedRoute>
      <div>
        <Link
          href="/upload-product"
          className="flex justify-center items-center bg-red-600 h-[40px] font-[500] text-white pb-[2px] w-[140px] rounded-[5px]"
        >
          Upload Product
        </Link>
        <button
          onClick={handleLogout}
          className="mt-[20px] flex justify-center items-center bg-red-600 h-[40px] font-[500] text-white w-[140px] rounded-[5px]"
        >
          Logout
        </button>
      </div>
    </AgentProtectedRoute>
  );
}
