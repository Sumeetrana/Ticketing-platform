import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthenticatedUser } from "./jwt-auth.guard.js";

export const CurrentUser = createParamDecorator(
    (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp()
                            .getRequest<{ user: AuthenticatedUser }>();
        const user = request.user;

        if (data) {
            return user?.[data]
        }

        return user
    }
)