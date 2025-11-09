import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [area, setArea] = useState("");
  const nav = useNavigate();
  return (
    <div className="flex gap-2 w-full max-w-2xl">
      <input
  value={area}
  onChange={e => setArea(e.target.value)}
  className="input"
  placeholder="Search area (Koramangala, HSR, Andheri, Gachibowli...)"
/>


      <button onClick={() => nav(`/search?area=${encodeURIComponent(area)}`)} className="btn">Search</button>
    </div>
  );
}
