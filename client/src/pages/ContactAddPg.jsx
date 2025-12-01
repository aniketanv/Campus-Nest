// client/src/pages/AddPG.jsx
import React, { useState } from "react";
import axios from "axios";

const api = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AddPG() {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [rating, setRating] = useState(4.5);

  const [wifi, setWifi] = useState(true);
  const [hotWater, setHotWater] = useState(true);
  const [timings, setTimings] = useState("24x7");

  const [rentSingle, setRentSingle] = useState("");
  const [rentDouble, setRentDouble] = useState("");

  // main gallery images
  const [files, setFiles] = useState([]);
  // lunch / rules image
  const [infoFile, setInfoFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please sign in as Owner to add a PG.");
      return;
    }

    setLoading(true);

    try {
      // 1) Upload main PG photos
      let photoUrls = [];
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((f) => formData.append("photos", f));

        const uploadRes = await axios.post(
          `${api}/api/upload/pg-photos`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        photoUrls = uploadRes.data.urls || [];
      }

      // 2) Upload lunch / rules / info image (single file, optional)
      let infoImageUrl = "";
      if (infoFile) {
        const infoForm = new FormData();
        infoForm.append("photos", infoFile);

        const uploadInfoRes = await axios.post(
          `${api}/api/upload/pg-photos`,
          infoForm,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        infoImageUrl = uploadInfoRes.data.urls?.[0] || "";
      }

      // 3) Create PG in MongoDB
      await axios.post(
        `${api}/api/pgs`,
        {
          name,
          area,
          address,
          city,
          rating,
          facilities: { wifi, hotWater, timings },
          rentOptions: [
            { sharing: "single", price: Number(rentSingle) },
            { sharing: "double", price: Number(rentDouble) },
          ],
          photos: photoUrls,
          infoImage: infoImageUrl, // 👈 lunch / rules image
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto card p-6 space-y-4"
    >
      <h1 className="text-3xl font-bold">Add New PG</h1>

      <input
        className="input"
        placeholder="PG Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="input"
        placeholder="Area (Eg: Koramangala)"
        value={area}
        onChange={(e) => setArea(e.target.value)}
      />

      <input
        className="input"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <input
        className="input"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <div className="flex gap-4">
        <input
          className="input"
          type="number"
          placeholder="Single Share Rent"
          value={rentSingle}
          onChange={(e) => setRentSingle(e.target.value)}
        />
        <input
          className="input"
          type="number"
          placeholder="Double Share Rent"
          value={rentDouble}
          onChange={(e) => setRentDouble(e.target.value)}
        />
      </div>

      <div className="flex gap-4">
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

      <input
        className="input"
        placeholder="Timings (Eg: 24x7)"
        value={timings}
        onChange={(e) => setTimings(e.target.value)}
      />

      {/* Main PG photos */}
      <div>
        <label className="font-medium block mb-1">PG Photos (gallery):</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFiles(Array.from(e.target.files))}
          className="input"
        />
      </div>

      {/* Lunch / rules / info image */}
      <div>
        <label className="font-medium block mb-1">
          House Rules / Meal Timings Image (optional):
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setInfoFile(e.target.files[0])}
          className="input"
        />
        <p className="text-xs text-gray-500 mt-1">
          You can upload a timetable / notice image showing lunch & dinner timings.
        </p>
      </div>

      <button
        type="submit"
        className="btn bg-emerald-600 hover:bg-emerald-700"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Add PG"}
      </button>
    </form>
  );
}
