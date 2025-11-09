import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Search from "./pages/Search.jsx";
import PgDetails from "./pages/PgDetails.jsx";
import SignInOwner from "./pages/SignInOwner.jsx";
import SignInSeeker from "./pages/SignInSeeker.jsx";
import SignUp from "./pages/SignUp.jsx";
import DashboardOwner from "./pages/DashboardOwner.jsx";
import DashboardSeeker from "./pages/DashboardSeeker.jsx";
import ContactAddPg from "./pages/ContactAddPg.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors">
      <Navbar />
      <div className="container py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
          <Route path="/pg/:id" element={<PgDetails />} />
          <Route path="/signin/owner" element={<SignInOwner />} />
          <Route path="/signin/seeker" element={<SignInSeeker />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard/owner" element={<DashboardOwner />} />
          <Route path="/dashboard/seeker" element={<DashboardSeeker />} />
          <Route path="/add-pg" element={<ContactAddPg />} />
        </Routes>
      </div>
    </div>
  );
}
