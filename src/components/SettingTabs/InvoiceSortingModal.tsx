import { Modal } from "antd";
import { useState } from "react";
import { DatePicker } from "antd";
import type { DatePickerProps } from "antd";

import { InvoiceSortingModalDays } from "@/assets/data";

import arrowSvg from "@/assets/svgs/Arrow-Right.svg";
import Image from "next/image";

interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ButtonProps {
  key: number;
  text: string;
  selectedDay: string;
  setSelectedDay: React.Dispatch<React.SetStateAction<string>>;
}

const onChange: DatePickerProps["onChange"] = (date, dateString) => {
  console.log(date, dateString);
};

const InvoiceSortingModal = ({ isModalOpen, setIsModalOpen }: ModalProps) => {
  const [selectedDay, setSelectedDay] = useState("today");
  return (
    <Modal
      title=""
      open={isModalOpen}
      onOk={() => setIsModalOpen(!isModalOpen)}
      onCancel={() => setIsModalOpen(!isModalOpen)}
      centered
      width={"80%"}
      footer={null}
      closable={false}
      style={{ fontFamily: "Inter", padding: 0 }}
    >
      <div className="flex flex-col md:flex-row p-[10px] md:p-[20px] lg:p-[30px] gap-[25px]">
        {/* days filter */}
        <div
          className="w-full md:w-[190px] lg:w-[220px] min-w-[190px] lg:min-w-[220px] rounded-[10px] bg-white p-[8px] md:p-[15px] flex flex-row overflow-auto md:flex-col gap-[10px] md:gap-[2px] lg:gap-[5px]"
          style={{ boxShadow: "0px 4px 30.2px 0px #AEAEAE40" }}
        >
          {InvoiceSortingModalDays.map((item, index) => (
            <Button
              key={index}
              text={item}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
            />
          ))}
        </div>
        <div className="w-full flex flex-col justify-between gap-[20px] lg:pt-[20px]">
          {/* dates input */}
          <div className="sorting-modal-content flex flex-col lg:flex-row items-center justify-between gap-[5px] lg:gap-[30px]">
            <DatePicker
              onChange={onChange}
              suffixIcon={null}
              format="DD MMMM YYYY"
              style={{ fontFamily: "Inter" }}
              placeholder="Select Start Date"
              className="custom-date-picker w-full h-[40px] font-[700]"
            />
            <Image
              alt="arrow"
              src={arrowSvg}
              className="w-[30px] md:w-[35px] h-[30px] md:h-[40px] rotate-90 lg:rotate-0"
            />
            <DatePicker
              onChange={onChange}
              suffixIcon={null}
              format="DD MMMM YYYY"
              style={{ fontFamily: "Inter" }}
              placeholder="Select End Date"
              className="custom-date-picker w-full h-[40px] font-[700]"
            />
          </div>
          {/* action buttons */}
          <div className="flex gap-[10px] md:gap-[30px] justify-end">
            <button
              onClick={() => setIsModalOpen(!isModalOpen)}
              className="bg-white border-[2px] border-[rgba(238, 238, 238, 1)] text-[#c2c2c2] h-[40px] w-[120px] rounded-[7px] font-[600] text-[15px]"
              style={{ fontFamily: "Inter" }}
            >
              Cancel
            </button>
            <button
              onClick={() => setIsModalOpen(!isModalOpen)}
              className="bg-[--red] text-white h-[40px] w-[120px] rounded-[7px] font-[600] text-[15px]"
              style={{ fontFamily: "Inter" }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InvoiceSortingModal;

const Button = ({ key, text, selectedDay, setSelectedDay }: ButtonProps) => {
  return (
    <button
      key={key}
      className={`h-[35px] capitalize text-[15px] pt-[1px] font-[500] rounded-[7px] w-[max-content] min-w-[max-content] ${
        text === selectedDay
          ? "bg-[--red] px-[15px] text-white"
          : "text-[#898989] px-[3px]"
      }`}
      onClick={() => setSelectedDay(text)}
    >
      {text}
    </button>
  );
};
