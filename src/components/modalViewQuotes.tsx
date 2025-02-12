import { customerQuotesViewApi } from "@/api/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setKeForMessage } from "@/features/agentFeatures";

interface ModalUploadQuotesProps {
  setShowModal: (value: boolean) => void;
  ViewQuotes: string;
}

const ModalViewQuotes: React.FC<ModalUploadQuotesProps> = ({
  setShowModal,
  ViewQuotes,
}) => {
  const router = useRouter();
  const params = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const searchText = "";
  const [ViewQuotesData, setViewQuotes] = useState<Quote[]>([]);
  const dispatch=useDispatch()
  type Quote = {
    productId:{
      _id:string
    };
    agentId:string
    price: number;
    shippingPickupPrice: number;
    shippingDoorPrice: number;
    doorToDoorShippingCost: number;
    pickupTotalPrice: number;
    totalShippingPickupPrice: number;
    totalShippingDoorPrice: number;
  };

  type ApiResponse = {
    status: string;
    totalPages: number;
    currentPage: number;

    data: {
      data: Quote[];
      currentPage: number;
      totalPages: number;
      status: string;
    };
  };

  const fn_getProduct = async (pageValue: number, searchText: string) => {
    const response = (await customerQuotesViewApi(
      { page: pageValue, search: searchText },
      ViewQuotes || ""
    )) as ApiResponse;

    if (response?.data?.status === "ok") {
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setViewQuotes(response.data.data);
    }
  };

  useEffect(() => {
    const page = parseInt(params.get("page") || "1", 10);
    fn_getProduct(page, searchText);
  }, [params.get("page"), searchText]);

  const fn_viewMore = (selectedPage: number) => {
    router.push(`/agent/newcustomers?page=${selectedPage}`);
    fn_getProduct(selectedPage, searchText);
  };

  const fn_blankSpace = () => {
    setShowModal(false);
  };

  const fn_whiteArea = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div
      className="absolute top-0 left-0 w-full h-full bg-[#0000008a] flex flex-col justify-center items-center"
      onClick={fn_blankSpace}
    >
      <div
        className="relative sm:w-[80%] w-[90%] bg-white rounded-[10px]"
        onClick={fn_whiteArea}
      >
        <div
          className="absolute w-[35px] h-[35px] cursor-pointer rounded-[10px] bg-white right-0 top-[-45px] flex justify-center items-center"
          onClick={() => setShowModal(false)}
        >
          <RxCross2 className="text-[23px]" />
        </div>

        {/* Table Content */}
        <div className="flex flex-col">
          <div className="sm:mx-6 lg:mx-8 overflow-x-auto bg-white rounded-t-lg">
            <div className="inline-block min-w-full sm:px-3 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full mb-0 table-auto">
                  <thead>
                    <tr className="rounded-lg whitespace-nowrap">
                      <th
                        scope="col"
                        className="text-sm font-bold px-6 py-4"
                      ></th>
                      <th scope="col" className="text-sm font-[500] px-6 py-4">
                        Product Price
                      </th>
                      <th scope="col" className="text-sm font-[500] px-6 py-4">
                        Shipping
                        <br />
                        pick up price
                      </th>
                      <th scope="col" className="text-sm font-[500] px-6 py-4">
                        Door to Door
                        <br />
                        Shipping cost
                      </th>
                      <th scope="col" className="text-sm font-[900] px-6 py-4">
                        Door to Door
                        <br />
                        Total Price
                      </th>
                      <th scope="col" className="text-sm font-[900] px-6 py-4">
                        Pickup
                        <br />
                        Total Price
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-bold px-6 py-4"
                      ></th>
                    </tr>
                  </thead>
                  <tbody>
                    {ViewQuotesData?.length > 0 ? (
                      ViewQuotesData.map((quote: Quote, index: number) => (
                        <tr
                          key={index}
                          className="align-middle border-t border-b text-sm text-center font-normal px-6 whitespace-nowrap"
                        >
                          <td className="align-middle text-sm text-center font-normal px-6 py-4 whitespace-nowrap">
                            {index + 1}
                          </td>
                          <td className="font-[400] text-[14px] whitespace-nowrap">
                            ${quote.price}
                          </td>
                          <td className="align-middle text-sm text-center font-normal px-6 py-3 whitespace-nowrap">
                            ${quote.shippingPickupPrice}
                          </td>
                          <td className="align-middle text-sm text-center font-normal px-6 py-3 whitespace-nowrap">
                            ${quote.shippingDoorPrice}
                          </td>
                          <td className="align-middle text-sm text-center font-[900] px-6 py-3 whitespace-nowrap">
                            $ {quote.totalShippingDoorPrice}
                          </td>
                          <td className=" text-black font-[900] text-[14px] whitespace-nowrap">
                            ${quote.totalShippingPickupPrice}
                          </td>
                          <td className="font-[600] text-[14px] text-[--red] hover:underline cursor-pointer" 
                            onClick={()=>{
                              dispatch(setKeForMessage(true))
                            }}
                          >
                          <Link href={`/chat?productId=${quote.productId._id}&agentId=${quote.agentId}`
                                
                        }>
                            I&apos;ll take this Offer
                          </Link>
                        </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="pb-4 pt-3 text-center text-gray-600 font-[500] text-[15px]"
                        >
                          When quotes become available, they will appear here
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-[15px] mb-[5px]">
                    <div className="border h-[40px] rounded-[7px] flex justify-between">
                      <button
                        className="text-[14px] border-e w-[100px] flex items-center justify-center gap-1.5"
                        disabled={currentPage === 1}
                        onClick={() =>
                          fn_viewMore(currentPage > 1 ? currentPage - 1 : 1)
                        }
                      >
                        <IoIosArrowBack />
                        <p className="mt-[3px]">Previous</p>
                      </button>
                      {Array.from({ length: totalPages }, (_, index) => (
                        <button
                          key={index}
                          className={`w-[40px] border-s border-e ${
                            currentPage === index + 1 &&
                            "outline outline-[1px] z-[0]"
                          }`}
                          onClick={() => fn_viewMore(index + 1)}
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button
                        className="text-[14px] border-e w-[100px] flex items-center justify-center gap-1.5"
                        disabled={currentPage === totalPages}
                        onClick={() =>
                          fn_viewMore(
                            currentPage < totalPages
                              ? currentPage + 1
                              : totalPages
                          )
                        }
                      >
                        <p className="mt-[3px]">Next</p>
                        <IoIosArrowForward />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalViewQuotes;
