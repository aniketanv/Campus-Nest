import React, { useState } from "react";
import axios from "axios";
const api = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ContactAddPg() {
  const [f, setF] = useState({ name: "", phone: "", email: "", pgName: "", message: "" });
  const [done, setDone] = useState(false);

  const submit = async () => {
    try {
      await axios.post(`${api}/api/contact`, f);
      setDone(true);
    } catch (e) {
      alert(e.response?.data?.error || "Failed to submit");
    }
  };

  if (done) return <div className="card">Thanks! We received your details and will reach out soon.</div>;

  return (
    <div className="max-w-lg mx-auto card space-y-3">
      <h1 className="text-2xl font-bold">Add Your PG — Contact Us</h1>
      <input className="border rounded-2xl px-3 py-2 w-full" placeholder="Your name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
      <input className="border rounded-2xl px-3 py-2 w-full" placeholder="Phone" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} />
      <input className="border rounded-2xl px-3 py-2 w-full" placeholder="Email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
      <input className="border rounded-2xl px-3 py-2 w-full" placeholder="PG name" value={f.pgName} onChange={e => setF({ ...f, pgName: e.target.value })} />
      <textarea className="border rounded-2xl px-3 py-2 w-full" rows="4" placeholder="Message" value={f.message} onChange={e => setF({ ...f, message: e.target.value })} />
      <button onClick={submit} className="btn">Send</button>
    </div>
  );
}
