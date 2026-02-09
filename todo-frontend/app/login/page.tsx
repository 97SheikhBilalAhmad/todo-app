"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post<{ access_token: string }>("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.access_token);
      localStorage.getItem("token")
      router.push("/todos");
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };
  


  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-900 via-purple-300 to-pink-600 items-center justify-center  bg-black-50">
      <div className="w-full max-w-2xl  rounded-2xl bg-gradient-to-br from-indigo-400 via-purple-100 to-pink-300 p-6 shadow-2xl">
        <h1 className="mb-4 text-2xl font-bold text-center text-black">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="mb-3 w-full rounded border p-2 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-4 w-full rounded border p-2 text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} className="w-full rounded-xl bg-gradient-to-br from-indigo-600 to-pink-600 py-3 text-lg font-semibold text-white hover:bg-gray-700">
  Login
</button>

        <p className="mt-4 text-center text-sm  text-black">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-600 underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
