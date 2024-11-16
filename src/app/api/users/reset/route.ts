import { getDataFromToken } from "@/helper/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

// Connect to the database
connect();

export async function POST(request: NextRequest) {
  try {
    // Extract user ID from the token
    const userId = await getDataFromToken(request);

    // Update the user's `subjects` array to an empty array
    const result = await User.updateOne(
      { _id: userId },
      { $set: { subjects: [] } }
    );

    // Check if the update was acknowledged
    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "User Not Found or No Changes Made" }, { status: 404 });
    }

    // Respond with a success status only
    return NextResponse.json({ message: "Subjects array cleared successfully" });
  } catch (error) {
    // Handle errors
    console.error("Error clearing subjects array:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
}
