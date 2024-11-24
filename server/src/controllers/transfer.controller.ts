import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import prisma from "../utils/db";
import { ApiResponse } from "../utils/ApiResponse";
import { z } from "zod";
import { createTransferSchema } from "../schema/transfer.schema";
import GoogleManager from "../apps/googleManager";
import { pipeline } from "node:stream";
import fs from "fs";
import { ApiError } from "../utils/ApiError";

export const transferFileToOtherDrive = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const {
      body: { fromAccountId, toAccountId, files },
    }: z.infer<typeof createTransferSchema> = req;

    const transfer = await prisma.transfers.create({
      data: {
        userId: userId as string,
        fromAccountId,
        toAccountId: toAccountId,
        files: {
          createMany: {
            data: files?.map((e) => ({
              name: e?.name,
              mimeType: e?.mimeType,
              initalId: e?.id,
              size: e?.size,
              userId: userId as string,
            })),
          },
        },
        transferSize: files
          ?.reduce((acc, curr) => (acc += parseInt(curr.size.toString())), 0)
          .toString(),
      },
      include:{
        fromAccount:true,
        toAccount:true
      }
    });

    const googleClientFrom = new GoogleManager(transfer.fromAccount?.refreshToken as string);
    const googleClientTo = new GoogleManager(transfer.toAccount?.refreshToken as string);
    const sourceStream = await googleClientFrom.getFileReadableStream(
      files[0]?.id,
      files[0]?.name
    );

    const resumableUri = await googleClientTo.getResumableUploadUri(
      files[0]?.name,
      parseInt(files[0]?.size),
      files[0]?.mimeType
    );

    if (!resumableUri) {
      throw new ApiError(400, "Invalid resumableUri");
    }

    let startByte = 0;

    for await (const chunk of sourceStream.data) {
      const res = await googleClientTo.uploadChuncksOnUri(
        startByte,
        parseInt(files[0]?.size),
        chunk,
        resumableUri
      );
      console.log("response",res)
      startByte += chunk.length;
      console.log(`Uploaded chunk: ${startByte}/${files[0]?.size}`);
    }

    console.log("File transfer completed!");

    res
      .status(200)
      .json(
        new ApiResponse(200, transfer, "Transfer Initialised Successfully")
      );
  }
);

export const getAllTransferFromUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const transfers = await prisma.transfers.findMany({
      where: {
        userId,
      },
      include: {
        fromAccount: {
          select: {
            accountEmail: true,
            avatar: true,
          },
        },
        toAccount: {
          select: {
            accountEmail: true,
            avatar: true,
          },
        },
        files: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res
      .status(200)
      .json(new ApiResponse(200, transfers, "Transfer fetched Successfully"));
  }
);
