import prisma from "../prisma";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken"

const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies["access_token"] || 
                      req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            res.status(401).json({
                message : "Unauthorized! Token missing."
            })
            return;
        }

        // Verifying the token
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET as string
        )  as { id : string, role : "user" | "seller", user: string};

        if (!decoded) {
            res.status(401).json({
                message : "Unauthorized! Invalid Token."
            })
            return;
        }

        const account = await prisma.agent.findUnique({ where : { id : decoded.id ? decoded.id : decoded.user}});
        req.user = account;

        if(!account) {
            res.status(401).json({
                message : "Account Not Found."
            })
            return;
        };

        req.role = decoded.role;

        next(); 

    } catch (error) {
        res.status(401).json({
            message : "Unauthorized! Token Expired or Invalid."
        });
    }
}

export default isAuthenticated;