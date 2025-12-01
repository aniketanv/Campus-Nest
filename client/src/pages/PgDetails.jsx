// client/src/pages/PgDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const api = import.meta.env.VITE_API_URL || "http://localhost:5000";
const CLOUD_NAME = "dhmojlcwp";

// 🔥 Convert Cloudinary public ID → full URL
function getImageUrl(photoId) {
  if (!photoId) return "";
  if (photoId.startsWith("http")) return photoId; // already full URL
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${photoId}.jpg`;
}

function getToken() {
  return localStorage.getItem("token");
}

export default function PgDetails() {
  const { id } = useParams();
  const [pg, setPg] = useState(null);
  const [sharing, setSharing] = useState("double");
  const nav = useNavigate();

  // Fetch PG
  useEffect(() => {
    (async () => {
      try {
        const r = await axios.get(`${api}/api/pgs/${id}`);
        setPg(r.data);
        if (r.data?.rentOptions?.[0]?.sharing) {
          setSharing(r.data.rentOptions[0].sharing);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  const price =
    pg?.rentOptions?.find((r) => r.sharing === sharing)?.price || 0;

  // Reserve → navigate to payment page
  const reserve = () => {
    const token = getToken();
    if (!token) {
      alert("Please sign in as Student/Job to reserve.");
      nav("/signin/seeker");
      return;
    }
    nav(`/payment/${id}?sharing=${sharing}`);
  };

  // Loading skeleton
  if (!pg) {
    return (
      <div className="card animate-pulse space-y-3">
        <div className="h-56 rounded-xl bg-gray-200 dark:bg-gray-800" />
        <div className="h-6 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* ------------------------------ */}
      {/* LEFT SIDE: IMAGES */}
      {/* ------------------------------ */}
      <div className="card space-y-3">
        {/* Main Image */}
        <div className="h-72 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
          {pg.photos?.[0] ? (
            <img
              src={getImageUrl(pg.photos[0])}
              alt={pg.name}
              className="object-cover w-full h-full"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-sm text-gray-600 dark:text-gray-300">
              No image available
            </div>
          )}
        </div>

        {/* Additional thumbnails */}
        {pg.photos?.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {pg.photos.slice(1, 5).map((u, i) => (
              <img
                key={i}
                src={getImageUrl(u)}
                alt={`${pg.name}-${i}`}
                className="h-20 w-full object-cover rounded-md"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.visibility = "hidden";
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ------------------------------ */}
      {/* RIGHT SIDE: DETAILS */}
      {/* ------------------------------ */}
      <div className="card space-y-4">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-semibold">{pg.name}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {pg.area}, {pg.city}
          </p>
        </div>

        {/* Rating */}
        {pg.rating && (
          <div className="inline-flex items-center gap-1 text-sm px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 w-max">
            ⭐ {pg.rating} / 5
          </div>
        )}

        {/* Description */}
        {pg.description && (
          <p className="text-sm text-gray-700 dark:text-gray-200">
            {pg.description}
          </p>
        )}

        {/* Facilities */}
        <div className="space-y-1 text-sm text-gray-700 dark:text-gray-200">
          <h2 className="font-semibold">Facilities</h2>
          <div className="flex flex-wrap gap-2">
            {pg?.facilities?.wifi && <span className="chip">WiFi</span>}
            {pg?.facilities?.hotWater && (
              <span className="chip">Hot water</span>
            )}
            {pg?.facilities?.timings && (
              <span className="chip">
                Timings: {pg.facilities.timings || "24x7"}
              </span>
            )}
          </div>
        </div>

        {/* Sharing options + Price */}
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
              Choose sharing
            </label>
            <select
              value={sharing}
              onChange={(e) => setSharing(e.target.value)}
              className="border rounded-2xl px-3 py-2
                         bg-white text-gray-900 border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
            >
              {pg?.rentOptions?.map((r) => (
                <option key={r.sharing} value={r.sharing}>
                  {r.sharing} — ₹{r.price}
                </option>
              ))}
            </select>
          </div>

          <div className="text-lg font-semibold">
            Rent: ₹{price} / month
          </div>

          <button onClick={reserve} className="btn">
            Reserve &amp; Pay (Mock)
          </button>

          {/* Owner info */}
          <div className="pt-2 text-sm text-gray-700 dark:text-gray-200">
            <p>
              <b>Owner:</b> {pg?.owner?.name || "Owner"} —{" "}
              {pg?.owner?.phone || "NA"}
            </p>
          </div>

          {/* Info / Rules / Meal Timings image */}
          {pg.infoImage && (
            <div className="pt-2">
              <h3 className="font-semibold mb-2">
                House Rules / Meal Timings
              </h3>
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <img
                  src={pg.infoImage}
                  alt="Info"
                  className="w-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
