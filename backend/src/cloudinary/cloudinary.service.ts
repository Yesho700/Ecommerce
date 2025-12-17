import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
  }

  async uploadFile(filePath: string, folder?: string) {
    const res = await cloudinary.uploader.upload(filePath, {
      folder: folder || "ecommerce",
      resource_type: "auto",
      access_mode: "authenticated"
    });
    return { public_id: res.public_id, resource_type: res.resource_type, width: res.width, height: res.height, format: res.format };
  }

  signUrl(publicId: string, resourceType: "image" | "video" = "image", deliveryType: "authenticated" | "upload" = "authenticated") {
    return cloudinary.url(publicId, {
      type: deliveryType,
      resource_type: resourceType,
      secure: true,
      sign_url: true
    });
  }

  async getResourceInfo(publicId: string, resourceType: "image" | "video" = "image") {
    return cloudinary.api.resource(publicId, { resource_type: resourceType, type: "authenticated" });
  }

  async signedReadUrl(publicId: string, resourceType: "image" | "video" = "image", ttlSeconds = 900) {
    const info = await this.getResourceInfo(publicId, resourceType);
    const expires_at = Math.floor(Date.now() / 1000) + ttlSeconds;
    return cloudinary.utils.private_download_url(publicId, info.format, {
      resource_type: resourceType,
      type: "authenticated",
      expires_at
    });
  }

  getUploadSignature(params: { folder?: string; public_id?: string; overwrite?: boolean; access_mode?: "authenticated" | "public" }) {
    const timestamp = Math.floor(Date.now() / 1000);
    const payload: Record<string, string | number | boolean> = {
      timestamp,
      access_mode: params.access_mode || "authenticated",
    };
    if (params.folder) payload.folder = params.folder;
    if (params.public_id) payload.public_id = params.public_id;
    if (typeof params.overwrite === "boolean") payload.overwrite = params.overwrite;
    const signature = cloudinary.utils.api_sign_request(payload, process.env.CLOUDINARY_API_SECRET!);
    return {
      timestamp,
      signature,
      api_key: process.env.CLOUDINARY_API_KEY!,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
      ...payload
    };
  }
}
