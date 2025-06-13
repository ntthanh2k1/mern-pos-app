import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({ limit: "5mb" }));
app.use(helmet());
app.use(
  cors({
    // origin: "http://localhost:xxxx",
    // credentials: true
  })
);
app.use(cookieParser());

app.listen(port, async () => {
  console.log(`http://localhost:${port}`);
});
