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
import Payment from "./pages/Payment.jsx";
import AllPgs from "./pages/AllPgs.jsx";
import ProtectedRoute from "./components/ProtectedRoute";



export default function App() {
  return (
    <div className="
      min-h-screen
      bg-gray-100 text-gray-800
      dark:bg-gray-950 dark:text-gray-100
      transition-colors
    ">
      <Navbar />

      <div className="container py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
          <Route path="/pg/:id" element={<PgDetails />} />
          <Route
            path="/payment/:id"
            element={
              <ProtectedRoute role="seeker">
                <Payment />
              </ProtectedRoute>
            }
          />

          <Route path="/signin/owner" element={<SignInOwner />} />
          <Route path="/signin/seeker" element={<SignInSeeker />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard/owner"
            element={
              <ProtectedRoute role="owner">
                <DashboardOwner />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/seeker"
            element={
              <ProtectedRoute role="seeker">
                <DashboardSeeker />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-pg"
            element={
              <ProtectedRoute role="owner">
                <ContactAddPg />
              </ProtectedRoute>
            }
          />

          <Route path="/pgs" element={<AllPgs />} />
        </Routes>
      </div>
    </div>
  );
}
