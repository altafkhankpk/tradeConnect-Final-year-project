"use client";
import Link from "next/link";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logout } from "@/features/agentFeatures";
// import AgentProtectedRoute from "@/components/ProtectedRoute";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const agentAccess = Cookies.get("agentAccess");
    if (agentAccess) {
      router.push("/product");
    }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("access");
    Cookies.remove("refresh");
    Cookies.remove("role");
    dispatch(logout());
    localStorage.removeItem('userId');
    router.push("/login");

  };

  return (
    // <AgentProtectedRoute>
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
    // </AgentProtectedRoute>
  );
}
