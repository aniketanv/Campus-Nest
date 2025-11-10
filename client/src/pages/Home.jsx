import React, { useEffect, useState } from "react";
import PgCard from "../components/PgCard.jsx";
import axios from "axios";
const api = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  useEffect(() => { axios.get(`${api}/api/pgs/featured`).then(r => setFeatured(r.data)); }, []);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <div className="p-10 md:p-16">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Find your perfect PG — fast.</h1>
          <p className="mt-3 text-white/90 max-w-2xl">
            CampusNest helps students and working professionals discover highly-rated PGs with the facilities they care about.
          </p>
          <div className="mt-4 text-xs opacity-80">
            Use the search bar above — try: Koramangala, Basavanagudi, HSR, BTM, Whitefield
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Famous / Featured PGs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {featured.map(i => <PgCard key={i._id} item={i} />)}
        </div>
      </section>

      <section className="card">
        <h2 className="text-xl font-semibold mb-2">For PG Owners</h2>
        <p className="text-gray-700 dark:text-gray-200">
          Want to list your PG? Use the <b>Add PG</b> option or send us details via the form.
        </p>
      </section>
    </div>
  );
}
