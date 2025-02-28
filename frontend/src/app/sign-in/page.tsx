"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

export default function SignIn() {  // Renamed from Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/user/sign-in/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } else {
      setError(data.error || "Sign-in failed");
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-3xl font-bold mb-4">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-dracula-comment text-dracula-fg rounded"
            />
          </div>
          <div>
            <label className="block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-dracula-comment text-dracula-fg rounded"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="bg-dracula-purple text-dracula-bg px-4 py-2 rounded hover:bg-dracula-comment">
            Sign In
          </button>
        </form>
      </div>
    </>
  );
}
