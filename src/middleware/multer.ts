import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";


// Create S3 client instance (AWS SDK v3)
const s3 = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || "Test_ACCESSID",
    secretAccessKey: process.env.AWS_S3_ACCESS_KEY || "Test_ACCESSKEY"
  },
});

// Configure Multer with S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "gromart", // Your bucket name
    // acl: "public-read", // Use "public-read" instead of "public" for correct access settings
    key: (req, file, cb) => {
      const fileName = `uploads/${Date.now().toString()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // Accept file
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, and PDF files are allowed."
        )
      );
    }
  },
});

export default upload;
