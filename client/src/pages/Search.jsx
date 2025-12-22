import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import PgCard from "../components/PgCard.jsx";

const api = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Search() {
  const [sp, setSp] = useSearchParams();

  // 1. Get initial values from URL (handles "All PGs" vs "Specific Area")
  const area = useMemo(() => (sp.get("area") || "").trim(), [sp]);
  
  // States for dynamic filters
  const [minRating, setMinRating] = useState(sp.get("minRating") || "");
  const [sharing, setSharing] = useState(sp.get("sharing") || "");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // 2. Helper to sync UI changes with the URL search parameters
  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(sp);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSp(newParams);
  };

  // 3. Effect to fetch data whenever area, rating, or sharing changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setErr("");
        
        const params = {
          area,
          minRating,
          sharing,
          sort: "rating_desc",
          limit: 24,
        };

        const r = await axios.get(`${api}/api/pgs`, { params });
        setItems(r.data || []);
      } catch (e) {
        setErr(e.response?.data?.error || "Failed to load PGs");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [area, minRating, sharing]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* HEADER & FILTER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {area ? `PGs in "${area}"` : "All Available PGs"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? "Searching..." : `${items.length} properties found`}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* RATING FILTER */}
          <select
            className="select border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            value={minRating}
            onChange={(e) => {
              setMinRating(e.target.value);
              updateFilters("minRating", e.target.value);
            }}
          >
            <option value="">Any Rating</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="4">4.0+ Stars</option>
            <option value="3">3.0+ Stars</option>
          </select>

          {/* SHARING FILTER - Matches your DB keys exactly */}
          <select
            className="select border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            value={sharing}
            onChange={(e) => {
              setSharing(e.target.value);
              updateFilters("sharing", e.target.value);
            }}
          >
            <option value="">Any Sharing</option>
            <option value="single">Single Sharing</option>
            <option value="double">Double Sharing</option>
            <option value="triple">Triple Sharing</option>
            <option value="quad">Quad Sharing</option>
          </select>
          
          {/* RESET BUTTON (Optional) */}
          {(minRating || sharing) && (
            <button 
              onClick={() => {
                setMinRating("");
                setSharing("");
                setSp(area ? { area } : {});
              }}
              className="text-sm text-red-500 hover:underline px-2"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {err && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
          {err}
        </div>
      )}

      {/* RESULTS GRID */}
      {loading ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-72 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : (
        <>
          {items.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((it) => (
                <PgCard key={it._id} item={it} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No PGs match your current search or filters.
              </p>
              <button 
                onClick={() => setSp({})}
                className="mt-4 text-emerald-600 font-medium hover:underline"
              >
                View all properties
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}