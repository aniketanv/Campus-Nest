import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const api = import.meta.env.VITE_API_URL || "http://localhost:5000";
const CLOUD_NAME = "dhmojlcwp";

const img = (id) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${id}.jpg`;

export default function AllPgs() {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${api}/api/pgs`).then((res) => {
      setPgs(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (pgs.length === 0)
    return <div className="text-center py-10">No PGs available</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">All PGs</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pgs.map((p) => (
          <Link key={p._id} to={`/pg/${p._id}`} className="card">
            {p.photos?.[0] && (
              <img
                src={img(p.photos[0])}
                className="h-40 w-full object-cover rounded mb-2"
              />
            )}

            <h2 className="font-semibold">{p.name}</h2>
            <p className="text-sm text-gray-600">
              {p.area}, {p.city}
            </p>

            <p className="mt-1">
              ⭐ {p.ratingCount === 0 ? "New" : p.rating.toFixed(1)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
