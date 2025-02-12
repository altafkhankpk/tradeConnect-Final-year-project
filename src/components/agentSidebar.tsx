"use client";

import React from "react";
import Image from "next/image";
import logo from "@/assets/Dr__2.png";
import { IoDocumentText, IoMail } from "react-icons/io5";
import { RiSettings3Fill } from "react-icons/ri";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updateSidebarNavigation } from "@/features/agentFeatures";

const AgentSidebar = () => {
  const dispatch = useDispatch();
  const sidebarNavigation = useSelector(
    (state: RootState) => state.agentFeatures.sidebarNavigation
  );

  return (
    <div className="fixed bottom-0 md:bottom-auto md:static md:flex z-[9999] md:z-0 bg-[--gray] md:bg-transparent w-full md:min-w-[95px] md:w-[95px] md:min-h-[100vh] py-[20px] md:py-[40px] flex-row md:flex-col">
      <Image
        alt="logo"
        src={logo}
        className="hidden md:block min-h-[45px] sm:min-h-[55px] h-[45px] sm:h-[55px] object-contain"
      />
      <div className="md:w-full h-[100%] flex md:flex-col justify-center gap-[23px] md:gap-[30px]">
        <Image alt="logo" src={logo} className="block md:hidden w-[50px] absolute left-[15px] mt-[3px] sm:mt-[7px]" />
        <Link
          href={"/agent/chat"}
          className={`flex flex-col items-center justify-center gap-[3px] sm:gap-[5px] cursor-pointer ${
            sidebarNavigation === "chat"
              ? "text-[black]"
              : "text-[#8F8989]"
          }`}
          onClick={() => dispatch(updateSidebarNavigation("chat"))}
        >
          <IoMail className="text-[25px]" />
          <p className="text-[10px] sm:text-[12px] font-[600]">Messages</p>
        </Link>
        <Link
          href={"/agent/newcustomers?page=1"}
          className={`flex w-[40px] md:w-auto flex-col items-center justify-center gap-[3px] sm:gap-[5px] cursor-pointer ${
            sidebarNavigation === "customers"
              ? "text-[black]"
              : "text-[#8F8989]"
          }`}
          onClick={() => dispatch(updateSidebarNavigation("customers"))}
        >
          <IoDocumentText className="text-[25px]" />
          <p className="text-[10px] sm:text-[12px] text-center font-[600] leading-[12px] mb-[-13px]">
            Get New Customers
          </p>
        </Link>
        <Link
          href={"/agent/settings"}
          className={`flex flex-col items-center justify-center gap-[3px] sm:gap-[5px] cursor-pointer ${
            sidebarNavigation === "settings"
              ? "text-[black]"
              : "text-[#8F8989]"
          }`}
          onClick={() => dispatch(updateSidebarNavigation("settings"))}
        >
          <RiSettings3Fill className="text-[25px]" />
          <p className="text-[10px] sm:text-[12px] font-[600]">Settings</p>
        </Link>
      </div>
    </div>
  );
};

export default AgentSidebar;
