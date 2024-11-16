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

    // Update attendance for each subject
    attendanceUpdates.forEach(({ name, attended }) => {
      if (!user.subjects[name]) {
        // Initialize the subject if it doesn't exist
        user.subjects[name] = [0, 0];
      }

      // Increment total classes (0th element)
      user.subjects[name][0] += 1;

      // Increment attended classes (1st element) if the user attended
      if (attended) {
        user.subjects[name][1] += 1;
      }
    });

    // Save the updated user document
    await user.save();

    return NextResponse.json({ message: "Attendance updated successfully!" });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Error updating attendance:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
