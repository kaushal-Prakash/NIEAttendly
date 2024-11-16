/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import LoginNavbar from "@/components/login navbar/LoginNavbar";
import "./style.css";
import toast, { Toaster } from "react-hot-toast";

interface Subject {
  name: string;
  total: number;
  present: number;
  isToday: boolean;
}

function AttendancePage() {
  const [view, setView] = useState<"select" | "attendance" | "addSubject">("select");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [newSubject, setNewSubject] = useState("");
  const [isFetchingSubjects, setIsFetchingSubjects] = useState(false);

  // Fetch subjects for attendance
  const fetchSubjects = async () => {
    setIsFetchingSubjects(true);
    try {
      const response = await axios.get("/api/users/me");
      const { subjects }: { subjects: Subject[] } = response.data;

      if (!subjects || !Array.isArray(subjects)) {
        throw new Error("Invalid subjects data");
      }

      // Map the subjects array to the desired structure
      setSubjects(subjects.map(({ name, total, present, isToday }) => ({
        name,
        total,
        present, // Use 'present' instead of 'attended'
        isToday,
      })));

      // Initialize attendance state
      setAttendance(subjects.reduce((acc: Record<string, boolean>, { name }) => {
        acc[name] = false; // Default to not attended
        return acc;
      }, {}));
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to fetch subjects. Please try again later.");
    } finally {
      setIsFetchingSubjects(false);
    }
  };

  // Toggle isToday status for a subject
  const toggleIsToday = (name: string) => {
    setSubjects((prevSubjects) =>
      prevSubjects.map((subject) =>
        subject.name === name ? { ...subject, isToday: !subject.isToday } : subject
      )
    );
  };

  // Submit attendance
  const submitAttendance = async () => {
    const attendanceUpdates = subjects.map(({ name, isToday }) => ({
      name,
      isToday,
      attended: attendance[name] || false,
    }));

    try {
      await axios.post("/api/users/attendance", { attendanceUpdates });
      toast.success("Attendance marked successfully!");
      setView("select");
    } catch (error) {
      console.error("Error submitting attendance:", error);
      toast.error("Failed to submit attendance. Please try again later.");
    }
  };

  // Add a new subject
  const addSubject = async () => {
    if (!newSubject.trim()) {
      toast.error("Subject name cannot be empty.");
      return;
    }
    try {
      await axios.post("/api/users/add-subject", {
        subject: newSubject,
      });
      toast.success("Subject added successfully!");
      setNewSubject("");
      fetchSubjects(); // Refresh subjects
    } catch (error) {
      console.error("Error adding subject:", error);
      toast.error("Failed to add subject. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen w-full text-gray-800 bg-cover bg-center home-container">
      <Toaster />
      <LoginNavbar />
      <div className="max-w-4xl mx-auto p-6 space-y-8 bg-slate-100 border-r-2 border-b-2 shadow-md home-content backdrop-blur-sm rounded-md">
        <h1 className="text-3xl font-bold text-center text-blue-600">Attendance Management</h1>

        {/* Option Selection */}
        {view === "select" && (
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
              onClick={() => {
                fetchSubjects();
                setView("attendance");
              }}
            >
              Mark Today&apos;s Attendance
            </button>
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
              onClick={() => setView("addSubject")}
            >
              Add Subject
            </button>
          </div>
        )}

        {/* Attendance Form */}
        {view === "attendance" && (
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-blue-600">Mark Attendance</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitAttendance();
              }}
            >
              <div className="space-y-4 mt-4">
                {subjects.map((subject) => (
                  <div key={subject.name} className="flex items-center justify-between gap-4 text-black">
                    <span className="font-medium">{subject.name}</span>

                    {/* Toggle isToday */}
                    <button
                      type="button"
                      onClick={() => toggleIsToday(subject.name)}
                      className={`px-2 py-1 rounded ${subject.isToday ? 'bg-green-500 text-white hidden md:block' : 'bg-gray-300 text-gray-800'}`}
                    >
                      {subject.isToday ? "Click here to Select" : "Click here to remove"}
                    </button>

                    {/* Attendance options */}
                    {subject.isToday && (
                      <div className="flex gap-10 md:gap-20">
                        <label>
                          <input
                            type="radio"
                            name={subject.name}
                            value="attended"
                            checked={attendance[subject.name] === true}
                            onChange={() =>
                              setAttendance((prev) => ({
                                ...prev,
                                [subject.name]: true,
                              }))
                            }
                          />{" "}
                          Attended
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={subject.name}
                            value="not_attended"
                            checked={attendance[subject.name] === false}
                            onChange={() =>
                              setAttendance((prev) => ({
                                ...prev,
                                [subject.name]: false,
                              }))
                            }
                          />{" "}
                          Not Attended
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-400 text-black rounded shadow hover:bg-gray-500"
                  onClick={() => setView("select")}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
                >
                  Submit Attendance
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add Subject Form */}
        {view === "addSubject" && (
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-blue-600">Add Subject</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addSubject();
              }}
            >
              <div className="flex items-center gap-4 mt-4">
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Enter subject name"
                  className="w-full px-3 py-2 border rounded-lg shadow-sm text-gray-600 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-400 text-white rounded shadow hover:bg-gray-500"
                  onClick={() => setView("select")}
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendancePage;
