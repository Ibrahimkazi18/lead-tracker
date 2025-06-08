import jwt from "jsonwebtoken";
import prisma from "./prisma";

export const verifyTokenAndGetUser = async (
  token: string,
  role: "agent" | "admin"
) => {
  const decoded = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string
  ) as { id: string; role: "agent" | "admin"; email: string };

  if (!decoded) throw new Error("Invalid token");

  if (decoded.role !== role) throw new Error("Invalid role");

  const user =
    role === "agent"
      ? await prisma.agent.findUnique({ where: { id: decoded.id } })
      : await prisma.admin.findUnique({ where: { id: decoded.id } });

  if (!user) throw new Error("Account not found");

  return { decoded, user };
};
