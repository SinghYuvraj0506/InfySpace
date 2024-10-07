import { Router } from "express";
import { authDriveGoogle, authGoogle, googleCallback, googleDriveCallback, logout } from "../controllers/auth.controller";


const authRouter = (router:Router) => {
    router.get("/auth/google", authGoogle);
    router.get("/auth/drive/google", authDriveGoogle);
    router.get("/auth/google/callback", googleCallback);
    router.get("/auth/google/drive/callback", googleDriveCallback);
    router.get("/auth/logout", logout);

}

export default authRouter;