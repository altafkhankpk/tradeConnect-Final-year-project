"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { agentgoogleApi, signupAgentApi } from "@/api/api";
import { useFormik } from "formik";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import logon from "@/assets/logo.png";
import google from "@/assets/google-btn.png";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { login } from "@/features/agentFeatures";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/components/GoogleSignin/config";
import { signupAgentSchema } from "@/schema/agentSchema";

const Register = () => {
  const router = useRouter();
  const [googleLoader, setGoogleLoader] = useState(false);
  console.log(googleLoader);

  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const [passwordShow, setPasswordShow] = useState(false);
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);
  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  };

  interface SignupAgentResponse {
    data: {
      status: string;
      token: string;
      message: string;
      data?: {
        _id: string;
      };
    };
    status?: number;
    response?: {
      data: {
        message: string;
      };
    };
  }

  const Formik = useFormik({
    initialValues,
    validationSchema: signupAgentSchema,
    onSubmit: async (value, { resetForm }) => {
      setLoader(true);

      const response: SignupAgentResponse = (await signupAgentApi(
        value
      )) as SignupAgentResponse;
      if (response?.data?.status === "ok") {
        resetForm();
        Cookies.set("agentAccess", response?.data?.token, {
          expires: 1,
        });
        Cookies.set("agentRefresh", response?.data?.token, {
          expires: 1,
        });
        return router.push("/agent/auth/register/account/createaccount_1");
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
    firstname: string;
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
            toast.success("Signup Successfull");
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
      <div className="flex flex-col lg:flex-row px-[20px] py-[30px] gap-[50px] lg:gap-[15px] max-w-[1400px]">
        {/* left-box */}
        <div className="flex-1 xl:ps-[30px] lg:border-r pe-[20px] flex flex-col items-center lg:items-start">
          {/*   */}
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
            {/* <div className="sm:min-w-[500px] sm:max-w-[530px] flex gap-[10px] items-center">
              <p className="text-gray-300">Or continue with</p>
              <hr className="flex-1 mt-[2px]" />
            </div> */}
            {/* <div className="flex gap-[13px] items-center">
              <Image
                alt="google"
                src={google}
                onClick={handleGoogleSignin}
                className="h-[50px] object-contain cursor-pointer w-[max-content]"
              />
              {googleLoader ? <span className="loadergoogle"></span> : null}
            </div> */}
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
              Already have an Account?{" "}
              <Link
                href={"/agent/auth/login"}
                className="font-[600] underline text-[--red] cursor-pointer"
              >
                Click
              </Link>{" "}
              Here
            </p>
          </form>
        </div>
        {/* right-box */}
        <div className="flex-1">
          <Image
            src={require("../../../../../assets/agent.png")}
            className=" h-full"
            alt="agent"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
