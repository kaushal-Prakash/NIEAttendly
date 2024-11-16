/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    console.log(reqBody);

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create and save the new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // Generate JWT token
    const tokenSecret = process.env.TOKEN_SECRET;
    if (!tokenSecret) {
      return NextResponse.json(
        { error: "Token secret is not defined" },
        { status: 500 }
      );
    }

    const tokenData = {
      id: savedUser._id,
      email: savedUser.email,
    };

    const token = jwt.sign(tokenData, tokenSecret, {
      expiresIn: "1d", // Token expires in 1 day
    });

    // Set token in cookies
    const response = NextResponse.json({
      message: "User created successfully",
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" && request.url.startsWith("https"),
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day (in seconds)
    });

    return response;
  } catch (error: any) {
    console.error("Error during signup:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
