import React, { useState } from "react";
import axios from "axios";
const api = import.meta.env.VITE_API_URL || "http://localhost:5000";
function getToken(){ return localStorage.getItem("token"); }

export default function DashboardOwner() {
  const [pg, setPg] = useState({ name: "", area: "", address: "", city: "", rating: 4.2,
    facilities: { wifi: true, hotWater: true, timings: "6am-10pm" },
    rentOptions: [{ sharing: "single", price: 12000 }, { sharing: "double", price: 8000 }],
    photos: []
  });
  const [created, setCreated] = useState(null);

  const submit = async () => {
    try {
      const r = await axios.post(`${api}/api/pgs`, pg, { headers: { Authorization: `Bearer ${getToken()}` } });
      setCreated(r.data); alert("PG submitted!");
    } catch (e) { alert(e.response?.data?.error || "Failed to add PG (sign in as owner?)"); }
  };

  return (
    <div className="card space-y-4">
      <h1 className="text-2xl font-bold">Add PG</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="border rounded-2xl px-3 py-2" placeholder="PG Name" value={pg.name} onChange={e => setPg({ ...pg, name: e.target.value })} />
        <input className="border rounded-2xl px-3 py-2" placeholder="Area" value={pg.area} onChange={e => setPg({ ...pg, area: e.target.value })} />
        <input className="border rounded-2xl px-3 py-2" placeholder="Address" value={pg.address} onChange={e => setPg({ ...pg, address: e.target.value })} />
        <input className="border rounded-2xl px-3 py-2" placeholder="City" value={pg.city} onChange={e => setPg({ ...pg, city: e.target.value })} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="flex items-center gap-2"><input type="checkbox" checked={pg.facilities.wifi} onChange={e => setPg({ ...pg, facilities: { ...pg.facilities, wifi: e.target.checked } })}/> WiFi</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={pg.facilities.hotWater} onChange={e => setPg({ ...pg, facilities: { ...pg.facilities, hotWater: e.target.checked } })}/> Hot water</label>
        <input className="border rounded-2xl px-3 py-2" placeholder="Timings" value={pg.facilities.timings} onChange={e => setPg({ ...pg, facilities: { ...pg.facilities, timings: e.target.value } })} />
      </div>
      <div className="space-y-2">
        <h2 className="font-semibold">Rent Options</h2>
        {pg.rentOptions.map((r, idx) => (
          <div key={idx} className="flex gap-2">
            <select value={r.sharing} onChange={e => { const x = [...pg.rentOptions]; x[idx].sharing = e.target.value; setPg({ ...pg, rentOptions: x }); }} className="border rounded-2xl px-2 py-1">
              <option value="single">single</option><option value="double">double</option><option value="triple">triple</option><option value="quad">quad</option>
            </select>
            <input className="border rounded-2xl px-2 py-1" type="number" value={r.price} onChange={e => { const x = [...pg.rentOptions]; x[idx].price = Number(e.target.value); setPg({ ...pg, rentOptions: x }); }}/>
          </div>
        ))}
        <button className="border px-3 py-1 rounded-2xl" onClick={() => setPg({ ...pg, rentOptions: [...pg.rentOptions, { sharing: "single", price: 0 }] })}>Add option</button>
      </div>
      <button onClick={submit} className="btn bg-emerald-600 hover:bg-emerald-700">Submit PG</button>
      {created && <pre className="bg-gray-50 p-3 rounded-xl overflow-auto">{JSON.stringify(created, null, 2)}</pre>}
    </div>
  );
}
