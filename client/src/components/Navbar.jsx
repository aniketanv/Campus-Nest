import React from "react";
import ThemeToggle from "./ThemeToggle";
import SearchBar from "./SearchBar";
import { Link, useLocation, useNavigate } from "react-router-dom";


export default function Navbar() {
  const loc = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const showSearch = loc.pathname === "/" || loc.pathname === "/search";
    const navigate = useNavigate();

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  navigate("/");
};



  
  const navLink = (path) =>
    `nav-link ${loc.pathname === path ? "nav-link-active" : ""}`;

  return (
    <header className="navbar">
      <div className="container py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100"
        >
          CampusNest
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3 text-sm">
          <Link to="/" className={navLink("/")}>
            Home
          </Link>
          {(!user?.id || user.role === "seeker") && (
            <Link to="/pgs" className={navLink("/pgs")}>
              All PGs
            </Link>
          )}



          <Link to="/about" className={navLink("/about")}>
            About
          </Link>

          {user?.id && user.role === "owner" && (
            <Link to="/add-pg" className="btn">
              Add PG
            </Link>
          )}

          {!user?.id && (
            <>
              <Link to="/signin/seeker" className="btn">
                Sign in (Student)
              </Link>
              <Link
                to="/signin/owner"
                className="btn bg-emerald-600 hover:bg-emerald-700"
              >
                Sign in (Owner)
              </Link>
              <Link to="/signup" className="nav-btn hidden sm:inline-block">
                Sign up
              </Link>
            </>
          )}

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

              <button onClick={logout} className="nav-btn">
                Logout
              </button>
            </>
          )}

          {/* Theme toggle */}
          <ThemeToggle />
        </nav>
      </div>

      {/* SearchBar on Home & Search */}
      {showSearch && (
        <div className="container pb-3">
          <SearchBar />
        </div>
      )}
    </header>
  );
}
