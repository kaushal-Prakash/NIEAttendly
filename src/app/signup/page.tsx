"use client"; 
import Link from "next/link"; 
import React, { useEffect, useState } from "react"; 
import { useRouter } from "next/navigation"; 
import axios from "axios"; 
import { toast, Toaster } from "react-hot-toast"; 
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Error state
  const [success, setSuccess] = useState<string | null>(null); // Success state

  const onSignup = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error message
      const response = await axios.post("/api/users/signup", user); // Post signup data
      console.log("Signup success", response.data);
      toast.success("Signup successful!");
      setSuccess("Signup successful!"); // Success message
      router.push("/login"); // Redirect to login page after successful signup
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("Signup failed", error.message);
      toast.error("Signup failed. Please try again.");
      setError("Signup failed. Please try again."); // Set error message
    } finally {
      setLoading(false);
    }
  };

  // Disable button if user email or password is empty
  useEffect(() => {
    setButtonDisabled(
      !(user.email.length > 0 && user.password.length > 0)
    );
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      {/* Container for the image and the form */}
      <div className="w-full max-w-4xl flex items-center justify-center md:justify-between bg-white p-8 rounded shadow-md">
        {/* Image Section */}
        <div className="hidden md:block w-1/2 relative h-[400px]"> {/* Added height */}
          <Image
            src="/bg/login.png" // Path to the image
            alt="Signup Image"
            layout="fill" // Make image responsive and fill the div
            objectFit="cover" // Ensure image covers the area without distortion
            className="rounded-l-lg"
          />
        </div>

        {/* Signup Form Section */}
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">Sign Up</h2>
          
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
            onClick={onSignup}
            disabled={buttonDisabled || loading} // Disable button if form is incomplete or loading
            className={`w-full py-2 rounded transition-colors ${
              buttonDisabled || loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
          
          {/* Redirect to Login page */}
          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
      <Toaster /> {/* Toast notifications */}
    </div>
  );
}
