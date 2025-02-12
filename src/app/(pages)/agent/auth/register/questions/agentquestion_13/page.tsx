"use client";
import Image from "next/image";
import Link from "next/link";
import logon from "@/assets/logo.png";
const Login = () => {
  return (
    <div className="w-full relative sm:px-10 px-5 py-10">
      <div className="">
        {/* left-box */}
        <div className="">
          <Image
            alt="logo"
            src={logon}
            className="h-[80px] object-contain w-[max-content]"
          />

          <div className=" flex justify-center">
            <div>
              <div className=" text-center">
                <p className="sm:text-[30px]  text-[25px] font-[800]  mt-[15px] ">
                  Thank You!
                </p>
                <p className="text-[#5C5C5C] font-[500] text-center">
                  Our team is reviewing your details
                </p>
              </div>
              <form className="mt-[48px] flex flex-col gap-[30px] w-full sm:w-auto">
                <div className=" text-center">
                  <Image
                    src={require("../../../../../../../assets/Tick Square.png")}
                    className=" mx-auto"
                    width={120}
                    alt=""
                  />
                  <p className="text-[#5C5C5C] font-[500] text-center lg:text-start">
                    We will notify you by email once you are approved to use the
                    app
                  </p>
                </div>

                <hr />

                <div className="flex sm:min-w-[500px] sm:max-w-[530px] mt-[10px]">
                  <Link
                    href={"/agent/auth/register/account/createaccount_1"}
                    className="h-[65px] text-white flex justify-center items-center bg-[#D91921] flex-1 font-[600] text-[18px] rounded-tr-[10px] rounded-br-[10px]"
                  >
                    Next
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
