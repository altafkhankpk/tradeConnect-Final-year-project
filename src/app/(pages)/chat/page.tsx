"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

import { updateSidebarNavigation } from "@/features/features";

import shadow from "@/assets/red-shadow.png";
 

 
import Sidebar from "@/components/sidebar";
 
import Chat from "@/components/dropShipperChat/chat";
import { RootState } from "@/store/store";

const UploadProduct = () => {
  const dispatch = useDispatch();
  // const [showModal, setShwoModal] = useState(false);

  const sideOpen=useSelector(function(store:RootState){
    return store.agentFeatures.isChatOpen;
  });
  useEffect(() => {
    dispatch(updateSidebarNavigation("chat"));
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
        {
          sideOpen ?null :

        <Sidebar />
        }
        {/* right box - in white */}
        <div className="min-h-[100vh] w-full py-[px] ps-[4px] pe-[4px] sm:pe-[30px]">
          <div className="bg-[white] md:relative min-h-[100%] rounded-[35px] px-[1px] py-[px]  flex flex-col">
          <Chat></Chat>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadProduct;
