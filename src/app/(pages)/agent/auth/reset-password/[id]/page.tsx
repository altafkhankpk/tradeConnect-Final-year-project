"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";

import { resetPasswordSchema } from "@/schema/schema";
// import ProtectedRoute from "@/components/ProtectedRoute";

import { IoIosArrowDown } from "react-icons/io";

import coma from "@/assets/svgs/coma.svg";
import logon from "@/assets/logo.png";
import { updatePasswordAgentApi } from "@/api/api";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const ForgetPassword = () => {
  const router = useRouter();
  const [passwordShow, setShowPassword] = useState(false);
  const passwordConShow = false;



  const params = useParams() as { [key: string]: string };
  const id: string = params.id;
  
  const [loader, setLoader] = useState(false);
  const initialValues = {
    password: "",
    confirmPassword: "",
  };




  interface loginData {
    _id: string;
    password: string;
    confirmPassword: string;
    status: number;
    data: {
      data: {
        _id: string;
      },
      status: string;
      token: string;
      message: string;
    }
    response: {
      data: {
        status: string;
        message?: string;
      }
    }
  }



  const Formik = useFormik({
    initialValues,
    validationSchema: resetPasswordSchema,
    onSubmit: async (value, { resetForm }) => {
      setLoader(true);
      const response = await updatePasswordAgentApi(value, id) as loginData;
      resetForm();
      if (response?.data?.status === "ok") {
        toast.success("Password reset Successfully");
        resetForm();
        setLoader(false);
        return router.push(`/agent/auth/login`);
      }
      if (response?.status === 400) {
        setLoader(false);
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
              Enter Your New Password
            </p>
            <form
              onSubmit={Formik.handleSubmit}
              className="mt-[23px] flex flex-col gap-[30px] w-full sm:w-auto"
            >
              <div className="relative">
                <input
                  type={passwordShow ? "text" : "password"}
                  name="password"
                  value={Formik.values.password}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  className="h-[65px] w-full sm:min-w-[500px] sm:max-w-[530px] rounded-[17px] outline outline-[2px] outline-gray-200 focus:outline-[--red] px-[30px] font-[500]"
                  placeholder="New Password"
                />

                {passwordShow ? (
                  <FaRegEye
                    onClick={() => setShowPassword(!passwordShow)}
                    className="absolute text-[20px] text-gray-400 cursor-pointer right-[20px] top-[24px] bg-white"
                  />
                ) : (
                  <FaRegEyeSlash
                    onClick={() => setShowPassword(!passwordShow)}
                    className="absolute text-[20px] text-gray-400 cursor-pointer right-[20px] top-[24px] bg-white"
                  />
                )}
              </div>

              {Formik.errors.password && Formik.touched.password && (
                <p className="text-[--red] text-[11px] font-[600] mt-[-27px]">
                  {Formik.errors.password}
                </p>
              )}
              <div className="relative">
                <input
                  type={passwordConShow ? "text" : "password"}
                  name="confirmPassword"
                  value={Formik.values.confirmPassword}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  className="h-[65px] w-full sm:min-w-[500px] sm:max-w-[530px] rounded-[17px] outline outline-[2px] outline-gray-200 focus:outline-[--red] px-[30px] font-[500]"
                  placeholder="Confirm Password"
                />


                {passwordConShow ? (
                  <FaRegEye
                    onClick={() => setShowPassword(!passwordConShow)}
                    className="absolute text-[20px] text-gray-400 cursor-pointer right-[20px] top-[24px] bg-white"
                  />
                ) : (
                  <FaRegEyeSlash
                    onClick={() => setShowPassword(!passwordConShow)}
                    className="absolute text-[20px] text-gray-400 cursor-pointer right-[20px] top-[24px] bg-white"
                  />
                )}
              </div>
              {Formik.errors.confirmPassword &&
                Formik.touched.confirmPassword && (
                  <p className="text-[--red] text-[11px] font-[600] mt-[-27px]">
                    {Formik.errors.confirmPassword}
                  </p>
                )}
              <div className="flex sm:min-w-[500px] sm:max-w-[530px] mt-[10px]">
                <button
                  type="submit"
                  className={`h-[65px] flex justify-center items-center flex-1 text-white font-[600] text-[17px] rounded-[10px] ${loader
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
          <div className="bg-[--red] flex-1 px-[10px] py-[35px] sm:p-[35px] rounded-[30px]">
            <p className="text-[18px] font-[700] text-[#ebebeb] text-center">
              OUR RESULTS
            </p>
            {/* white-box */}
            <div
              className="relative bg-white rounded-[15px] py-[20px] px-[15px] sm:px-[25px] mt-[20px] font-[600] text-[15px] sm:text-[17px]"
              style={{ boxShadow: "0px 4px 40px 0px #00000040" }}
            >
              <Image
                alt="coma-sign"
                src={coma}
                className="absolute right-[25px]"
              />
              <p className="me-[80px]">
                Thanks to your app, I earned an additional{" "}
                <span className="text-[--red] font-[700]">
                  $5,200 in one month
                </span>
                .
              </p>
              <p>
                I can&apos;t believe I made an extra{" "}
                <span className="text-[--red] font-[700]">
                  $62,000 in a year
                </span>{" "}
                effortlessly, just by finding the right agent.
              </p>
            </div>
            {/* lists */}
            <div className="mt-[20px] flex flex-col gap-[15px] text-[15px] sm:text-[16px]">
              <div className="flex gap-[10px] text-white font-[500]">
                <IoIosArrowDown className="min-w-[22px] h-[23px]" />
                <p>
                  <span className="font-[700]">Earn more efforlessly</span> -
                  99% of customers find better prices for their products in our
                  app, saving money instantly.
                </p>
              </div>
              <div className="flex gap-[10px] text-white font-[500]">
                <IoIosArrowDown className="min-w-[22px] h-[23px]" />
                <p>
                  <span className="font-[700]">100% free</span> - Experience our
                  app at zero cost—no strings attached! You only pay your new
                  agent for each order, without any additional payment.
                </p>
              </div>
              <div className="flex gap-[10px] text-white font-[500]">
                <IoIosArrowDown className="min-w-[22px] h-[23px]" />
                <p>
                  <span className="font-[700]">Maximize your time</span> - Let
                  your dedicated agent handle every order, shipping, and
                  tracking so focus on what really matters: skyrocketing your
                  marketing and sales!
                </p>
              </div>
              <div className="flex gap-[10px] text-white font-[500]">
                <IoIosArrowDown className="min-w-[22px] h-[23px]" />
                <p>
                  <span className="font-[700]">
                    Lightning-fast shipping worldwide
                  </span>{" "}
                  - Get your products delivered to any country in record time!
                </p>
              </div>
              <div className="flex gap-[10px] text-white font-[500]">
                <IoIosArrowDown className="min-w-[22px] h-[23px]" />
                <p>
                  <span className="font-[700]">
                    Access any product from China
                  </span>{" "}
                  - Sell any product imaginable with sourcing done for you,
                  branding the package, packing it as you desire, and ensuring a
                  true brand shopping experience — at no cost!
                </p>
              </div>
              <div className="flex gap-[10px] text-white font-[500]">
                <IoIosArrowDown className="min-w-[22px] h-[23px]" />
                <p>
                  <span className="font-[700]">Say goodbye to scams!</span> -
                  Our 100% verified agents and secure payment systems like
                  Stripe ensure your dropshipping journey is safe and sound.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    // </ProtectedRoute>
  );
};

export default ForgetPassword;
