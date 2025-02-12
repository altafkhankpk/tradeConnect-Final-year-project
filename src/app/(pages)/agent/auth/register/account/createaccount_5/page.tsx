"use client";
import Image from "next/image";
import logon from "@/assets/logo.png";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { updateAgentdApi } from "@/api/api";
import { ExperienceAgentSchema } from "@/schema/agentSchema";

const Login = () => {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const initialValues = {
    experience: "",
  };

  interface AgentData {
    _id: string;
    experience: string;
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
    validationSchema: ExperienceAgentSchema,
    onSubmit: async (value, { resetForm }) => {
      setLoader(true);
      const response = (await updateAgentdApi(value)) as AgentData;
      resetForm();
      if (response?.data?.status === "ok") {
        resetForm();
        // setLoader(false);
        return router.push(`/agent/auth/register/account/createaccount_6`);
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

  const goBack = () => {
    router.push(`/agent/auth/register/account/createaccount_4`);
  };

  return (
    <div className="w-full relative sm:px-10 px-5 py-10">
      <div className="">
        <div className="">
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

          <div className=" flex mt-[40px] justify-between items-center">
            <div className="cursor-pointer" onClick={goBack}>
              <HiOutlineArrowLeft size={24} color="#D91921" />
            </div>
            <div>
              <form
                onSubmit={Formik.handleSubmit}
                className="mt-[12px] flex flex-col gap-[30px] w-full sm:w-auto"
              >
                <p className="text-[30px] text-center sm:text-[25px] font-[600]  mt-[15px]">
                  Years of experience
                </p>
                <input
                  type={"number"}
                  name="experience"
                  min={1}
                  value={Formik.values.experience}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  className="h-[65px] w-full sm:min-w-[500px]  sm:max-w-[530px] rounded-[17px] outline outline-[2px] outline-gray-200 focus:outline-[--red] px-[30px] font-[500]"
                  placeholder="Enter experience"
                />

                {Formik.errors.experience && Formik.touched.experience && (
                  <p className="text-[--red] text-[11px] font-[600] mt-[-27px]">
                    {Formik.errors.experience}
                  </p>
                )}

                <div className=" py-2 w-full">
                  <hr className=" m-0" />
                </div>
                <div className="flex sm:min-w-[500px]  sm:max-w-[530px] mt-[10px]">
                  <button
                    disabled={loader}
                    type="submit"
                    className={`h-[65px] flex justify-center items-center flex-1 text-white font-[600] text-[17px] rounded-[10px] ${
                      loader
                        ? "cursor-not-allowed bg-[--red-disabled]"
                        : "bg-[--red]"
                    }`}
                  >
                    {!loader ? (
                      <span>Next</span>
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
