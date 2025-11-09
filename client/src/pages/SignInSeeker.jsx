import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
const api = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SignInSeeker() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = async () => {
    try {
      const r = await axios.post(`${api}/api/auth/login`, { email, password });
      if (r.data.user.role !== "seeker") { alert("Not a student/worker account"); return; }
      localStorage.setItem("token", r.data.token);
      localStorage.setItem("user", JSON.stringify({ ...r.data.user, id: r.data.user.id }));
      nav("/dashboard/seeker");
    } catch (e) { alert(e.response?.data?.error || "Failed to sign in"); }
  };

  return (
    <div className="max-w-md mx-auto card space-y-3">
      <h1 className="text-2xl font-bold">Student/Job Seeker Sign In</h1>

      <input
        className="w-full rounded-2xl border px-4 py-3
                   bg-white text-gray-900 placeholder-gray-500 border-gray-300
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-600"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        className="w-full rounded-2xl border px-4 py-3
                   bg-white text-gray-900 placeholder-gray-500 border-gray-300
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-600"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={submit} className="btn w-full">Sign In</button>

      <p className="text-sm">
        No account?{" "}
        <Link className="text-blue-600 dark:text-blue-400" to="/signup">Sign up</Link>
      </p>
    </div>
  );
}
