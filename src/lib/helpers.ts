import bcrypt from 'bcryptjs';
import ms, { StringValue } from 'ms';
import jwt, { JwtPayload, SignOptions, TokenExpiredError } from 'jsonwebtoken';
import { Types } from 'mongoose';

interface Payload {
    _id: string | Types.ObjectId;
    email: string;
    role: string;
}

interface Token {
    access_token: string;
    refresh_token: string;
}

interface DecodedToken {
    _id: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
  }

class helpingKit {
    private secretKey: string | undefined;

    constructor(secretKey?: string) {
        this.secretKey = secretKey;
    }

    async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, 8);
    }

    async compare(password: string, hashPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashPassword);
    }

    generateToken<T extends object>(payload: T, expiresIn: StringValue): string {
        const expireMs = ms(expiresIn)
        const option: SignOptions = { expiresIn: expireMs }
        return jwt.sign(payload, this.secretKey!, option);
    }

    generateSessionsTokens(payload: Payload): Token {
        const access_token = this.generateToken({ _id: payload._id }, '1d');
        const refresh_token = this.generateToken(payload, '30d');
        return { access_token, refresh_token };
    }

    async verifyToken(token: string): Promise<JwtPayload | string> {
        try {
            return jwt.verify(token, this.secretKey!)
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new Error('Token expires');
            } else {
                throw new Error('Invalid Token')
            }
        }
    }

    isTokenExpired (token: string): boolean {
        try {
            const decoded = jwt.decode(token) as DecodedToken | null;
            if (!decoded || !decoded.exp) {
                return true;
            }
            const currentTime = Math.floor(Date.now() / 1000);
            return decoded.exp < currentTime;
        } catch (error) {
            console.error('Error decoding token:', error);
            return true;
        }
    };
}

export default helpingKit;
