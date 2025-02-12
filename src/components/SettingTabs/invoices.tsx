import Image from "next/image";
import { useState } from "react";

import sortRedIcon from "@/assets/svgs/sort-red-icon.svg";
import downloadInvoice from "@/assets/svgs/download-icon.svg";
import InvoiceSortingModal from "./InvoiceSortingModal";

const Invoices = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      {/* heading & sorting */}
      <div className="flex flex-col lg:flex-row justify-between items-center">
        <p className="text-[25px] sm:text-[30px] md:text-[35px] font-[800]">
          <i>Your Invoices</i>
        </p>
        <div
          className="flex items-center justify-end gap-[12px] cursor-pointer w-full lg:w-auto"
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          <p className="text-[--red] font-[800] text-[24px]">Sort</p>
          <Image alt="sort icon" src={sortRedIcon} className="w-[30px]" />
        </div>
      </div>
      {/* invoices tabs */}
      <div className="mt-[35px] flex flex-col gap-[20px] sm:gap-[25px]">
        <InvoiceBox showBottomLine={true} />
        <InvoiceBox showBottomLine={true} />
        <InvoiceBox showBottomLine={true} />
        <InvoiceBox showBottomLine={true} />
        <InvoiceBox showBottomLine={false} />
      </div>
      {/* sorting Modal */}
      <InvoiceSortingModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default Invoices;

const InvoiceBox = ({ showBottomLine }: { showBottomLine: boolean }) => {
  return (
    <>
      <div className="bg-[#F3F3F3] rounded-[8px] px-[12px] sm:px-[30px] py-[12px] xl:py-[18px] flex flex-col xl:flex-row justify-between items-center">
        <div className="flex flex-col justify-between xl:h-[68px] w-full">
          <p className="text-[18px] sm:text-[20px] xl:text-[23px] font-[800]">
            Purchase on 04.08.2023
          </p>
          <p className="text-[12px] sm:text-[13px] xl:text-[15px]">
            Order ID: 6FWBE82
          </p>
        </div>
        <div className="flex items-center justify-end gap-[8px] cursor-pointer w-full">
          <p className="font-[600] text-[11px] sm:text-[13px] xl:text-[15px] pt-[5px] text-[--red]">
            Download Invoice
          </p>
          <Image
            alt="download icon"
            src={downloadInvoice}
            className="text-[20px] sm:w-[22px] xl:w-[24px]"
          />
        </div>
      </div>
      {showBottomLine && <hr />}
    </>
  );
};
