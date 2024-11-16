import mongoose from "mongoose";

// Define the schema for a subject
const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true, // Ensure subject names are stored in lowercase
  },
  total: {
    type: Number,
    default: 0,
  },
  present: {
    type: Number,
    default: 0,
  },
});

// Define the user schema
const attendlySchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true, // This creates a unique index on the email field
    lowercase: true, // Automatically lowercases the email to handle case-insensitivity
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  subjects: {
    type: [subjectSchema], // Array of subject objects
    default: [], // Default to an empty array
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create or use the existing model
const AttendlyUser = mongoose.models.AttendlyUser || mongoose.model("AttendlyUser", attendlySchema);

export default AttendlyUser;
