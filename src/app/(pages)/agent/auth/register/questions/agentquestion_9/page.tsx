"use client";
import Image from "next/image";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import logon from "@/assets/logo.png";
import { HiOutlineArrowLeft } from "react-icons/hi";
const Login = () => {

  return (
    <ProtectedRoute>
      <div className="w-full relative sm:px-10 px-5 py-10">
        <div className="">
          {/* left-box */}
          <div className="">
            <Image
              alt="logo"
              src={logon}
              className="h-[80px] object-contain w-[max-content]"
            />
             <p className="sm:text-[27px] text-[25px] font-[800]  mt-[15px] ">
              Tell us a Little about yourself
             
            </p>
            <p className="text-[#5C5C5C] font-[500] text-center lg:text-start">
              We need this information to validate your account
            </p>

            <div className=" pt-4">
                <h1 className=" text-[#D91921] uppercase font-[700]">3 Questions</h1>
                <h1 className=" text-[#D91921]  text-[20px] uppercase font-[800]">Remaining</h1>
            </div>

            <div className=" flex justify-between items-center"> 
            <div>
                    <HiOutlineArrowLeft  className=" font-bold" size={24} color="#D91921" />
                </div>
            <div className=" flex justify-center">
           
            <div
            >
                <p className="text-[30px] text-center sm:text-[25px] font-[600]  mt-[15px]">
              How many customers do you have?
             
            </p>
           
            <form
           
              className="mt-[12px] flex flex-col gap-[30px] w-full mx-auto sm:w-auto"
            >
              <input
                type="text"
                name="email"
    
                className="h-[65px] w-full sm:min-w-[500px] sm:max-w-[530px] rounded-[17px] outline outline-[2px] outline-gray-200 focus:outline-[--red] px-[30px] font-[500]"
                placeholder=""
              />
               <div className=" w-full">
               <hr className=" m-0" />
               </div>
              <div className="flex sm:min-w-[500px] sm:max-w-[530px] mt-[10px]">
                
                <Link
                  href={"/agent/auth/register/questions/agentquestion_10"}
                  className="h-[65px] text-white flex justify-center items-center bg-[#D91921] flex-1 font-[600] text-[18px] rounded-tr-[10px] rounded-br-[10px]"
                >
                  Next
                </Link>
              </div>
              
            </form>
            
            </div>
             <div>
                
             </div>
            </div>
            <div>

            </div>
            </div>

            <div className=" flex relative  sm:mr-16  mr-0 mt-4 justify-end">
            <Link
                  href={"/register"}
                  className="text-black border-2 w-72 py-1.5 border-[#000000] flex justify-center items-center    font-[400] text-[18px] rounded-full "
                >
                  l&#39;ll answear this later
                </Link>
            </div>
          </div>
         

        </div>

        <div className="absolute   bottom-0 right-0">
            <Image src={require('../../../../../../../assets/agent_login.png')}  width={150} alt="" />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Login;
