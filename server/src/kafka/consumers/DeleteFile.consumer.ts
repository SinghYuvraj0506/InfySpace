import { EachMessageHandler } from "kafkajs";
import {
  FILE_PROGRESS_TYPES,
  KAFKA_TOPICS,
  UPDATE_DB_KEYS,
} from "../../utils/constants";
import { DriveFileType, tranferWithAccountsType } from "../../types/custom";
import { produceMessage } from "../kafka.helper";
import prisma from "../../utils/db";
import { trashFiles } from "../../apps/helpers/google.helper";

const DeleteFileConsumer: EachMessageHandler = async ({ topic, message }) => {
  const {
    transfer,
    fileTransferId,
  }: {
    file: DriveFileType;
    transfer: tranferWithAccountsType;
    resumableUri: string | null;
    fileTransferId: string;
  } = JSON.parse(message.value?.toString() ?? "");

  try {
    const fileTransferData = await prisma.fileTransfer.findUnique({
      where: { id: fileTransferId },
    });

    if (!fileTransferData || !fileTransferData?.finalId) {
      throw new Error("Final Id not found for deletion");
    }

    // trash the file -------------------------
    await trashFiles({
      refreshTokenSenderAccount: transfer?.fromAccount?.refreshToken as string,
      senderEmail: transfer?.fromAccount?.accountEmail as string,
      initalId: fileTransferData?.initalId,
    });

    //  update the progresss ------------------
    await produceMessage({
      topic: KAFKA_TOPICS.UPDATE_DB,
      message: {
        key: UPDATE_DB_KEYS.UPDATE_FILE_PROGRESS,
        value: JSON.stringify({
          type: FILE_PROGRESS_TYPES.DELETION_PROGRESS,
          fileTransferId: fileTransferId,
          value: "SUCCESS",
        }),
      },
    });
  } catch (error) {
    console.log(
      `Error occured in topic: ${KAFKA_TOPICS.DELETE_SOURCE}----------------`
    );
    console.log(error)
    await produceMessage({
      topic: KAFKA_TOPICS.UPDATE_DB,
      message: {
        key: UPDATE_DB_KEYS.UPDATE_FILE_PROGRESS,
        value: JSON.stringify({
          type: FILE_PROGRESS_TYPES.DELETION_PROGRESS,
          fileTransferId: fileTransferId,
          value:'FAILED'
        })
      },
    });
  }
};

export default DeleteFileConsumer;
