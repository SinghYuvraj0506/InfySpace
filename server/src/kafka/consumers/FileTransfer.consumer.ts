import { EachMessageHandler } from "kafkajs";
import { FILE_PROGRESS_TYPES, KAFKA_TOPICS } from "../../utils/constants";
import { driveFileTransfer } from "../../apps/helpers/google.helper";
import { DriveFileType, tranferWithAccountsType } from "../../types/custom";
import { produceMessage } from "../kafka.helper";

const FileTranferConsumer: EachMessageHandler = async ({ topic, message }) => {
  try {
    const {
      file,
      transfer,
      resumableUri,
    }: {
      file: DriveFileType;
      transfer: tranferWithAccountsType;
      resumableUri: string | null;
    } = JSON.parse(message.value?.toString() ?? "");

    await driveFileTransfer({
      refreshTokenRecieverAccount: transfer?.toAccount?.refreshToken as string,
      refreshTokenSenderAccount: transfer?.fromAccount?.refreshToken as string,
      file,
      fileTransferId: transfer?.id,
      resumableUri: resumableUri ?? undefined,
    });

    console.log("Complete copying task -----------")

    //  update the progresss ------------------
    await produceMessage({
      topic: KAFKA_TOPICS.UPDATE_DB,
      message: {
        key: FILE_PROGRESS_TYPES.COPYING_PROGRESS,
        value: JSON.stringify({
          fileTransferId: transfer?.id,
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
