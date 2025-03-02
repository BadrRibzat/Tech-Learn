"use client";
import { useState, useEffect } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await fetch("http://127.0.0.1:8000/user/sign-out/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
      });
      localStorage.removeItem("token");
      setIsLoggedIn(false);
    }
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
          {!isLoggedIn ? (
            <>
              <li><a href="/sign-up" className="hover:text-dracula-purple">Sign Up</a></li>
              <li><a href="/sign-in" className="hover:text-dracula-purple">Sign In</a></li>
            </>
          ) : (
            <>
              <li><a href="/dashboard" className="hover:text-dracula-purple">Dashboard</a></li>
              <li>
                <button onClick={handleLogout} className="hover:text-dracula-purple">
                  Sign Out
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
