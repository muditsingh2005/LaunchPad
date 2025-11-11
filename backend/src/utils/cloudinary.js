import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const safeUnlink = (localFilePath) => {
  try {
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
  } catch {}
};

const resolveResourceType = (mimeType) => {
  if (!mimeType) return "auto";
  if (mimeType.startsWith("application/")) return "raw"; // PDFs and other docs
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("image/")) return "image";
  return "auto";
};

const uploadOnCloudinary = async (localFilePath, mimeType) => {
  try {
    if (!localFilePath) return null;

    const resourceType = resolveResourceType(mimeType);
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
    });

    const success = Boolean(
      response && (response.secure_url || response.url) && response.asset_id
    );
    if (success) {
      console.log(
        `cloudinary upload success: resource_type=${resourceType}, asset_id=${
          response.asset_id
        }, url=${response.secure_url || response.url}`
      );
      safeUnlink(localFilePath);
      return response;
    }

    console.error(
      "Cloudinary upload returned no asset_id or URL; treating as failure"
    );
    safeUnlink(localFilePath);
    return null;
  } catch (error) {
    console.error("Cloudinary upload error:", error?.message || error);
    safeUnlink(localFilePath); // remove the locally saved file as upload failed
    return null;
  }
};

export { uploadOnCloudinary };
