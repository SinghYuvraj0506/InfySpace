import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import validate from "../middlewares/validate.middleware";

import { createTransferSchema } from "../schema/transfer.schema";
import { getAllTransferFromUserId, transferFileToOtherDrive } from "../controllers/transfer.controller";

const transferRouter = (router: Router) => {
  router.post(
    "/transfers/initialize",
    verifyJWT,
    validate(createTransferSchema),
    transferFileToOtherDrive
  );

  router.get(
    "/transfers/getAll",
    verifyJWT,
    getAllTransferFromUserId
  );
};

export default transferRouter;
