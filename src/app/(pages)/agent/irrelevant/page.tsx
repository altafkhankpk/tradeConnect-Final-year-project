"use client";

import axios from "axios";
import moment from "moment";
import Image from "next/image";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { URLSearchParams } from "url";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import AgentSidebar from "@/components/agentSidebar";
import ModalFilterPopup from "@/components/modalFilterPopup";
import ModalUploadQuotes from "@/components/modalUploadQuotes";
import { getCustomerApi, getCustomerTypeApi } from "@/api/api";

import Swap from "@/assets/Swap.png";

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { setKeForMessage } from "@/features/agentFeatures";
import { useDispatch } from "react-redux";

const API_URL = process.env.NEXT_PUBLIC_REACT_APP_BASEURL;

const Irrelevent = () => {
  const router = useRouter();
  const params: URLSearchParams = useSearchParams();
  const dispatch = useDispatch();
  const [filterModal, setFilterModal] = useState(false);
  const [addQuoteModal, setAddQuoteModal] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const lastPathSegment = pathSegments[pathSegments.length - 1];
  const searchText = "";

  interface ProdItem {
    _id?: string;
    createdAt?: string; // Adjust type if `createdAt` is a Date object
    imageLink?: string;
    image?: string;
    orderPerDay?: number;
    destination?: string;
    platform?: string;
    userId?: {
      _id?: string;
    };
    productId?: string;
  }

  const [data, setData] = useState<Item[]>([]);
  const [dataView, setDataView] = useState<ProdItem | undefined>(undefined);

  console.log(data);
  

  interface Item {
    productId: {
      _id?: string | undefined;
      createdAt?: string; // Adjust type if `createdAt` is a Date object
      imageLink?: string;
      image?: string;
      orderPerDay?: number;
      destination?: string;
      platform?: string;
      userId?: {
        _id?: string;
      };
    };
    createdAt?: string; // Adjust type if `createdAt` is a Date object
  }

  interface ApiResponse {
    data: {
      status: string;
      totalPages: number;
      currentPage: number;
      data: []; // Replace `any[]` with the actual data structure if known
    };
  }

  interface FilterData {
    page?: number;
    search?: string;
    type?: string | null;
    minOrderPerDay?: number | null;
    maxOrderPerDay?: number | null;
    startDate?: string | null;
    endDate?: string | null;
    platform?: string | null;
    destination?: string | null;
  }

  const fn_getProduct = async (pageValue: number, searchText: string) => {
    const minOrderPerDayParam = params.get("minOrderPerDay");
    const maxOrderPerDayParam = params.get("maxOrderPerDay");
    let data: FilterData = {
      page: pageValue,
      search: searchText,
    };
    if (lastPathSegment != "allproducts") {
      data = {
        ...data,
        type: lastPathSegment == "workingon" ? "working" : lastPathSegment,
      };
      // Define response with proper typing
      const response = (await getCustomerTypeApi(data)) as ApiResponse;

      console.log(response);

      if (response?.data?.status === "ok") {
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
        setData(response.data.data);
      }
    } else {
      data = {
        ...data,
        type:
          (lastPathSegment as string) === "workingon"
            ? "working"
            : lastPathSegment,
        minOrderPerDay: minOrderPerDayParam
          ? parseInt(minOrderPerDayParam, 10)
          : null,
        maxOrderPerDay: maxOrderPerDayParam
          ? parseInt(maxOrderPerDayParam, 10)
          : null,
        startDate: params.get("startDate") || null,
        endDate: params.get("endDate") || null,
        platform: params.get("platform") || null,
        destination: params.get("destination") || null,
      };
      // Define response with proper typing
      const response = (await getCustomerApi(data)) as ApiResponse;

      console.log(response);

      if (response?.data?.status === "ok") {
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
        setData(response.data.data);
      }
    }
  };

  useEffect(() => {
    const page = params.get("page");
    if (params.size === 0 || !page) {
      router.push("/agent/newcustomers?page=1", undefined);
    }
    fn_getProduct(page ? parseInt(page, 10) : 1, searchText);
  }, [params.get("page")]);

  const fn_viewMore = (selectedPage: number) => {
    router.push(`/agent/newcustomers?page=${selectedPage}`);
    fn_getProduct(selectedPage, searchText);
  };

  const changeRank = async (rank: string, productId: string | undefined) => {
    console.log(rank);

    try {
      const cookies = Cookies.get("agentAccess");
      const config = {
        headers: {
          Authorization: `Bearer ${cookies}`,
        },
      };
      const response = await axios.post(
        `${API_URL}/apis/rank/create`,
        { state: rank, productId: productId },
        config
      );
      if (response?.data?.status === "ok") {
        if (response?.data?.data?.state === "working") {
          toast.success("Product Added to Working On Successfully");
        } else if (response?.data?.data?.state === "irrelevant") {
          toast.success("Product Added to Irrelevant Successfully");
        } else {
          toast.success("Product Added to Done Successfully");
        }

        const updatedData = data.filter(
          (item: Item) => item.productId._id !== productId
        );

        // Update the state with the new array
        setData(updatedData);
      }
      console.log(response);
    } catch (error) {
      return error;
    }
  };

  return (
    <div className="flex justify-center overflow-x-hidden w-full bg-[#E1E1E1] min-h-[100vh]">
      <div className="flex w-full bg-transparent z-[9]">
        {/* left box - sidebar */}
        <AgentSidebar />
        {/* right box - in white */}
        <div className="relative min-h-[100vh] w-full py-[30px] px-[10px] lg:pe-[30px]">
          <div className="bg-[white] md:relative min-h-[100%] rounded-[35px] px-[10px] sm:px-[20px] py-[40px] pb-[80px] lg:p-[40px] flex flex-col">
            <p className="text-[25px] sm:text-[40px] font-[800]">
              <i>Get New Customers</i>
            </p>
            <p className="text-[#5C5C5C] font-[500]">Start collaborating now</p>

            <div className="flex justify-between items-center">
              {/* buttons */}
              <div className="flex gap-5 overflow-auto w-full">
                <button
                  onClick={() => {
                    router.push(`/agent/newcustomers?page=1`);
                  }}
                  className={`${
                    lastPathSegment == "newcustomers"
                      ? "shadow-lg border-2 border-[#1E40AF]"
                      : ""
                  } min-w-[max-content] px-[15px] bg-[#60A5FA] text-white h-[45px] min-h-[45px] rounded-[10px] flex justify-center items-center mt-[20px] gap-[10px] text-[15px] font-[500]`}
                >
                  <p>All Products</p>
                </button>
                <button
                  onClick={() => {
                    router.push(`/agent/workingon?page=1`);
                  }}
                  className={`${
                    lastPathSegment == "workingon"
                      ? "shadow-lg border-2 border-[#FFD700]"
                      : ""
                  }  min-w-[max-content] px-[15px] bg-[#F6EF4C] text-white h-[45px] min-h-[45px] rounded-[10px] flex justify-center items-center mt-[20px] gap-[10px] text-[15px] font-[500]`}
                >
                  <p>Working On</p>
                </button>
                <button
                  onClick={() => {
                    router.push(`/agent/irrelevant?page=1`);
                  }}
                  className={`${
                    lastPathSegment == "irrelevant"
                      ? "shadow-lg border-2 border-[#D71A217A]"
                      : ""
                  } min-w-[max-content] px-[15px] bg-[#D71A217A] text-white h-[45px] min-h-[45px] rounded-[10px] flex justify-center items-center mt-[20px] gap-[10px] text-[15px] font-[500]`}
                >
                  <p>Irrelevant</p>
                </button>
                <button
                  onClick={() => {
                    router.push(`/agent/done?page=1`);
                  }}
                  className={`${
                    lastPathSegment == "done"
                      ? "shadow-lg border-2 border-[#32CD32]"
                      : ""
                  } min-w-[max-content] px-[15px] bg-[#00FF1A] text-white h-[45px] min-h-[45px] rounded-[10px] flex justify-center items-center mt-[20px] gap-[10px] text-[15px] font-[500]`}
                >
                  <p>Done</p>
                </button>
              </div>
              {/* double arrow */}
              <div
                className="cursor-pointer mt-[15px]"
                onClick={() => setFilterModal(true)}
              >
                <Image src={Swap} alt="" width={35} height={35} />
              </div>
            </div>

            <div
              className="rounded-[20px] border p-[10px] text-gray-800 my-10"
              style={{ boxShadow: "0px 0px 43px 0px #B9B9B940" }}
            >
              <div className="overflow-auto p-[1px] new-customer-table">
                <table className="min-w-[1100px] w-full">
                  <thead className="">
                    <tr className="rounded-lg ">
                      <th scope="col" className="text-sm  font-bold px-6 py-4">
                        Time
                      </th>
                      <th scope="col" className="text-sm  font-bold px-6 py-4">
                        Product Image/Link
                      </th>
                      <th scope="col" className="text-sm font-bold px-6 py-4">
                        Daily Orders
                      </th>
                      <th scope="col" className="text-sm font-bold px-6 py-4">
                        Destination Country
                      </th>
                      <th scope="col" className="text-sm  font-bold px-6 py-4">
                        Platform
                      </th>
                      <th scope="col" className="text-sm  font-bold px-6 py-4">
                        Upload a Quote
                      </th>
                      {/* <th scope="col" className="text-sm  font-bold px-6 py-4">
                        DM
                      </th> */}
                      <th
                        scope="col"
                        className="text-sm  font-bold px-6 py-4"
                      ></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.map((item: Item, index) => {
                      return (
                        <tr
                          key={index}
                          className="align-middle border-t border-b text-sm text-center font-normal px-6"
                        >
                          <td className="align-middle text-sm text-center font-normal px-6 py-3 whitespace-nowrap">
                            {moment(item?.createdAt).format("DD-MM-YY h:mm A")}
                          </td>
                          <td className="font-[400] text-[14px]">
                            <>
                              {item?.productId.imageLink ? (
                                <a
                                  href={item?.productId.imageLink}
                                  target="__blank"
                                >
                                  {item?.productId.imageLink?.slice(0, 27)}
                                  ...
                                </a>
                              ) : (
                                <a href={item?.productId.image} target="__blank" className=" mx-auto  w-16 h-12 overflow-hidden flex justify-center items-center">
                                  <Image
                                    src={`${item?.productId.image}`}
                                    alt="Product Image"
                                    className=" mx-auto rounded-md"
                                    width={60}
                                    height={60}
                                  />
                                </a>
                              )}
                            </>
                          </td>
                          <td className="align-middle text-sm text-center font-normal px-6  py-3">
                            {item?.productId.orderPerDay}
                          </td>
                          <td className="align-middle text-sm text-center font-normal px-6  py-3">
                            {item?.productId.destination}
                          </td>
                          <td className="align-middle text-sm text-center font-normal px-6  py-3">
                            {item?.productId.platform}
                          </td>
                          <td className="align-middle text-sm text-center font-normal px-6  py-3">
                            <button
                              onClick={() => {
                                setAddQuoteModal(true);

                                setDataView(item?.productId);
                              }}
                              className="h-[30px] w-[max-content] bg-[#D71A21] text-white font-[400] rounded-[10px] flex justify-center items-center px-[14px]"
                            >
                              Upload a Quote
                            </button>
                          </td>
                          <td className="font-[400] text-[14px]">
                          {/* <button
                              className="h-[30px] bg-[#D71A21] w-[max-content] mx-auto text-white font-[400] rounded-[10px] flex justify-center items-center px-[13px]"
                              onClick={() => {
                                dispatch(setKeForMessage(true))
                                router.push(`/agent/chat?productId=${item.productId._id}&userId=${item.productId.userId}`)
                              }}
                            >
                              Reach Out
                            </button> */}
                          </td>
                          <td className="align-middle text-sm text-center font-normal px-6 py-1.5">
                            <div className="flex flex-col gap-1">
                              <button
                               title="Working on"
                                className="w-4 h-4 bg-[#F6EF4C] rounded-full"
                                onClick={() =>
                                  changeRank("working", item?.productId._id)
                                }
                              ></button>
                              <div
                                className="w-4 h-4 bg-[#D71A217A] rounded-full"
                                
                              ></div>
                              <button
                               title="done"
                                className="w-4 h-4 bg-[#00FF1A] rounded-full"
                                onClick={() =>
                                  changeRank("done", item?.productId._id)
                                }
                              ></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-[15px] mb-[5px]">
                  <div className="border h-[40px] rounded-[7px] flex justify-between">
                    <button
                      className="text-[14px] border-e w-[100px] flex items-center justify-center gap-1.5"
                      disabled={currentPage === 1}
                      onClick={() => {
                        const pageParam = params.get("page");
                        const pageNumber = pageParam
                          ? parseInt(pageParam, 10)
                          : null;

                        if (pageNumber !== null && pageNumber > 1) {
                          fn_viewMore(pageNumber - 1);
                        } else {
                          // Optionally handle cases where the condition is not met
                          console.log(
                            "Page number is not valid or does not meet the condition."
                          );
                        }
                      }}
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
                      disabled={totalPages === currentPage}
                      onClick={() => {
                        const pageParam = params.get("page");
                        const currentPage = pageParam
                          ? parseInt(pageParam, 10)
                          : null;

                        // Compute the value for fn_viewMore
                        const valueToPass =
                          currentPage !== null && currentPage < totalPages
                            ? currentPage + 1
                            : 2;

                        fn_viewMore(valueToPass);
                      }}
                    >
                      <p className="mt-[3px]">Next</p>
                      <IoIosArrowForward />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* add product modal */}
          {addQuoteModal && (
            <ModalUploadQuotes
              dataView={dataView}
              setShowModal={setAddQuoteModal}
            />
          )}

          {filterModal && (
            <ModalFilterPopup
              setShowModal={setFilterModal}
              setTotalPages={setTotalPages}
              setCurrentPage={setCurrentPage}
              setData={setData}
              max={100}
              tab={"irrelevant"}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Irrelevent;
