import { EachMessageHandler } from "kafkajs";
import { FILE_PROGRESS_TYPES, KAFKA_TOPICS, UPDATE_DB_KEYS } from "../../utils/constants";
import { DriveFileType, tranferWithAccountsType } from "../../types/custom";
import { produceMessage } from "../kafka.helper";

const VerifyFileConsumer: EachMessageHandler = async ({ topic, message }) => {
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


    //  update the progresss ------------------
    await produceMessage({
      topic: KAFKA_TOPICS.UPDATE_DB,
      message: {
        key: UPDATE_DB_KEYS.UPDATE_FILE_PROGRESS,
        value: JSON.stringify({
          key: FILE_PROGRESS_TYPES.VERIFICATION_PROGRESS,
          fileTransferId: transfer?.id,
          value:'SUCCESS'
        })
      },
    });

    //  go for file verification ------------------
    await produceMessage({
      topic: KAFKA_TOPICS.DELETE_SOURCE,
      message: {
        key: "delete_files",
        value: message.value,
      },
    });
  } catch (error) {
    console.log(
      `Error occured in topic: ${KAFKA_TOPICS.VERIFY_FILE}----------------`
    );
  }
};

export default VerifyFileConsumer;
