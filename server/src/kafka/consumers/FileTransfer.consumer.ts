import { EachMessageHandler } from "kafkajs";
import { FILE_PROGRESS_TYPES, KAFKA_TOPICS, UPDATE_DB_KEYS } from "../../utils/constants";
import { driveFileTransfer } from "../../apps/helpers/google.helper";
import { DriveFileType, tranferWithAccountsType } from "../../types/custom";
import { produceMessage } from "../kafka.helper";

const FileTranferConsumer: EachMessageHandler = async ({ topic, message }) => {
  try {
    const {
      file,
      transfer,
      resumableUri,
      fileTransferId
    }: {
      file: DriveFileType;
      transfer: tranferWithAccountsType;
      resumableUri: string | null;
      fileTransferId:string
    } = JSON.parse(message.value?.toString() ?? "");

    await driveFileTransfer({
      refreshTokenRecieverAccount: transfer?.toAccount?.refreshToken as string,
      refreshTokenSenderAccount: transfer?.fromAccount?.refreshToken as string,
      senderEmail: transfer?.fromAccount?.accountEmail as string,
      recieverEmail: transfer?.toAccount?.accountEmail as string,
      file,
      fileTransferId: fileTransferId,
      resumableUri: resumableUri ?? undefined,
    });

    console.log("Complete copying task -----------")

    //  update the progresss ------------------
    await produceMessage({
      topic: KAFKA_TOPICS.UPDATE_DB,
      message: {
        key: UPDATE_DB_KEYS.UPDATE_FILE_PROGRESS,
        value: JSON.stringify({
          type:FILE_PROGRESS_TYPES.COPYING_PROGRESS,
          fileTransferId: fileTransferId,
          value:100
        })
      },
    });

    //  go for file verification ------------------
    await produceMessage({
      topic: KAFKA_TOPICS.VERIFY_FILE,
      message: {
        key: "verify_files",
        value: message.value,
      },
    });
  } catch (error) {
    console.log(
      `Error occured in topic: ${KAFKA_TOPICS.FILE_TRANSFER}----------------`
    );
  }
};

export default FileTranferConsumer;
