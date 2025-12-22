import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const api = import.meta.env.VITE_API_URL || "http://localhost:5000";

const inputClass =
  "w-full rounded-2xl border px-4 py-3 " +
  "bg-gray-50 text-gray-800 placeholder-gray-500 border-gray-400 " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500 " +
  "dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-600";


export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "seeker",
  });

  const nav = useNavigate();

const submit = async (e) => {
  e.preventDefault();

  // ✅ Frontend validation
  if (form.name.trim().length < 3) {
    alert("Name must be at least 3 characters");
    return;
  }

  if (!/^\d{10}$/.test(form.phone)) {
    alert("Phone number must be exactly 10 digits");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    alert("Please enter a valid email address");
    return;
  }

  if (form.password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  try {
    const r = await axios.post(`${api}/api/auth/signup`, form);

    localStorage.setItem("token", r.data.token);
    localStorage.setItem(
      "user",
      JSON.stringify({ ...r.data.user, id: r.data.user.id })
    );

    nav(form.role === "owner" ? "/dashboard/owner" : "/dashboard/seeker");
  } catch (e) {
    alert(e.response?.data?.error || "Failed to sign up");
  }
};


  return (
    <form
      onSubmit={submit}
      className="max-w-md mx-auto card space-y-3"
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Create your profile
      </h1>

      <input
        className={inputClass}
        placeholder="Full name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <input
        className={inputClass}
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        required
      />

      <input
        className={inputClass}
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />

      <input
        className={inputClass}
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />

      <div className="flex gap-4 text-gray-800 dark:text-gray-200">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={form.role === "seeker"}
            onChange={() => setForm({ ...form, role: "seeker" })}
          />
          Student / Job
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={form.role === "owner"}
            onChange={() => setForm({ ...form, role: "owner" })}
          />
          PG Owner
        </label>
      </div>

      <button
        type="submit"
        className="btn w-full bg-emerald-600 hover:bg-emerald-700"
      >
        Create Account
      </button>
    </form>
  );
}
