"use client";
import Link from "next/link";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logout } from "@/features/agentFeatures";
import { useRouter } from "next/navigation";

export default function Agent() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("agentAccess");
    Cookies.remove("agentRefresh");
    Cookies.remove("role");
    dispatch(logout());
    localStorage.removeItem("agentId");
    router.push("/agent/auth/login");
  };

  return (
    <div>
      <Link
        href="/agent/newcustomers"
        className="flex justify-center items-center bg-red-600 h-[40px] font-[500] text-white pb-[2px] w-[140px] rounded-[5px]"
      >
        New Customer
      </Link>
      <button
        onClick={handleLogout}
        className="mt-[20px] flex justify-center items-center bg-red-600 h-[40px] font-[500] text-white w-[140px] rounded-[5px]"
      >
        Logout
      </button>
    </div>
  );
}
