import React from "react";
import { Link } from "react-router-dom";

export default function PgCard({ item }) {
  return (
    <div className="card flex flex-col gap-3">
      <div className="h-44 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
        {item.photos?.[0] ? (
          <img
            src={item.photos[0]}
            alt={item.name}
            className="object-cover w-full h-full"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // graceful fallback
              e.currentTarget.onerror = null;
              e.currentTarget.replaceWith(
                Object.assign(document.createElement("div"), {
                  className: "w-full h-full grid place-items-center text-sm text-gray-500 dark:text-gray-400",
                  innerText: "Image unavailable",
                })
              );
            }}
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-sm text-gray-500 dark:text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <div className="chip">⭐ {item.rating}</div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm">
        {item.area}, {item.city}
      </p>

      <div className="flex items-center gap-2 text-xs">
        {item?.facilities?.wifi && <span className="chip">WiFi</span>}
        {item?.facilities?.hotWater && <span className="chip">Hot water</span>}
        <span className="chip">Timings: {item?.facilities?.timings || "24x7"}</span>
      </div>

      <Link to={`/pg/${item._id}`} className="btn text-center">View details</Link>
    </div>
  );
}
