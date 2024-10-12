import { Role } from "src/roles/role.entity";

export class UserPayload {
    sub: number;
    username: string;
    role: Role;
    iat: number;
    exp: number;
}