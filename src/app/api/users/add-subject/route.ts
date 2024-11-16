/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import Attendly from '@/models/userModel';
import { connect } from '@/dbConfig/dbConfig';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    // Get the token from cookies
    const token = req.cookies.get('token')?.value;

    if (!token) {
      console.log('Token not provided');
      return NextResponse.json({ error: 'Unauthorized: Token not provided' }, { status: 401 });
    }

    // Decode the token to extract user data
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as { email: string };
    const { email } = decoded;

    // Parse the subject from the request body
    const { subject } = await req.json();
    const subjectName = subject.toLowerCase(); // Ensure lowercase subject name

    // Validate the subject
    if (!subject || typeof subject !== 'string') {
      console.log('Invalid subject:', subject);
      return NextResponse.json({ error: 'Invalid subject' }, { status: 400 });
    }

    // Connect to the database
    await connect();

    // Find the user by email
    const user = await Attendly.findOne({ email }).select("-password");

    if (!user) {
      console.log('User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Ensure the subjects field is an array
    if (!user.subjects || !Array.isArray(user.subjects)) {
      console.log('Initializing subjects array');
      user.subjects = [];
    }

    // Find or initialize the subject in the user's subjects array
    let userSubject = user.subjects.find(((s: { name: any; }) => s.name === subjectName));
    if (!userSubject) {
      console.log('Adding new subject:', subjectName);
      userSubject = { name: subjectName, total: 0, present: 0 };
      user.subjects.push(userSubject);
    } else {
      console.log('Subject already exists:', subjectName);
    }

    // Save the updated user document
    await user.save();

    // Verify if the subject was added successfully
    const updatedUser = await Attendly.findOne({ email }).select("-password");
    console.log('Updated user subjects:', updatedUser.subjects);

    // Return success response
    return NextResponse.json({ message: 'Subject added successfully', success: true }, { status: 200 });

  } catch (error) {
    console.log('Error:', error);

    // Check for JWT verification errors (expired or invalid token)
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Handle any other errors
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
