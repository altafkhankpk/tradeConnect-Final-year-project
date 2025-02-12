const Bank = () => {
  return (
    <div>
      {/* heading & sorting */}
      <p className="text-[25px] sm:text-[30px] md:text-[35px] font-[800]">
        <i>Bank Details</i>
      </p>
      <div className="flex flex-col gap-[20px] mt-[30px]">
        {/* routing Number */}
        <div className="flex gap-1 flex-col">
          <div className="flex items-center gap-2">
            <label className="text-[18px] font-[600]">Routing Number</label>
          </div>
          <div>
            <input className="outline outline-[2px] outline-gray-200 focus:outline-[--red] rounded-lg overflow-hidden bg-[#F3F3F3] h-[48px] px-[15px] font-[500] w-full max-w-[550px]" />
          </div>
        </div>
        {/* account number */}
        <div className="flex gap-1 flex-col">
          <div className="flex items-center gap-2">
            <label className="text-[18px] font-[600]">Account Number</label>
          </div>
          <div>
            <input className="outline outline-[2px] outline-gray-200 focus:outline-[--red] rounded-lg overflow-hidden bg-[#F3F3F3] h-[48px] px-[15px] font-[500] w-full max-w-[550px]" />
          </div>
        </div>

        {/* button */}
        <div className="flex justify-end mt-6 max-w-[550px]">
          <button className={`text-white w-[152px] h-10 pb-[1px] rounded-md bg-[--red]`}>
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bank;
