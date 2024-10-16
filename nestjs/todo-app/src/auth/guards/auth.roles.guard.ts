// src/auth/guards/roles.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../users/user.entity';
import { ROLES_KEY } from 'src/roles/roles.decorator';
import { UserPayload } from '../dto/auth-jwt-payload.dto';

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Get the roles defined for the route handler
        const requiredRoles = this.reflector.get<number[]>(ROLES_KEY, context.getHandler());
        if (!requiredRoles || requiredRoles.length === 0) {
            return true; // If no roles are defined, allow access
        }
    
        // Get the request and user
        const request = context.switchToHttp().getRequest();
        const user: UserPayload = request.user; // the user is set by an authentication guard in the request
        // console.log("From RolesGuard:", user);

        if (!user || user.roles && user.roles.length === 0) {
            throw new ForbiddenException('RolesGuard: User role is missing.');
        }
    
        // Compare the user's role ID with the required roles
        const hasRole = user.roles.some(role => requiredRoles.includes(role.id)); // user.role is now a single object
        if (!hasRole) {
            throw new ForbiddenException('RolesGuard: You do not have the necessary permissions to access this resource.');
        }
    
        return true; // Allow access if the user has the required role
    }
}
