import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

import express, { Request, Response } from "express";
import connectDB from "./config/db";
import bodyParser = require("body-parser");
import cors from "cors";

// Route import here
import authRoute from "./routes/auth.routes";
import bannerRoute from "./routes/banner.routes";

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

// All route use here
app.use("/auth", authRoute);
app.use("/banner", bannerRoute);

// Default route
app.get("/", (req: Request, res: Response) => {
    res.send("Hello, welcome to GroMart API!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server failed to start:', err);
    process.exit(1);
});

export default app
