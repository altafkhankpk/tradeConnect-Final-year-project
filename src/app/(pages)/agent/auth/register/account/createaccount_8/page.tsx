"use client";

import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";

import logon from "@/assets/logo.png";

import { HiOutlineArrowLeft } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CoverImageAgentSchema } from "@/schema/agentSchema";
import { getCustomerApi, updateAgentFormdApi } from "@/api/api";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import { login } from "@/features/agentFeatures";

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const initialValues = {
    coverImage: "",
  };

  interface AgentData {
    _id: string;
    coverImage: string;
    status: number;
    data: {
      data: {
        _id: string;
      };
      status: string;
      message: string;
    };
    response: {
      data: {
        status: string;
        message?: string;
      };
    };
  }

  const Formik = useFormik({
    initialValues,
    validationSchema: CoverImageAgentSchema,
    onSubmit: async (values, {}) => {
      setLoader(true);
      const formData = new FormData();
      formData.append("coverImage", values.coverImage);
      const response = (await updateAgentFormdApi(formData)) as AgentData;
      if (response?.data?.status === "ok") {
        dispatch(login());
        localStorage.setItem("agentId", response?.data?.data?._id);
        Cookies.set("role", "agent");
        await getCustomerApi({ page: 1 });
        toast.success("Signup Successfull");
        return router.push(`/agent/newcustomers`);
      }
      if (response?.status === 400) {
        setLoader(false);
        return toast.error(
          response?.response?.data?.message ?? "An error occurred"
        );
      }
      setLoader(false);
      return toast.error("Network Error");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Formik.setFieldValue("coverImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full relative sm:px-10 px-5 py-10">
      <div className="">
        <div>
          <Image
            alt="logo"
            src={logon}
            className="h-[80px] object-contain w-[max-content]"
          />
          <p className="sm:text-[27px] text-[25px] font-[800] mt-[30px] text-center">
            Welcome!
          </p>
          <p className="text-[#5C5C5C] font-[500] text-center">
            Please create your user account first
          </p>

          <div className="flex mt-[40px] justify-between items-center">
            <Link href={"/agent/auth/register/account/createaccount_7"}>
              <HiOutlineArrowLeft size={24} color="#D91921" />
            </Link>
            <div>
              <p className="text-[30px] text-center sm:text-[25px] font-[600] mt-[15px]">
                Cover Photos/Videos(your business)
              </p>
              <p className="text-[#5C5C5C] font-[500] text-center">
                Click to add your picture
              </p>
              <form
                onSubmit={Formik.handleSubmit}
                className="mt-[12px] flex flex-col gap-[30px] w-full sm:w-auto"
              >
                <div className="relative flex justify-center">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      width={135}
                      height={135}
                      className="mx-auto rounded-full object-cover"
                      alt="Profile Preview"
                    />
                  ) : (
                    <Image
                      src={require("../../../../../../../assets/upload-btn.png")}
                      width={125}
                      className="mx-auto"
                      alt="Upload Placeholder"
                    />
                  )}
                  {previewImage ? null : (
                    <FaPlus
                      color="white"
                      size={30}
                      className="cursor-pointer absolute top-[47px]"
                    />
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                {Formik.errors.coverImage && Formik.touched.coverImage && (
                  <p className="text-[--red] mx-auto text-[13px] font-[600] mt-[-27px]">
                    {Formik.errors.coverImage}
                  </p>
                )}
                <div>
                  <button
                    disabled={loader}
                    type="submit"
                    className={`h-[55px] px-12 w-full flex justify-center items-center flex-1 text-white font-[600] text-[17px] rounded-[10px] ${
                      loader
                        ? "cursor-not-allowed bg-[--red-disabled]"
                        : "bg-[--red]"
                    }`}
                  >
                    {!loader ? (
                      <span>Save</span>
                    ) : (
                      <span className="loader"></span>
                    )}
                  </button>
                </div>
              </form>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
