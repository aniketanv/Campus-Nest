// client/src/pages/Payment.jsx
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const api = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getToken() {
  return localStorage.getItem("token");
}

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI" },
  { id: "card", label: "Debit/Credit Card" },
  { id: "netbanking", label: "Net Banking" },
  { id: "wallet", label: "Wallet" },
];

export default function Payment() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const sharing = searchParams.get("sharing") || "double";

  const [pg, setPg] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [details, setDetails] = useState({
    upiId: "",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    bank: "",
    wallet: "",
  });

  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [booking, setBooking] = useState(null);

  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const r = await axios.get(`${api}/api/pgs/${id}`);
        setPg(r.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  useEffect(() => {
  setDetails({
    upiId: "",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    bank: "",
    wallet: "",
  });
}, [paymentMethod]);


  const price =
    pg?.rentOptions?.find((r) => r.sharing === sharing)?.price || 0;

  const handlePay = async () => {
  const token = getToken();
  if (!token) {
    alert("Please sign in as Student/Job to reserve.");
    nav("/signin/seeker");
    return;
  }

  // ✅ BASIC AMOUNT CHECK
  if (!price || price <= 0) {
    alert("Invalid payment amount");
    return;
  }

  // ✅ PAYMENT METHOD VALIDATION
  if (paymentMethod === "upi") {
    if (!details.upiId || !details.upiId.includes("@")) {
      alert("Please enter a valid UPI ID");
      return;
    }
  }

  if (paymentMethod === "card") {
    const cardNumber = details.cardNumber.replace(/\s/g, "");

    if (!/^\d{16}$/.test(cardNumber)) {
      alert("Card number must be 16 digits");
      return;
    }

    if (!details.cardName || details.cardName.trim().length < 3) {
      alert("Please enter name on card");
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(details.cardExpiry)) {
      alert("Expiry must be in MM/YY format");
      return;
    }

    if (!/^\d{3}$/.test(details.cardCvv)) {
      alert("CVV must be 3 digits");
      return;
    }
  }

  if (paymentMethod === "netbanking") {
    if (!details.bank) {
      alert("Please select a bank");
      return;
    }
  }

  if (paymentMethod === "wallet") {
    if (!details.wallet) {
      alert("Please select a wallet");
      return;
    }
  }

  try {
    setLoading(true);

    const r = await axios.post(
      `${api}/api/bookings`,
      {
        pgId: id,
        sharing,
        months: 1,
        amount: price,
        paymentMethod,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setBooking(r.data);
    setPaid(true);

    if (r.data?.receiptUrl) {
      window.open(`${api}${r.data.receiptUrl}`, "_blank");
    }
  } catch (e) {
    if (
      e.response?.data?.error?.includes("already have an active PG booking")
    ) {
      alert(e.response.data.error);
      nav("/dashboard/seeker");
      return;
    }

    alert(e.response?.data?.error || "Payment failed");
  }
 finally {
    setLoading(false);
  }
};


  const onChange = (field) => (e) => {
    setDetails((prev) => ({ ...prev, [field]: e.target.value }));
  };

  if (!pg) {
    return (
      <div className="card animate-pulse space-y-3">
        <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-52 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-32 rounded bg-gray-200 dark:bg-gray-800" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto card space-y-6">
      <div className="flex flex-col gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
        <h1 className="text-2xl font-semibold">Mock Payment</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          This is a <b>demo payment page</b>. No real money is charged.
        </p>
      </div>

      {/* Summary + method selector */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <h2 className="font-semibold text-lg">Order Summary</h2>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <div>
              <span className="font-medium">PG:</span> {pg.name}
            </div>
            <div>
              <span className="font-medium">Sharing:</span> {sharing}
            </div>
            <div>
              <span className="font-medium">Amount:</span>{" "}
              <span className="font-semibold">₹{price}</span>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h2 className="font-semibold text-lg mb-2">
            Select Payment Method
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPaymentMethod(m.id)}
                className={
                  "border rounded-md px-3 py-2 text-sm text-left transition " +
                  (paymentMethod === m.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800")
                }
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Details panel */}
      <div className="border rounded-xl p-4 space-y-3 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-base">
          {paymentMethod === "upi" && "Pay with UPI"}
          {paymentMethod === "card" && "Pay with Debit/Credit Card"}
          {paymentMethod === "netbanking" && "Pay with Net Banking"}
          {paymentMethod === "wallet" && "Pay with Wallet"}
        </h2>

        {paymentMethod === "upi" && (
          <div className="space-y-2 text-sm">
            <label className="block">
              UPI ID
              <input
                type="text"
                className="input mt-1 text-sm"
                placeholder="example@upi"
                value={details.upiId}
                onChange={onChange("upiId")}
              />
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Supported apps: Google Pay, PhonePe, Paytm, BHIM UPI (mock only).
            </p>
          </div>
        )}

        {paymentMethod === "card" && (
          <div className="space-y-2 text-sm">
            <label className="block">
              Card Number
              <input
                type="text"
                className="input mt-1 text-sm"
                placeholder="1111 2222 3333 4444"
                value={details.cardNumber}
                onChange={onChange("cardNumber")}
              />
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="flex-1 text-sm">
                Name on Card
                <input
                  type="text"
                  className="input mt-1 text-sm"
                  placeholder="Full Name"
                  value={details.cardName}
                  onChange={onChange("cardName")}
                />
              </label>
              <label className="w-full sm:w-24 text-sm">
                Expiry
                <input
                  type="text"
                  className="input mt-1 text-sm"
                  placeholder="MM/YY"
                  value={details.cardExpiry}
                  onChange={onChange("cardExpiry")}
                />
              </label>
              <label className="w-full sm:w-20 text-sm">
                CVV
                <input
                  type="password"
                  className="input mt-1 text-sm"
                  placeholder="***"
                  value={details.cardCvv}
                  onChange={onChange("cardCvv")}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              This is a mock form – data is not sent to any payment gateway.
            </p>
          </div>
        )}

        {paymentMethod === "netbanking" && (
          <div className="space-y-2 text-sm">
            <label className="block">
              Select Bank
              <select
                className="input mt-1 text-sm"
                value={details.bank}
                onChange={onChange("bank")}
              >
                <option value="">Choose Bank</option>
                <option value="sbi">SBI</option>
                <option value="hdfc">HDFC</option>
                <option value="icici">ICICI</option>
                <option value="axis">Axis</option>
                <option value="other">Other Bank</option>
              </select>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Normally you&apos;d be redirected to your bank login – here it&apos;s just a demo.
            </p>
          </div>
        )}

        {paymentMethod === "wallet" && (
          <div className="space-y-2 text-sm">
            <label className="block">
              Select Wallet
              <select
                className="input mt-1 text-sm"
                value={details.wallet}
                onChange={onChange("wallet")}
              >
                <option value="">Choose Wallet</option>
                <option value="paytm">Paytm Wallet</option>
                <option value="phonepe">PhonePe Wallet</option>
                <option value="amazon">Amazon Pay</option>
                <option value="other">Other Wallet</option>
              </select>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              In a real app, you would be redirected to the wallet app / OTP page.
            </p>
          </div>
        )}
      </div>

      {/* Pay or success */}
      {!paid ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Paying <span className="font-semibold">₹{price}</span> via{" "}
            <span className="font-semibold">
              {
                PAYMENT_METHODS.find((m) => m.id === paymentMethod)
                  ?.label
              }
            </span>
          </div>
          <button
          onClick={handlePay}
          className="btn"
          disabled={loading || !price || paid}
        >

            {loading ? "Processing..." : `Pay ₹${price}`}
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 dark:bg-green-900 dark:border-green-700 space-y-2">
          <h2 className="font-semibold text-green-700 dark:text-green-100">
            Payment Successful 🎉
          </h2>
          <p className="text-sm text-green-800 dark:text-green-100">
            This was a <b>mock payment</b>. Your booking has been created.
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Payment method:{" "}
            {
              PAYMENT_METHODS.find((m) => m.id === paymentMethod)
                ?.label
            }
          </p>
          {booking?.bookingId && (
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Booking ID: {booking.bookingId}
            </p>
          )}

          <div className="mt-2 flex gap-2 flex-wrap">
            {booking?.receiptUrl && (
              <a
                href={`${api}${booking.receiptUrl}`}
                target="_blank"
                rel="noreferrer"
                className="btn-outline text-sm"
              >
                View Receipt (PDF)
              </a>
            )}
            <button
              className="btn-secondary text-sm"
              onClick={() => nav("/dashboard/seeker")}
            >
              Go to My Bookings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
