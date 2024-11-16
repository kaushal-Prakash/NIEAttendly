import { getDataFromToken } from "@/helper/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

// Connect to the database
connect();

export async function GET(request: NextRequest) {
  try {
    // Extract user ID from the token
    const userId = await getDataFromToken(request);

    // Fetch the user from the database, excluding the password field
    const user = await User.findOne({ _id: userId }).select("-password");

    // If user is not found, throw an error
    if (!user) {
      return NextResponse.json({ error: "User Not Found" }, { status: 404 });
    }

    // Return the subjects array from the user data
    return NextResponse.json({
      message: "User found",
      subjects: user.subjects,
    });
  } catch (error) {
    // Narrow the type of error
    if (error instanceof Error) {
      console.log("Error fetching subjects:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    } else {
      console.log("Unknown error:", error);
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 400 }
      );
    }
  }
}
