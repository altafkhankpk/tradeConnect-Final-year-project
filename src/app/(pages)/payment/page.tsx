"use client";

import PaymentPage from "@/components/StripeComponents/checkout";

// import { GetServerSideProps } from 'next';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';
// Load your Stripe publishable key
// import CheckoutForm from '@/components/checkoutForm';
// const stripePromise = loadStripe('pk_test_51PgMY72L1r125aFrhm9JnuBv1fMRTsw1ic1AWha2fWPUXto9ftixZGrSfdNoca3boG7yofjOCPpZz7piskCqbPND00xtahD4Ny');

const payment = () => {
  return (
    // <Elements stripe={stripePromise}>
    //   {/* <CheckoutForm /> */}
    // </Elements>
    <PaymentPage/>
  );
};

export default payment;