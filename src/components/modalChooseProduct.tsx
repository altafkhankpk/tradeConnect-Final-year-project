import { useRef, useState, useMemo, MutableRefObject } from "react";
import Image from "next/image";
import Select, { SingleValue } from "react-select";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import countryList from "react-select-country-list";

import { uploadProductApi } from "@/api/api";
import { uploadProductSchema } from "@/schema/schema";
import { storePlatform } from "@/assets/data";

import { GrClose } from "react-icons/gr";
import { MdOutlineFileUpload } from "react-icons/md";

import modalShadow from "@/assets/modal-shadow.png";

interface ModalChooseProductProps {
  setShowModal: (show: boolean) => void;
  onProductCreated: (() => Promise<void>) | null | string; // Allows a function, null, or string
  currentPages: number | string | null;
}

const ModalChooseProduct = ({
  setShowModal,
  onProductCreated,
  currentPages,
}: ModalChooseProductProps) => {
  const router = useRouter();
  const fileInputRef: MutableRefObject<HTMLInputElement | null> = useRef(null);

  const [loader, setLoader] = useState(false);
  const options = useMemo(() => countryList().getData(), []);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewImage(fileUrl);
      setSelectedFile(file);
      Formik.setFieldValue("imageLink", file);
      Formik.setFieldValue("type", "image");
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    Formik.setFieldValue("imageLink", "");
    Formik.setFieldValue("type", "");
  };

  const initialValues = {
    orderPerDay: "",
    platform: "",
    imageLink: "",
    destination: "",
    note: "",
    image: "",
    productName: "",
  };

  interface Product {
    data: {
      status: string;
    };
  }

  const Formik = useFormik({
    initialValues: initialValues,
    validationSchema: uploadProductSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoader(true);

      const formData = new FormData();

      formData.append("orderPerDay", values.orderPerDay);
      formData.append("platform", values.platform);
      formData.append("destination", values.destination);
      formData.append("note", values.note);
      formData.append("productName", values.productName);
      if (selectedFile) {
        formData.append("image", selectedFile);
        formData.append("type", "image");
      } else {
        formData.append("imageLink", values.imageLink);
        formData.append("type", "imageUrl");
      }
      const response = (await uploadProductApi(formData)) as Product;

      console.log(response);

      if (response?.data?.status === "ok") {
        toast.success("Product Created");
        router.push("/product?page=1");
        resetForm();
        setShowModal(false);
        if (typeof onProductCreated === "function") {
          await onProductCreated(); // Safe to call the function
        }

        router.push(`/product?page=${currentPages}`);

        setTimeout(() => {
          setLoader(false);
        }, 2000);
      } else {
        setLoader(false);
        return toast.error("Network Error");
      }
    },
  });

  const handleChange = (e: SingleValue<{ label: string; value: string }>) => {
    if (e) {
      Formik.setFieldValue("platform", e?.value);
    }
  };

  return (
    <div className="absolute w-full sm:pb-0 pb-28 md:w-auto p-[30px] md:p-[60px] z-[999] top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/3">
      <Image
        alt="bg"
        src={modalShadow}
        className="hidden lg:block absolute w-[250px] top-0 left-0 z-[-1]"
      />
      <Image
        alt="bg"
        src={modalShadow}
        className="hidden lg:block absolute w-[270px] bottom-0 right-0 z-[-1]"
      />
      <form
        onSubmit={Formik.handleSubmit}
        className="bg-white border lg:border-none border-[--red-disabled] md:w-[100%] lg:w-[800px] xl:w-[900px] h-[max-content] rounded-[10px] px-[10px] py-[30px] md:px-[30px] xl:px-[40px] shadow-[0px_4px_30px_0px_#94949440]"
      >
        <div
          onClick={() => setShowModal(false)}
          className="float-end cursor-pointer"
        >
          <GrClose className="black mt-[-10px] md:mt-0" />
        </div>
        <p className="text-center font-[600] text-[20px] sm:text-[25px] lg:text-[30px]">
          Choose a Product from Your Store
        </p>
        <p className="text-[#5C5C5C] text-[15px] text-center mt-[5px]">
          and start receiving quotes from agents.
        </p>
        <hr className="my-[20px]" />
        <div className="grid grid-cols-1 lg:grid-cols-3 justify-between lg:gap-[20px] h-[270px] lg:h-auto overflow-auto">
          <div className="w-full lg:max-w-[230px]">
            <p className="text-[13px] sm:text-[15px]">
              How many orders do you currently have per day?
            </p>
            <input
              name="orderPerDay"
              value={Formik.values.orderPerDay}
              onChange={Formik.handleChange}
              type="number"
              min={1}
              onBlur={Formik.handleBlur}
              className="w-full mt-[8px] h-[35px] text-[14px] sm:text-[16px] sm:h-[40px] rounded-[5px] border px-[10px] sm:px-[20px] font-[600] focus:outline-none focus:border-[--red] focus:shadow-[0px_0px_0px_2px_#D71A202E]"
            />
            {Formik.errors.orderPerDay ? (
              Formik.touched.orderPerDay && (
                <p className="text-[11px] font-[500] mt-[-1px] text-[--red]">
                  {Formik.errors.orderPerDay}
                </p>
              )
            ) : (
              <p className="h-[15px]"></p>
            )}
          </div>
          <div className="w-full lg:max-w-[220px] md:mt-5 mt-0">
            <p className="text-[15px]">Platform the store is built</p>
            <Select
              placeholder="Choose Platform"
              onChange={(selectedOption: SingleValue<{ value: string; label: string; }>) => {
                handleChange(selectedOption);
              }}
              options={storePlatform}
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                menu: (provided) => ({
                  ...provided,
                  overflowY: "auto",
                }),
                control: (provided, state) => ({
                  ...provided,
                  fontWeight: 600,
                  marginTop: "10px",
                  height: "40px",
                  borderColor: state.isFocused ? "var(--red)" : "#e8e8e8",
                  borderWidth: "1px",
                  boxShadow: state.isFocused
                    ? "none"
                    : "none",
                  "&:hover": {
                    borderColor: "var(--red)",
                  },
                }),
                singleValue: (provided) => ({
                  ...provided,
                  fontWeight: 600,
                }),
                option: (provided, state) => ({
                  ...provided,
                  fontSize: "14px",
                  fontWeight: 400,
                  backgroundColor: state.isSelected
                    ? "lightgray"
                    : provided.backgroundColor,
                  "&:hover": {
                    backgroundColor: "lightgray",
                  },
                }),
              }}
            />
            {Formik.errors.platform ? (
              Formik.touched.platform && (
                <p className="text-[11px] font-[500] mt-[-1px] text-[--red]">
                  {Formik.errors.platform}
                </p>
              )
            ) : (
              <p className="h-[15px]"></p>
            )}
          </div>
          <div className="w-full lg:max-w-[220px] md:mt-5 mt-0">
            <p className="text-[15px]">AliExpress link/image</p>
            <div className="flex gap-2">
              {previewImage ? (
                <div className="relative w-full mt-[10px] pb-2 rounded-[5px] border px-[20px] font-[500]">
                  <img
                    src={previewImage}
                    alt="Selected preview"
                    className="w-full h-[100px] object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 text-white bg-[--red] rounded-full p-1"
                  >
                    <GrClose />
                  </button>
                </div>
              ) : (
                <input
                  name="imageLink"
                  value={
                    typeof Formik.values.imageLink === "string"
                      ? Formik.values.imageLink
                      : ""
                  }
                  onChange={(e) => {
                    Formik.setFieldValue("imageLink", e.target.value);
                    Formik.setFieldValue("type", "link");
                  }}
                  placeholder="Paste image URL or select file"
                  className="w-full mt-[10px] h-[40px] rounded-[5px] border px-[20px] font-[500] focus:outline-none focus:border-[--red] focus:shadow-[0px_0px_0px_2px_#D71A202E]"
                />
              )}

              <div
                className="h-[40px] min-w-[40px] rounded-[5px] border mt-[10px] cursor-pointer flex justify-center items-center"
                onClick={handleIconClick}
              >
                <MdOutlineFileUpload className="text-[--red] text-[25px]" />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            {typeof Formik.values.imageLink === "string" &&
            !Formik.values.imageLink.includes("aliexpress") &&
            Formik.errors.imageLink ? (
              Formik.touched.imageLink && (
                <p className="text-[11px] font-[500] mt-[-1px] text-[--red]">
                  {Formik.errors.imageLink}
                </p>
              )
            ) : (
              <p className="h-[15px]"></p>
            )}
          </div>
          <div className="w-full lg:max-w-[220px]">
            <p className="text-[15px]">Destination country</p>
            <div>
              <select
                name="destination"
                value={Formik.values.destination}
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
                className="w-full mt-[8px] h-[35px] text-[14px] sm:h-[40px] rounded-[5px] border px-[10px] sm:px-[20px] font-[600] focus:outline-none focus:border-[--red] focus:shadow-[0px_0px_0px_2px_#D71A202E]"
              >
                <option className="text-[13px]" selected value={""}></option>
                {options?.map((item) => (
                  <option
                    key={item.value}
                    value={item?.label}
                    className="text-[13px]"
                  >
                    {item?.label}
                  </option>
                ))}
              </select>
              {Formik.errors.destination ? (
                Formik.touched.destination && (
                  <p className="text-[11px] font-[500] mt-[-1px] text-[--red]">
                    {Formik.errors.destination}
                  </p>
                )
              ) : (
                <p className="h-[15px]"></p>
              )}
            </div>
          </div>
          <div className="w-full lg:max-w-[220px]">
            <p className="text-[15px]">Additional Note (Optional)</p>
            <input
              name="note"
              value={Formik.values.note}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
              className="w-full mt-[8px] h-[35px] text-[14px] sm:text-[16px] sm:h-[40px] rounded-[5px] border px-[10px] sm:px-[20px] font-[600] focus:outline-none focus:border-[--red] focus:shadow-[0px_0px_0px_2px_#D71A202E]"
            />
            {Formik.errors.note ? (
              Formik.touched.note && (
                <p className="text-[11px] font-[500] mt-[-1px] text-[--red]">
                  {Formik.errors.note}
                </p>
              )
            ) : (
              <p className="h-[15px]"></p>
            )}
          </div>
          <div className="w-full lg:max-w-[220px]">
            <p className="text-[15px]">Product Name</p>
            <input
              name="productName"
              value={Formik.values.productName}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
              className="w-full mt-[8px] h-[35px] text-[14px] sm:text-[16px] sm:h-[40px] rounded-[5px] border px-[10px] sm:px-[20px] font-[600] focus:outline-none focus:border-[--red] focus:shadow-[0px_0px_0px_2px_#D71A202E]"
            />
            {Formik.errors.productName ? (
              Formik.touched.productName && (
                <p className="text-[11px] font-[500] mt-[-1px] text-[--red]">
                  {Formik.errors.productName}
                </p>
              )
            ) : (
              <p className="h-[15px]"></p>
            )}
          </div>
        </div>
        <div className="flex justify-center py-[25px]">
          <button className="min-h-[40px] rounded-[6px] bg-[--black] text-white py-[5px] px-[10px] sm:px-[40px] font-[500]">
            Select a product from your Shopify Store
          </button>
        </div>
        <div className="flex justify-center gap-[10px] lg:gap-[60px]">
          <button
            type="submit"
            className={`h-[40px] text-white rounded-[6px] w-[200px] text-[17px] font-[600] pt-[1px] flex items-center justify-center ${
              loader ? "bg-[--red-disabled] cursor-not-allowed" : "bg-[--red]"
            }`}
            disabled={loader}
          >
            {loader ? <span className="small-loader"></span> : "Submit"}
          </button>
          <button
            className="h-[40px] text-white bg-[#D9D9D9] rounded-[6px] w-[200px] text-[17px] font-[600] pt-[1px]"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalChooseProduct;
