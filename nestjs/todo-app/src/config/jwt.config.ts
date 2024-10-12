import { JwtModuleOptions } from "@nestjs/jwt";
import { jwtConstants } from "src/auth/constants";

export const jwtConfig: JwtModuleOptions = {
    global: true,
    secret: jwtConstants.secret,
    signOptions: {expiresIn: '6000s'}
}