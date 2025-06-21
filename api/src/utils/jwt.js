import jwt from "jsonwebtoken";

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
      expiresIn: "1d",
    }
  );

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });
};

export { createAccessToken };
