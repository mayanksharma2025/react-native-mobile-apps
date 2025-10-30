import { AuthRequest } from "../middleware/auth";

export const requireAuth = (req: AuthRequest) => {
    if (!req.user) {
        throw new Error("Unauthorized: You must be logged in");
    }
    return req.user;
};

export const requireAdmin = (req: AuthRequest) => {
    if (!req.user) {
        throw new Error("Unauthorized: No user found");
    }
    if (req.user.role !== "admin") {
        throw new Error("Forbidden: Admin privileges required");
    }
    return req.user;
};

export const requireSelfOrAdmin = (req: AuthRequest, targetUserId: string) => {
    if (!req.user) {
        throw new Error("Unauthorized: No user found");
    }
    if (req.user.role !== "admin" && req.user.id !== targetUserId) {
        throw new Error("Forbidden: You can only update your own account");
    }
    return req.user;
};
