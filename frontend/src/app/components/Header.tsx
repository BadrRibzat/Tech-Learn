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
    <header className="bg-tech-primary p-4 shadow-md">
      <nav className="max-w-4xl mx-auto flex justify-between items-center text-tech-fg">
        <h1 className="text-xl font-bold">Tech-Learn</h1>
        <ul className="flex space-x-4">
          <li><a href="/" className="hover:text-tech-secondary">Home</a></li>
          <li><a href="/about" className="hover:text-tech-secondary">About</a></li>
          <li><a href="/contact" className="hover:text-tech-secondary">Contact</a></li>
          <li><a href="/payments" className="hover:text-tech-secondary">Payments</a></li>
          {!isLoggedIn ? (
            <>
              <li><a href="/sign-up" className="hover:text-tech-secondary">Sign Up</a></li>
              <li><a href="/sign-in" className="hover:text-tech-secondary">Sign In</a></li>
            </>
          ) : (
            <>
              <li><a href="/dashboard" className="hover:text-tech-secondary">Dashboard</a></li>
              <li>
                <button onClick={handleLogout} className="hover:text-tech-secondary">
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
