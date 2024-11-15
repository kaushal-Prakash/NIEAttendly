import { NextApiRequest, NextApiResponse } from 'next';
import Attendly from '@/models/userModel';  // Import the Attendly model
import { connect } from '@/dbConfig/dbConfig'; // Your existing MongoDB connection function
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Get the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    // If token is not provided, return an error
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      // Verify the token and extract user data
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as { email: string };

      // Connect to MongoDB
      await connect();

      // Find the user by email (extracted from the token)
      const user = await Attendly.findOne({ email: decoded.email });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Extract subjects from the attendance map (keys are subject names)
      const subjects = Array.from(user.attendance.keys());

      // Return the list of subjects
      return res.status(200).json(subjects);
    } catch (error: any) {
      console.error('Error fetching subjects:', error);
      
      // Check for JWT errors (invalid or expired token)
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      return res.status(500).json({ error: 'Failed to fetch subjects' });
    }
  } else {
    // If the method is not GET, return Method Not Allowed
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
