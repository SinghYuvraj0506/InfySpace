import { Router } from "express";
import { authGoogle, googleCallback, logout } from "../controllers/auth.controller";


const authRouter = (router:Router) => {
    router.get("/auth/google", authGoogle);
    router.get("/auth/google/callback", googleCallback);
    router.get("/auth/logout", logout);

}

export default authRouter;