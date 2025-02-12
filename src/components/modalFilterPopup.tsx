import { useMemo, useState } from "react";
import { DateRange, RangeKeyDict } from "react-date-range";
import Slider from "react-slider";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { fetchProducts, fetchProductsRank } from "@/api/api";
import countryList from "react-select-country-list";
import { useRouter } from "next/navigation";
import { storePlatform } from "@/assets/data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updateFilterProduct } from "@/features/agentFeatures";
import Select, { SingleValue } from "react-select";

interface ModalFilterPopupProps {
  setShowModal: (show: boolean) => void;
  setTotalPages: (totalPages: number) => void;
  setCurrentPage: (currentPage: number) => void;
  setData: (data: []) => void;
  max: number;
  tab: string;
}

interface TrackState {
  index: number;
  value: number[];
}
interface ApiResponse {
  status: string;
  totalPages: number;
  currentPage: number;
  data: []; // Replace `any[]` with the actual data structure if known
}

const parseDate = (dateString: string) => new Date(dateString);

const ModalFilterPopup = ({
  setShowModal,
  setTotalPages,
  setCurrentPage,
  setData,
  max,
  tab,
}: ModalFilterPopupProps) => {
  const toUTCDate = (date: Date) => {
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
  };

  const savedFilterProduct = useSelector(
    (state: RootState) => state.agentFeatures.filter
  );

  const router = useRouter();
  const dispatch = useDispatch();
  const [ranges, setRanges] = useState({
    selection: {
      startDate:
        savedFilterProduct.startDate !== ""
          ? parseDate(savedFilterProduct.startDate)
          : toUTCDate(new Date()),
      endDate:
        savedFilterProduct.endDate !== ""
          ? parseDate(savedFilterProduct.endDate)
          : toUTCDate(new Date()),
      key: "selection",
    },
  });

  const options = useMemo(() => countryList().getData(), []);
  const [sliderValues, setSliderValues] = useState<number[]>([0, max]);
  const [loading, setLoading] = useState<boolean>(false);
  const [platform, setPlatform] = useState<string>(
    savedFilterProduct.plateform
  );
  const [destination, setDestination] = useState<string>(
    savedFilterProduct.destination
  );

  const handleSelect = (rangesByKey: RangeKeyDict) => {
    const newRanges = {
      selection: {
        startDate: toUTCDate(rangesByKey.selection.startDate || new Date()),
        endDate: toUTCDate(rangesByKey.selection.endDate || new Date()),
        key: rangesByKey.selection.key || "selection",
      },
    };

    setRanges(newRanges);
  };

  const handleSliderChange = (values: number[]) => {
    setSliderValues(values);
  };

  const handleSearch = async () => {
    setLoading(true);
    console.log(destination);
    console.log(platform);
    console.log(ranges.selection.startDate.toISOString().split("T")[0]);
    console.log(ranges.selection.endDate.toISOString().split("T")[0]);
    dispatch(
      updateFilterProduct({
        destination,
        plateform: platform,
        startDate: ranges.selection.startDate.toISOString().split("T")[0],
        endDate: ranges.selection.endDate.toISOString().split("T")[0],
      })
    );
    try {
      if (tab) {
        const productsData = (await fetchProductsRank({
          type: tab,
          maxOrderPerDay: sliderValues[1],
          minOrderPerDay: sliderValues[0],
          destination: destination,
          platform: platform,
          startDate: ranges.selection.startDate.toISOString().split("T")[0],
          endDate: ranges.selection.endDate.toISOString().split("T")[0],
        })) as ApiResponse;

        setTotalPages(productsData.totalPages);
        setCurrentPage(productsData.currentPage);
        setData(productsData.data);
        if (tab == "woking") {
        } else if (tab == "irrelevant") {
          router.push("/agent/irrelevant?page=1", undefined);
        } else if (tab == "done") {
          router.push("/agent/done?page=1", undefined);
        }
      } else {
        const productsData = await fetchProducts({
          maxOrderPerDay: sliderValues[1],
          minOrderPerDay: sliderValues[0],
          destination: destination,
          platform: platform,
          startDate: ranges.selection.startDate.toISOString().split("T")[0],
          endDate: ranges.selection.endDate.toISOString().split("T")[0],
        });

        setTotalPages(productsData.totalPages);
        setCurrentPage(productsData.currentPage);
        setData(productsData.data);

        router.push("/agent/newcustomers?page=1", undefined);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error during search:", error);
    }
    setLoading(false);
  };

  const handleChange = (e: SingleValue<{ label: string; value: string }>) => {
    if (e) {
      setPlatform(e.value);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0000008a] flex justify-center items-center">
      <div className="relative max-w-6xl bg-white rounded-lg p-4 sm:p-6 md:p-8 lg:p-10 overflow-auto w-full">
        <div className="pt-5">
          <h3 className="text-black font-bold text-xl pb-4">
            Choose the daily order range of the product
          </h3>
          <div className="w-full">
            <Slider
              value={sliderValues}
              onChange={handleSliderChange}
              min={0}
              max={max}
              step={1}
              className="slider"
              thumbClassName="thumb"
              trackClassName="track"
              ariaLabel={["Lower thumb", "Upper thumb"]}
              renderThumb={(props: React.HTMLProps<HTMLDivElement>) => (
                <div {...props} className="thumb" />
              )}
              renderTrack={(
                props: React.HTMLProps<HTMLDivElement>,
                state: TrackState
              ) => (
                <div
                  {...props}
                  className={`track ${
                    state.index === 1 ? "track-filled" : "track-unfilled"
                  }`}
                />
              )}
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{sliderValues[0]}</span>
              <span>{sliderValues[1]}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-12 mt-6 overflow-auto max-h-[250px] sm:max-h-[400px]">
          <div className="md:w-[40%]">
            <div className="pb-5">
              <h3 className="text-black font-bold text-xl pb-4">Date</h3>
              <div
                className="rounded-2xl mx-auto p-3"
                style={{ boxShadow: "0px 0px 43px 0px #B9B9B940" }}
              >
                <DateRange
                  ranges={[ranges.selection]}
                  onChange={handleSelect}
                  maxDate={new Date()}
                />
              </div>
            </div>
          </div>
          <div className="md:w-[60%]">
            <div>
              <h3 className="text-black font-bold text-xl pb-4">
                Select the Platform the Store is Built On
              </h3>
              <Select
                placeholder="Choose Platform"
                defaultValue={platform ? { value: platform, label: platform } : undefined}
                onChange={(
                  selectedOption: SingleValue<{ value: string; label: string }>
                ) => {
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
                    height: "45px",
                    borderColor: state.isFocused ? "var(--red)" : "#e8e8e8",
                    borderWidth: "1px",
                    boxShadow: state.isFocused ? "none" : "none",
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
            </div>
            <div className="pt-5">
              <h3 className="text-black font-bold text-xl pb-4">
                Select the Destination Country
              </h3>

              <select
                name="destination"
                onChange={(e) => {
                  setDestination(e.target.value);
                }}
                className="py-3.5 px-4 bg-[#F3F3F3] text-black font-semibold w-full rounded-md"
              >
                <option
                  className="text-[13px]"
                  selected
                  value={"Select Country"}
                >
                  Select Country
                </option>
                {options?.map((item) => (
                  <option
                    key={item.value}
                    value={item?.label}
                    className="text-[13px]"
                    selected={savedFilterProduct.destination === item?.label}
                  >
                    {item?.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-left gap-5 items-center mt-12">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="h-[55px] w-44 bg-[#F1F1F1] text-red-500 font-semibold text-lg rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSearch}
                className="h-[55px] w-44 bg-red-500 text-white font-semibold text-lg rounded-md"
                disabled={loading}
              >
                {loading ? "Loading..." : "Search"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalFilterPopup;
