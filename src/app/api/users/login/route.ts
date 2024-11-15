import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// Connect to the database
connect();

export async function POST(request: NextRequest) {
  try {
    const lastToken = request.cookies.get("token")?.value || "";
    if(lastToken != ""){
      const response = NextResponse.json({
        message: "Login successful",
        success: true,
      });

      return response;
    }

    // Parse request body
    const reqBody = await request.json();
    const { email, password } = reqBody;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }
    console.log("User found");

    // Check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 400 }
      );
    }
    console.log("Password is correct");

    // Ensure TOKEN_SECRET is defined in the environment
    const tokenSecret = process.env.TOKEN_SECRET;
    if (!tokenSecret) {
      return NextResponse.json(
        { error: "Token secret is not defined" },
        { status: 500 }
      );
    }

    // Create token data
    const tokenData = {
      id: user._id,
      email: user.email,
    };

    // Generate JWT token
    const token = jwt.sign(tokenData, tokenSecret, {
      expiresIn: "1d", // Token expires in 1 day
    });

    // Create response and set the token cookie
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    // Set the token as a cookie (secure flag should be set to `true` in production)
    response.cookies.set("token", token, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production" && request.url.startsWith("https"),
      // Only set secure cookies in production
      sameSite: "strict", // Mitigate CSRF attacks (lowercase "strict")
      path: "/", // Make the cookie accessible across the site
      maxAge: 60 * 60 * 24, // 1 day (in seconds)
    });

    return response;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
