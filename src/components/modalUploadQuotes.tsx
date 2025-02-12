import {
  Formik,
  Field,
  Form,
  FieldArray,
  FormikHelpers,
  FormikErrors,
  FormikTouched,
} from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { AgentQuotationApi } from "@/api/api";
import toast from "react-hot-toast";
import { MdDeleteForever } from "react-icons/md";

interface QuoteFormValues {
  quotes: {
    quantity: number;
    productPrice: number | string;
    shippingPickup: number | string;
    shippingDoorToDoor: number | string;
    totalPriceShippingPickup: number | string;
    totalPriceShippingDoorToDoor: number | string;
  }[];
  userId?: string;
  productId?: string;
}

const initialQuote = {
  quantity: 1,
  productPrice: "",
  shippingPickup: "",
  shippingDoorToDoor: "",
  totalPriceShippingPickup: "",
  totalPriceShippingDoorToDoor: "",
};

const validationSchema = Yup.object({
  quotes: Yup.array().of(
    Yup.object().shape({
      quantity: Yup.number()
        .required("Quantity is required")
        .min(1, "Minimum 1 item"),
      productPrice: Yup.number()
        .transform((value, originalValue) =>
          typeof originalValue === "string" && originalValue.trim() === ""
            ? undefined
            : value
        )
        .required("Product Price is required")
        .min(1, "Minimum 1 item"),
      shippingPickup: Yup.number()
        .transform((value, originalValue) =>
          typeof originalValue === "string" && originalValue.trim() === ""
            ? undefined
            : value
        )
        .required("Shipping Pickup Price is required")
        .min(1, "Minimum 1 item"),
      shippingDoorToDoor: Yup.number()
        .transform((value, originalValue) =>
          typeof originalValue === "string" && originalValue.trim() === ""
            ? undefined
            : value
        )
        .required("Shipping Door to Door is required")
        .min(1, "Minimum 1 item"),
      totalPriceShippingPickup: Yup.number()
        .transform((value, originalValue) =>
          typeof originalValue === "string" && originalValue.trim() === ""
            ? undefined
            : value
        )
        .required("Total Price for Pickup is required")
        .min(1, "Minimum 1 item"),
      totalPriceShippingDoorToDoor: Yup.number()
        .transform((value, originalValue) =>
          typeof originalValue === "string" && originalValue.trim() === ""
            ? undefined
            : value
        )
        .required("Total Price for Door to Door is required")
        .min(1, "Minimum 1 item"),
    })
  ),
});

interface Item {
  _id?: string;
  createdAt?: string;
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

interface ModalUploadQuotesProps {
  setShowModal: (value: boolean) => void;
  dataView: Item | undefined;
}

const ModalUploadQuotes: React.FC<ModalUploadQuotesProps> = ({
  setShowModal,
  dataView,
}) => {
  const [agentId, setAgentId] = useState<string | null>(null);

  useEffect(() => {
    const storedAgentId = localStorage.getItem("agentId");
    setAgentId(storedAgentId);
  }, []);

  const initialValues: QuoteFormValues = {
    quotes: [initialQuote],
    userId: dataView?.userId?._id,
    productId: dataView?._id,
  };

  interface AgentQuotationResponse {
    data: {
      status: string;
      message?: string;
    };
  }

  const handleSubmit = async (
    values: QuoteFormValues,
    {}: FormikHelpers<QuoteFormValues>
  ) => {
    let allSuccessful = true;

    try {
      for (const item of values.quotes) {
        const params = {
          quantity: item.quantity,
          price: Number(item.productPrice) || 0,
          shippingPickupPrice: Number(item.shippingPickup) || 0,
          shippingDoorPrice: Number(item.shippingDoorToDoor) || 0,
          totalShippingPickupPrice: Number(item.totalPriceShippingPickup) || 0,
          totalShippingDoorPrice:
            Number(item.totalPriceShippingDoorToDoor) || 0,
          agentId,
          userId: typeof dataView?.userId === 'object' ? dataView?.userId?._id || "" : dataView?.userId || "",
          productId: dataView?._id,
        };
        const response = (await AgentQuotationApi(
          params
        )) as AgentQuotationResponse;

        if (response?.data?.status !== "ok") {
          allSuccessful = false;
          toast.error(response?.data?.message || "Submission failed");
        }
      }

      if (allSuccessful) {
        toast.success("All quotes submitted successfully!");
        setShowModal(false);
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0000008a] flex justify-center items-center z-40">
      <div className="relative max-w-7xl w-[max-content] max-h-full bg-white rounded-xl p-4 sm:p-6 md:p-8 lg:p-10 overflow-auto">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
          }: {
            values: QuoteFormValues;
            errors: FormikErrors<QuoteFormValues>;
            touched: FormikTouched<QuoteFormValues>;
          }) => (
            <Form>
              <FieldArray name="quotes">
                {({remove }) => (
                  <>
                    <div className="overflow-x-auto">
                      {values?.quotes?.map((_, index: number) => (
                        <div
                          key={index}
                          className="flex gap-5 min-w-[1100px] max-w-[1100px] md:min-w-[1150px] md:max-w-[1150px] lg:min-w-[1200px] lg:max-w-[1200px] items-center mb-2 relative"
                        >
                          <div className="flex flex-col min-w-[60px]">
                            <label className="text-black text-lg font-bold block mt-[-10px] mb-2">
                              QTY
                            </label>
                            <p className="font-[800] text-[22px] mb-[40px]">
                              {index + 1}x
                            </p>
                          </div>

                          <div className="flex flex-col min-w-[170px] w-[170px] relative">
                            <label className="text-black font-bold">
                              Product Price
                            </label>
                            <p className="absolute text-gray-500 text-[18px] top-[42px] left-[10px] font-[500]">
                              $
                            </p>
                            <Field
                              name={`quotes[${index}].productPrice`}
                              type="number"
                              min={1}
                              className="mt-2 bg-[#F1F1F1] p-3 ps-[30px] outline-none rounded-md"
                            />
                            {typeof errors.quotes?.[index] === "object" &&
                            errors.quotes?.[index]?.productPrice &&
                            touched.quotes?.[index]?.productPrice ? (
                              <div className="text-red-500 text-sm h-[41px]">
                                {errors.quotes[index].productPrice}
                              </div>
                            ) : (
                              <p className="h-[41px]"></p>
                            )}
                          </div>

                          <div className="flex flex-col min-w-[190px] w-[190px] relative">
                            <label className="text-black font-bold">
                              Shipping Pickup Price
                            </label>
                            <p className="absolute text-gray-500 text-[18px] top-[42px] left-[10px] font-[500]">
                              $
                            </p>
                            <Field
                              name={`quotes[${index}].shippingPickup`}
                              type="number"
                              min={1}
                              className="mt-2 bg-[#F1F1F1] p-3 ps-[30px] outline-none rounded-md"
                            />
                            {typeof errors.quotes?.[index] === "object" &&
                            errors.quotes?.[index]?.shippingPickup &&
                            touched.quotes?.[index]?.shippingPickup ? (
                              <div className="text-red-500 text-sm h-[41px]">
                                {errors.quotes[index].shippingPickup}
                              </div>
                            ) : (
                              <p className="h-[41px]"></p>
                            )}
                          </div>

                          <div className="flex flex-col min-w-[190px] w-[190px] relative">
                            <label className="text-black font-bold">
                              Shipping Door to Door
                            </label>
                            <p className="absolute text-gray-500 text-[18px] top-[42px] left-[10px] font-[500]">
                              $
                            </p>
                            <Field
                              name={`quotes[${index}].shippingDoorToDoor`}
                              type="number"
                              min={1}
                              className="mt-2 bg-[#F1F1F1] p-3 ps-[30px] outline-none rounded-md"
                            />
                            {typeof errors.quotes?.[index] === "object" &&
                            errors.quotes?.[index]?.shippingDoorToDoor &&
                            touched.quotes?.[index]?.shippingDoorToDoor ? (
                              <div className="text-red-500 text-sm h-[41px]">
                                {errors.quotes[index].shippingDoorToDoor}
                              </div>
                            ) : (
                              <p className="h-[41px]"></p>
                            )}
                          </div>

                          <div className="flex flex-col min-w-[190px] w-[190px] relative">
                            <label className="text-black font-bold">
                              Total Price (Pickup)
                            </label>
                            <p className="absolute text-gray-500 text-[18px] top-[42px] left-[10px] font-[500]">
                              $
                            </p>
                            <Field
                              name={`quotes[${index}].totalPriceShippingPickup`}
                              type="number"
                              min={1}
                              className="mt-2 bg-[#F1F1F1] p-3 ps-[30px] outline-none rounded-md"
                            />
                            {typeof errors.quotes?.[index] === "object" &&
                            errors.quotes?.[index]?.totalPriceShippingPickup &&
                            touched.quotes?.[index]
                              ?.totalPriceShippingPickup ? (
                              <div className="text-red-500 text-sm h-[41px]">
                                {errors.quotes[index].totalPriceShippingPickup}
                              </div>
                            ) : (
                              <p className="h-[41px]"></p>
                            )}
                          </div>

                          <div className="flex flex-col min-w-[210px] w-[190px] relative">
                            <label className="text-black font-bold">
                              Total Price (Door to Door)
                            </label>
                            <p className="absolute text-gray-500 text-[18px] top-[42px] left-[10px] font-[500]">
                              $
                            </p>
                            <Field
                              name={`quotes[${index}].totalPriceShippingDoorToDoor`}
                              type="number"
                              min={1}
                              className="mt-2 bg-[#F1F1F1] p-3 ps-[30px] outline-none rounded-md"
                            />
                            {typeof errors.quotes?.[index] === "object" &&
                            errors.quotes?.[index]
                              ?.totalPriceShippingDoorToDoor &&
                            touched.quotes?.[index]
                              ?.totalPriceShippingDoorToDoor ? (
                              <div className="text-red-500 text-sm h-[41px]">
                                {
                                  errors.quotes[index]
                                    .totalPriceShippingDoorToDoor
                                }
                              </div>
                            ) : (
                              <p className="h-[41px]"></p>
                            )}
                          </div>
                          {index !== 0 ? (
                            <p className="w-[30px]">
                              <MdDeleteForever
                                className="text-[26px] mt-[25px] text-[--red] cursor-pointer"
                                onClick={() => remove(index)}
                              />
                            </p>
                          ) : (
                            <p className="w-[30px]"></p>
                          )}
                        </div>
                      ))}
                    </div>
                    {/* <div className="flex justify-end mt-1">
                      <div className="flex justify-center items-center">
                        <button
                          type="button"
                          onClick={() => push(initialQuote)}
                          className="p-2"
                        >
                          <Image src={Square} alt="Remove" />
                        </button>
                      </div>
                    </div> */}
                  </>
                )}
              </FieldArray>

              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="h-[55px] w-60 bg-[#F1F1F1] text-red-500 font-semibold text-lg rounded-md"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="h-[55px] w-60 bg-[--red] text-white font-semibold text-lg rounded-md"
                >
                  DONE
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ModalUploadQuotes;
