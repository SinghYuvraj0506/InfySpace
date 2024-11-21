import express from "express";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import accountRouter from "./account.routes";
import transferRouter from "./transfers.routes";

const router = express.Router()

export default (): express.Router => {
    authRouter(router);
    userRouter(router);
    accountRouter(router);
    transferRouter(router);
    return router;
  };
  