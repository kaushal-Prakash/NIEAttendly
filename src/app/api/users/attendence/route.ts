import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

// Ensure database connection
connect();

export async function POST(request: NextRequest) {
  try {
    // Get the user ID from the token
    const userId = await getDataFromToken(request);

    // Parse the request body to get attendance updates
    const { attendanceUpdates }: { attendanceUpdates: { name: string; attended: boolean }[] } = await request.json();

    // Validate the data
    if (!attendanceUpdates || !Array.isArray(attendanceUpdates)) {
      return NextResponse.json({ error: "Invalid attendance data" }, { status: 400 });
    }

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure the subjects field is an array
    if (!user.subjects || !Array.isArray(user.subjects)) {
      console.log('Initializing subjects array');
      user.subjects = [];
    }

    // Update attendance for each subject
    attendanceUpdates.forEach(({ name, attended }) => {
      let subject = user.subjects.find((subject: { name: string; }) => subject.name === name.toLowerCase());
      if (!subject) {
        // Initialize the subject if it doesn't exist
        subject = { name: name.toLowerCase(), total: 0, present: 0 };
        user.subjects.push(subject);
      }

      // Increment total classes
      subject.total += 1;

      // Increment attended classes if the user attended
      if (attended) {
        subject.present += 1;
      }
    });

    // Save the updated user document
    await user.save();

    return NextResponse.json({ message: "Attendance updated successfully!" });
  } catch (error) {
    console.log("Error updating attendance:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
