import { S3 } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

// Initialize S3
const s3 = new S3();

export async function POST(req, res) {
  console.log("Generating pre-signed URL for S3 upload");
  
  try {
    // Parse the file type from the request body
    const { fileType } = req.body;

    if (!fileType) {
      return res.status(400).json({ error: "File type is required" });
    }

    // Generate a unique filename for the file
    const fileName = `uploads/${uuidv4()}.${fileType.split("/")[1]}`;

    // Generate a pre-signed URL for uploading the file to S3
    const url = s3.getSignedUrl("putObject", {
      Bucket: process.env.AWS_BUCKET_NAME, // Ensure this is set in your .env file
      Key: fileName,
      Expires: 60, // URL expiration time in seconds
      ContentType: fileType, // File type sent from the frontend
      ACL: "public-read", // File access permissions
    });

    // Respond with the pre-signed URL and the file name
    res.status(200).json({
      url,
      fileName,
      fields: {
        key: fileName,
        acl: "public-read", // File access permissions
        "Content-Type": fileType,
      },
    });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    res.status(500).json({ error: "Error generating pre-signed URL" });
  }
}
