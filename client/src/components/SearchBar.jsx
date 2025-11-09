import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [area, setArea] = useState("");
  const nav = useNavigate();

 // client/src/components/SearchBar.jsx
const handleSearch = () => {
  const q = area.trim();
  if (!q) { nav("/search"); return; }       // no area => show all
  nav(`/search?area=${encodeURIComponent(q)}`);
};


  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex gap-2 w-full max-w-2xl">
      <input
        value={area}
        onChange={(e) => setArea(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border rounded-2xl px-4 py-3 w-full 
                   bg-white dark:bg-gray-800 
                   text-gray-900 dark:text-gray-100 
                   placeholder-gray-500 dark:placeholder-gray-400 
                   border-gray-400 dark:border-gray-600 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search area (Koramangala, HSR, BTM...)"
      />
      <button
        onClick={handleSearch}
        className="btn bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        Search
      </button>
    </div>
  );
}
