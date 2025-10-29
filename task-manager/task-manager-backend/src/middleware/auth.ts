import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: { id: string; role: string };
}

export const authMiddleware = (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        req.user = undefined;
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload & { id: string; role: string };

        req.user = { id: decoded.id, role: decoded.role };
    } catch (error) {
        console.error("❌ Invalid token:", (error as Error).message);
        req.user = undefined;
    }

    next();
};
