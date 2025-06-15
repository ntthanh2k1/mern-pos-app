import jwt from "jsonwebtoken";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

const createAccessToken = async (user, res) => {
  const accessToken = jwt.sign(
    {
      userId: user.userId,
      code: user.code,
      name: user.name,
      username: user.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000, // 15 phút
  });
};

const createRefreshToken = async (user, userAgent, res) => {
  const refreshToken = jwt.sign(
    {
      userId: user.userId,
      code: user.code,
      name: user.name,
      username: user.username,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  await prisma.refreshToken.create({
    data: {
      userId: user.userId,
      refreshToken: refreshToken,
      userAgent: userAgent,
    },
  });

  await prisma.refreshToken.update({
    where: { userId: user.userId },
    data: { refreshToken: refreshToken, userAgent: userAgent },
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
  });
};

export { createAccessToken, createRefreshToken };
