import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

export interface JwtPayload {
    userId: string;
    email: string;
}

// creates login token
export function signToken(payload: JwtPayload) {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: '3d',
    });
}

//protect routes
export function verifyToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}