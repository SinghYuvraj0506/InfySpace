import { Router } from "express";
import { getAuthUser } from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";


const userRouter = (router:Router) => {
    router.get("/user/getAuthUserDetails", verifyJWT, getAuthUser);

}

export default userRouter;