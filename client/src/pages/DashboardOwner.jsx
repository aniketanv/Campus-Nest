import React, { useEffect, useState } from "react";
import axios from "axios";

const api = import.meta.env.VITE_API_URL || "http://localhost:5000";
function getToken() {
  return localStorage.getItem("token");
}

export default function DashboardOwner() {
  // empty form template
  const emptyForm = {
    name: "",
    area: "",
    address: "",
    city: "",
    rating: 4.2,
    facilities: { wifi: true, hotWater: true, timings: "6am-10pm" },
    rentOptions: [{ sharing: "single", price: 0 }],
    photos: [],
  };

  const [pg, setPg] = useState(emptyForm);
  const [justAdded, setJustAdded] = useState(false);
  const [myPgs, setMyPgs] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = { Authorization: `Bearer ${getToken()}` };

  // Load PGs owned by the current user
  const loadMine = async () => {
    try {
      setLoading(true);
      const r = await axios.get(`${api}/api/pgs/mine`, { headers });
      setMyPgs(r.data || []);
    } catch (e) {
      console.error("Failed to fetch PGs:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMine();
  }, []);

  // Submit new PG
  const submit = async () => {
    try {
      await axios.post(`${api}/api/pgs`, pg, { headers });
      setPg(emptyForm); // reset form
      setJustAdded(true); // show success banner
      setTimeout(() => setJustAdded(false), 3000); // auto-hide after 3s
      await loadMine(); // refresh PG list
    } catch (e) {
      alert(e.response?.data?.error || "Failed to add PG (sign in as owner?)");
    }
  };

  return (
    <div className="space-y-6">
      {/* ✅ Success Banner */}
      {justAdded && (
        <div className="card border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200">
          ✅ PG added successfully!
        </div>
      )}

      {/* 🏠 Add PG Form */}
      <div className="card space-y-4">
        <h1 className="text-2xl font-bold">Add PG</h1>

        {/* --- Basic Info --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="input"
            placeholder="PG Name"
            value={pg.name}
            onChange={(e) => setPg({ ...pg, name: e.target.value })}
          />
          <input
            className="input"
            placeholder="Area"
            value={pg.area}
            onChange={(e) => setPg({ ...pg, area: e.target.value })}
          />
          <input
            className="input"
            placeholder="Address"
            value={pg.address}
            onChange={(e) => setPg({ ...pg, address: e.target.value })}
          />
          <input
            className="input"
            placeholder="City"
            value={pg.city}
            onChange={(e) => setPg({ ...pg, city: e.target.value })}
          />
        </div>

        {/* --- Facilities --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <input
              type="checkbox"
              checked={pg.facilities.wifi}
              onChange={(e) =>
                setPg({
                  ...pg,
                  facilities: { ...pg.facilities, wifi: e.target.checked },
                })
              }
            />
            WiFi
          </label>

          <label className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <input
              type="checkbox"
              checked={pg.facilities.hotWater}
              onChange={(e) =>
                setPg({
                  ...pg,
                  facilities: {
                    ...pg.facilities,
                    hotWater: e.target.checked,
                  },
                })
              }
            />
            Hot water
          </label>

          <input
            className="input"
            placeholder="Timings"
            value={pg.facilities.timings}
            onChange={(e) =>
              setPg({
                ...pg,
                facilities: { ...pg.facilities, timings: e.target.value },
              })
            }
          />
        </div>

        {/* --- Rent Options --- */}
        <div className="space-y-2">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">
            Rent Options
          </h2>
          {pg.rentOptions.map((r, idx) => (
            <div key={idx} className="flex gap-2">
              <select
                value={r.sharing}
                onChange={(e) => {
                  const x = [...pg.rentOptions];
                  x[idx].sharing = e.target.value;
                  setPg({ ...pg, rentOptions: x });
                }}
                className="border rounded-2xl px-2 py-1 bg-white text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
              >
                <option value="single">single</option>
                <option value="double">double</option>
                <option value="triple">triple</option>
                <option value="quad">quad</option>
              </select>
              <input
                type="number"
                value={r.price}
                onChange={(e) => {
                  const x = [...pg.rentOptions];
                  x[idx].price = Number(e.target.value);
                  setPg({ ...pg, rentOptions: x });
                }}
                className="border rounded-2xl px-2 py-1 bg-white text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
              />
            </div>
          ))}

          <button
            className="border px-3 py-1 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() =>
              setPg({
                ...pg,
                rentOptions: [
                  ...pg.rentOptions,
                  { sharing: "single", price: 0 },
                ],
              })
            }
          >
            Add option
          </button>
        </div>

        <button
          onClick={submit}
          className="btn bg-emerald-600 hover:bg-emerald-700"
        >
          Submit PG
        </button>
      </div>

      {/* 🏘️ My PGs List */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">My PGs</h2>
        {loading ? (
          <div>Loading...</div>
        ) : myPgs.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-300">
            You haven’t added any PGs yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myPgs.map((p) => (
              <div
                key={p._id}
                className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{p.name}</div>
                  <span className="chip">⭐ {p.rating ?? "-"}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {p.area}, {p.city}
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {p?.facilities?.wifi && <span className="chip">WiFi</span>}
                  {p?.facilities?.hotWater && (
                    <span className="chip">Hot water</span>
                  )}
                  <span className="chip">
                    Timings: {p?.facilities?.timings || "24x7"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
