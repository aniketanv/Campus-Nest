import React from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const loc = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Show search on Home and Search routes
  const showSearch = loc.pathname === "/" || loc.pathname === "/search";

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-10 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-all duration-200">
      <div className="container py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100"
        >
          CampusNest
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4 text-sm text-gray-800 dark:text-gray-100">
          {/* 🏠 Home tab */}
          <Link to="/" className={linkCls(loc.pathname === "/")}>
            Home
          </Link>

          {/* About */}
          <Link to="/about" className={linkCls(loc.pathname === "/about")}>
            About
          </Link>

          {/* Show Add PG only for logged-in owners */}
          {user?.id && user.role === "owner" && (
            <Link to="/dashboard/owner" className={linkBtn()}>
              Add PG
            </Link>
          )}

          {/* Hide sign-in links if logged in */}
          {!user?.id && (
            <>
              <Link to="/signin/seeker" className="btn">
                Sign in (Student/Job)
              </Link>
              <Link
                to="/signin/owner"
                className="btn bg-emerald-600 hover:bg-emerald-700"
              >
                Sign in (Owner)
              </Link>
              <Link
                to="/signup"
                className="hidden sm:inline-block border px-4 py-2 rounded-2xl"
              >
                Sign up
              </Link>
            </>
          )}

          {/* Logged-in user options */}
          {user?.id && (
            <>
              {user.role === "owner" ? (
                <Link
                  to="/dashboard/owner"
                  className="btn bg-emerald-600 hover:bg-emerald-700"
                >
                  Owner Dashboard
                </Link>
              ) : (
                <Link to="/dashboard/seeker" className="btn">
                  My Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  location.href = "/";
                }}
                className="border px-4 py-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            </>
          )}

          {/* 🌗 Theme Toggle */}
          <ThemeToggle />
        </nav>
      </div>

      {/* 🔍 Persistent SearchBar on Home + Search routes */}
      {showSearch && (
        <div className="container pb-3">
          <SearchBar />
        </div>
      )}
    </header>
  );
}

/* --- Helper styles --- */
function linkCls(active) {
  return (
    "px-3 py-2 rounded-2xl transition-all " +
    (active
      ? "bg-gray-100 dark:bg-gray-800"
      : "hover:bg-gray-100 dark:hover:bg-gray-800")
  );
}

function linkBtn() {
  return "border px-3 py-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all";
}
