"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { signInWithPopup } from "firebase/auth";
import { login } from "@/features/features";
import { agentgoogleApi, signinAgentApi } from "@/api/api";
import { signinSchema } from "@/schema/schema";
import logon from "@/assets/logo.png";
import google from "@/assets/google-btn.png";
import { auth, provider } from "@/components/GoogleSignin/config";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const AgentLogin = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [passwordShow, setShowPassword] = useState(false);
  const [googleLoader, setGoogleLoader] = useState(false);
  const initialValues = {
    email: "",
    password: "",
  };

  interface loginData {
    _id: string;
    email: string;
    password: string;
    status: number;
    data: {
      data: {
        _id: string;
        firstName: string;
        username: string;
        about: string;
        headline: string;
        experience: string;
        city: string;
        profileImage: string;
        coverImage: string;
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

  const Formik = useFormik({
    initialValues,
    validationSchema: signinSchema,
    onSubmit: async (value, { resetForm }) => {
      setLoader(true);
      const response = (await signinAgentApi(value)) as loginData;
      if (response?.data?.status === "ok") {
        resetForm();
        Cookies.set("agentAccess", response?.data?.token, {
          expires: 1,
        });
        Cookies.set("agentRefresh", response?.data?.token, {
          expires: 1,
        });
        localStorage.setItem("agentId", response?.data?.data?._id);
        if (!response?.data?.data?.firstName) {
          toast.error("Fill remaining Fields");
          return router.push("/agent/auth/register/account/createaccount_1");
        }
        if (!response?.data?.data?.username) {
          toast.error("Fill remaining Fields");
          return router.push("/agent/auth/register/account/createaccount_2");
        }
        if (!response?.data?.data?.about) {
          toast.error("Fill remaining Fields");
          return router.push("/agent/auth/register/account/createaccount_3");
        }
        if (!response?.data?.data?.headline) {
          toast.error("Fill remaining Fields");
          return router.push("/agent/auth/register/account/createaccount_4");
        }
        if (!response?.data?.data?.experience) {
          toast.error("Fill remaining Fields");
          return router.push("/agent/auth/register/account/createaccount_5");
        }
        if (!response?.data?.data?.city) {
          toast.error("Fill remaining Fields");
          return router.push("/agent/auth/register/account/createaccount_6");
        }
        if (!response?.data?.data?.profileImage) {
          toast.error("Fill remaining Fields");
          return router.push("/agent/auth/register/account/createaccount_7");
        }
        if (!response?.data?.data?.coverImage) {
          toast.error("Fill remaining Fields");
          return router.push("/agent/auth/register/account/createaccount_8");
        }
        toast.success("Login Successfull");
        Cookies.set("role", "agent", {
          expires: 1,
        });
        dispatch(login());
        //  await getCustomerApi(1);
        return router.push("/agent/newcustomers");
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

  interface GoogleSignInResponse {
    user: {
      displayName: string | null;
      email: string | null;
      photoURL: string | null;
    };
  }

  interface GoogleData {
    name: string;
    email: string;
    image: string;
    password?: string;
    data: {
      data: {
        _id: string;
        firstName: string;
        username: string;
        about: string;
        headline: string;
        experience: string;
        city: string;
        profileImage: string;
        coverImage: string;
      };
      status: string;
      token: string;
      message: string;
    };
  }

  const handleGoogleSignin = () => {
    setGoogleLoader(true);
    signInWithPopup(auth, provider)
      .then(async (data: GoogleSignInResponse) => {
        const formData = {
          firstname: data.user.displayName,
          email: data.user.email,
          image: data.user.photoURL,
          password: "",
        };
        try {
          const response = (await agentgoogleApi(formData)) as GoogleData;
          console.log(response);
          if (response?.data?.status === "ok") {
            localStorage.setItem("agentId", response?.data?.data?._id);
            Cookies.set("agentAccess", response?.data?.token, {
              expires: 1,
            });
            Cookies.set("agentRefresh", response?.data?.token, {
              expires: 1,
            });
            if (!response?.data?.data?.firstName) {
              toast.error("Fill remaining Fields");
              return router.push(
                "/agent/auth/register/account/createaccount_1"
              );
            }
            if (!response?.data?.data?.username) {
              toast.error("Fill remaining Fields");
              return router.push(
                "/agent/auth/register/account/createaccount_2"
              );
            }
            if (!response?.data?.data?.about) {
              toast.error("Fill remaining Fields");
              return router.push(
                "/agent/auth/register/account/createaccount_3"
              );
            }
            if (!response?.data?.data?.headline) {
              toast.error("Fill remaining Fields");
              return router.push(
                "/agent/auth/register/account/createaccount_4"
              );
            }
            if (!response?.data?.data?.experience) {
              toast.error("Fill remaining Fields");
              return router.push(
                "/agent/auth/register/account/createaccount_5"
              );
            }
            if (!response?.data?.data?.city) {
              toast.error("Fill remaining Fields");
              return router.push(
                "/agent/auth/register/account/createaccount_6"
              );
            }
            if (!response?.data?.data?.profileImage) {
              toast.error("Fill remaining Fields");
              return router.push(
                "/agent/auth/register/account/createaccount_7"
              );
            }
            if (!response?.data?.data?.coverImage) {
              toast.error("Fill remaining Fields");
              return router.push(
                "/agent/auth/register/account/createaccount_8"
              );
            }
            dispatch(login());
            Cookies.set("role", "agent", {
              expires: 1,
            });
            toast.success("Login Successfull");
            return router.push("/agent/newcustomers");
          } else {
            setLoader(false);
            return toast.error(response?.data?.message);
          }
        } catch (error) {
          console.error("Google API error:", error);
        } finally {
          setGoogleLoader(false);
        }
      })
      .catch((error) => {
        console.error("Google sign-in error:", error);
      });
  };

  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col lg:flex-row px-[20px] py-[20px] gap-[50px] lg:gap-[15px] max-w-[1400px]">
        {/* left-box */}
        <div className="flex-1 xl:ps-[30px] lg:border-r pe-[20px] flex flex-col items-center lg:items-start">
          {/* <Image
            alt="logo"
            src={logon}
            className="h-[95px] object-contain w-[max-content]"
          /> */}
          <p className="text-[30px] sm:text-[40px] font-[600] leading-[35px] sm:leading-[50px] max-w-[500px] mt-[15px] text-center lg:text-start">
            Get better prices for free and{" "}
            <i className="font-[800]">scale your business</i>
          </p>
          <p className="text-[#5C5C5C] font-[500] text-center lg:text-start">
            Please register or login in your account
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
            <p className="text-[13px] text-[#5C5C5C] mt-[-20px] w-full text-end sm:min-w-[500px] max-w-[450px] cursor-pointer">
              <Link
                href={"/agent/auth/forget-password"}
                className="hover:underline"
              >
                Forgot your password?
              </Link>
            </p>
            <div className="sm:min-w-[500px] sm:max-w-[530px] flex gap-[10px] items-center">
              <p className="text-gray-300">Or continue with</p>
              <hr className="flex-1 mt-[2px]" />
            </div>
            <div className="flex gap-[13px] items-center">
              <Image
                alt="google"
                src={google}
                onClick={handleGoogleSignin}
                className="h-[50px] object-contain cursor-pointer w-[max-content]"
              />
              {googleLoader ? <span className="loadergoogle"></span> : null}
            </div>
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
                  <span>Login</span>
                ) : (
                  <span className="loader"></span>
                )}
              </button>
            </div>
            <p className="mt-[-12px]">
              Don&apos;t have an Account?{" "}
              <Link
                href={"/agent/auth/register"}
                className="font-[600] underline text-[--red] cursor-pointer"
              >
                Signup
              </Link>{" "}
              Here
            </p>
          </form>
        </div>
        {/* right-box */}
        <div className="flex-1">
          <Image src={require("../../../../../assets/agent.png")} alt="agent" />
        </div>
      </div>
    </div>
  );
};

export default AgentLogin;
