import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URL!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected !");
    });

    connection.on("error", (err) => {
      console.log("MongoDB connection error, make sure DB is up and running !");
      console.log(err);
      process.exit(1); // exit with error
    });
  } catch (error) {
    console.log("Something went wrong in connecting DB");
    console.log(error);
  }
}
