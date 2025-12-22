import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const api = import.meta.env.VITE_API_URL || "http://localhost:5000";
const CLOUD_NAME = "dhmojlcwp";

/* ---------- helpers ---------- */
function getImageUrl(photoId) {
  if (!photoId) return "";
  if (photoId.startsWith("http")) return photoId;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${photoId}.jpg`;
}

export default function Home() {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${api}/api/pgs/top`);
        const raw = await res.json();
        const list = Array.isArray(raw) ? raw : [];
        setPgs(list.slice(0, 6)); // top 6
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return <div className="py-10 text-center">Loading...</div>;

  const heroImage =
    pgs?.[0]?.photos?.[0] ? getImageUrl(pgs[0].photos[0]) : null;

  return (
    <div className="space-y-16">
      {/* ---------- HERO SECTION ---------- */}
      <section className="mt-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* LEFT: TEXT */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold">
              Welcome to{" "}
              <span className="text-emerald-600">CampusNest</span>
            </h1>

            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Discover comfortable and affordable PG accommodations
              for students and working professionals near you.
            </p>

            <Link
              to="/pgs"
              className="inline-block mt-4 btn bg-emerald-600 hover:bg-emerald-700"
            >
              Explore PGs
            </Link>
          </div>

          {/* RIGHT: IMAGE */}
          <div>
            {heroImage ? (
              <img
                src={heroImage}
                alt="Featured PG"
                className="w-full h-[320px] object-cover rounded-2xl shadow-lg"
              />
            ) : (
              <div className="h-[320px] rounded-2xl bg-gray-200 dark:bg-gray-800 grid place-items-center text-gray-500">
                No image available
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------- TOP PGs ---------- */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-center">
          Top PGs
        </h2>

        {pgs.length === 0 ? (
          <div className="text-center text-gray-500">
            No PGs available
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pgs.map((p) => (
              <Link
                key={p._id}
                to={`/pg/${p._id}`}
                className="card hover:shadow-lg transition"
              >
                {p.photos?.[0] && (
                  <img
                    src={getImageUrl(p.photos[0])}
                    alt={p.name}
                    className="h-40 w-full object-cover rounded mb-2"
                  />
                )}

                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-600">
                  {p.area}, {p.city}
                </p>

                <p className="mt-1 text-sm">
                  ⭐ {p.ratingCount === 0 ? "New" : p.rating.toFixed(1)}
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* ---------- VIEW ALL BUTTON ---------- */}
        <div className="pt-6 text-center">
          <Link
            to="/pgs"
            className="btn px-8 py-3 text-base bg-emerald-600 hover:bg-emerald-700"
          >
            View All PGs
          </Link>
        </div>
      </section>
    </div>
  );
}
