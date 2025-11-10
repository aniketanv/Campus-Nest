import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
const api = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getToken(){ return localStorage.getItem("token"); }

export default function PgDetails() {
  const { id } = useParams();
  const [pg, setPg] = useState(null);
  const [sharing, setSharing] = useState("double");
  const nav = useNavigate();

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

  const price = pg?.rentOptions?.find(r => r.sharing === sharing)?.price || 0;

  const reserve = async () => {
    const token = getToken();
    if (!token) { alert("Please sign in as Student/Job to reserve."); nav("/signin/seeker"); return; }
    try {
      const r = await axios.post(`${api}/api/bookings`,
        { pgId: id, sharing, months: 1, amount: price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.open(`${api}${r.data.receiptUrl}`, "_blank");
      alert("Reserved! Mock receipt opened.");
    } catch (e) {
      alert(e.response?.data?.error || "Failed to reserve");
    }
  };

  if (!pg) {
    return (
      <div className="card animate-pulse space-y-3">
        <div className="h-56 rounded-xl bg-gray-200 dark:bg-gray-800" />
        <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Media (hero + thumbnails) */}
      <div className="card space-y-3">
        <div className="h-72 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
          {pg.photos?.[0] ? (
            <img
              src={pg.photos[0]}
              alt={pg.name}
              className="object-cover w-full h-full"
              referrerPolicy="no-referrer"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-sm text-gray-600 dark:text-gray-300">
              No image available
            </div>
          )}
        </div>

        {pg.photos?.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {pg.photos.slice(1, 5).map((u, i) => (
              <img
                key={i}
                src={u}
                alt={`${pg.name}-${i}`}
                className="h-20 w-full object-cover rounded-md"
                referrerPolicy="no-referrer"
                onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="card space-y-3">
        <h1 className="text-3xl font-bold">{pg.name}</h1>

        <p className="text-gray-600 dark:text-gray-300">
          {pg.address} — {pg.area}, {pg.city}
        </p>

        <div className="flex items-center gap-2 text-xs">
          {pg?.facilities?.wifi && <span className="chip">WiFi</span>}
          {pg?.facilities?.hotWater && <span className="chip">Hot water</span>}
          <span className="chip">Timings: {pg?.facilities?.timings || "24x7"}</span>
          <span className="chip">⭐ {pg.rating}</span>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
            Choose sharing
          </label>
          <select
            value={sharing}
            onChange={e => setSharing(e.target.value)}
            className="border rounded-2xl px-3 py-2
                       bg-white text-gray-900 border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
          >
            {pg?.rentOptions?.map(r => (
              <option key={r.sharing} value={r.sharing}>
                {r.sharing} — ₹{r.price}
              </option>
            ))}
          </select>
        </div>

        <button onClick={reserve} className="btn">Reserve & Get Receipt (Mock)</button>

        <div className="pt-2 text-sm text-gray-700 dark:text-gray-200">
          <p><b>Owner:</b> {pg?.owner?.name || "Owner"} — {pg?.owner?.phone || "NA"}</p>
        </div>

        {/* Info / Lunch timings / Rules image */}
        {pg.infoImage && (
          <div className="pt-2">
            <h3 className="font-semibold mb-2">House Rules / Meal Timings</h3>
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <img
                src={pg.infoImage}
                alt="Info"
                className="w-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
