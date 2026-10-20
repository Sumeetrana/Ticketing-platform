import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Role } from "../constants/role.enum.js";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles.decorator.js";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(public readonly reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if (!required) return true

        const request = context.switchToHttp().getRequest();

        if (!required.includes(request.user.role)) {
            throw new ForbiddenException('Insufficient permissions')
        }

        return true

    }
}