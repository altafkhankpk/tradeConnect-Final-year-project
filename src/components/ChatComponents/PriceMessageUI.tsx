import axios from "axios";
import { useState } from "react";

interface MessageData {
  data: {
    amount: string | undefined;
    description: string | undefined;
    customerId: string;
    accountId: string;
  };
}

export default function PriceMessage({ data }: MessageData) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleWithdraw = async () => {
    try {
      setLoading(true);
      setMessage("");

      const API_URL = process.env.NEXT_PUBLIC_REACT_APP_BASEURL;
      data.customerId = "682e377348662dff0ce5faae"
      data.accountId = "682980a2a6bc68f203bdcd2f"
      const response = await axios.post(
        `${API_URL}/apis/payment/sendBank/${data.customerId}/${data.accountId}`,
        {
          amount: data.amount,
        }
      );

      setMessage("Withdrawal request sent successfully!");
      console.log(response.data);
    } catch (error: any) {
      console.error(error);
      setMessage("Withdrawal failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-200 p-4 rounded-[20px] flex flex-col justify-between min-h-[200px] relative shadow-sm min-w-80">
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">Description</h3>
          <p className="text-left text-gray-700">{data.description}</p>
        </div>
        <div className="text-right">
          <h3 className="font-semibold text-lg">Amount</h3>
          <p className="font-bold text-xl text-gray-800">${data.amount}</p>
        </div>
      </div>

      <button
        className="bg-[--red] text-white py-2 px-4 rounded-lg absolute bottom-4 right-4"
        onClick={handleWithdraw}
        disabled={loading}
      >
        <b>{loading ? "Processing..." : "Withdraw Quote"}</b>
      </button>

      {message && (
        <p className="text-sm text-center mt-3 font-semibold text-green-700">
          {message}
        </p>
      )}
    </div>
  );
}
