import { EachMessageHandler } from "kafkajs";
import { FILE_PROGRESS_TYPES, KAFKA_TOPICS } from "../../utils/constants";
import { DriveFileType, tranferWithAccountsType } from "../../types/custom";
import { produceMessage } from "../kafka.helper";

const DeleteFileConsumer: EachMessageHandler = async ({ topic, message }) => {
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
        key: FILE_PROGRESS_TYPES.DELETION_PROGRESS,
        value: JSON.stringify({
          fileTransferId: transfer?.id,
          value:"SUCCESS"
        })
      },
    });

  } catch (error) {
    console.log(
      `Error occured in topic: ${KAFKA_TOPICS.DELETE_SOURCE}----------------`
    );
  }
};

export default DeleteFileConsumer;
