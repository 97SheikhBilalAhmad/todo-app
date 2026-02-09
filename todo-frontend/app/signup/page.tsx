"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      alert("Signup successful");
      router.push("/login");
    } catch (err: any) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-900 via-purple-300 to-pink-600 items-center justify-center  bg-black-50">
      <div className="w-100 rounded-4xl bg-gradient-to-br from-indigo-400 via-purple-100 to-pink-300 p-6 shadow-2xl">
        <h1 className="mb-4 text-2xl font-bold text-center text-black">Create Account</h1>

        <input
          type="text"
          placeholder="Full Name"
          className="mb-3 w-full rounded border p-2 text-black"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <button onClick={handleSignup} className="w-full rounded-xl bg-gradient-to-br from-indigo-600 to-pink-600 py-3 text-lg font-semibold text-white hover:bg-gray-700">
  Signup
</button>

        <p className="mt-4 text-center text-sm  text-black">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
