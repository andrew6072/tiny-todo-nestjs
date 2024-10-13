import { Role } from "src/roles/role.entity";

export class UserPayload {
    sub: number;
    username: string;
    roles: Role[];
    iat: number;
    exp: number;
}