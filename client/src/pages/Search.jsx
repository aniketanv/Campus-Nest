import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import PgCard from "../components/PgCard.jsx";
const api = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Search() {
  const [params] = useSearchParams();
  const area = params.get("area") || "";
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (!area) return;
    axios.get(`${api}/api/pgs/search?area=${encodeURIComponent(area)}`).then(r => setItems(r.data));
  }, [area]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Results for "{area}"</h1>
      {items.length === 0 && <div className="card">No PGs found for that area. Try HSR, Koramangala, Andheri, Gachibowli.</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {items.map(item => <PgCard key={item._id} item={item} />)}
      </div>
    </div>
  );
}
