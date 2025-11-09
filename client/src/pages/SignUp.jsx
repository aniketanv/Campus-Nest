import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const api = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "seeker", phone: "" });
  const nav = useNavigate();
  const submit = async () => {
    try {
      const r = await axios.post(`${api}/api/auth/signup`, form);
      localStorage.setItem("token", r.data.token);
      localStorage.setItem("user", JSON.stringify({ ...r.data.user, id: r.data.user.id }));
      nav(form.role === "owner" ? "/dashboard/owner" : "/dashboard/seeker");
    } catch (e) { alert(e.response?.data?.error || "Failed to sign up"); }
  };
  return (
    <div className="max-w-md mx-auto card space-y-3">
      <h1 className="text-2xl font-bold">Create your profile</h1>
      <input className="border rounded-2xl px-3 py-2 w-full" placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input className="border rounded-2xl px-3 py-2 w-full" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
      <input className="border rounded-2xl px-3 py-2 w-full" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" className="border rounded-2xl px-3 py-2 w-full" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      <div className="flex gap-4">
        <label className="flex items-center gap-2"><input type="radio" checked={form.role==="seeker"} onChange={()=>setForm({...form, role:"seeker"})}/> Student/Job</label>
        <label className="flex items-center gap-2"><input type="radio" checked={form.role==="owner"} onChange={()=>setForm({...form, role:"owner"})}/> PG Owner</label>
      </div>
      <button onClick={submit} className="btn w-full bg-emerald-600 hover:bg-emerald-700">Create Account</button>
    </div>
  );
}
