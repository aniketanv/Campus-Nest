// client/src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CLOUD_NAME = "dhmojlcwp";

function getImageUrl(photoId) {
  if (!photoId) return "";
  if (photoId.startsWith("http")) return photoId; // already a full URL
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${photoId}.jpg`;
}

export default function Home() {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/pgs/featured");
        const data = await res.json();
        setPgs(data);
      } catch (err) {
        console.error("Failed to load PGs", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <main className="container py-6">
        <p>Loading PGs...</p>
      </main>
    );
  }

  return (
    <main className="container py-6 space-y-6">
      {/* Hero */}
      {pgs[0] && (
        <section className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
              Find your perfect PG near campus 🏠
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Curated PGs with real high-quality photos from our database.
            </p>
            <Link
              to="/search"
              className="inline-block px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            >
              Browse all PGs
            </Link>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-lg">
            <img
              src={getImageUrl(pgs[0].photos?.[0])}
              alt={pgs[0].name}
              className="w-full h-full object-cover max-h-[320px]"
            />
          </div>
        </section>
      )}

      {/* Featured cards */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Featured PGs</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pgs.map((pg) => {
            // 🔢 Compute "starting from" rent from rentOptions
            const minRent =
              pg?.rentOptions && pg.rentOptions.length
                ? Math.min(...pg.rentOptions.map((o) => o.price))
                : null;

            return (
              <Link
                key={pg._id}
                to={`/pg/${pg._id}`}
                className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition bg-white dark:bg-gray-900"
              >
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={getImageUrl(pg.photos?.[0])}
                    alt={pg.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 space-y-1">
                  <h3 className="font-semibold">{pg.name}</h3>
                  <p className="text-sm text-gray-500">
                    {pg.area}, {pg.city}
                  </p>
                  <p className="text-sm text-amber-500 font-medium">
                    ⭐ {pg.rating} {pg.gender ? `· ${pg.gender}` : ""}
                  </p>
                  {minRent !== null && (
                    <p className="text-sm font-semibold">
                      ₹{minRent.toLocaleString("en-IN")} / month
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
