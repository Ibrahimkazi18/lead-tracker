
import { NextFunction, Request, Response } from "express";
import { verifyTokenAndGetUser } from "../verifyTokenAndGetUser";

const isAdminAuthenticated = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies["admin_access_token"] ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized! Token missing." });
      return;
    }

    const { decoded, user } = await verifyTokenAndGetUser(token, "admin");

    req.admin = user;
    req.role = decoded.role;

    next();
  } catch (error: any) {
    res
      .status(401)
      .json({ message: "Unauthorized! " + error.message });
  }
};

export default isAdminAuthenticated;
