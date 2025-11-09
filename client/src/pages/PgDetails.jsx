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

  useEffect(() => { axios.get(`${api}/api/pgs/${id}`).then(r => setPg(r.data)); }, [id]);
  const price = pg?.rentOptions?.find(r => r.sharing === sharing)?.price || 0;

  const reserve = async () => {
    const token = getToken();
    if (!token) { alert("Please sign in as Student/Job to reserve."); nav("/signin/seeker"); return; }
    try {
      const r = await axios.post(`${api}/api/bookings`, { pgId: id, sharing, months: 1, amount: price }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.open(`${api}${r.data.receiptUrl}`, "_blank");
      alert("Reserved! Mock receipt opened.");
    } catch (e) {
      alert(e.response?.data?.error || "Failed to reserve");
    }
  };

  if (!pg) return <div>Loading...</div>;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card">
        <div className="h-72 rounded-xl overflow-hidden bg-gray-100">
          {pg.photos?.[0] && <img src={pg.photos[0]} alt={pg.name} className="object-cover w-full h-full"/>}
        </div>
      </div>
      <div className="card space-y-3">
        <h1 className="text-3xl font-bold">{pg.name}</h1>
        <p className="text-gray-600">{pg.address} — {pg.area}, {pg.city}</p>
        <div className="flex items-center gap-2 text-xs">
          {pg?.facilities?.wifi && <span className="chip">WiFi</span>}
          {pg?.facilities?.hotWater && <span className="chip">Hot water</span>}
          <span className="chip">Timings: {pg?.facilities?.timings || "24x7"}</span>
          <span className="chip">⭐ {pg.rating}</span>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Choose sharing</label>
          <select value={sharing} onChange={e => setSharing(e.target.value)} className="border rounded-2xl px-3 py-2">
            {pg?.rentOptions?.map(r => <option key={r.sharing} value={r.sharing}>{r.sharing} — ₹{r.price}</option>)}
          </select>
        </div>

        <button onClick={reserve} className="btn">Reserve & Get Receipt (Mock)</button>

        <div className="pt-2 text-sm text-gray-700">
          <p><b>Owner:</b> {pg?.owner?.name} — {pg?.owner?.phone || "NA"}</p>
        </div>
      </div>
    </div>
  );
}
