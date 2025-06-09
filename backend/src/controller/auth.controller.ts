import { NextFunction, Request, Response } from "express";
import { checkOtpRestrictions, handleForgotPassword, sendOtp, trackOtp, validateRegistrationData, verifyForgotPasswordOtp, verifyOtp } from "../utils/auth.helper";
import bcrypt from "bcryptjs";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import prisma from "../utils/prisma";
import { AuthError, ValidationError } from "../packages";
import { setCookie } from "../utils/cookies/setCookie";
import { OAuth2Client } from "google-auth-library";
import { serialize } from "cookie";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// google signup/login
export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;

    if (!token) {
      return next(new ValidationError("No Google token provided."));
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.name) {
      return next(new ValidationError("Google login failed. Invalid credentials."));
    }

    const { email, name } = payload;

    const defaultPlan = await prisma.subscriptionPlan.findFirst({
      where: { isDefault : true }, 
    });

    if (!defaultPlan) {
      throw new Error("Default subscription plan not found.");
    }

    let user = await prisma.agent.findUnique({ where: { email } });

    // Create user if not found
    if (!user) {
      user = await prisma.agent.create({
        data: {
          email,
          name,
          password: "", // empty password as it's Google-authenticated
          subscriptionStart: new Date(),
          subscriptionEnd: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
          subscriptionStatus :"TRIAL",
          subscriptionPlan: {
            connect: {
              id: defaultPlan.id,
            },
          },
        },
      });

      await prisma.agentSubscription.create({
        data: {
          agentId: user.id,
          planId: defaultPlan.id,
          status: "confirmed",
          isActive: true,
          confirmedAt: new Date(),
          expiresAt: new Date(Date.now() + defaultPlan.duration * 86400000),
        },
      });
    }
    
    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: "user" },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email, role: "user" },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    setCookie(res, "refresh_token", refreshToken);
    setCookie(res, "access_token", accessToken);

    res.status(200).json({
      accessToken,
      message: "Google login successful!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return next(error);
  }
};


// Register a new user 
export const userRegistration = async (req:Request, res:Response, next:NextFunction) => {
    try {
        validateRegistrationData(req.body, "user")
    
        const { name, email } = req.body;

        const existingUser = await prisma.agent.findUnique({where: { email }})

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

        const existingUser = await prisma.agent.findUnique({where: { email }})

        if(existingUser) {
            throw next(new ValidationError("User already exist with this email!"));
        }

        await verifyOtp(email, otp, next);

        const hashedPassword = await bcrypt.hash(password, 10);

        const defaultPlan = await prisma.subscriptionPlan.findFirst({
          where: { isDefault : true },  
        });

        if (!defaultPlan) {
          throw new Error("Default subscription plan not found.");
        }

        await prisma.agent.create({
            data : {
                name: name,
                email: email,
                password: hashedPassword,
                subscriptionStart: new Date(),
                subscriptionEnd: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
                subscriptionStatus :"TRIAL",
                subscriptionPlan: {
                  connect: {
                    id: defaultPlan.id,
                  },
                },
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
        
        const user = await prisma.agent.findUnique({where : { email: email } });
        
        if (!user) {
            throw next(new AuthError("User does not exist!"));
        }
        
        // verify password
        const isMatch = await bcrypt.compare(password, user.password!);
        
        if(!isMatch) {
            throw next(new AuthError("Invalid email or passoword!"));
        }

        // Generate access and refresh token
        const accessToken = jwt.sign(
            { id: user.id, email: user.email, role: "user" }, 
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: "1d" }
        );
        
        const refreshToken = jwt.sign(
            { id: user.id, email: user.email, role: "user" }, 
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
                           req.headers.authorization?.split(" ")[1];

        if(!refreshTok) {
            throw new ValidationError('Unauthorized! No refresh token.')
        }

        const decoded = jwt.verify(refreshTok, process.env.REFRESH_TOKEN_SECRET as string) as { id : string, role : string, email:string};

        if (!decoded) {
            throw new JsonWebTokenError('Forbidden! Invalid refresh token.');
        }
        
        const account = await prisma.agent.findUnique({ where : { email : decoded.email }});

        if(!account) {
            throw new AuthError("Forbidden! User or Seller not found");
        }

        const newAccessToken = jwt.sign(
            { id : decoded.id, role : decoded.role},
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn : "1d" }
        );

        setCookie(res, 'access_token', newAccessToken);

        req.role = decoded.role;

        res.status(201).json({ success : true });
        
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
        await handleForgotPassword(req, res, next);
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

        const user = await prisma.agent.findUnique({ where : { email }});

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

        await prisma.agent.update({
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

export const changeUserPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { agentId } = req.params; 
    const { oldPassword, newPassword } = req.body;

    if (!agentId || !oldPassword || !newPassword) {
      res.status(400).json({ message: "All fields are required." });
      return;
    }

    const user = await prisma.agent.findUnique({ where: { id: agentId } });

    if (!user || !user.password) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Old password is incorrect." });
      return;
    }

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      res.status(400).json({ message: "New password cannot be the same as the old password." });
      return;
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.agent.update({
      where: { id: agentId },
      data: { password: hashed },
    });

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    next(error);
  }
};


export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Clear both access and refresh tokens
    res.setHeader("Set-Cookie", [
      serialize("access_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(0),
        path: "/",
      }),
      serialize("refresh_token", "", {
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


// DELETE /api/agent/delete-account
export const deleteAgentAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { agentId } = req.params;

    if (!agentId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    await prisma.visit.deleteMany({ where: { lead: { agentId } } });
    await prisma.lead.deleteMany({ where: { agentId } });

    await prisma.agent.delete({
      where: { id: agentId },
    });

    res.clearCookie("refresh_token");
    res.clearCookie("access_token");

    res.status(200).json({ message: "Your account has been deleted successfully." });
  } catch (error) {
    next(error);
  }
};
