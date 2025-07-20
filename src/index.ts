import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

import express, { NextFunction, Request, Response } from "express";
import connectDB from "./config/db";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";

// Route import here
import authRoute from "./routes/auth.routes";
import bannerRoute from "./routes/banner.routes";
import categoryRoute from "./routes/category.routes";
import subCategoryRoute from "./routes/subcategory.routes";

// Connect to MongoDB Database with better error handling
connectDB()
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1); // Exit with error code
    });

const app = express();
const PORT = process.env.PORT || 8080; // Use port from environment variables or default to 8080

// Initialize Cors
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

// Middleware to parse JSON and URL-encoded request bodies
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true, // Allows parsing of rich data structures
    })
);

// Serve uploads folder as static
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Log the full error object
  console.error("Error:", typeof err === "object" ? JSON.stringify(err, null, 2) : err);

  // Extract a readable message
  let message = "Internal Server Error";
  if (err) {
    if (typeof err === "string") {
      message = err;
    } else if (err.message) {
      message = err.message;
    } else if (err.error && err.error.message) {
      message = err.error.message;
    } else {
      message = JSON.stringify(err);
    }
  }

  res.status(err.status || 500).json({
    success: false,
    message,
    // error: process.env.NODE_ENV === "development" ? err : undefined,
  });
});

// All route use here
app.use("/auth", authRoute);
app.use("/banner", bannerRoute);
app.use("/category", categoryRoute);
app.use("/sub-category", subCategoryRoute);

// Default route
app.get("/", (req: Request, res: Response) => {
    res.send("Hello, welcome to GroMart API!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server failed to start:', typeof err === 'object' ? JSON.stringify(err, null, 2) : err);
    process.exit(1);
});

export default app
