"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import profile from "@/assets/Profile.png";
import Whitepencile from "@/assets/white-pencile.png";
import AvatarImg from "@/assets/avatar.png";
import send from "@/assets/Send.png";
import call from "@/assets/Call.png";
import toast from "react-hot-toast";
import { DropShipperGetApi, updateDropshipperApi } from "@/api/api";
import Sidebar from "@/components/sidebar";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { updateSidebarNavigation } from "@/features/features";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import Invoices from "@/components/SettingTabs/invoices";

const Settings = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("profile");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [viewMobileBar, setViewMobileBar] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    username: "",
    name: "",
    email: "",
    phone: "",
    profileImage: "",
  });
  const [initailData, setInitailData] = useState<InitailType>({
    username: "",
    name: "",
    email: "",
    phone: "",
    profileImage: "",
  });
  interface FormDataType {
    username?: string;
    name?: string;
    email?: string;
    phone?: string;
    profileImage: File | string; // Allow both File and string types
  }
  interface InitailType {
    username?: string;
    name?: string;
    email?: string;
    phone?: string;
    profileImage: string; // Allow both File and string types
  }
  interface ApiResponse {
    data: {
      status: string;
      data: {
        username?: string;
        name?: string;
        email?: string;
        phone?: string;
        profileImage: string;
      };
    };
  }
  const fn_getDropshipperData = async () => {
    const response: ApiResponse = (await DropShipperGetApi()) as ApiResponse;
    if (response?.data?.status === "ok") {
      setFormData({
        username: response?.data?.data?.username || "",
        name: response?.data?.data?.name || "",
        email: response?.data?.data?.email || "",
        phone: response?.data?.data?.phone || "",
        profileImage: response?.data?.data?.profileImage || "",
      });
      setInitailData({
        username: response?.data?.data?.username || "",
        name: response?.data?.data?.name || "",
        email: response?.data?.data?.email || "",
        phone: response?.data?.data?.phone || "",
        profileImage: response?.data?.data?.profileImage || "",
      });
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    fn_getDropshipperData();
    dispatch(updateSidebarNavigation("settings"));
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async () => {
    const fileData = new FormData();
    Object.keys(formData).forEach((nameKey) => {
      const typedKey = nameKey as keyof FormDataType;
      if (formData[typedKey] !== initailData[typedKey]) {
        fileData.append(nameKey, formData[typedKey] as string | Blob);
      }
    });

    try {
      const response = (await updateDropshipperApi(fileData)) as ApiResponse;
      if (response?.data?.status === "ok") {
        toast.success("Profile Update Successfull");
        fn_getDropshipperData(); // Refresh the profile data
      } else {
        toast.success("Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      toast.success("An error occurred.");
    }
  };
  const logout = () => {
    localStorage.clear();
    Cookies.remove("access");
    Cookies.remove("refresh");
    Cookies.remove("role");
    router.push("/login");
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div>
            <p className="text-[25px] sm:text-[34px] font-[800]">
              <i>Apparence</i>
            </p>
            <div>
              <div className="grid gap-5 mt-4 lg:grid-cols-2 grid-cols-1">
                {/* Profile Picture */}
                <div className="flex gap-2 flex-col">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="bg-[#F3F3F3] w-28 h-28 rounded-md">
                        <a
                          href={
                            initailData.profileImage
                              ? initailData.profileImage
                              : "#"
                          }
                          target="__blank"
                        >
                          <Image
                            src={
                              previewImage
                                ? previewImage
                                : initailData.profileImage
                                ? initailData.profileImage
                                : AvatarImg
                            }
                            width={112}
                            height={112}
                            alt="Image"
                          />
                        </a>
                      </div>

                      <label
                        htmlFor="profilePic"
                        className=" p-1 absolute -bottom-1 -right-1 rounded-full bg-white cursor-pointer"
                      >
                        <div className="bg-[--red] w-5 h-5 rounded-full flex justify-center items-center">
                          <Image src={Whitepencile} alt="" />
                        </div>
                      </label>
                      <input
                        id="profilePic"
                        type="file"
                        className=" hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[18px] sm:text-2xl font-[600]">
                        Profile Picture
                      </label>
                      <p className="text-[--red] font-[600] text-[14px] sm:text-[16px]">
                        Customize
                      </p>
                    </div>
                  </div>
                </div>

                {/* Username */}
                <div className="flex gap-2 flex-col">
                  <div className="flex items-center gap-2">
                    {/* <div>
                      <Image src={watch} width={22} height={22} alt="" />
                    </div> */}
                    <label className="text-[18px] sm:text-2xl font-[600]">
                      Username
                    </label>
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
                      className="absolute flex items-center gap-3 right-3.5 top-3.5 cursor-pointer"
                    >
                      <div>
                        <Image src={pencile} width={20} height={20} alt="" />
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>

              <hr className="mt-4" />
            </div>

            <div>
              <p className="text-[25px] sm:text-[34px] font-[800] my-6">
                <i>Personal Information</i>
              </p>

              <div className="grid gap-8">
                {/* Name */}
                <div className="flex gap-2 flex-col">
                  <div className="flex items-center gap-2">
                    <div>
                      <Image
                        src={profile}
                        width={22}
                        height={22}
                        alt="profile"
                      />
                    </div>
                    <label className="text-[18px] sm:text-2xl font-[600]">
                      Name
                    </label>
                  </div>

                  <div className="relative w-full lg:w-9/12">
                    <input
                      name="name"
                      value={formData.name}
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
                          width={20}
                          height={20}
                          alt="edit"
                        />
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-2 flex-col">
                  <div className="flex items-center gap-2">
                    <div>
                      <Image src={send} width={22} height={22} alt="profile" />
                    </div>
                    <label className="text-[18px] sm:text-2xl font-[600]">
                      Email
                    </label>
                  </div>
                  <div className="relative w-full lg:w-9/12">
                    <input
                      name="email"
                      value={formData.email}
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
                          width={20}
                          height={20}
                          alt="edit"
                        />
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* Mobile */}
                <div className="flex gap-2 flex-col">
                  <div className="flex items-center gap-2">
                    <div>
                      <Image src={call} width={22} height={22} alt="profile" />
                    </div>
                    <label className="text-[18px] sm:text-2xl font-[600]">
                      Mobile {"(optional)"}
                    </label>
                  </div>
                  <div className="relative w-full lg:w-9/12">
                    <input
                      name="phone"
                      value={formData.phone}
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
                          width={20}
                          height={20}
                          alt="edit"
                        />
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSubmit}
                  className="bg-[--red] text-white px-6 py-2 rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        );
      case "invoices":
        return <Invoices />;
      default:
        return null;
    }
  };

  return (
    <>
      {formData.email ? (
        <div className="flex justify-center overflow-x-hidden w-full bg-[--black] min-h-[100vh]">
          <div className="flex w-full bg-transparent z-[9]">
            {/* Left box - sidebar */}
            <Sidebar />
            {/* Right box - in white */}
            <div className="relative min-h-[100vh] w-full py-[30px] px-[10px] lg:pe-[30px]">
              <div className="bg-white md:relative min-h-[100%] rounded-[35px] px-[25px] pt-[40px] pb-[80px] md:p-[40px]">
                <div className=" flex gap-12 h-full">
                  <div
                    className={`transition-all duration-700 z-[9999] min-h-[100vh] md:min-h-[auto] left-0 top-0 w-[200px] md:w-[25%] fixed md:static bg-white shadow-sm md:shadow-none px-[10px] md:px-0 py-[30px] md:py-0 border-e md:border-none border-[--red] ${
                      viewMobileBar
                        ? "left-0 md:left-auto"
                        : "left-[-100%] md:left-auto"
                    }`}
                  >
                    <p className="text-[25px] sm:text-[43px] font-[800]">
                      <i>Settings</i>
                    </p>
                    <p className="text-[#5C5C5C] font-[500] text-[14px] sm:text-[16px]">
                      Personalize your preferences
                    </p>
                    <div className=" flex flex-col h-[85%] justify-between ">
                      <div className="flex flex-col gap-4 mt-[20px]">
                        <button
                          onClick={() => setActiveTab("profile")}
                          className={`px-5 h-[45px]  flex items-center gap-[10px] text-[16px] sm:text-[18px] font-[700] ${
                            activeTab === "profile"
                              ? "bg-[#F3F3F3] text-[--red] border-l-4 border-[--red]"
                              : "text-black"
                          }`}
                        >
                          <p>Profile</p>
                        </button>

                        <button
                          onClick={() => setActiveTab("invoices")}
                          className={`px-5 h-[45px]  flex items-center gap-[10px] text-[16px] sm:text-[18px] font-[700] ${
                            activeTab === "invoices"
                              ? "bg-[#F3F3F3] text-[--red] border-l-4 border-[--red]"
                              : "text-black"
                          }`}
                        >
                          <p>Invoices</p>
                        </button>

                        <button
                          onClick={() => setActiveTab("bank")}
                          className={`px-5 h-[45px]  flex text-left items-center gap-[10px] text-[16px] sm:text-[18px] font-[700] ${
                            activeTab === "bank"
                              ? "bg-[#F3F3F3] text-[--red] border-l-4 border-[--red]"
                              : "text-black"
                          }`}
                        >
                          <p>Payment Methods</p>
                        </button>
                      </div>
                      <div className="absolute bottom-[30px]">
                        <button
                          className={`px-5 mt-5 h-[45px]  flex items-center gap-[10px] text-[16px] sm:text-[18px] font-[700] text-[--red]  border-[--red]"}`}
                          onClick={logout}
                        >
                          <p>Logout</p>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 w-full md:w-[70%]">
                    <div
                      className="absolute md:hidden right-[20px] bg-[--red] text-white w-[35px] h-[35px] rounded-full flex justify-center items-center"
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
      ) : (
        <LoadingScreen />
      )}
    </>
  );
};

export default Settings;
