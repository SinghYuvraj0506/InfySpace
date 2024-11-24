import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import prisma from "../utils/db";
import { ApiResponse } from "../utils/ApiResponse";
import { z } from "zod";
import { createTransferSchema } from "../schema/transfer.schema";
import { produceMessage } from "../kafka/kafka.helper";
import { KAFKA_TOPICS } from "../utils/constants";

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
      include: {
        fromAccount: true,
        toAccount: true,
      },
    });

    // produce the messafe to the file transfer topic ----------------
    for (let eachfile of files) {
      await produceMessage({
        topic: KAFKA_TOPICS.FILE_TRANSFER,
        message: {
          key: "start_transfer",
          value: JSON.stringify({
            file: eachfile,
            transfer: transfer,
            resumableUri: null
          }),
        },
      });
    }

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
