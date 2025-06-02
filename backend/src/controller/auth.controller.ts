import { NextFunction, Request, Response } from "express";
import { checkOtpRestrictions, handleForgotPassword, sendOtp, trackOtp, validateRegistrationData, verifyForgotPasswordOtp, verifyOtp } from "../../utils/auth.helper";
import bcrypt from "bcryptjs";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import prisma from "../../utils/prisma";
import { AuthError, ValidationError } from "../packages";
import { setCookie } from "../../utils/cookies/setCookie";

// Register a new user 
export const userRegistration = async (req:Request, res:Response, next:NextFunction) => {
    try {
        validateRegistrationData(req.body, "user")
    
        const { name, email } = req.body;

        const existingUser = await prisma.users.findUnique({where: { email }})

        if(existingUser) {
            return next(new ValidationError("User already exist with this email!"));
        }

        await checkOtpRestrictions(email, next);
        await trackOtp(email, next);
        await sendOtp(name, email, "user-activation-mail");

        res.status(200).json({
            message: "OTP sent to email. Please verify your account.",
        })

    } catch (error) {
        return next(error);
    }
}


// Verify user with otp
export const verifyUser = async (req:Request, res:Response, next:NextFunction) => { 
    try {
        const { email, otp, name, password} = req.body;

        if ( !email || !otp || !name || !password ) {
            throw next(new ValidationError("All fileds are required!"));
        }

        const existingUser = await prisma.users.findUnique({where: { email }})

        if(existingUser) {
            throw next(new ValidationError("User already exist with this email!"));
        }

        await verifyOtp(email, otp, next);

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.users.create({
            data : {
                name: name,
                email: email,
                password: hashedPassword,
            }
        })

        res.status(200).json({
            success: true,
            message: "User registered succefully!"
        })

    } catch (error) {
        next(error);
    }
}


// Login user
export const loginUser = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            throw next(new ValidationError("Email and password are required!"));
        }
        
        const user = await prisma.users.findUnique({where : { email: email } });
        
        if (!user) {
            throw next(new AuthError("User does not exist!"));
        }
        
        // verify password
        const isMatch = await bcrypt.compare(password, user.password!);
        
        if(!isMatch) {
            throw next(new AuthError("Invalid email or passoword!"));
        }

        res.clearCookie("seller_access_token");
        res.clearCookie("seller_refresh_token");

        // Generate access and refresh token
        const accessToken = jwt.sign(
            { user: user.id, role: "user" }, 
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: "1d" }
        );
        
        const refreshToken = jwt.sign(
            { user: user.id, role: "user" }, 
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: "7d" }
        );

        // store the access and refresh token in httpOnly secure cookie
        setCookie(res, "refresh_token", refreshToken );
        setCookie(res, "access_token", accessToken );

        res.status(200).json({
            message: "Login Successful!",
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        })

    } catch (error) {
        throw next(error);
    }
}


// refresh token user
export const refreshToken = async (req:any, res:Response, next:NextFunction) => {
    try {
        const refreshTok = req.cookies["refresh_token"] || 
                           req.cookies["seller_refresh_token"] || 
                           req.headers.authorization?.split(" ")[1];

        if(!refreshTok) {
            return new ValidationError('Unauthorized! No refresh token.')
        }

        const decoded = jwt.verify(refreshTok, process.env.REFRESH_TOKEN_SECRET as string) as { id : string, role : string, user : string, seller : string};

        if (!decoded || !decoded.id || !decoded.role) {
            return new JsonWebTokenError('Forbidden! Invalid refresh token.');
        }
        
        let account;
        if(decoded.role === "user") {
            account = await prisma.users.findUnique({ where : { id : decoded.id ? decoded.id : decoded.user }});
        }
        else if (decoded.role === "seller") {
            account = await prisma.sellers.findUnique({ 
                where : { id : decoded.id ? decoded.id : decoded.seller }, 
                include : {shop : true}
            });
        }

        if(!account) {
            return new AuthError("Forbidden! User or Seller not found");
        }

        const newAccessToken = jwt.sign(
            { id : decoded.id, role : decoded.role},
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn : "1d" }
        );

        if(decoded.role === "user") {
            setCookie(res, 'access_token', newAccessToken);
        }
        else if (decoded.role === "seller") {
            setCookie(res, 'seller_access_token', newAccessToken);
        }

        req.role = decoded.role;

        return res.status(201).json({ success : true });
        
    } catch (error) {
        return next(error);
    }
}


// get logged in user
export const getUser = async (req:any, res:Response, next:NextFunction) => {
    try {
        const user = req.user;

        res.status(201).json({
            success: true,
            user
        })

    } catch (error) {
        return next(error);
    }
}

// user forgot password
export const userForgotPassword = async (req:Request, res:Response, next:NextFunction) => {
    try {
        await handleForgotPassword(req, res, next, 'user');
    } catch (error) {
        throw next(error);
    }
}


// Verify forgot passwor otp
export const verifyForgotPassword = async (req:Request, res:Response, next:NextFunction) => {
    try {
        await verifyForgotPasswordOtp(req, res, next);

    } catch (error) {
        throw next(error);
    }
}


// Reset user passsword
export const resetUserPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, newPassword} = req.body;

        if (!email || !newPassword) {
            throw next(new ValidationError("Email and password is required."));
        }

        const user = await prisma.users.findUnique({ where : { email }});

        if (!user) {
            throw next(new ValidationError("User does not exist"));
        }

        // comapre old pass with new pass
        const isSame = await bcrypt.compare(newPassword, user.password!);

        if(isSame) {
            throw next(new ValidationError("New password cannot be the same as the old password"));
        }

        // hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.users.update({
            where : { email },
            data : { password : hashedPassword }
        })

        res.status(200).json({
            message: "Password reset successfully!"
        });

    } catch (error) {
        throw next(error);        
    }
}
