import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { IS_PUBLIC_KEY } from "./public.decorator.js";

export interface AuthenticatedUser {
    userId: string;
    email: string;
    role: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(public readonly configService: ConfigService,
        public readonly jwtService: JwtService,
        public readonly reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if (isPublic) return true;

        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException("User is not authorized")
        }

        const token = authHeader.split(' ')[1]

        if (!token) {
            throw new UnauthorizedException("User is not authorized")
        }

        let payload;
        try {
            payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('jwtSecret'),
            });
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }

        request.user = {
            userId: payload.sub,
            email: payload.email,
            role: payload.role,
        };
        return true
    }
}