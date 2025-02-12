"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";

import { updateSidebarNavigation } from "@/features/features";

import shadow from "@/assets/red-shadow.png";
import uplaodBtn from "@/assets/upload-btn.png";

import { FaPlus } from "react-icons/fa";
import Sidebar from "@/components/sidebar";
import ModalChooseProduct from "@/components/modalChooseProduct";

const UploadProduct = () => {
  const dispatch = useDispatch();
  const [showModal, setShwoModal] = useState(false);
  useEffect(() => {
    dispatch(updateSidebarNavigation("quotes"));
  }, []);
  return (
    <div className="flex justify-center w-full bg-[--black] min-h-[100vh]">
      <Image
        alt="shadow"
        src={shadow}
        className="absolute w-[295px] h-[295px] right-0 opacity-[0.7]"
      />
      <div className="flex w-full bg-transparent z-[9]">
        {/* left box - sidebar */}
        <Sidebar />
        {/* right box - in white */}
        <div className="min-h-[100vh] w-full py-[30px] pe-[20px] sm:pe-[30px]">
          <div className="bg-[white] md:relative min-h-[100%] rounded-[35px] px-[25px] py-[40px] sm:p-[40px] flex flex-col">
            <p className="text-[35px] sm:text-[43px] font-[800]">
              <i>Upload a product</i>
            </p>
            <p className="text-[#5C5C5C] font-[500]">
              And receive quotes for free.
            </p>
            <button
              className="w-[150px] bg-[--red] text-white h-[45px] min-h-[45px] rounded-[10px] flex justify-center items-center mt-[20px] gap-[10px] text-[15px] font-[500]"
              onClick={() => setShwoModal(true)}
            >
              <FaPlus />
              <p>Add Product</p>
            </button>
            <div className="mt-[20px] h-[100%] min-h-[300px] flex flex-col justify-center pb-[15px]">
              <div
                className="relative flex justify-center items-center"
                onClick={() => setShwoModal(true)}
              >
                <Image
                  alt="btn"
                  src={uplaodBtn}
                  className="w-[130px] sm:w-[150px] h-[130px] sm:h-[150px] cursor-pointer"
                />
                <FaPlus className="absolute text-[27px] text-white mt-[3px]" />
              </div>
              <p className="text-[13px] sm:text-[15px] font-[700] text-center">
                Click here to upload the product.
              </p>
              <i className="text-[13px] sm:text-[15px] font-[600] text-[--red] text-center mt-[20px]">
                It takes an average of just{" "}
                <span className="font-[800]">20 seconds</span> to upload a
                product
              </i>
            </div>
            {/* modal */}
            {showModal && <ModalChooseProduct setShowModal={setShwoModal} onProductCreated={''} currentPages={1} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadProduct;
