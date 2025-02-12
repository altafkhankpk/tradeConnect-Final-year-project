"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useFormik } from "formik";

import { forgetPasswordSchema } from "@/schema/schema";
// import ProtectedRoute from "@/components/ProtectedRoute";

import logon from "@/assets/logo.png";
import { forgetPasswordAgentApi } from "@/api/api";

const ForgetPassword = () => {
 
  const [loader, setLoader] = useState(false);
  const initialValues = {
    email: "",
    link: "",
  };



            
  interface ForgetData{
    _id: string;
    email: string;
    link: string;
    status: number;
    data:{
      data:{
        _id: string;
      },
      status: string;
      message: string;
    }
    response:{
      data:{
        status: string;
        message?: string | undefined | null ;
      },
    }
  }







  const Formik = useFormik({
    initialValues,
    validationSchema: forgetPasswordSchema,
    onSubmit: async (value, { resetForm }) => {
      setLoader(true);
      const response = await forgetPasswordAgentApi(value) as ForgetData;
      resetForm();
      if (response?.data?.status === "ok") {
        toast.success("Please Check Your Email");
        resetForm();
        return setLoader(false);
      }
      if (response?.status === 400) {
        setLoader(false);
        console.log(response);
        
        return toast.error(response?.response?.data?.message ?? "An error occurred");
      }
      setLoader(false);
      return toast.error("Network Error");
    },
  });
  return (
    // <ProtectedRoute>
      <div className="flex justify-center w-full">
        <div className="flex flex-col lg:flex-row px-[20px] py-[40px] gap-[50px] lg:gap-[15px] max-w-[1400px]">
          {/* left-box */}
          <div className="flex-1 xl:ps-[30px] lg:border-r pe-[20px] flex flex-col items-center lg:items-start">
            <Image
              alt="logo"
              src={logon}
              className="h-[95px] object-contain w-[max-content]"
            />
            <p className="text-[30px] sm:text-[40px] font-[600] leading-[35px] sm:leading-[50px] max-w-[500px] mt-[15px] text-center lg:text-start">
              Get better prices for free and{" "}
              <i className="font-[800]">scale your business</i>
            </p>
            <p className="text-[#5C5C5C] font-[500] text-center lg:text-start">
              Forget Your Password ? Enter Email Address
            </p>
            <form
              onSubmit={Formik.handleSubmit}
              className="mt-[23px] flex flex-col gap-[30px] w-full sm:w-auto"
            >
              <input
                type="text"
                name="email"
                value={Formik.values.email}
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
                className="h-[65px] w-full sm:min-w-[500px] sm:max-w-[530px] rounded-[17px] outline outline-[2px] outline-gray-200 focus:outline-[--red] px-[30px] font-[500]"
                placeholder="Email Address"
              />
              {Formik.errors.email && Formik.touched.email && (
                <p className="text-[--red] text-[11px] font-[600] mt-[-27px]">
                  {Formik.errors.email}
                </p>
              )}
              <div className="flex sm:min-w-[500px] sm:max-w-[530px] mt-[10px]">
                <button
                  type="submit"
                  className={`h-[65px] flex justify-center items-center flex-1 text-white font-[600] text-[17px] rounded-[10px] ${
                    loader
                      ? "cursor-not-allowed bg-[--red-disabled]"
                      : "bg-[--red]"
                  }`}
                >
                  {!loader ? (
                    <span>Submit</span>
                  ) : (
                    <span className="loader"></span>
                  )}
                </button>
              </div>
            </form>
          </div>
          {/* right-box */}
          <div className="flex-1">
          <Image src={require("../../../../../assets/agent.png")} alt="agent" />
        </div>
        </div>
      </div>
    // </ProtectedRoute>
  );
};

export default ForgetPassword;
