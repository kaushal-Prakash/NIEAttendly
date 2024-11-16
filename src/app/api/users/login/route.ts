import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// Ensure the database is connected
connect();

export async function POST(request: NextRequest) {
  try {
    // Retrieve the token from the cookies
    const lastToken = request.cookies.get("token")?.value || "";

    // If the token exists, return a successful login response
    if (lastToken) {
      return NextResponse.json({
        message: "Login successful",
        success: true,
      });
    }

    // Parse the request body to get the email and password
    const { email, password } = await request.json();

    // Validate the email and password
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 404 }
      );
    }

    // Find the user in the database by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }
    console.log("User found");

    // Verify the password
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 400 }
      );
    }
    console.log("Password is correct");

    // Ensure the token secret is defined in the environment variables
    const tokenSecret = process.env.TOKEN_SECRET;
    if (!tokenSecret) {
      return NextResponse.json(
        { error: "Token secret is not defined" },
        { status: 500 }
      );
    }

    // Create the JWT payload
    const tokenData = {
      id: user._id,
      email: user.email,
    };

    // Sign the JWT token
    const token = jwt.sign(tokenData, tokenSecret, {
      expiresIn: "1d", // Token expires in 1 day
    });

    // Create the response and set the JWT token as a cookie
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production" && request.url.startsWith("https"),
      // Only set secure cookies in production
      sameSite: "strict", // Mitigate CSRF attacks
      path: "/", // Make the cookie accessible across the site
      maxAge: 60 * 60 * 24, // 1 day (in seconds)
    });

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
