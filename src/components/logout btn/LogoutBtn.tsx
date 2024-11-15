"use client";
import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();
    const handleLogout = async () => {
        try {
            const res = await axios.get("/api/users/logout", { withCredentials: true });
            if (res.status === 200) {
                toast.success("Logout successful");
                router.push("/");
                // Optional: Redirect or update UI after successful logout
            } else {
                alert("Logout failed");
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("An error occurred while logging out");
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-150"
        >
            Logout
        </button>
    );
}
