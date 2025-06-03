import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Bank = () => {
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const handleSubmit = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      // Step 1: Create a bank token using Stripe.js
      const { token, error } = await stripe.createToken("bank_account", {
        country: "US",
        currency: "usd",
        routing_number: "110000000", // ✅ Stripe test routing number
        account_number: "000123456789", // ✅ Stripe test account number
        account_holder_name: "Altaf khan",
        account_holder_type: "individual",
      });


      if (error || !token) {
        console.error(error);
        alert("Failed to create token.");
        return;
      }

      const API_URL = process.env.NEXT_PUBLIC_REACT_APP_BASEURL;

      // Step 2: Send token to your backend
      const res = await axios.post(`${API_URL}/apis/payment/addBankAccount`, {
        token: token.id,
      });

      alert("Bank account added successfully!");
      console.log(res.data);

    } catch (err: any) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div>
      <p className="text-[25px] sm:text-[30px] md:text-[35px] font-[800]"><i>Bank Details</i></p>
      <div className="flex flex-col gap-[20px] mt-[30px]">
        <div className="flex gap-1 flex-col">
          <label className="text-[18px] font-[600]">Routing Number</label>
          <input
            value={routingNumber}
            onChange={(e) => setRoutingNumber(e.target.value)}
            className="outline outline-[2px] outline-gray-200 focus:outline-[--red] rounded-lg bg-[#F3F3F3] h-[48px] px-[15px] font-[500] w-full max-w-[550px]"
          />
        </div>
        <div className="flex gap-1 flex-col">
          <label className="text-[18px] font-[600]">Account Number</label>
          <input
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="outline outline-[2px] outline-gray-200 focus:outline-[--red] rounded-lg bg-[#F3F3F3] h-[48px] px-[15px] font-[500] w-full max-w-[550px]"
          />
        </div>
        <div className="flex justify-end mt-6 max-w-[550px]">
          <button
            onClick={handleSubmit}
            className="text-white w-[152px] h-10 pb-[1px] rounded-md bg-[--red]"
          >
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bank;
