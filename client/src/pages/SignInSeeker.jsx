import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const api = import.meta.env.VITE_API_URL || "http://localhost:5000";

const inputClass =
  "w-full rounded-2xl border px-4 py-3 " +
  "bg-gray-50 text-gray-800 placeholder-gray-500 border-gray-400 " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500 " +
  "dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-600";


export default function SignInSeeker() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      const r = await axios.post(`${api}/api/auth/login`, { email, password });

      // role check stays exactly as you have it
      if (r.data.user.role !== "seeker") {
        alert("Not a student/worker account");
        return;
      }

      localStorage.setItem("token", r.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...r.data.user, id: r.data.user.id })
      );

      nav("/dashboard/seeker");
    } catch (e) {
      alert(e.response?.data?.error || "Failed to sign in");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-md mx-auto card space-y-3"
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Student / Job Seeker Sign In
      </h1>

      <input
        className={inputClass}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        className={inputClass}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" className="btn w-full">
        Sign In
      </button>

      <p className="text-sm text-gray-700 dark:text-gray-300">
        No account?{" "}
        <Link className="text-blue-600 dark:text-blue-400" to="/signup">
          Sign up
        </Link>
      </p>
    </form>
  );
}
