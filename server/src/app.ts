import express, { Request, Response } from "express";
import cors from "cors";
import router from "./routes/index";
import { ApiError } from "./utils/ApiError";
import { ErrorMiddleware } from "./middlewares/error.middleware";

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/healthcheck", async (req, res) => {
  res.send("Hello guys welcome to infy space backend");
});

app.use("/api/v1", router());


app.all("*", (req: Request, res: Response) => {
  throw new ApiError(404, `Route ${req.originalUrl} Not Found!!!`);
});

app.use(ErrorMiddleware as any);

export default app;
