import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Ensure that process.env.MONGODB is defined and available
    if (!process.env.MONGODB) {
      throw new Error("MONGODB connection string is not defined in .env");
    }
    

    // Attempt to connect to MongoDB using the connection string
    const mongooseConnect = await mongoose.connect(process.env.MONGODB);

    console.log("MongoDB Connected...");
    return mongooseConnect;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Database connection failed");
  }
};

export default connectDB;