import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const auth = req.headers["authorization"];
    if (!auth || !auth.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing bearer token");
    }
    const token = auth.slice("Bearer ".length).trim();
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || "change_me"
      });
      (req as any).user = { userId: payload.sub, role: payload.role };
      if (payload.role !== "admin") {
        throw new UnauthorizedException("Not authorized");
      }
      return true;
    } catch (e) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
