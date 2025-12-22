import React, { useEffect, useState } from "react";
import axios from "axios";

const api = import.meta.env.VITE_API_URL || "http://localhost:5000";
const CLOUD_NAME = "dhmojlcwp"; // 🔴 CHANGE THIS

function getToken() {
  return localStorage.getItem("token");
}

// 🔹 Convert Cloudinary public_id → usable image URL
function cloudinaryUrl(publicId) {
  if (!publicId) return null;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${publicId}.jpg`;
}

export default function DashboardOwner() {
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [myPgs, setMyPgs] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = { Authorization: `Bearer ${getToken()}` };

  const loadMine = async () => {
    try {
      setLoading(true);
      const r = await axios.get(`${api}/api/pgs/mine`, { headers });
      setMyPgs(r.data || []);
    } catch (e) {
      console.error("Failed to load PGs", e);
    } finally {
      setLoading(false);
    }
  };

  const deletePg = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await axios.delete(`${api}/api/pgs/${deleteId}`, { headers });
      setDeleteId(null);
      await loadMine();
    } catch (e) {
      alert(e.response?.data?.error || "Failed to delete PG");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    loadMine();
  }, []);

  return (
    <div className="space-y-6">
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
                {/* 🔹 PG Cover Image */}
                {p.photos?.length > 0 && (
                  <img
                    src={cloudinaryUrl(p.photos[0])}
                    alt={p.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}

                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold">{p.name}</div>
                  <span className="chip">⭐ {p.rating ?? "-"}</span>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {p.area}, {p.city}
                </div>

                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {p?.facilities?.wifi && <span className="chip">WiFi</span>}
                  {p?.facilities?.hotWater && (
                    <span className="chip">Hot Water</span>
                  )}
                  <span className="chip">
                    Timings: {p?.facilities?.timings || "24x7"}
                  </span>
                </div>

                {/* 🔹 Food / Rules Image */}
                {p.foodTimingsPhoto && (
                  <img
                    src={cloudinaryUrl(p.foodTimingsPhoto)}
                    alt="Food Timings"
                    className="mt-3 w-full h-24 object-cover rounded-lg"
                  />
                )}

                <button
                  onClick={() => setDeleteId(p._id)}
                  className="mt-3 w-full text-sm bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                >
                  Remove PG
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔴 Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-2">Remove PG?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg border"
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                onClick={deletePg}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                disabled={deleting}
              >
                {deleting ? "Removing..." : "Yes, Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
