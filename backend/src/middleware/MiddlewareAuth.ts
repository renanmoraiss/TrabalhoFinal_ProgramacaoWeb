import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { Payload } from "../models/Payload";

export function isAuthenticated (
    request: Request,
    response: Response,
    next: NextFunction
) {
    const authToken = request.headers.authorization;

    if(!authToken) {
        return response.status(401).end();
    }

    const [,token] = authToken.split(" ");

    try {
        const { sub } = verify(token, process.env.JWT_SECRET!) as Payload;
        request.userId = sub;
       
        return next();
    } catch (error) {
        return response.status(401).end();
    }

}