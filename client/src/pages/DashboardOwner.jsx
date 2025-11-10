import React, { useEffect, useState } from "react";
import axios from "axios";
const api = import.meta.env.VITE_API_URL || "http://localhost:5000";
function getToken(){ return localStorage.getItem("token"); }

export default function DashboardOwner() {
  const [pg, setPg] = useState({
    name: "", area: "", address: "", city: "",
    rating: 4.2,
    facilities: { wifi: true, hotWater: true, timings: "6am-10pm" },
    rentOptions: [{ sharing: "single", price: 12000 }, { sharing: "double", price: 8000 }],
    photos: [],
    infoImage: "" // 👈 new
  });
  const [created, setCreated] = useState(null);
  const [myPgs, setMyPgs] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = { Authorization: `Bearer ${getToken()}` };

  const loadMine = async () => {
    try {
      setLoading(true);
      const r = await axios.get(`${api}/api/pgs/mine`, { headers });
      setMyPgs(r.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { loadMine(); }, []);

  // ---- Upload helpers ----
  const uploadSingle = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    const r = await axios.post(`${api}/api/upload/single`, fd, {
      headers: { ...headers, "Content-Type": "multipart/form-data" },
    });
    return r.data.url;
  };

  const uploadMulti = async (files) => {
    const fd = new FormData();
    Array.from(files).forEach(f => fd.append("files", f));
    const r = await axios.post(`${api}/api/upload/multi`, fd, {
      headers: { ...headers, "Content-Type": "multipart/form-data" },
    });
    return r.data.urls || [];
  };

  const onUploadGallery = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    try {
      const urls = await uploadMulti(files);
      setPg(p => ({ ...p, photos: [...p.photos, ...urls] }));
    } catch (err) {
      alert(err.response?.data?.error || err.message || "Upload failed");
    } finally {
      e.target.value = "";
    }
  };

  const onUploadInfo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadSingle(file);
      setPg(p => ({ ...p, infoImage: url }));
    } catch (err) {
      alert(err.response?.data?.error || err.message || "Upload failed");
    } finally {
      e.target.value = "";
    }
  };

  const submit = async () => {
    try {
      const r = await axios.post(`${api}/api/pgs`, pg, { headers });
      setCreated(r.data);
      await loadMine();
      alert("PG submitted!");
      // reset basic fields (keep gallery cleared)
      setPg({
        name: "", area: "", address: "", city: "",
        rating: 4.2,
        facilities: { wifi: true, hotWater: true, timings: "6am-10pm" },
        rentOptions: [{ sharing: "single", price: 12000 }, { sharing: "double", price: 8000 }],
        photos: [],
        infoImage: ""
      });
    } catch (e) {
      alert(e.response?.data?.error || "Failed to add PG (sign in as owner?)");
    }
  };

  return (
    <div className="space-y-6">
      {/* Add PG card */}
      <div className="card space-y-4">
        <h1 className="text-2xl font-bold">Add PG</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="input" placeholder="PG Name" value={pg.name} onChange={e => setPg({ ...pg, name: e.target.value })} />
          <input className="input" placeholder="Area" value={pg.area} onChange={e => setPg({ ...pg, area: e.target.value })} />
          <input className="input" placeholder="Address" value={pg.address} onChange={e => setPg({ ...pg, address: e.target.value })} />
          <input className="input" placeholder="City" value={pg.city} onChange={e => setPg({ ...pg, city: e.target.value })} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <input type="checkbox" checked={pg.facilities.wifi}
                   onChange={e => setPg({ ...pg, facilities: { ...pg.facilities, wifi: e.target.checked } })} />
            WiFi
          </label>
          <label className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <input type="checkbox" checked={pg.facilities.hotWater}
                   onChange={e => setPg({ ...pg, facilities: { ...pg.facilities, hotWater: e.target.checked } })} />
            Hot water
          </label>
          <input className="input" placeholder="Timings" value={pg.facilities.timings}
                 onChange={e => setPg({ ...pg, facilities: { ...pg.facilities, timings: e.target.value } })} />
        </div>

        {/* Rent options */}
        <div className="space-y-2">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Rent Options</h2>
          {pg.rentOptions.map((r, idx) => (
            <div key={idx} className="flex gap-2">
              <select
                value={r.sharing}
                onChange={e => { const x = [...pg.rentOptions]; x[idx].sharing = e.target.value; setPg({ ...pg, rentOptions: x }); }}
                className="border rounded-2xl px-2 py-1 bg-white text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600">
                <option value="single">single</option>
                <option value="double">double</option>
                <option value="triple">triple</option>
                <option value="quad">quad</option>
              </select>
              <input
                type="number"
                value={r.price}
                onChange={e => { const x = [...pg.rentOptions]; x[idx].price = Number(e.target.value); setPg({ ...pg, rentOptions: x }); }}
                className="border rounded-2xl px-2 py-1 bg-white text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600" />
            </div>
          ))}
          <button className="border px-3 py-1 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setPg({ ...pg, rentOptions: [...pg.rentOptions, { sharing: "single", price: 0 }] })}>
            Add option
          </button>
        </div>

        {/* Images */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block font-medium">Gallery images</label>
            <input type="file" multiple accept="image/*" onChange={onUploadGallery} className="block" />
            {pg.photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {pg.photos.map((u, i) => (
                  <img key={i} src={u} alt={`pg-${i}`} className="w-full h-24 object-cover rounded-lg" />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Info image (lunch timings / rules)</label>
            <input type="file" accept="image/*" onChange={onUploadInfo} className="block" />
            {pg.infoImage && (
              <img src={pg.infoImage} alt="info" className="w-full h-24 object-cover rounded-lg" />
            )}
          </div>
        </div>

        <button onClick={submit} className="btn bg-emerald-600 hover:bg-emerald-700">Submit PG</button>

        {created && (
          <pre className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl overflow-auto text-gray-900 dark:text-gray-100">
            {JSON.stringify(created, null, 2)}
          </pre>
        )}
      </div>

      {/* My PGs listing (unchanged) */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">My PGs</h2>
        {loading ? (
          <div>Loading...</div>
        ) : myPgs.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-300">You haven’t added any PGs yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myPgs.map(p => (
              <div key={p._id} className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{p.name}</div>
                  <span className="chip">⭐ {p.rating ?? "-"}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {p.area}, {p.city}
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {p?.facilities?.wifi && <span className="chip">WiFi</span>}
                  {p?.facilities?.hotWater && <span className="chip">Hot water</span>}
                  <span className="chip">Timings: {p?.facilities?.timings || "24x7"}</span>
                </div>
                {p.infoImage && <img src={p.infoImage} alt="info" className="mt-3 w-full h-24 object-cover rounded-lg" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
