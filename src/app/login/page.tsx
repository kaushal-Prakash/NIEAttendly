/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const [user, setUser] = useState({ email: "", password: "" });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();
  const onLogin = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state
  
      const response = await axios.post("/api/users/login", user);
  
      // Log full response for debugging
      console.log("Login Response:", response);
  
      toast.success("Login successful!");
      setSuccess("Login successful!");
  
      // Save token (if applicable)
      localStorage.setItem("authToken", response.data.token);
  
      // Debug token storage
      console.log("Token saved to localStorage");
  
      // Redirect with a forced reload to ensure state updates
      setTimeout(() => {
        router.push("/home"); // Redirect to the home page
    }, 500);
    } catch (error: any) {
      console.log("Login failed:", error.message);
  
      // Log full error object
      console.log("Full Error Object:", error);
  
      toast.error("Login failed. Please check your credentials.");
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };
  

  // Disable button if user email or password is empty
  useEffect(() => {
    setButtonDisabled(!(user.email.length > 0 && user.password.length > 0));
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      {/* Container for the image and the form */}
      <div className="w-full max-w-4xl flex items-center justify-center md:justify-between bg-white p-8 rounded shadow-md">
        {/* Image Section */}
        <div className="hidden md:block w-1/2 relative h-[400px]">
          <Image
            src="/bg/login.png"
            alt="Login Image"
            layout="fill"
            objectFit="cover"
            className="rounded-l-lg"
          />
        </div>
        {/* Login Form Section */}
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">Login</h2>
          {/* Show error or success messages */}
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && <div className="text-green-500 mb-4">{success}</div>}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-bold">Email</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded font-semibold"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-bold">Password</label>
            <input
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded font-semibold"
              placeholder="Enter your password"
            />
          </div>
          {/* Submit button */}
          <button
            onClick={onLogin}
            disabled={buttonDisabled || loading}
            className={`w-full py-2 rounded transition-colors ${
              buttonDisabled || loading
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
          {/* Redirect to Signup page */}
          <p className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      <Toaster /> {/* Toast notifications */}
    </div>
  );
}
