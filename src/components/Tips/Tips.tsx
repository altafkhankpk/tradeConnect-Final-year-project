import Image from "next/image";

import arrow from "@/assets/Arrow 05.png";
import arrow2 from "@/assets/left-point-arrow.png";

const Tips = ({
  viewTip,
  setViewTip,
}: {
  viewTip: number;
  setViewTip: (tip: number) => void;
}) => {
  return (
    <>
      {/* Tip-1 */}
      {viewTip === 1 && (
        <div
          className="fixed top-0 left-0 w-full min-h-[100vh] bg-[#00000080] z-[99999]"
          onClick={() => setViewTip(2)}
        >
          <div className="absolute top-[120px] sm:top-[220px] md:top-[200px] right-[5%] sm:right-0 left-[5%] sm:left-0 md:left-[6%] lg:left-[13%] xl:left-[18%] 2xl:left-[27%] bg-white sm:w-[350px] md:w-[400px] rounded-[18px] text-center p-[20px] md:p-[25px] text-[17px] md:text-[20px] font-[700] z-[1]">
            <i>
              &quot;Our agents are actively preparing quotes for you. Once you
              receive price quotes, they will appear here.&quot;
            </i>
          </div>
          <Image
            alt="arrow"
            src={arrow}
            className="w-[200px] sm:w-[20%] rotate-[56deg] sm:rotate-0 ml-[150px] sm:ml-[44.5%] md:ml-[47%] lg:ml-[45%] mt-[200px] sm:mt-[280px] md:mt-[260px] lg:mt-[240px] xl:mt-[210px] 2xl:mt-[180px]"
          />
        </div>
      )}
      {/* Tip-2 */}
      {viewTip === 2 && (
        <div
          className="fixed top-0 left-0 w-full min-h-[100vh] bg-[#00000080] z-[99999] flex md:block justify-center md:justify-start"
          onClick={() => {
            setViewTip(3);
            localStorage.setItem("productPopup", "false");
          }}
        >
          <div className="absolute bg-white sm:w-[350px] ms-[5%] sm:ms-0 me-[5%] sm:me-0 md:w-[400px] rounded-[18px] text-center p-[15px] md:p-[25px] text-[17px] md:text-[20px] font-[700] z-[1] md:left-[300px] bottom-[280px] md:bottom-auto top-auto md:top-[40vh]">
            <i>You can chat with agents directly here now.</i>
          </div>
          <Image
            alt="arrow"
            src={arrow2}
            className="absolute bottom-[150px] sm:bottom-[160px] md:bottom-0 self-center rotate-[270deg] md:rotate-0 md:static w-[200px] ml-[-150px] sm:ml-[-190px] md:ml-[100px] md:mt-[40vh]"
          />
        </div>
      )}
    </>
  );
};

export default Tips;
