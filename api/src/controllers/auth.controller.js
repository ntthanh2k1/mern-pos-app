import { PrismaClient } from "../generated/prisma/client.js";
import argon2 from "argon2";
import { generateCode, verifyPassword } from "../utils/helpers.js";
import { createAccessToken, createRefreshToken } from "../utils/jwt.js";

const prisma = new PrismaClient();

const register = async (req, res, next) => {
  try {
    const { name, email, username, password } = req.body;

    const [existingEmail, existingUsername] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.user.findUnique({ where: { username } }),
    ]);
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: `Email ${email} already exists.`,
      });
    }
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: `Username ${username} already exists.`,
      });
    }

    const code = generateCode("USER");
    const hashedPassword = await argon2.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        code: code,
        name,
        email,
        username,
        password: hashedPassword,
      },
      select: {
        userId: true,
        code: true,
        name: true,
        email: true,
        username: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Registered successfully.",
      data: user,
    });
  } catch (error) {
    error.methodName = register.name;
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const userAgent = req.headers["User-Agent"];

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const isCorrectPassword = await verifyPassword(user.password, password);
    if (!isCorrectPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Password not correct." });
    }

    await createAccessToken(user, res);
    // await createRefreshToken(user, userAgent, res);

    res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      data: {
        userId: user.userId,
        code: user.code,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    error.methodName = login.name;
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    error.methodName = logout.name;
    next(error);
  }
};

const getAuthUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({ where: { userId } });

    res.status(200).json({
      success: true,
      data: {
        userId: user.userId,
        code: user.code,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    error.methodName = getAuthUser.name;
    next(error);
  }
};

export { register, login, logout, getAuthUser };
