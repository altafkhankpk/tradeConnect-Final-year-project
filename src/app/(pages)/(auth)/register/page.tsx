"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { googleApi, signupApi } from "@/api/api";
import { useFormik } from "formik";

import { signupSchema } from "@/schema/schema";

import { IoIosArrowDown } from "react-icons/io";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import coma from "@/assets/svgs/coma.svg";
import logon from "@/assets/logo.png";
import google from "@/assets/google.png";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { login, updateRole } from "@/features/features";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "@/components/GoogleSignin/config";

const Register = () => {
  const router = useRouter();
  const [googleLoader, setGoogleLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const [passwordShow, setPasswordShow] = useState(false);
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);
  const initialValues = {
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  };

  interface AllData {
    _id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    status: number;
    data: {
      data: {
        _id: string;
        productPopup: string;
      };
      status: string;
      token: string;
      message: string;
    };
    response: {
      data: {
        status: string;
        message?: string;
      };
    };
  }

  interface RegData {
    username: string;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
  }
  

  const Formik = useFormik({
    initialValues,
    validationSchema: signupSchema,
    onSubmit: async (value: RegData, { resetForm }) => {

      setLoader(true);
      console.log(value);
      const response = (await signupApi(value)) as AllData;
      if (response?.data?.status === "ok") {
        resetForm();
        Cookies.set("access", response?.data?.token, {
          expires: 1,
        });
        Cookies.set("refresh", response?.data?.token, {
          expires: 1,
        });
        Cookies.set("role", "user", {
          expires: 1,
        });
        dispatch(login());
        dispatch(updateRole("user"));
        localStorage.setItem("userId", response?.data?.data?._id);
        localStorage.setItem('productPopup', response?.data?.data?.productPopup);
        toast.success("Signup Successfull");
        return router.push("/product");
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

  interface GoogleData{
    name: string;
    username: string;
    email: string;
    image: string;
    password?: string;
    status: number;
    data:{
      data:{
        _id: string;
      },
      status: string;
      token: string;
      message: string;
    }
  
    response:{

      data:{
        status: string;
        message?: string;
      }
    }
  }

  const handleGoogleSignin = async () => {
    setGoogleLoader(true);

    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
      const data = await signInWithPopup(auth, provider);
      const formData = {
        name: data.user.displayName,
        username: data.user.displayName,
        email: data.user.email,
        image: data.user.photoURL,
      };
  
      // Call the API with form data

      const response = await googleApi(formData) as GoogleData;
  
      if (response?.data?.status === "ok") {
        Cookies.set("access", response?.data?.token, {
          expires: 1,
        });
        Cookies.set("refresh", response?.data?.token, {
          expires: 1,
        });
        Cookies.set("role", "user", {
          expires: 1,
        });
        dispatch(login());
        localStorage.setItem("userId", response?.data?.data?._id);
        toast.success("Signup Sucessfully");
        return router.push("/product");
      } else {
        setLoader(false);
        return toast.error(response?.data?.message);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setLoader(false);
      toast.error("Internet issue");
    } finally {
      setGoogleLoader(false);
    }
  };

  return (
    <>
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
              Please register or login in your account
            </p>
            <form
              className="mt-[23px] flex flex-col gap-[30px] w-full sm:w-auto"
              onSubmit={Formik.handleSubmit}
            >
              <input
                type="text"
                name="username"
                value={Formik.values.username}
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
                className="h-[65px] w-full sm:min-w-[500px] sm:max-w-[530px] rounded-[17px] outline outline-[2px] outline-gray-200 focus:outline-[--red] px-[30px] font-[500]"
                placeholder="Username"
              />
              {Formik.errors.username && Formik.touched.username && (
                <p className="text-[--red] text-[12px] font-[600] mt-[-27px]">
                  {Formik.errors.username}
                </p>
              )}
              <input
                type="text"
                name="name"
                value={Formik.values.name}
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
                className="h-[65px] w-full sm:min-w-[500px] sm:max-w-[530px] rounded-[17px] outline outline-[2px] outline-gray-200 focus:outline-[--red] px-[30px] font-[500]"
                placeholder="Full Name"
              />
              {Formik.errors.name && Formik.touched.name && (
                <p className="text-[--red] text-[12px] font-[600] mt-[-27px]">
                  {Formik.errors.name}
                </p>
              )}
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
                <p className="text-[--red] text-[12px] font-[600] mt-[-27px]">
                  {Formik.errors.email}
                </p>
              )}
              <div className="relative">
                <input
                  type={passwordShow ? "text" : "password"}
                  name="password"
                  value={Formik.values.password}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  className="h-[65px] w-full sm:min-w-[500px] sm:max-w-[530px] rounded-[17px] outline outline-[2px] outline-gray-200 focus:outline-[--red] px-[30px] font-[500]"
                  placeholder="Password"
                />
                {passwordShow ? (
                  <FaRegEye
                    onClick={() => setPasswordShow(!passwordShow)}
                    className="absolute text-[20px] text-gray-400 cursor-pointer right-[20px] top-[24px] bg-white"
                  />
                ) : (
                  <FaRegEyeSlash
                    onClick={() => setPasswordShow(!passwordShow)}
                    className="absolute text-[20px] text-gray-400 cursor-pointer right-[20px] top-[24px] bg-white"
                  />
                )}
              </div>
              {Formik.errors.password && Formik.touched.password && (
                <p className="text-[--red] text-[12px] font-[600] mt-[-27px]">
                  {Formik.errors.password}
                </p>
              )}
              <div className="relative">
                <input
                  type={confirmPasswordShow ? "text" : "password"}
                  name="confirmPassword"
                  value={Formik.values.confirmPassword}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  className="h-[65px] w-full sm:min-w-[500px] sm:max-w-[530px] rounded-[17px] outline outline-[2px] outline-gray-200 focus:outline-[--red] px-[30px] font-[500]"
                  placeholder="Confirm Password"
                />
                {confirmPasswordShow ? (
                  <FaRegEye
                    onClick={() => setConfirmPasswordShow(!confirmPasswordShow)}
                    className="absolute text-[20px] text-gray-400 cursor-pointer right-[20px] top-[24px] bg-white"
                  />
                ) : (
                  <FaRegEyeSlash
                    onClick={() => setConfirmPasswordShow(!confirmPasswordShow)}
                    className="absolute text-[20px] text-gray-400 cursor-pointer right-[20px] top-[24px] bg-white"
                  />
                )}
              </div>
              {Formik.errors.confirmPassword &&
                Formik.touched.confirmPassword && (
                  <p className="text-[--red] text-[12px] font-[600] mt-[-27px]">
                    {Formik.errors.confirmPassword}
                  </p>
                )}
              <input
                type="text"
                name="phone"
                value={Formik.values.phone}
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
                className="h-[65px] w-full sm:min-w-[500px] sm:max-w-[530px] rounded-[17px] outline outline-[2px] outline-gray-200 focus:outline-[--red] px-[30px] font-[500]"
                placeholder="Phone Number (Optional)"
              />
              {Formik.errors.phone && Formik.touched.phone && (
                <p className="text-[--red] text-[12px] font-[600] mt-[-27px]">
                  {Formik.errors.phone}
                </p>
              )}
              <div className="sm:min-w-[500px] sm:max-w-[530px] flex gap-[10px] items-center">
                <p className="text-gray-300">Or continue with</p>
                <hr className="flex-1 mt-[2px]" />
              </div>
              <div className="flex gap-[13px] items-center">
                <div
                  onClick={handleGoogleSignin}
                  className="h-[50px] flex px-4  gap-2 border rounded-2xl items-center cursor-pointer"
                >
                  <div>
                    <Image alt="google" src={google} width={25} height={25} />
                  </div>
                  <span className=" text-black text-sm">Google</span>

                  {googleLoader ? <span className="loadergoogle"></span> : null}
                </div>
              </div>
              <div className="flex sm:min-w-[500px] sm:max-w-[530px] mt-[10px]">
                <button
                  type="submit"
                  className={`h-[65px] flex justify-center items-center text-white flex-1 font-[600] text-[17px] rounded-[10px] ${
                    loader
                      ? "cursor-not-allowed bg-[--red-disabled]"
                      : "bg-[--red]"
                  }`}
                >
                  {!loader ? (
                    <span>Sign Up</span>
                  ) : (
                    <span className="loader"></span>
                  )}
                </button>
              </div>
              <p className="mt-[-12px]">
              Already have an account?{" "}
              <Link
                href={"/login"}
                className="font-[600] underline text-[--red] cursor-pointer"
              >
                Click
              </Link>{" "}
              Here
            </p>
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
    </>
  );
};

export default Register;
