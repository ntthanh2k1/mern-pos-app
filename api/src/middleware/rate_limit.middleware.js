import rateLimit from "express-rate-limit";

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000,
  headers: true,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message:
        "You have exceeded the number of allowed requests. Please try again later.",
    });
  },
});

export default globalLimiter;
