"use client";

import Image from "next/image";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Tips from "@/components/Tips/Tips";
import { getProductApi } from "@/api/api";
import Sidebar from "@/components/sidebar";
import ModalViewQuotes from "@/components/modalViewQuotes";
import { updateSidebarNavigation } from "@/features/features";
import ModalChooseProduct from "@/components/modalChooseProduct";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";

import uplaodBtn from "@/assets/upload-btn.png";
import searchIcon from "@/assets/search-icon.png";

import { FaPlus } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Product = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const params: URLSearchParams = useSearchParams();
  const showSearch = true;
  const [showModal, setShowModal] = useState(false);
  const [addProductModal, setAddProductModal] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const searchText = params.get("search") || "";
  const [data, setData] = useState<[]>([]);
  const [result, setResult] = useState(false);
  const [ViewQuotes, setViewQuotes] = useState<string>("");
  const [productLoader, setProductLoader] = useState(true);

  const [viewTip, setViewTip] = useState(1);

  const productPopup = localStorage.getItem("productPopup");

  interface ProductApiResponse {
    data: {
      status: string;
      count: number;
      totalPages: number;
      currentPage: number;
      data: [];
    };
  }

  const fn_getProduct = async (pageValue: number, searchText: string) => {
    const response = (await getProductApi({
      page: pageValue,
      search: searchText,
    })) as ProductApiResponse;

    if (response?.data?.status === "ok") {
      setTotalPages(response?.data?.totalPages);
      setCurrentPage(response?.data?.currentPage);
      setData(response?.data?.data);
      setProductLoader(false);
    }
    setResult(true);
  };

  useEffect(() => {
    dispatch(updateSidebarNavigation("quotes"));
  }, []);

  useEffect(() => {
    const page = params.get("page");

    if (params.size === 0 || !page) {
      router.push("/product?page=1", undefined);
    }
    const pageNumber = page ? parseInt(page, 10) : 1;
    fn_getProduct(pageNumber, searchText);
  }, [params.get("page")]);

  const fn_viewMore = (selectedPage: number) => {
    router.push(`/product?page=${selectedPage}`);
    fn_getProduct(selectedPage, searchText);
  };

  const fn_searchProduct = (text: string) => {
    if (text === "") {
      setProductLoader(true);
    }
    router.push(`/product?search=${text}&page=1`);
    fn_getProduct(1, text);
  };

  const handleProductCreation = async () => {
    await fn_getProduct(currentPage, searchText);
  };

  interface ProductItem {
    _id: string;
    imageLink?: string;
    image: string;
    productName: string;
    quotationCount: number;
  }

  return result || searchText || showSearch ? (
    <>
      {productPopup === "true" && data?.length > 0 && <Tips viewTip={viewTip} setViewTip={setViewTip} />}
      {/* <Tips viewTip={viewTip} setViewTip={setViewTip} /> */}
      <div className="flex justify-center w-full bg-[--black] min-h-[100vh]">
        <div className="flex w-full bg-transparent z-[9]">
          {/* left box - sidebar */}
          <Sidebar />
          {/* right box - in white */}
          <div className="relative min-h-[100vh] w-full py-[30px] px-[10px] lg:pe-[30px]">
            <div className="bg-[white] md:relative min-h-[100%] rounded-[35px] px-[15px] py-[40px] lg:p-[40px] flex flex-col">
              <p className="text-[25px] sm:text-[43px] font-[800]">
                <i>Upload a product</i>
              </p>
              <p className="text-[#5C5C5C] font-[500]">
                And receive quotes for free.
              </p>
              <div className="flex flex-col sm:flex-row gap-[10px] sm:gap-0">
                <button
                  onClick={() => setAddProductModal(true)}
                  className="w-full sm:w-[150px] bg-[--red] text-white h-[45px] min-h-[45px] rounded-[10px] flex justify-center items-center mt-[20px] gap-[10px] text-[15px] font-[500]"
                >
                  <FaPlus />
                  <p>Add Product</p>
                </button>
                {data?.length > 0 || searchText ? (
                  <div className="sm:mt-[22px] sm:ms-[20px] flex items-center gap-2">
                    {showSearch && (
                      <input
                        placeholder="Search..."
                        className="text-[15px] font-[500] h-[43px] border px-[10px] flex-1 sm:w-[200px] rounded-[10px] focus:outline focus:outline-[1px] focus:outline-[--red]"
                        defaultValue={searchText}
                        onChange={(e) => {
                          fn_searchProduct(e.target.value);
                        }}
                      />
                    )}
                    <Image
                      alt="search"
                      src={searchIcon}
                      className="min-h-[35px] h-[35px] min-w-[35px] w-[35px] object-contain cursor-pointer"
                      onClick={() => fn_searchProduct(searchText)}
                    />
                  </div>
                ) : null}
              </div>
              {productLoader ? (
                <div className="w-full flex justify-center">
                  <span className="red-loader"></span>
                </div>
              ) : data?.length === 0 && !searchText ? (
                <div className="mt-[20px] h-[100%] min-h-[300px] flex flex-col justify-center pb-[15px]">
                  <div className="relative flex justify-center items-center">
                    <Image
                      alt="btn"
                      src={uplaodBtn}
                      className="w-[130px] sm:w-[150px] h-[130px] sm:h-[150px] cursor-pointer"
                      onClick={() => setAddProductModal(true)}
                    />
                    <FaPlus
                      className="absolute text-[27px] text-white mt-[3px] cursor-pointer"
                      onClick={() => setAddProductModal(true)}
                    />
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
              ) : (
                <section className="mb-20  text-gray-800">
                  <div
                    className="overflow-x-hidden mt-[25px] rounded-[10px] border p-[15px]"
                    style={{ boxShadow: "0px 0px 43px 0px #B9B9B940" }}
                  >
                    <div className="flex flex-col ">
                      <div className="sm:-mx-6 lg:-mx-8 overflow-x-auto">
                        <div className="inline-block min-w-full lg:px-8">
                          <div className="overflow-hidden">
                            <table className="min-w-full mb-0 ">
                              <thead className="">
                                <tr className="rounded-lg  whitespace-nowrap">
                                  <th
                                    scope="col"
                                    className="text-sm  font-bold px-6 py-4"
                                  >
                                    No.
                                  </th>
                                  <th
                                    scope="col"
                                    className="text-sm  font-bold px-6 py-4"
                                  >
                                    Image Link
                                  </th>
                                  <th
                                    scope="col"
                                    className="text-sm font-bold px-6 py-4"
                                  >
                                    Product Name
                                  </th>
                                  <th
                                    scope="col"
                                    className="text-sm font-bold px-6 py-4"
                                  >
                                    Quotes (quantity)
                                  </th>

                                  <th
                                    scope="col"
                                    className="text-sm  font-bold px-6 py-4"
                                  >
                                    View Quotes
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {data?.map((item: ProductItem, index) => (
                                  <tr
                                    key={index}
                                    className="align-middle border-t border-b text-sm text-center font-normal px-6 whitespace-nowrap"
                                  >
                                    <td className="align-middle text-sm text-center font-normal px-6 py-4 whitespace-nowrap">
                                      {(currentPage - 1) * 7 + index + 1}
                                    </td>
                                    <td className="font-[400] text-[14px] whitespace-nowrap">
                                      {item?.imageLink ? (
                                        <a
                                          href={item?.imageLink}
                                          target="__blank"
                                        >
                                          {item?.imageLink?.slice(0, 27)}...
                                        </a>
                                      ) : (
                                        <a
                                          href={item?.image}
                                          target="__blank"
                                          className="mx-auto  w-16 h-12 overflow-hidden flex justify-center items-center"
                                        >
                                          <Image
                                            src={item?.image}
                                            alt="Product Image"
                                            className=" mx-auto rounded-md"
                                            width={60}
                                            height={60}
                                          />
                                        </a>
                                      )}
                                    </td>
                                    <td className="align-middle text-sm text-center font-normal px-6  py-3 whitespace-nowrap">
                                      {item?.productName}
                                    </td>
                                    <td className="align-middle text-sm text-center font-normal px-6  py-3 whitespace-nowrap">
                                      {item.quotationCount}
                                    </td>
                                    <td className="font-[400] text-[14px] whitespace-nowrap">
                                      <button
                                        className="h-[30px] mx-auto bg-[--black] text-white font-[400] rounded-[10px] flex justify-center items-center px-[13px]"
                                        onClick={() => {
                                          setShowModal(true);
                                          setViewQuotes(item._id);
                                        }}
                                      >
                                        View Quotes
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
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
                                  currentPage !== null &&
                                  currentPage < totalPages
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
                </section>
              )}
            </div>
            {/* add product modal */}
            {addProductModal && (
              <ModalChooseProduct
                onProductCreated={handleProductCreation}
                setShowModal={setAddProductModal}
                currentPages={currentPage}
              />
            )}
            {/* show quotes modal */}
            {showModal && (
              <ModalViewQuotes
                setShowModal={setShowModal}
                ViewQuotes={ViewQuotes}
              />
            )}
          </div>
        </div>
      </div>
    </>
  ) : (
    <LoadingScreen />
  );
};

export default Product;
