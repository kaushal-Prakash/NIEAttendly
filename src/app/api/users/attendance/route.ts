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
    const { attendanceUpdates }: { attendanceUpdates: { name: string; isToday: boolean; attended: boolean }[] } = await request.json();

    // Validate the data
    if (!attendanceUpdates || !Array.isArray(attendanceUpdates)) {
      return NextResponse.json({ error: "Invalid attendance data" }, { status: 400 });
    }

    // Find the user in the database
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update attendance for each subject
    attendanceUpdates.forEach(({ name, isToday, attended }) => {
      let subject = user.subjects.find((subject: { name: string; }) => subject.name === name.toLowerCase());

      if (!subject) {
        // Initialize the subject if it doesn't exist
        subject = { name: name.toLowerCase(), total: 0, present: 0, isToday: false };
        user.subjects.push(subject);
      }

      // Update isToday status for the subject
      subject.isToday = isToday;

      // Increment total classes only if the subject is scheduled today
      if (isToday) {
        subject.total += 1;

        // Increment attended classes if the user attended
        if (attended) {
          subject.present += 1;
        }
      }
    });

    // Save the updated user document
    await user.save();

    return NextResponse.json({ message: "Attendance updated successfully!" });
  } catch (error) {
    console.log("Error updating attendance:", error);

    // Type guard for better error handling
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
  }
}
