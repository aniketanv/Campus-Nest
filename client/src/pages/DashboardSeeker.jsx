import React, { useEffect, useState } from "react";
import axios from "axios";

const api = import.meta.env.VITE_API_URL || "http://localhost:5000";
const CLOUD_NAME = "dhmojlcwp";

export default function DashboardSeeker() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⭐ rating state
  const [myRating, setMyRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);

  /* ---------- Remove booking ---------- */
  const handleRemove = async () => {
    const ok = window.confirm(
      "Are you sure you want to remove this PG booking? This action cannot be undone."
    );
    if (!ok) return;

    try {
      await axios.delete(`${api}/api/bookings/${booking._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooking(null);
    } catch (e) {
      alert(e.response?.data?.error || "Failed to remove PG");
    }
  };
useEffect(() => {
  if (booking?.pg?.ratings && user?.id) {
    const mine = booking.pg.ratings.find(
      (r) => r.user === user.id
    );
    if (mine) setMyRating(mine.value);
  }
}, [booking, user.id]);

  
  /* ---------- Fetch booking ---------- */
  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const r = await axios.get(`${api}/api/bookings/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooking(r.data[0] || null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  /* ---------- Submit rating ---------- */
  const submitRating = async () => {
  if (!myRating) return alert("Please select a rating");

  try {
    setRatingLoading(true);

    const res = await axios.post(
      `${api}/api/pgs/${booking.pg._id}/rate`,
      { rating: myRating },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert(
      res.data.updated
        ? "Your rating has been updated ⭐"
        : "Thanks for rating this PG ⭐"
    );
  } catch (e) {
    alert(e.response?.data?.error || "Failed to submit rating");
  } finally {
    setRatingLoading(false);
  }
};


  if (loading) return <div className="card">Loading your PG…</div>;

  if (!booking)
    return (
      <div className="card text-center">
        <h2 className="text-xl font-semibold">No active PG booking</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Book a PG to see details here.
        </p>
      </div>
    );

  const pg = booking.pg;

  const imageUrl = pg?.photos?.[0]
    ? `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_1000,h_500,c_fill/${pg.photos[0]}`
    : "/placeholder-pg.jpg";

  // 📅 Payment due calculation
  const startDate = new Date(booking.createdAt);
  const nextDueDate = new Date(startDate);
  nextDueDate.setMonth(nextDueDate.getMonth() + booking.months);

  const today = new Date();
  const diffDays = Math.ceil(
    (nextDueDate - today) / (1000 * 60 * 60 * 24)
  );
  const isDueSoon = diffDays <= 3;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My PG</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Welcome, {user.name}
        </p>
      </div>

      {/* PG Image */}
      <img
        src={imageUrl}
        alt={pg.name}
        className="w-full h-[320px] object-cover rounded-2xl"
      />

      {/* PG Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">{pg.name}</h2>
          <p>📍 {pg.area}</p>
          <p>🛏 Sharing: <b>{booking.sharing}</b></p>
          <p>💰 Monthly Rent: <b>₹{booking.amount}</b></p>
          <p>
            📄 Status:{" "}
            <span className="capitalize font-semibold">
              {booking.status}
            </span>
          </p>
        </div>

        {/* Payment info */}
        <div
  className={`rounded-2xl p-4 border transition ${
    isDueSoon
      ? "bg-red-50 border-red-300 text-red-800 dark:bg-red-900/40 dark:border-red-700 dark:text-red-100"
      : "bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
  }`}
>
  <h3 className="text-lg font-semibold mb-1">
    Next Payment
  </h3>

  <p>
    Due on: <b>{nextDueDate.toDateString()}</b>
  </p>

  <p className="text-sm mt-1">
    {diffDays <= 0
      ? "⚠️ Payment overdue"
      : isDueSoon
      ? `⚠️ Due in ${diffDays} day(s)`
      : `✅ Due in ${diffDays} days`}
  </p>
</div>

      </div>

      {/* ⭐ RATE PG */}
      <div className="rounded-2xl border p-5 bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-3">
          ⭐ Rate Your PG
        </h3>

        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              onClick={() => setMyRating(i)}
              className={`text-3xl ${
                i <= myRating ? "text-yellow-500" : "text-gray-400"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <button
  onClick={submitRating}
  disabled={ratingLoading}
  className="btn bg-emerald-600 hover:bg-emerald-700"
>
  {ratingLoading
    ? "Saving..."
    : myRating
    ? "Update Rating"
    : "Submit Rating"}
</button>

      </div>

      {/* ❌ Remove PG */}
      <div className="rounded-2xl border border-red-300 bg-red-50 p-5">
        <h3 className="text-lg font-semibold text-red-700">
          Danger Zone
        </h3>
        <p className="text-sm text-red-600 mt-1">
          Removing this PG will cancel your booking.
        </p>

        <button
          onClick={handleRemove}
          className="mt-4 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
        >
          Remove PG
        </button>
      </div>
    </div>
  );
}
