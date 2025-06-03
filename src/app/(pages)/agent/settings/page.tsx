"use client";

import Image from "next/image";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AgentSidebar from "@/components/agentSidebar";
import { AgentdGetApi, updateAgentFormApi } from "@/api/api";
import Invoices from "@/components/AgentSettingTabs/invoices";
import { updateSidebarNavigation } from "@/features/agentFeatures";

import send from "@/assets/Send.png";
import call from "@/assets/Call.png";
import profile from "@/assets/Profile.png";
import watch from "@/assets/Time Square.png";
import document from "@/assets/Document.png";
import localtion from "@/assets/Location.png";
import AvatarImg from "@/assets/avatar.png";
import Whitepencile from "@/assets/white-pencile.png";

import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import Bank from "@/components/AgentSettingTabs/Bank";

const Settings = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("profile");
  const [viewMobileBar, setViewMobileBar] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewCover, setPreviewCover] = useState<string | null>(null);
  const [loader, setLoader] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    username: "",
    firstName: "",
    experience: "",
    email: "",
    catchphrase: "",
    orderPerDay: "",
    city: "",
    profileImage: "",
    coverImage: "",
  });

  const [initailData, setInitailData] = useState<InitailType>({
    username: "",
    firstName: "",
    email: "",
    phone: "",
    profileImage: "",
    coverImage: "",
  });

  interface FormData {
    username?: string;
    firstName?: string;
    experience?: string;
    email?: string;
    orderPerDay?: string;
    city?: string;
    profileImage: File | string;
    coverImage: File | string;
    catchphrase?: string;
    phone?: string;
  }

  interface AgentFormData {
    username?: string;
    firstName?: string;
    experience?: string;
    email?: string;
    orderPerDay?: string;
    city?: string;
    profileImage: File | string;
    coverImage: File | string;
    catchphrase?: string;
    phone?: string;
  }

  interface InitailType {
    username?: string;
    firstName?: string;
    experience?: string;
    email?: string;
    orderPerDay?: string;
    city?: string;
    profileImage?: string;
    coverImage?: string;
    catchphrase?: string;
    phone?: string;
  }

  interface AgentApiResponse {
    data: {
      status: string;
      data: {
        username?: string;
        firstName?: string;
        experience?: string;
        email?: string;
        orderPerDay?: string;
        city?: string;
        phone?: string;
        profileImage: string;
        coverImage?: string;
        catchphrase: string;
      };
    };
  }

  const fn_getProduct = async () => {
    const response = (await AgentdGetApi()) as AgentApiResponse;
    if (response?.data?.status === "ok") {
      setFormData({
        username: response?.data?.data?.username || "",
        firstName: response?.data?.data?.firstName || "",
        email: response?.data?.data?.email || "",
        phone: response?.data?.data?.phone || "",
        profileImage: response?.data?.data?.profileImage || "",
        coverImage: response?.data?.data?.coverImage || "",
        catchphrase: response?.data?.data?.catchphrase || "",
        experience: response?.data?.data?.experience || "",
        orderPerDay: response?.data?.data?.orderPerDay || "",
        city: response?.data?.data?.city || "",
      });
      setInitailData({
        username: response?.data?.data?.username || "",
        firstName: response?.data?.data?.firstName || "",
        email: response?.data?.data?.email || "",
        phone: response?.data?.data?.phone || "",
        profileImage: response?.data?.data?.profileImage || "",
        coverImage: response?.data?.data?.coverImage || "",
        catchphrase: response?.data?.data?.catchphrase || "",
        experience: response?.data?.data?.experience || "",
        orderPerDay: response?.data?.data?.orderPerDay || "",
        city: response?.data?.data?.city || "",
      });
    }
  };

  useEffect(() => {
    fn_getProduct();
    dispatch(updateSidebarNavigation("settings"));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  interface HandleData {
    data: {
      status: string;
    };
  }

  const handleSubmit = async () => {
    setLoader(true);
    const fileData = new FormData();
    Object.keys(formData).forEach((nameKey) => {
      const typedKey = nameKey as keyof AgentFormData;
      if (formData[typedKey] !== initailData[typedKey]) {
        fileData.append(nameKey, formData[typedKey] as string | Blob);
      }
    });

    try {
      const response = (await updateAgentFormApi(fileData)) as HandleData;
      if (response?.data?.status === "ok") {
        toast.success("Profile updated successfully!");
        fn_getProduct();
      } else {
        toast.error("Failed to update profile.");
      }
      setLoader(false);
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
      setLoader(false);
    }
  };
   const fn_deleteAccount = async () => {
    try {
      const token = Cookies.get("agentAccess");// or however you're storing the JWT

      const response = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BASEURL}/apis/agent/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add JWT token to the header
        },
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Account deleted successfully.");
        // Optionally, log the user out and redirect
        localStorage.removeItem("token");
        Cookies.remove("agentAccess");
        Cookies.remove("refresh");
        window.location.href = "/agent/auth/login"; // or navigate using react-router
      } else {
        toast.error(`Failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("An error occurred while deleting the account.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const name = e.target.name;
    if (file) {
      if (name == "profileImage") {
        setFormData({ ...formData, profileImage: file });
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFormData({ ...formData, coverImage: file });
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewCover(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div>
            <p className="text-[25px] sm:text-[30px] md:text-[35px] font-[800]">
              <i>Apparence</i>
            </p>

            <div>
              <div className="grid gap-2 mt-4 lg:grid-cols-2 grid-cols-1">
                {/* Profile Picture */}
                <div className="flex gap-2 flex-col">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="bg-[#F3F3F3] w-[100px] h-[100px] rounded-md">
                        <a href={initailData.profileImage} target="__blank">
                          <Image
                            src={
                              previewImage
                                ? previewImage
                                : initailData.profileImage
                                ? initailData.profileImage
                                : AvatarImg
                            }
                            width={100}
                            height={100}
                            alt="Image"
                          />
                        </a>
                      </div>

                      <label
                        htmlFor="profilePic"
                        className="p-1 absolute -bottom-1 -right-1 rounded-full bg-white cursor-pointer"
                      >
                        <div className="bg-[--red] w-5 h-5 rounded-full flex justify-center items-center">
                          <Image src={Whitepencile} alt="" />
                        </div>
                      </label>
                      <input
                        id="profilePic"
                        name="profileImage"
                        type="file"
                        className=" hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[18px] font-[600]">
                        Profile Picture
                      </label>
                      <p className="text-[--red] font-[600] text-[14px] sm:text-[15px]">
                        Customize
                      </p>
                    </div>
                  </div>
                </div>

                {/* Username */}
                <div className="hidden lg:flex gap-1 flex-col">
                  <div className="flex items-center gap-2">
                    {/* <div>
                      <Image src={watch} width={22} height={22} alt="" />
                    </div> */}
                    <label className="text-[18px] font-[600]">Username</label>
                  </div>
                  <div className="relative">
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder=""
                      className="outline outline-[2px] outline-gray-200 focus:outline-[--red] rounded-lg overflow-hidden bg-[#F3F3F3] h-[48px] p-2 w-full"
                    />
                    {/* <div
                      className="absolute flex items-center gap-2 right-3.5 top-3.5 cursor-pointer"
                    >
                      <div>
                        <Image src={pencile} width={18} height={18} alt="" />
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* Cover Picture */}
                <div className="flex gap-1 flex-col mt-[10px] lg:mt-0">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="bg-[#F3F3F3] w-[100px] h-[100px] rounded-md">
                        <a href={initailData.coverImage ? initailData.coverImage : "#"} target="__blank">
                        <Image
                          src={
                            previewCover
                              ? previewCover
                              : initailData.coverImage
                              ? initailData.coverImage
                              : AvatarImg
                          }
                          width={100}
                          height={100}
                          alt="Image"
                        />
                        </a>
                      </div>

                      <label
                        htmlFor="coverImage"
                        className=" p-1 absolute -bottom-1 -right-1 rounded-full bg-white cursor-pointer"
                      >
                        <div className="bg-[--red] w-5 h-5 rounded-full flex justify-center items-center">
                          <Image src={Whitepencile} alt="" />
                        </div>
                      </label>
                      <input
                        id="coverImage"
                        type="file"
                        name="coverImage"
                        className=" hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[18px] font-[600]">
                        Cover Photos
                      </label>
                      <p className="text-[--red] font-[600] text-[14px] sm:text-[15px]">
                        Customize
                      </p>
                    </div>
                  </div>
                </div>

                {/* Username */}
                <div className="flex lg:hidden gap-1 flex-col">
                  <div className="flex items-center gap-2">
                    {/* <div>
                      <Image src={watch} width={22} height={22} alt="" />
                    </div> */}
                    <label className="text-[18px] font-[600]">Username</label>
                  </div>
                  <div className="relative">
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder=""
                      className="outline outline-[2px] outline-gray-200 focus:outline-[--red] rounded-lg overflow-hidden bg-[#F3F3F3] h-[48px] p-2 w-full"
                    />
                    {/* <div
                      className="absolute flex items-center gap-2 right-3.5 top-3.5 cursor-pointer"
                    >
                      <div>
                        <Image src={pencile} width={18} height={18} alt="" />
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* Catchphrase */}
                <div className="flex gap-1 flex-col">
                  <div className="flex items-center gap-2">
                    {/* <div>
                      <Image src={watch} width={22} height={22} alt="" />
                    </div> */}
                    <label className="text-[18px] font-[600]">
                      Your Heading
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      name="catchphrase"
                      value={formData.catchphrase}
                      onChange={handleChange}
                      placeholder=""
                      className="outline outline-[2px] outline-gray-200 focus:outline-[--red] rounded-lg overflow-hidden bg-[#F3F3F3] h-[48px] p-2 w-full"
                    />
                    {/* <div
                      className="absolute flex items-center gap-2 right-3.5 top-3.5 cursor-pointer"
                    >
                      <div>
                        <Image src={pencile} width={18} height={18} alt="" />
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>

              <hr className="mt-4 mb-2" />
            </div>

            <div>
              <p className="text-[25px] font-[800] mb-[5px] mt-[15px]">
                <i>Personal Information</i>
              </p>

              <div className="grid gap-8 lg:grid-cols-2 grid-cols-1">
                {/* Name */}
                <div className="flex gap-1 flex-col">
                  <div className="flex items-center gap-2">
                    <div>
                      <Image
                        src={profile}
                        width={19}
                        height={19}
                        alt="profile"
                      />
                    </div>
                    <label className="text-[18px] font-[600]">Name</label>
                  </div>

                  <div className="relative w-full">
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder=""
                      className="outline outline-[2px] outline-gray-200 focus:outline-[--red] rounded-lg overflow-hidden bg-[#F3F3F3] h-[48px] p-2 pr-24 w-full"
                    />
                    {/* <div className="absolute flex items-center gap-2 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                      <div>
                        <Image
                          src={pencile}
                          width={18}
                          height={18}
                          alt="edit"
                        />
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* Years of Experience */}
                <div className="flex gap-1 flex-col">
                  <div className="flex items-center gap-2">
                    <div>
                      <Image src={watch} width={19} height={19} alt="" />
                    </div>
                    <label className="text-[18px] font-[600]">
                      Years of Experience
                    </label>
                  </div>

                  <div className="relative w-full">
                    <input
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder=""
                      min={1}
                      className="outline outline-[2px] outline-gray-200 focus:outline-[--red] rounded-lg overflow-hidden bg-[#F3F3F3] h-[48px] p-2 w-full"
                      type="number"
                    />
                    {/* <div className="absolute flex items-center gap-2 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                      <div>
                        <Image
                          src={pencile}
                          width={18}
                          height={18}
                          alt="edit"
                        />
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-1 flex-col">
                  <div className="flex items-center gap-2">
                    <div>
                      <Image src={send} width={19} height={19} alt="profile" />
                    </div>
                    <label className="text-[18px] font-[600]">Email</label>
                  </div>
                  <div className="relative w-full">
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder=""
                      className="outline outline-[2px] outline-gray-200 focus:outline-[--red] rounded-lg overflow-hidden bg-[#F3F3F3] h-[48px] p-2 pr-24 w-full"
                    />
                    {/* <div className="absolute flex items-center gap-2 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                      <div>
                        <Image
                          src={pencile}
                          width={18}
                          height={18}
                          alt="edit"
                        />
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* Minimum Orders per Day */}
                <div className="flex gap-1 flex-col">
                  <div className="flex items-center gap-2">
                    <div>
                      <Image src={document} width={19} height={19} alt="" />
                    </div>
                    <label className="text-[18px] font-[600]">
                      Minimum Orders per Day
                    </label>
                  </div>

                  <div className="relative w-full">
                    <input
                      name="orderPerDay"
                      value={formData.orderPerDay}
                      onChange={handleChange}
                      placeholder=""
                      min={1}
                      className="outline outline-[2px] outline-gray-200 focus:outline-[--red] rounded-lg overflow-hidden bg-[#F3F3F3] h-[48px] p-2 w-full"
                      type="number"
                    />
                    {/* <div
                      className="absolute flex items-center gap-2 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    >
                      <div>
                        <Image
                          src={pencile}
                          width={18}
                          height={18}
                          alt="edit"
                        />
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* Mobile */}
                <div className="flex gap-1 flex-col">
                  <div className="flex items-center gap-2">
                    <div>
                      <Image src={call} width={19} height={19} alt="profile" />
                    </div>
                    <label className="text-[18px] font-[600]">
                      Mobile {"(optional)"}
                    </label>
                  </div>
                  <div className="relative w-full">
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder=""
                      className="outline outline-[2px] outline-gray-200 focus:outline-[--red] rounded-lg overflow-hidden bg-[#F3F3F3] h-[48px] p-2 pr-24 w-full"
                    />
                    {/* <div className="absolute flex items-center gap-2 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                      <div>
                        <Image
                          src={pencile}
                          width={18}
                          height={18}
                          alt="edit"
                        />
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* Warehouse Location */}
                <div className="flex gap-1 flex-col">
                  <div className="flex items-center gap-2">
                    <div>
                      <Image src={localtion} width={19} height={19} alt="" />
                    </div>
                    <label className="text-[18px] font-[600]">
                      Warehouse Location
                    </label>
                  </div>

                  <div className="relative w-full">
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder=""
                      className="outline outline-[2px] outline-gray-200 focus:outline-[--red] rounded-lg overflow-hidden bg-[#F3F3F3] h-[48px] p-2 pr-24 w-full"
                    />
                    {/* <div
                      className="absolute flex items-center gap-2 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    >
                      <div>
                        <Image
                          src={pencile}
                          width={18}
                          height={18}
                          alt="edit"
                        />
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
              

              <div className="flex justify-between mt-6">
                 <button
                  onClick={fn_deleteAccount}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
                >
                  Delete Account
                </button>
                <button
                  disabled={loader}
                  onClick={handleSubmit}
                  className={`text-white w-[152px] h-10 rounded-md ${
                    loader
                      ? "cursor-not-allowed bg-[--red-disabled]"
                      : "bg-[--red]"
                  }`}
                >
                  {!loader ? (
                    <span>Save Changes</span>
                  ) : (
                    <span className="loader"></span>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      case "invoices":
        return <Invoices />
      case "bank" :
        return <Bank />
      default:
        return null;
    }
  };

  const logout = () => {
    localStorage.clear();
    Cookies.remove("agentAccess");
    Cookies.remove("agentRefresh");
    Cookies.remove("role");
    router.push("/agent/auth/login");
  };

  return (
    <div className="flex justify-center overflow-x-hidden w-full bg-[#E1E1E1] min-h-[100vh]">
      <div className="flex w-full bg-transparent z-[9]">
        {/* Left box - sidebar */}
        <AgentSidebar />
        {/* Right box - in white */}
        <div className="relative min-h-[100vh] w-full py-[30px] px-[10px] lg:pe-[30px]">
          <div className="bg-[white] md:relative min-h-[100%] rounded-[35px] px-[20px] py-[40px] pb-[80px] lg:p-[40px] flex flex-col">
            <div className=" flex sm:flex-row flex-col  gap-12">
              <div
                className={`fixed md:static w-[200px] md:w-[40%] lg:w-[25%] min-h-[100vh] md:min-h-[auto] top-0 border-e md:border-none border-[--red] px-[10px] md:px-0 py-[30px] md:py-0 shadow-sm md:shadow-none bg-white z-[9999] transition-all duration-700 ${
                  viewMobileBar
                    ? "left-0 md:left-auto"
                    : "left-[-100%] md:left-auto"
                }`}
              >
                <p className="text-[25px] sm:text-[40px] font-[800]">
                  <i>Settings</i>
                </p>
                <p className="text-[#5C5C5C] font-[500] text-[14px] sm:text-[16px]">
                  Personalize your preferences
                </p>
                <div className=" flex flex-col h-[85%] justify-between ">
                  <div className="flex flex-col gap-4 mt-[20px]">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`px-5 h-[40px] sm:h-[45px] flex items-center gap-[10px] text-[16px] sm:text-[18px] font-[700] ${
                        activeTab === "profile"
                          ? "bg-[#F3F3F3] text-[--red] border-l-4 border-[--red]"
                          : "text-black"
                      }`}
                    >
                      <p>Profile</p>
                    </button>

                    {/* <button
                      onClick={() => setActiveTab("invoices")}
                      className={`px-5 h-[40px] sm:h-[45px] flex items-center gap-[10px] text-[16px] sm:text-[18px] font-[700] ${
                        activeTab === "invoices"
                          ? "bg-[#F3F3F3] text-[--red] border-l-4 border-[--red]"
                          : "text-black"
                      }`}
                    >
                      <p>Invoices</p>
                    </button> */}

                    <button
                      onClick={() => setActiveTab("bank")}
                      className={`px-5 min-h-[40px] py-[5px] sm:min-h-[45px] flex text-left items-center gap-[10px] text-[16px] sm:text-[18px] font-[700] ${
                        activeTab === "bank"
                          ? "bg-[#F3F3F3] text-[--red] border-l-4 border-[--red]"
                          : "text-black"
                      }`}
                    >
                      <p>Bank account for receiving funds</p>
                    </button>
                  </div>
                  <div className="absolute bottom-[30px]">
                    <button
                      className={`px-5 mt-10 md:mt-0 h-[40px] sm:h-[45px]  flex items-center gap-[10px] text-[16px] sm:text-[18px] font-[700] text-[--red]  border-[--red]"}`}
                      onClick={logout}
                    >
                      <p>Logout</p>
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4 w-full md:w-[70%]">
                <div
                  className="absolute md:hidden right-[20px] bg-[--red] text-white w-[35px] h-[35px] rounded-full flex justify-center items-center z-[99999]"
                  onClick={() => setViewMobileBar(!viewMobileBar)}
                >
                  <MdKeyboardDoubleArrowRight
                    className={`text-[24px] ${
                      viewMobileBar ? "rotate-180" : ""
                    } transition-all duration-300`}
                  />
                </div>
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
