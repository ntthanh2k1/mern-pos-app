import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token not provided." });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Token not valid." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    error.methodName = protectRoute.name;
    next(error);
  }
};

export default protectRoute;
