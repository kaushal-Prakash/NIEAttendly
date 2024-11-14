import mongoose from "mongoose";

export async function connect() {
  // Check if MONGO_URL is defined
  const mongoUrl = process.env.MONGO_URL;

  if (!mongoUrl) {
    console.error("MONGO_URL is not defined in the environment variables");
    process.exit(1); // Exit process with an error code
  }

  try {
    // Wait for the connection to complete
    await mongoose.connect(mongoUrl);

    // Success event
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected!");
    });

    // Error event
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error, make sure DB is up and running!");
      console.error(err);
      process.exit(1); // Exit process if connection fails
    });

  } catch (error) {
    console.error("Something went wrong in connecting DB");
    console.error(error);
    process.exit(1); // Exit process if an error occurs during the connection attempt
  }
}
