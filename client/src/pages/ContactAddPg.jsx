import React, { useState } from "react";
import axios from "axios";

const api = import.meta.env.VITE_API_URL || "http://localhost:5000";

const OPTIONAL_SHARINGS = [
  { label: "2 Sharing", value: "double" },
  { label: "3 Sharing", value: "triple" },
  { label: "4 Sharing", value: "quad" },
];

export default function ContactAddPg() {
  const token = localStorage.getItem("token");

  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [rating] = useState(4.5);

  const [wifi, setWifi] = useState(true);
  const [hotWater, setHotWater] = useState(true);
  const [timings, setTimings] = useState("24x7");

  // Mandatory
  const [rentSingle, setRentSingle] = useState("");

  // Optional (2 / 3 / 4 sharing)
  const [extraRentOptions, setExtraRentOptions] = useState([]);

  const [files, setFiles] = useState([]);
  const [infoFile, setInfoFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const usedSharings = extraRentOptions.map(r => r.sharing);
  const availableSharings = OPTIONAL_SHARINGS.filter(
    opt => !usedSharings.includes(opt.value)
  );

  const handleSubmit = async () => {
    if (!token) {
      alert("Please sign in as Owner to add a PG.");
      return;
    }

    if (!rentSingle) {
      alert("Single sharing rent is required");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();

      fd.append("name", name);
      fd.append("area", area);
      fd.append("address", address);
      fd.append("city", city);
      fd.append("rating", rating);
      fd.append("timings", timings);
      fd.append("wifi", wifi);
      fd.append("hotWater", hotWater);

      const rentOptions = [
        { sharing: "single", price: Number(rentSingle) },
        ...extraRentOptions.filter(r => r.price > 0),
      ];

      fd.append("rentOptions", JSON.stringify(rentOptions));

      files.forEach(f => fd.append("photos", f));
      if (infoFile) fd.append("foodPhoto", infoFile);

      await axios.post(`${api}/api/pgs`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to add PG");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card p-6 text-center">
        <h2 className="text-2xl font-bold text-green-600">
          PG Added Successfully 🎉
        </h2>
        <p>Your PG listing is now live.</p>
      </div>
    );
  }

  return (
  <div className="max-w-3xl mx-auto card p-6 space-y-6">

    <h1 className="text-3xl font-bold text-center">Add New PG</h1>

    {/* ---------------- BASIC DETAILS ---------------- */}
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Basic Details</h2>

      {/* PG Name + Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">PG Name</label>
          <input
            className="input"
            placeholder="Eg: Green Stay PG"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Area</label>
          <input
            className="input"
            placeholder="Eg: BTM Layout"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </div>
      </div>

      {/* Address + City */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Address</label>
          <input
            className="input"
            placeholder="Full address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div>
          <label className="label">City</label>
          <input
            className="input"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
      </div>
    </div>

    {/* ---------------- RENT OPTIONS ---------------- */}
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Rent Options</h2>

      {/* Mandatory single */}
      <div>
        <label className="label">
          Single Sharing Rent <span className="text-red-500">*</span>
        </label>
        <input
          className="input"
          type="number"
          placeholder="Eg: 12000"
          value={rentSingle}
          onChange={(e) => setRentSingle(e.target.value)}
        />
      </div>

      {/* Optional sharings */}
      {extraRentOptions.map((r, idx) => (
        <div key={idx} className="flex gap-2 items-center">
          <input
            className="input bg-gray-100"
            value={
              r.sharing === "double"
                ? "2 Sharing"
                : r.sharing === "triple"
                ? "3 Sharing"
                : "4 Sharing"
            }
            disabled
          />

          <input
            className="input"
            type="number"
            placeholder="Rent"
            value={r.price}
            onChange={(e) => {
              const x = [...extraRentOptions];
              x[idx].price = Number(e.target.value);
              setExtraRentOptions(x);
            }}
          />

          <button
            type="button"
            onClick={() =>
              setExtraRentOptions(extraRentOptions.filter((_, i) => i !== idx))
            }
            className="text-red-600 font-bold"
          >
            ✕
          </button>
        </div>
      ))}

      {/* Add sharing dropdown */}
      {availableSharings.length > 0 && (
        <select
          className="input cursor-pointer"
          defaultValue=""
          onChange={(e) => {
            if (!e.target.value) return;
            setExtraRentOptions([
              ...extraRentOptions,
              { sharing: e.target.value, price: 0 },
            ]);
            e.target.value = "";
          }}
        >
          <option value="" disabled>
            + Add 2 / 3 / 4 Sharing
          </option>
          {availableSharings.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </div>

    {/* ---------------- AMENITIES ---------------- */}
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Amenities</h2>

      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={wifi}
            onChange={(e) => setWifi(e.target.checked)}
          />
          WiFi
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={hotWater}
            onChange={(e) => setHotWater(e.target.checked)}
          />
          Hot Water
        </label>
      </div>
    </div>

    {/* ---------------- TIMINGS ---------------- */}
    <div>
      <h2 className="text-lg font-semibold">Timings</h2>
      <label className="label">Entry / Exit / General Timings</label>
      <input
        className="input"
        placeholder="Eg: 24x7 or 6 AM – 10 PM"
        value={timings}
        onChange={(e) => setTimings(e.target.value)}
      />
    </div>

    {/* ---------------- PHOTOS ---------------- */}
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Photos</h2>

      <div>
        <label className="label">PG Photos (Gallery)</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />
      </div>

      <div>
        <label className="label">
          Food Timings / House Rules Photo (Optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setInfoFile(e.target.files[0])}
        />
      </div>
    </div>

    {/* ---------------- SUBMIT ---------------- */}
    <button
      type="button"
      onClick={handleSubmit}
      className="btn bg-emerald-600 hover:bg-emerald-700 w-full"
      disabled={loading}
    >
      {loading ? "Uploading..." : "Add PG"}
    </button>
  </div>
);

}
