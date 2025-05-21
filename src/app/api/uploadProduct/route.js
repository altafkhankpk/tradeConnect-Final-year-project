import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";



  let s3Client = new S3Client({
      region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID, // Corrected field
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_KEY,
      },
    });

    // Function to upload file to S3
  async function uploadFileToS3(file, fileName, contentType) {
      let fileBuffer = file;
        
      console.log("Uploading file to S3:", fileName);
      console.log("bbbbbbbbbbbbbbbbbbbbbbbb")
      console.log(process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME)
      let params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
        Key: `${fileName}-${Date.now()}`, // File key with a timestamp
        Body: fileBuffer, // File content as buffer
        ContentType: contentType, // Dynamic content type based on the file
      };
    
      console.log("S3 upload parameters:", params);
    
      // Uploading the file to S3
      let command = new PutObjectCommand(params);
      let result = await s3Client.send(command);
    
      console.log("File upload result:", result);
      return fileName;
    }


  export async function POST(request) {
      
  console.log("Request receivekkkkkkkkkkkkkkkkkkkd")
      const formData = await request.formData()
      console.log("Form data received")
      console.log(formData)
          const file = formData.get("image")
            console.log("File received", file)
        console.log("File namemmmmmmmmmmmmmmmmmmm:", file.name)

        let buffer = Buffer.from(await file.arrayBuffer());
        let contentType = file.type; // Get the file's MIME type
        console.log("File buffer created:", buffer);
      // const fileName = formData.get("fileName")
      let fileName = await uploadFileToS3(buffer, file.name, contentType);
      console.log("File uploaded:", fileName);
      console.log("File nameddddddddddddddddddddddddddddddddddddddddddd:",  )
      console.log(formData)
          
      const imageUrl = `https://altaf-next-1.s3.amazonaws.com/${fileName}`;
      console.log("Image URL:", imageUrl);
      console.log("formdata",formData)
      
      


      return NextResponse.json({
          message: "Product uploaded successfully",
          status: 200,
      })

  }