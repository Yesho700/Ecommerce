import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Body, Get, Query } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtGuard } from "../auth/jwt.guard";
import { CloudinaryService } from "./cloudinary.service";
import { tmpdir } from "os";
import { join } from "path";

@Controller("media")
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @UseGuards(JwtGuard)
  @Post("upload")
  @UseInterceptors(FileInterceptor("file", { dest: join(tmpdir(), "uploads") }))
  async upload(@UploadedFile() file: Express.Multer.File, @Body("folder") folder?: string) {
    const result = await this.cloudinaryService.uploadFile(file.path, folder);
    return result;
  }

  @UseGuards(JwtGuard)
  @Get("sign")
  sign(@Query("public_id") publicId: string, @Query("type") type: "image" | "video" = "image") {
    const url = this.cloudinaryService.signUrl(publicId, type);
    return { url };
  }

  @UseGuards(JwtGuard)
  @Post("sign-upload")
  signUpload(@Body() body: { folder?: string; public_id?: string; overwrite?: boolean; type?: "image" | "video" }) {
    console.log('signUpload', body);
    const sig = this.cloudinaryService.getUploadSignature({
      folder: body.folder,
      public_id: body.public_id,
      overwrite: body.overwrite ?? true,
      access_mode: "authenticated"
    });
    const resourceType = body.type || "image";
    const upload_url = `https://api.cloudinary.com/v1_1/${sig.cloud_name}/${resourceType}/upload`;
    return { upload_url, ...sig };
  }
}
