"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

import logo from "@/assets/sm-logo-white.png";

import { RiSettings3Fill } from "react-icons/ri";
import { IoDocumentText, IoMail } from "react-icons/io5";
import { updateSidebarNavigation } from "@/features/features";
import { RootState } from "@/store/store";

const Sidebar = () => {
  const dispatch = useDispatch();
  const sidebarNavigation = useSelector(
    (state: RootState) => state.features.sidebarNavigation
  );

  return (
    <div className="fixed bottom-0 md:bottom-auto  md:static md:flex z-[9999] bg-[--black] md:bg-transparent w-full md:min-w-[90px] md:w-[90px] md:min-h-[100vh] py-[20px] md:py-[40px] flex-row md:flex-col">
      <Image
        alt="logo"
        src={logo}
        className="hidden md:block min-h-[45px] sm:min-h-[55px] h-[45px] sm:h-[55px] object-contain"
      />
      <div className="md:w-full h-[100%] flex md:flex-col justify-center px-5 sm:px-0 gap-[20px] sm:gap-[30px]">
        <Image alt="logo" src={logo} className="block md:hidden absolute left-[20px] sm:mt-[10px] w-[50px]" />
        <Link
          href={"/chat"}
          className={`flex flex-col items-center justify-center gap-[3px] sm:gap-[5px] cursor-pointer ${sidebarNavigation === "chat" ? "text-[white]" : "text-[#8F8989]"
            }`}
          onClick={() => dispatch(updateSidebarNavigation("chat"))}
        >
          <IoMail className="text-[22px] sm:text-[30px]" />
          <p className="text-[9px] sm:text-[12px] font-[600]">Messages</p>
        </Link>
        <Link
          href={"/product?page=1"}
          className={`flex flex-col items-center justify-center gap-[3px] sm:gap-[5px] cursor-pointer ${sidebarNavigation === "quotes" ? "text-[white]" : "text-[#8F8989]"
            }`}
          onClick={() => dispatch(updateSidebarNavigation("quotes"))}
        >
          <IoDocumentText className="text-[22px] sm:text-[30px]" />
          <p className="text-[9px] sm:text-[12px] font-[600]">My Quotes</p>
        </Link>
        <Link
          href={"/settings"}
          className={`flex flex-col items-center justify-center gap-[3px] sm:gap-[5px] cursor-pointer ${sidebarNavigation === "settings" ? "text-[white]" : "text-[#8F8989]"
            }`}
          onClick={() => dispatch(updateSidebarNavigation("settings"))}
        >
          <RiSettings3Fill className="text-[22px] sm:text-[30px]" />
          <p className="text-[9px] sm:text-[12px] font-[600]">Settings</p>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
