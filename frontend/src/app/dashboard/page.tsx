"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/sign-in");  // Updated to sign-in
    }
  }, [router]);

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
      router.push("/sign-in");  // Updated to sign-in
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-3xl font-bold mb-4">User Dashboard</h2>
        <p>Welcome to your learning journey! Start exploring the terminal or dive into lessons.</p>
        <div className="space-x-4 mt-4">
          <a href="/terminal" className="bg-dracula-purple text-dracula-bg px-4 py-2 rounded hover:bg-dracula-comment">
            Go to Terminal
          </a>
          <button onClick={handleLogout} className="bg-dracula-purple text-dracula-bg px-4 py-2 rounded hover:bg-dracula-comment">
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
