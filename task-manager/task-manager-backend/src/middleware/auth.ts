import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: { id: string; role: string };
}

export const authMiddleware = (req: AuthRequest, _: Response, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return next();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded as { id: string; role: string };
    } catch (error) {
        console.error("Invalid token", error);
    }
    next();
};
