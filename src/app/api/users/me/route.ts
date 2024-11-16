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
      throw new Error("User not found");
    }

    // Return the user data
    return NextResponse.json({
      message: "User found",
      data: user,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Handle errors and return a 400 status with the error message
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
