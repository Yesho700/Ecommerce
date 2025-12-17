import { Controller, Post, Body, Get, Logger, UseGuards, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { JwtGuard } from "./jwt.guard";

class LoginDto {
  username: string;
  password: string;
}

@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Req() req) {

    const token = await this.authService.validateAdmin(req.body.username, req.body.password);
    return { access_token: token };
  }

  @Get("env-check")
  envCheck() {
    const envUser = process.env.ADMIN_USERNAME || "admin";
    const envPass = process.env.ADMIN_PASSWORD || "admin123";
    const isHashed = envPass.startsWith("$2");
    return {
      admin_user_configured: envUser ? true : false,
      admin_user_value_sample: envUser.substring(0, 2) + "***",
      admin_password_configured: envPass ? true : false,
      admin_password_is_hashed: isHashed
    };
  }

  @UseGuards(JwtGuard)
  @Get("me")
  me(@Req() req: any) {
    return req.user ?? null;
  }
}
