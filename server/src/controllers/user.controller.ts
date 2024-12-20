import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import prisma from "../utils/db";
import { ApiResponse } from "../utils/ApiResponse";

export const getAuthUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { Accounts: true },
  });

  res.status(200).json(new ApiResponse(200, user, "User Fetched Successfully"));
});

export const getAllAccounts = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const accounts = await prisma.accounts.findMany({
      where: { userId: userId as string },
    });

    res
      .status(200)
      .json(new ApiResponse(200, accounts, "Accounts Fetched Successfully"));
  }
);
