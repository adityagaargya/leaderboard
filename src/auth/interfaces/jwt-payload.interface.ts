import { UserRole } from "src/users/user.entity";


export interface JwtPayload {
    sub: string;
    email: string;
    role: UserRole;
}