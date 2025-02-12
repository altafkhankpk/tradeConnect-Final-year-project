
"use client"
// import React  from 'react';
// import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm: React.FC = () => {
  // const stripe = useStripe();
  // const elements = useElements();
  // const [isProcessing, setIsProcessing] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  // const [success, setSuccess] = useState<boolean>(false);

  // const handleSubmit = async (event: React.FormEvent) => {
  // //   event.preventDefault();
  // //   setIsProcessing(true);

  // //   if (!stripe || !elements) {
  // //     return;
  // //   }

  // //   const cardElement = elements.getElement(CardElement);

  // //   const { error, paymentMethod } = await stripe.createPaymentMethod({
  // //     type: 'card',
  // //     card: cardElement!,
  // //   });

  // //   if (error) {
  // //     // setError(error.message);
  // //     setIsProcessing(false);
  // //   } else {
  // //     // Call your backend to create the payment intent
  // //     const response = await fetch(`http://167.71.81.153:8000/apis/payment/send/acct_1PzEme2M2z3uJ3W0`, {
  // //       method: 'POST',
  // //       headers: {
  // //         'Content-Type': 'application/json',
  // //       },
  // //       body: JSON.stringify({
  // //         amount: 5000, 
  // //         paymentMethodId: paymentMethod.id,
  // //       }),
  // //     });
  // //     console.log(response);
  // //     const { clientSecret } = await response.json();

  // //     const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);

  // //     if (confirmError) {
  // //       // setError(confirmError.message);
  // //       console.log(confirmError);
        
  // //     } else {
  // //       setSuccess(true);
  // //     }
  // //     setIsProcessing(false);
  // //   }
  // // };
  // }
  return (

    <>
    {/* // <form onSubmit={handleSubmit}> */}
      {/* <CardElement />
      <button type="submit" disabled={isProcessing || !stripe}>
        {isProcessing ? 'Processing...' : 'Pay'}
      </button>
      {error && <div>{error}</div>}
      {success && <div>Payment Successful!</div>}
    </form> */}
    </>
    
  );
};

export default CheckoutForm