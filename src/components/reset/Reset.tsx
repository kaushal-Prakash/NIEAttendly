/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ClearSubjectsButton() {
    const [subjects, setSubjects] = useState(["Math", "Science", "History"]); // Example subjects array

    const clearSubjects = async () => {
        try {
            const response = await axios.post("/api/users/reset"); // POST request using Axios
            if (response.status === 200) {
                setSubjects([]); // Clear the local state if the API call succeeds
            }
            toast.success("Cleared all subjects");
            window.location.href = "/stats"
        } catch (error) {
            console.error("Failed to clear subjects", error);
        }
    };

    return (
        <div>
            <button
                onClick={clearSubjects}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-150"
            >
                Clear All Subjects
            </button>
        </div>
    );
}
