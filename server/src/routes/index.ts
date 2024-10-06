import express from "express";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";

const router = express.Router()

export default (): express.Router => {
    authRouter(router);
    userRouter(router);
    return router;
  };
  