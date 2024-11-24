import { KAFKA_TOPICS } from "../../utils/constants";
import { consumeMessage } from "../kafka.helper";
import UpdateDBConsumer from "./UpdateDB.consumer";
import fileTranferConsumer from "./FileTransfer.consumer";
import VerifyFileConsumer from "./VerifyFile.consumer";
import DeleteFileConsumer from "./DeleteFile.consumer";

const Init = async () => {
  try {
    await consumeMessage({
      topics: Object.values(KAFKA_TOPICS),
      eachMessageHandler: async (data) => {
        switch (data?.topic) {
          case KAFKA_TOPICS.FILE_TRANSFER:
            await fileTranferConsumer(data);
            break;
          case KAFKA_TOPICS.UPDATE_DB:
            await UpdateDBConsumer(data);
            break;
          case KAFKA_TOPICS.VERIFY_FILE:
            await VerifyFileConsumer(data);
            break;
          case KAFKA_TOPICS.DELETE_SOURCE:
            await DeleteFileConsumer(data);
            break;

          default:
            console.log("invalid topic --------");
            break;
        }
      },
    });
  } catch (error) {
    console.log("Something went wrong with kafka consumer -------------");
  }
};


Init();