import { EachMessageHandler, KafkaMessage } from "kafkajs";
import prisma from "../../utils/db";
import {
  FILE_PROGRESS_TYPES,
  KAFKA_TOPICS,
  UPDATE_DB_KEYS,
} from "../../utils/constants";

const UpdateDBConsumer: EachMessageHandler = async ({ message }) => {
  try {
    const keyName = message?.key?.toString();

    switch (keyName) {
      case UPDATE_DB_KEYS.UPDATE_UPLOAD_URI:
        await UpdateUploadURI({ message });
        break;

      case UPDATE_DB_KEYS.UPDATE_FINAL_FILE_ID:
        await UpdateFinalId({ message });
        break;

      case UPDATE_DB_KEYS.UPDATE_FILE_PROGRESS:
        await UpdateFileProgress({ message });
        break;

      default:
        break;
    }
  } catch (error) {
    console.log(
      `Error occured in topic: ${KAFKA_TOPICS.UPDATE_DB} ----------------`
    );
  }
};

// update the upload uri in db ---------------
const UpdateUploadURI = async ({ message }: { message: KafkaMessage }) => {
  const {
    fileTransferId,
    uri,
    expiry,
  }: {
    fileTransferId: string;
    uri: string;
    expiry: string;
  } = JSON.parse(message.value?.toString() ?? "");

  if (!fileTransferId || !uri || !expiry) {
    throw new Error("Insuffiecent Params in UpdateUploadURI Consumer function");
  }

  await prisma.fileTransfer.update({
    where: {
      id: fileTransferId,
    },
    data: {
      uploadUri: uri,
      expiry: expiry,
    },
  });

  console.log("Successfully update the uri in file transfer");
};

// update the final id in db ---------------
const UpdateFinalId = async ({ message }: { message: KafkaMessage }) => {
  const {
    fileTransferId,
    id,
  }: {
    fileTransferId: string;
    id: string;
  } = JSON.parse(message.value?.toString() ?? "");

  if (!fileTransferId || !id) {
    throw new Error("Insuffiecent Params in UpdateFinalId Consumer function");
  }

  await prisma.fileTransfer.update({
    where: {
      id: fileTransferId,
    },
    data: {
      finalId: id,
    },
  });

  console.log("Successfully update the finalid in file transfer");
};

// update the file progess in db ---------------
const UpdateFileProgress = async ({ message }: { message: KafkaMessage }) => {
  const progressKey = message.key?.toString();

  const {
    value,fileTransferId
  }: {
    value: number | string;
    fileTransferId: string
  } = JSON.parse(message.value?.toString() ?? "");

  if (!fileTransferId || !value) {
    throw new Error("Insuffiecent Params in UpdateUploadProgress Consumer function");
  }

  switch (progressKey) {
    case FILE_PROGRESS_TYPES.COPYING_PROGRESS:
      await prisma.fileTransfer.update({
        where:{
          id: fileTransferId
        },
        data:{
          completion_progress: value as number
        }
      });

    case FILE_PROGRESS_TYPES.VERIFICATION_PROGRESS:
      await prisma.fileTransfer.update({
        where:{
          id: fileTransferId
        },
        data:{
          verfication_status: value as any
        }
      });
      break;

    case FILE_PROGRESS_TYPES.DELETION_PROGRESS:
      await prisma.fileTransfer.update({
        where:{
          id: fileTransferId
        },
        data:{
          deletion_status: value as any
        }
      });
      break;

    default:
      break;
  }

  console.log("Successfully update the progress in file transfer");
};

export default UpdateDBConsumer;
