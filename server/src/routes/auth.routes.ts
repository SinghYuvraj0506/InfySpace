import { Router } from "express";
import { authGoogle, googleCallback } from "../controllers/auth.controller";


const authRouter = (router:Router) => {
    router.get("/auth/google", authGoogle);
    router.get("/auth/google/callback", googleCallback);

}

export default authRouter;