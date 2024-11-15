import { NextApiRequest, NextApiResponse } from 'next';
import Attendly from '@/models/userModel';  // Import the Attendly model
import { connect } from '@/dbConfig/dbConfig'; // Your existing MongoDB connection function
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Get the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    // If token is not provided, return an error
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      // Verify the token and extract user data
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as { email: string };

      const { subject } = req.body;

      // Validate input
      if (!subject) {
        return res.status(400).json({ error: 'Subject is required' });
      }

      // Connect to MongoDB
      await connect();

      // Find the user by email (extracted from the token)
      const user = await Attendly.findOne({ email: decoded.email });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // If the subject doesn't already exist, set its attendance to 0
      if (!user.attendance.has(subject)) {
        user.attendance.set(subject, 0); // Initialize the subject attendance to 0
      }

      // Save the updated user document
      await user.save();

      return res.status(200).json({ message: 'Attendance updated successfully', success: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error updating attendance:', error);
      
      // Check for JWT errors (invalid or expired token)
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      return res.status(500).json({ error: 'Failed to update attendance' });
    }
  } else {
    // If the method is not POST, return Method Not Allowed
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
