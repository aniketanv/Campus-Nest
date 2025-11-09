import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import PgCard from "../components/PgCard.jsx";

const api = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Search() {
  const [sp] = useSearchParams();
  const area = useMemo(() => (sp.get("area") || "").trim(), [sp]);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErr("");
        // Build params only if area is provided
        const params = { sort: "rating_desc", limit: 24 };
        if (area) params.area = area;

        const r = await axios.get(`${api}/api/pgs`, { params });
        setItems(r.data || []);
      } catch (e) {
        setErr(e.response?.data?.error || "Failed to load results");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [area]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        {area ? `Results for “${area}”` : "All PGs"}
      </h1>

      {loading && <div>Loading…</div>}
      {err && <div className="text-red-600 dark:text-red-400">{err}</div>}

      {!loading && !err && items.length === 0 && (
        <div className="card">No PGs found.</div>
      )}

      {items.length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {items.map((it) => (
            <PgCard key={it._id} item={it} />
          ))}
        </div>
      )}
    </div>
  );
}
