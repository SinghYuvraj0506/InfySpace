import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import prisma from "../utils/db";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import GoogleManager from "../apps/googleManager";

export const getFilesFromAccountId = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const {accountId} = req.params

    const account = await prisma.accounts.findUnique({
      where: { id: accountId , userId: userId }
    });

    if(!account){
      throw new ApiError(400,"Invalid Account")
    }

    const googleClient = new GoogleManager(account?.refreshToken, account.accountEmail)
    const files = await googleClient.listDriveFiles()

    res
      .status(200)
      .json(new ApiResponse(200, files, "Files Fetched Successfully"));
  }
);
