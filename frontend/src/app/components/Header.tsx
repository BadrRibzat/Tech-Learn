"use client";
import { useState, useEffect } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <header className="bg-dracula-comment p-4 shadow-md">
      <nav className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Tech-Learn</h1>
        <ul className="flex space-x-4">
          <li><a href="/" className="hover:text-dracula-purple">Home</a></li>
          <li><a href="/about" className="hover:text-dracula-purple">About</a></li>
          <li><a href="/contact" className="hover:text-dracula-purple">Contact</a></li>
          <li><a href="/payments" className="hover:text-dracula-purple">Payments</a></li>
          <li><a href="/terminal" className="hover:text-dracula-purple">Terminal</a></li>
          {!isLoggedIn ? (
            <>
              <li><a href="/signup" className="hover:text-dracula-purple">Sign Up</a></li>
              <li><a href="/login" className="hover:text-dracula-purple">Login</a></li>
            </>
          ) : (
            <li>
              <button onClick={handleLogout} className="hover:text-dracula-purple">
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
