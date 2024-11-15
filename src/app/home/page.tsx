'use client';

import { useState } from 'react';
import axios from 'axios';
import LoginNavbar from '@/components/login navbar/LoginNavbar';

function AttendancePage() {
  const [view, setView] = useState<'select' | 'attendance' | 'addSubject'>('select');
  const [subjects, setSubjects] = useState<{ name: string }[]>([]);
  const [newSubject, setNewSubject] = useState('');
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [isFetchingSubjects, setIsFetchingSubjects] = useState(false);

  // Fetch subjects for attendance
  const fetchSubjects = async () => {
    setIsFetchingSubjects(true);
    try {
      const { data } = await axios.get('/api/users/me');
      setSubjects(data.subjects || []);
      setAttendance(
        data.subjects.reduce((acc: Record<string, boolean>, subject: { name: string }) => {
          acc[subject.name] = false;
          return acc;
        }, {})
      );
    } catch (error) {
      console.error(error);
      alert('Failed to fetch subjects. Please try again later.');
    } finally {
      setIsFetchingSubjects(false);
    }
  };

  // Submit attendance
  const submitAttendance = async () => {
    try {
      await axios.post('/api/users/attendance', attendance);
      alert('Attendance marked successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to submit attendance. Please try again later.');
    }
  };

  // Add a new subject
  const addSubject = async () => {
    if (!newSubject.trim()) {
      alert('Subject name cannot be empty.');
      return;
    }
    try {
      await axios.post('/api/users/addSubject', { subject: newSubject });
      alert('Subject added successfully!');
      setNewSubject('');
    } catch (error) {
      console.error(error);
      alert('Failed to add subject. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen w-full text-gray-800"
    style={}>
      <LoginNavbar />
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold text-center text-blue-600">Attendance Management</h1>

        {/* Option Selection */}
        {view === 'select' && (
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
              onClick={() => {
                fetchSubjects();
                setView('attendance');
              }}
            >
              Mark Today's Attendance
            </button>
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
              onClick={() => setView('addSubject')}
            >
              Add Subject
            </button>
          </div>
        )}

        {/* Attendance Form */}
        {view === 'attendance' && (
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
                  <div key={subject.name} className="flex items-center justify-between">
                    <span className="font-medium">{subject.name}</span>
                    <div className="flex gap-2">
                      <label>
                        <input
                          type="radio"
                          name={subject.name}
                          value="attended"
                          checked={attendance[subject.name] === true}
                          onChange={() =>
                            setAttendance((prev) => ({ ...prev, [subject.name]: true }))
                          }
                        />{' '}
                        Attended
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={subject.name}
                          value="not_attended"
                          checked={attendance[subject.name] === false}
                          onChange={() =>
                            setAttendance((prev) => ({ ...prev, [subject.name]: false }))
                          }
                        />{' '}
                        Not Attended
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-400 text-white rounded shadow hover:bg-gray-500"
                  onClick={() => setView('select')}
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
        {view === 'addSubject' && (
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
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                  onClick={() => setView('select')}
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
