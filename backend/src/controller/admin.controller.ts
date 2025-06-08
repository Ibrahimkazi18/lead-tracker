import { NextFunction, Request, Response } from "express";
import { checkOtpRestrictions, sendOtp, trackOtp, validateRegistrationData, verifyForgotPasswordOtp, verifyOtp } from "../utils/auth.helper";
import bcrypt from "bcryptjs";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import prisma from "../utils/prisma";
import { AuthError, ValidationError } from "../packages";
import { setCookie } from "../utils/cookies/setCookie";
import { serialize } from "cookie";


// register admin
export const registerAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existingAdmin = await prisma.admin.findFirst();

    if (existingAdmin) {
        res.status(403).json({ message: "Admin already exists." });
        return;
    }

    validateRegistrationData(req.body, "admin");

    const { email, password, name } = req.body;

    await checkOtpRestrictions(email, next);
    await trackOtp(email, next);
    await sendOtp(name, email, "admin-activation-mail");

    res.status(200).json({
        message: "OTP sent to email. Please verify your account.",
    });

  } catch (error) {
    next(error);
  }
};

// Verify user with otp
export const verifyAdmin = async (req:Request, res:Response, next:NextFunction) => { 
    try {
        const { email, otp, name, password} = req.body;

        if ( !email || !otp || !name || !password ) {
            throw next(new ValidationError("All fields are required!"));
        }

        const existingAdmin = await prisma.admin.findUnique({where: { email }})

        if(existingAdmin) {
            throw next(new ValidationError("User already exist with this email!"));
        }

        await verifyOtp(email, otp, next);

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await prisma.admin.create({
            data: {
            email,
            password: hashedPassword,
            name
            },
        });

        res.status(200).json({
            success: true,
            message: "User registered succefully!",
            admin
        })

    } catch (error) {
        next(error);
    }
}


// Login user
export const loginAdmin = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            throw next(new ValidationError("Email and password are required!"));
        }
        
        const admin = await prisma.admin.findUnique({where : { email: email } });
        
        if (!admin) {
            throw next(new AuthError("Admin does not exist!"));
        }
        
        // verify password
        const isMatch = await bcrypt.compare(password, admin.password!);
        
        if(!isMatch) {
            throw next(new AuthError("Invalid email or passoword!"));
        }

        // Generate access and refresh token
        const admin_access_token = jwt.sign(
            { id: admin.id, email: admin.email, role: "admin" },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: "1d" }
        );

        const admin_refresh_token = jwt.sign(
            { id: admin.id, email: admin.email, role: "admin" },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: "7d" }
        );

        setCookie(res, "admin_refresh_token", admin_refresh_token);
        setCookie(res, "admin_access_token", admin_access_token);

        res.status(200).json({
            message: "Login Successful!",
            user: {
                id: admin.id,
                email: admin.email,
                name: admin.name
            }
        })

    } catch (error) {
        throw next(error);
    }
}


// refresh token user
export const refreshAdminToken = async (req:any, res:Response, next:NextFunction) => {
    try {
        const refreshTok = req.cookies["admin_refresh_token"] || 
                           req.headers.authorization?.split(" ")[1];

        if(!refreshTok) {
            throw new ValidationError('Unauthorized! No refresh token.')
        }

        const decoded = jwt.verify(refreshTok, process.env.REFRESH_TOKEN_SECRET as string) as { id : string, role : string, email:string};

        if (!decoded) {
            throw new JsonWebTokenError('Forbidden! Invalid refresh token.');
        }
        
        const account = await prisma.admin.findUnique({ where : { email : decoded.email }});

        if(!account) {
            throw new AuthError("Forbidden! Admin not found");
        }

        const newAccessToken = jwt.sign(
            { id : decoded.id, role : decoded.role},
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn : "1d" }
        );

        setCookie(res, 'admin_access_token', newAccessToken);

        req.role = decoded.role;

        res.status(201).json({ success : true });
        
    } catch (error) {
        return next(error);
    }
}


// get logged in admin
export const getAdmin = async (req:any, res:Response, next:NextFunction) => {
    try {
        const admin = req.admin;

        res.status(201).json({
            success: true,
            admin
        })

    } catch (error) {
        return next(error);
    }
}


// logout
export const logoutAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Clear both access and refresh tokens
    res.setHeader("Set-Cookie", [
      serialize("admin_access_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(0),
        path: "/",
      }),
      serialize("admin_refresh_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(0),
        path: "/",
      }),
    ]);

    res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    next(error);
  }
};