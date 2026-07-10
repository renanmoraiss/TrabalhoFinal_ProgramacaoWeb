import { Request, Response } from "express";
import { AuthService } from "../../services/Auth/AuthService";
import { AuthRequest } from "../../models/auth/AuthRequest";

class AuthController {
    async handle (request: Request, response: Response) {
        const { email, passwordHash } : AuthRequest = request.body;
        const authService = new AuthService();
        const auth = await authService.execute({email, passwordHash});
        return response.status(200).json(auth);
    }
}

export { AuthController }