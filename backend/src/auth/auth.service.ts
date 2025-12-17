import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateAdmin(username: string, password: string): Promise<string> {
    console.log(username, password);
    const envUser = process.env.ADMIN_USERNAME || "admin";
    const envPass = process.env.ADMIN_PASSWORD || "admin123";

    const isUserValid = username === envUser;
    const isPassValid = envPass.startsWith("$2")
      ? await bcrypt.compare(password, envPass)
      : password === envPass;

    if (!isUserValid || !isPassValid) {
      console.log(username, password, isUserValid, isPassValid);
      throw new UnauthorizedException("Invalid credentials");
    }
    const token = await this.jwtService.signAsync({ sub: envUser, role: "admin" });
    return token;
  }
}

