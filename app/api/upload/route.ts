import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

cloudinary.config({
  // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // api_key: process.env.CLOUDINARY_API_KEY,
  // api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: "finalprojectrails",
  api_key: "735687424375287",
  api_secret: "K3S7CyKpCiyL8YLIcKLgaS32tO8",
});

function uploadBufferToCloudinary(buffer: Buffer, folder: string) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const typeValue = formData.get("type");
    const type = (typeof typeValue === "string" ? typeValue : "default") || "default";

    if (!(file instanceof Blob)) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let folder = "easy_mart_clone";
    if (type === "product") {
      folder = "easy_mart_clone/products";
    } else if (type === "grocery_category") {
      folder = "easy_mart_clone/grocery_categories";
    } else if (type && typeof type === "string" && type !== "default") {
      folder = `easy_mart_clone/${type}`;
    }

    const uploadedResponse: any = await uploadBufferToCloudinary(buffer, folder);
    console.log(uploadedResponse, "UPLOAD API")
    return NextResponse.json({ url: uploadedResponse.secure_url, folder });
  } catch (error) {
    return NextResponse.json(
      { message: "Upload failed", error: String(error) },
      { status: 500 }
    );
  }
}
