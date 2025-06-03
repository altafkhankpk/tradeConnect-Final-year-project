import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4">
      <div className="bg-white shadow-md rounded-2xl p-8 max-w-md w-full text-center">
        <CheckCircle className="text-green-500 w-20 h-20 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your payment has been processed successfully.
        </p>

        <Link href="/chat">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition duration-300">
            Go to Home
          </button>
        </Link>

        <p className="text-sm text-gray-500 mt-4">Order ID: #12345678</p>
      </div>
    </div>
  );
}
