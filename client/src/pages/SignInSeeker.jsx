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
      <input className="border rounded-2xl px-3 py-2 w-full" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" className="border rounded-2xl px-3 py-2 w-full" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={submit} className="btn w-full">Sign In</button>
      <p className="text-sm">No account? <Link className="text-blue-600" to="/signup">Sign up</Link></p>
    </div>
  );
}
