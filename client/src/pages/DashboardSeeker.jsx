import React from "react";
export default function DashboardSeeker() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <div className="card">
      <h1 className="text-2xl font-bold">Welcome, {user.name || "Seeker"}</h1>
      <p className="text-gray-700 mt-1">Search from the home page, open a listing, choose sharing, and reserve to get a mock receipt instantly.</p>
    </div>
  );
}
