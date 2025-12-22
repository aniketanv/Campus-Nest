// client/src/pages/PgDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const api = import.meta.env.VITE_API_URL || "http://localhost:5000";
const CLOUD_NAME = "dhmojlcwp";

/* ---------------- Utilities ---------------- */

function getImageUrl(photoId) {
  if (!photoId) return "";
  if (photoId.startsWith("http")) return photoId;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${photoId}.jpg`;
}

function getToken() {
  return localStorage.getItem("token");
}

function sharingLabel(s) {
  if (s === "single") return "1 Sharing";
  if (s === "double") return "2 Sharing";
  if (s === "triple") return "3 Sharing";
  if (s === "quad") return "4 Sharing";
  return s;
}

/* ---------------- Component ---------------- */

export default function PgDetails() {
  const { id } = useParams();
  const nav = useNavigate();

  const [pg, setPg] = useState(null);
  const [sharing, setSharing] = useState("");
  const [previewImg, setPreviewImg] = useState(null);

  /* ---------------- Fetch PG ---------------- */

  useEffect(() => {
    (async () => {
      try {
        const r = await axios.get(`${api}/api/pgs/${id}`);
        setPg(r.data);

        const defaultSharing =
          r.data?.rentOptions?.find((r) => r.sharing === "single")?.sharing ||
          r.data?.rentOptions?.[0]?.sharing;

        setSharing(defaultSharing || "");
      } catch (e) {
        console.error("Failed to load PG", e);
      }
    })();
  }, [id]);

  const price =
    pg?.rentOptions?.find((r) => r.sharing === sharing)?.price || 0;

  /* ---------------- Actions ---------------- */

  const reserve = () => {
    const token = getToken();
    if (!token) {
      alert("Please sign in to continue");
      nav("/signin/seeker");
      return;
    }
    nav(`/payment/${id}?sharing=${sharing}`);
  };

  /* ---------------- Loading ---------------- */

  if (!pg) {
    return (
      <div className="card animate-pulse space-y-3">
        <div className="h-72 rounded-xl bg-gray-200 dark:bg-gray-800" />
        <div className="h-6 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
      </div>
    );
  }

  /* ---------------- Render ---------------- */

  return (
    <>
      {/* ---------- Image Preview Modal ---------- */}
      {previewImg && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setPreviewImg(null)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImg(null)}
              className="absolute -top-4 -right-4 bg-white text-black rounded-full w-8 h-8 font-bold"
            >
              ✕
            </button>
            <img
              src={previewImg}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* ---------- LEFT: IMAGES ---------- */}
        <div className="space-y-4">
          <div className="card space-y-3">
            <div
              className="h-[320px] rounded-xl overflow-hidden cursor-pointer bg-gray-100"
              onClick={() =>
                pg.photos?.[0] &&
                setPreviewImg(getImageUrl(pg.photos[0]))
              }
            >
              {pg.photos?.[0] ? (
                <img
                  src={getImageUrl(pg.photos[0])}
                  alt={pg.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full grid place-items-center text-gray-500">
                  No image available
                </div>
              )}
            </div>

            {pg.photos?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {pg.photos.slice(1, 5).map((u, i) => (
                  <div
                    key={i}
                    className="h-[80px] rounded-lg overflow-hidden cursor-pointer bg-gray-100"
                    onClick={() => setPreviewImg(getImageUrl(u))}
                  >
                    <img
                      src={getImageUrl(u)}
                      alt={`${pg.name}-${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          

          {/* Rules / Food Timings */}
          {pg.foodTimingsPhoto && (
            <div className="card">
              <h3 className="font-semibold mb-2">
                House Rules / Meal Timings
              </h3>
              <div
                className="h-[220px] rounded-xl overflow-hidden cursor-pointer bg-gray-100"
                onClick={() =>
                  setPreviewImg(getImageUrl(pg.foodTimingsPhoto))
                }
              >
                <img
                  src={getImageUrl(pg.foodTimingsPhoto)}
                  alt="Rules"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* ---------- RIGHT: DETAILS ---------- */}
        <div className="card space-y-4">
          <div>
            <h1 className="text-2xl font-semibold">{pg.name}</h1>
            <p className="text-sm text-gray-600">
              {pg.area}, {pg.city}
            </p>
            <p className="text-sm text-gray-500">{pg.address}</p>
          </div>

          {/* ---------- Rating (Read-only) ---------- */}
{typeof pg.rating === "number" && (
 <div className="flex items-center gap-2 text-sm">
  <div className="flex">
    {[1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        className={
          i <= Math.round(pg.rating)
            ? "text-yellow-500"
            : "text-gray-300"
        }
      >
        ⭐
      </span>
    ))}
  </div>

  <span className="text-gray-600">
    {pg.ratingCount === 0
      ? "New"
      : `${pg.rating.toFixed(1)} / 5 · ${pg.ratingCount} ratings`}
  </span>
</div>

)}


          <div>
            <h2 className="font-semibold">Facilities</h2>
            <div className="flex flex-wrap gap-2 text-sm mt-1">
              {pg?.facilities?.wifi && <span className="chip">WiFi</span>}
              {pg?.facilities?.hotWater && (
                <span className="chip">Hot Water</span>
              )}
              {pg?.facilities?.timings && (
                <span className="chip">
                  Timings: {pg.facilities.timings}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Choose Sharing
            </label>
            <select
              value={sharing}
              onChange={(e) => setSharing(e.target.value)}
              className="input"
            >
              {pg?.rentOptions?.map((r) => (
                <option key={r.sharing} value={r.sharing}>
                  {sharingLabel(r.sharing)} — ₹{r.price}
                </option>
              ))}
            </select>

            <div className="text-lg font-semibold">
              Rent: ₹{price} / month
            </div>

            <button
              onClick={reserve}
              className="btn"
              disabled={price <= 0}
            >
              Reserve &amp; Pay (Mock)
            </button>
          </div>

          <div className="text-sm pt-2">
            <b>Owner:</b> {pg?.owner?.name || "Owner"} —{" "}
            {pg?.owner?.phone || "NA"}
          </div>
        </div>
      </div>
    </>
  );
}
