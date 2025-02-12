// pages/index.tsx
import React, { useState, useEffect, FormEvent } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Appearance } from "@stripe/stripe-js"; // Correctly importing Appearance type
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
const API_URL = process.env.NEXT_PUBLIC_REACT_APP_BASEURL;
// Load Stripe with your publishable key
const stripePromise = loadStripe(
  "pk_live_51PgMY72L1r125aFrc4q16BQAc3pPhSJnAlVKAxn5sLy4D4sqAUbfZNqgNrro4saob2nE2MWZvgro1jMlYAxU5iuX00xAqUhHxz"
);
const userToken = Cookies.get("access");

// interface PaymentPageProps {
//   amount: number;
// }
export default function PaymentPage() {
  const params: URLSearchParams = useSearchParams();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<string>("");
  const [userAmount, setUserAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [viewDetails, setViewDetails] = useState(false);

  const amount: number = +(params.get("amount") ?? 0);

  const getPaymentIntent = async () => {
    const calculateTax = (
      initialAmount: number,
      currentAmount: number,
      iterations: number
    ): number => {
      if (iterations === 0) {
        return currentAmount; // Base case: stop recursion after specified iterations
      }

      const stripeFee = (currentAmount * 2.9) / 100; // Calculate stripe fee from currentAmount (myamount)
      const tax = 0.15;
      const totalFee = stripeFee / 2 + tax; // Apply totalFee logic

      const myamount = initialAmount + totalFee; // Add totalFee to initialAmount

      // Recursively call the function with the updated myamount
      return calculateTax(initialAmount, myamount, iterations - 1);
    };

    // Start recursion with an initial amount and number of iterations
    const initialAmount = +(amount ?? 0);
    const totalIterations = 5;

    // The first call passes the initial amount as both initial and current amounts
    const finalAmount: number = calculateTax(
      initialAmount,
      initialAmount,
      totalIterations
    );
    console.log(
      `Final amount after ${totalIterations} iterations: ${finalAmount}`
    );

    if (finalAmount) {
      // Ensure the paymentIntentAmount is rounded to 2 decimal places
      let paymentIntentAmount: number = parseFloat(finalAmount.toFixed(2));
      setUserAmount(paymentIntentAmount);
      // Multiply by 100 to convert to cents for Stripe
      paymentIntentAmount = Number((paymentIntentAmount * 100).toFixed(2));

      const response = await axios.post(`${API_URL}/apis/payment/send`, {
        amount: paymentIntentAmount,
      });
      console.log(response.data.data);

      setPaymentIntent(response.data.data.id);
      setClientSecret(response.data.data.client_secret);
    }
  };
  // Fetch the client secret as soon as the page loads
  useEffect(() => {
    getPaymentIntent();
  }, []);

  if (!clientSecret) {
    return <div>Loading...</div>; // Show a loading state until the clientSecret is available
  }

  // Define the appearance options (use a predefined theme)
  const appearance: Appearance = {
    theme: "stripe", // Options: 'stripe', 'night', 'flat', or undefined
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {/* left side */}
      <div className="md:min-h-[100vh] flex flex-col justify-center items-center mt-[70px] md:mt-0 relative bg-white md:bg-gray-100">
        <div className="absolute flex justify-center items-center top-[-40px] md:top-[80px] left-[5%] xl:left-[10%]">
          <FaArrowLeft className="text-gray-400 cursor-pointer" onClick={() => router.push("/products")} />
          <span className="inline-block ms-[10px] text-gray-400 font-[500]">Drop Agent Hub</span>
        </div>
        <p className="text-[14px] md:text-[16px] font-[500] text-gray-400 w-[95%] sm:w-[90%] xl:w-[80%]">Sub Total</p>
        <div className="bg-white md:bg-gray-100 w-[97%] sm:w-[88%] px-[1%] md:px-0 rounded-[6px] md:w-[90%] xl:w-[80%] md:mb-10 flex items-center justify-between z-[999]">
          <p className="text-[30px] md:text-[45px] font-[600]">
            ${userAmount}
          </p>
          <p
            className="text-gray-600 block md:hidden text-[14px] cursor-pointer"
            onClick={() => setViewDetails(!viewDetails)}
          >
            {!viewDetails ? "Details" : "Close"}
            <IoIosArrowDown className={`inline-block ms-[10px] text-[16px] transition-all duration-500 ${!viewDetails ? "rotate-0" : "rotate-180"}`} />
          </p>
        </div>
        <div className="w-[95%] sm:w-[90%] xl:w-[80%] hidden md:block md:pb-[100px]">
          <div className="flex justify-between border-b py-4">
            <span className="text-gray-600">Original price</span>
            <span className="font-semibold">${amount}</span>
          </div>
          <div className="flex justify-between border-b py-4">
            <span className="text-gray-600">Stripe fee</span>
            <span className="font-semibold">
              $
              {parseFloat(
                (userAmount - parseFloat(amount.toFixed(2))).toFixed(2)
              )}
            </span>
          </div>
          <div className="flex justify-between py-4">
            <span className="font-[600]">Sub Total</span>
            <span className="font-semibold text-lg">${userAmount}</span>
          </div>
        </div>
      </div>
      {/* right side */}
      <div className="md:min-h-[100vh] mt-[30px] md:mt-0 w-full flex flex-col justify-center px-[2.5%] sm:px-[5%] xl:px-[7%] 2xl:px-[10%] py-[20px]">
        {/* <h2 className="text-lg font-semibold mb-4">Order summary</h2> */}

        {/* <div className="flex justify-between mb-2">
          <span className="text-gray-600">Original price</span>
          <span className="font-semibold">${amount}</span>
        </div> */}

        {/* <div className="flex justify-between mb-2">
          <span className="text-gray-600">Savings</span>
          <span className="text-green-600">- $299.00</span>
        </div>

        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Store Pickup</span>
          <span className="font-semibold">$99</span>
        </div> */}

        {/* <div className="flex justify-between mb-4">
          <span className="text-gray-600">Stripe fee</span>
          <span className="font-semibold">
            $
            {parseFloat(
              (userAmount - parseFloat(amount.toFixed(2))).toFixed(2)
            )}
          </span>
        </div> */}

        {/* <div className="border-t pt-4 flex justify-between">
          <span className="font-semibold text-lg">Total</span>
          <span className="font-semibold text-lg">${userAmount}</span>
        </div> */}

        <h2 className="text-[20px] md:text-[25px] font-semibold mb-4">
          Payment Details
        </h2>
        {clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret, appearance }}
          >
            <CheckoutForm
              setMessage={setMessage}
              setLoading={setLoading}
              loading={loading}
              paymentIntent={paymentIntent}
              userAmount={userAmount}
              amount={amount}
            />
          </Elements>
        )}
        {message && <div className="">{message}</div>}
      </div>
      {/* dropdown */}
      {viewDetails && (
        <div
          className="fixed top-0 left-0 bg-[#00000083] w-full min-h-[100vh] z-[99]"
          onClick={() => setViewDetails(false)}
        >
          <div
            className={`mx-[1.5%] sm:mx-[6%] bg-white mt-[140px] rounded-[6px] px-[10px]`}
          >
            <div className="flex justify-between border-b py-3 text-[14px]">
              <span className="text-gray-600">Original price</span>
              <span className="font-semibold">${amount}</span>
            </div>
            <div className="flex justify-between border-b py-3 text-[14px]">
              <span className="text-gray-600">Stripe fee</span>
              <span className="font-semibold">
                $
                {parseFloat(
                  (userAmount - parseFloat(amount.toFixed(2))).toFixed(2)
                )}
              </span>
            </div>
            <div className="flex justify-between py-3 text-[14px]">
              <span className="font-[600]">Sub Total</span>
              <span className="font-semibold text-lg">${userAmount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface CheckoutFormProps {
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  paymentIntent: string;
  userAmount: number | null;
  amount: number | null;
}

function CheckoutForm({
  setMessage,
  setLoading,
  loading,
  paymentIntent,
  userAmount,
  amount,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const params: URLSearchParams = useSearchParams();

  const agentId = params.get("agentId");
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return; // Stripe.js hasn't loaded yet.
    }

    const header = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const data = {
      agentId: agentId,
      totalAmount: amount,
      userAmount: userAmount,
      paymentIntentId: paymentIntent,
    };

    try {
      const response = await axios.post(
        `${API_URL}/apis/payment/create`,
        data,
        header
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`, // Optional success URL
        },
        redirect: "if_required", // Prevent automatic redirects for testing purposes
      });

      setLoading(false);

      if (result.error) {
        // Handle error (e.g., insufficient funds, invalid payment method)
        setMessage(result.error.message || "An error occurred");
      } else {
        // Handle different payment statuses
        const paymentIntentStatus = result.paymentIntent?.status;

        if (paymentIntentStatus === "requires_action") {
          // The payment needs further verification (like microdeposit verification for ACH)
          setMessage(
            "Please check your email or bank account to verify the microdeposits."
          );
        } else if (paymentIntentStatus === "processing") {
          // Payment is still processing (e.g., ACH transfer may take time)
          setMessage(
            "Your payment is processing. We will notify you once it is confirmed."
          );
        } else if (paymentIntentStatus === "succeeded") {
          // Payment succeeded (for methods like cards or after verification)
          setMessage("Payment succeeded!");
        } else {
          // Catch any other status that might come up
          setMessage(
            "Payment is in an unknown state. Please check back later."
          );
        }
      }
    } catch (error) {
      setMessage("Something went wrong");
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full px-6 py-3 text-white font-semibold rounded-lg transition duration-300 ease-in-out mt-4 transform ${loading || !stripe
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[--red] hover:bg-red-700 hover:scale-105 active:scale-100"
          }`}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 mx-auto text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
        ) : (
          "Pay"
        )}
      </button>
    </form>
  );
}
