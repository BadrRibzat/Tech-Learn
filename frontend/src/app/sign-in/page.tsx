"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="max-w-md mx-auto p-6 bg-dracula-comment rounded-lg shadow-lg mt-8">
        <h2 className="text-3xl font-bold mb-6 text-dracula-fg text-center">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-dracula-fg mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-dracula-bg text-dracula-fg rounded-md border border-dracula-purple focus:outline-none focus:ring-2 focus:ring-dracula-purple"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dracula-fg mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-dracula-bg text-dracula-fg rounded-md border border-dracula-purple focus:outline-none focus:ring-2 focus:ring-dracula-purple"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-dracula-fg hover:text-dracula-purple"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-dracula-purple text-dracula-bg px-4 py-3 rounded-md hover:bg-dracula-comment transition-colors duration-200"
          >
            Sign In
          </button>
        </form>
      </div>
    </>
  );
}
