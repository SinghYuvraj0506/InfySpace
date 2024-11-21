import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { getFilesFromAccountId } from "../controllers/account.controller";
import validate from "../middlewares/validate.middleware";
import { getFilesFromAccountIdSchema } from "../schema/accounts.schema";

const accountRouter = (router: Router) => {
  router.get(
    "/accounts/getDriveFiles/:accountId",
    verifyJWT,
    // validate(getFilesFromAccountIdSchema),
    getFilesFromAccountId
  );
};

export default accountRouter;
