import { EachMessageHandler } from "kafkajs";
import { FILE_PROGRESS_TYPES, KAFKA_TOPICS, UPDATE_DB_KEYS } from "../../utils/constants";
import { DriveFileType, tranferWithAccountsType } from "../../types/custom";
import { produceMessage } from "../kafka.helper";
import prisma from "../../utils/db";
import { comparesCheckSums } from "../../apps/helpers/google.helper";

const VerifyFileConsumer: EachMessageHandler = async ({ topic, message }) => {
  const {
    transfer,
    fileTransferId
  }: {
    file: DriveFileType;
    transfer: tranferWithAccountsType;
    resumableUri: string | null;
    fileTransferId:string
} = JSON.parse(message.value?.toString() ?? "");

  try {
    const fileTransferData = await prisma.fileTransfer.findUnique({
      where:{id:fileTransferId}
    })

    if(!fileTransferData || !fileTransferData?.finalId){
      throw new Error("Final Id not found for verification")
    }

    // verify checksum -------------------------------
    await comparesCheckSums({
      refreshTokenRecieverAccount: transfer?.toAccount?.refreshToken as string,
      refreshTokenSenderAccount: transfer?.fromAccount?.refreshToken as string,
      finalId: fileTransferData?.finalId,
      initalId: fileTransferData?.initalId
    })

    //  update the progresss ------------------
    await produceMessage({
      topic: KAFKA_TOPICS.UPDATE_DB,
      message: {
        key: UPDATE_DB_KEYS.UPDATE_FILE_PROGRESS,
        value: JSON.stringify({
          type: FILE_PROGRESS_TYPES.VERIFICATION_PROGRESS,
          fileTransferId: fileTransferId,
          value:'SUCCESS'
        })
      },
    });

    //  go for file deletion ------------------
    // await produceMessage({
    //   topic: KAFKA_TOPICS.DELETE_SOURCE,
    //   message: {
    //     key: "delete_files",
    //     value: message.value,
    //   },
    // });

  } catch (error) {
    console.log(
      `Error occured in topic: ${KAFKA_TOPICS.VERIFY_FILE}----------------`
    );
    console.log(error)
    await produceMessage({
      topic: KAFKA_TOPICS.UPDATE_DB,
      message: {
        key: UPDATE_DB_KEYS.UPDATE_FILE_PROGRESS,
        value: JSON.stringify({
          key: FILE_PROGRESS_TYPES.VERIFICATION_PROGRESS,
          fileTransferId: fileTransferId,
          value:'FAILED'
        })
      },
    });
  }
};

export default VerifyFileConsumer;
