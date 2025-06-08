import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken"

export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  const token = req.cookies.admin_access_token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {id : string, role : string, email : string};
    if (decoded.role !== "admin") return res.status(403).json({ message: "Forbidden" });

    req.adminId = decoded.id;
    
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};