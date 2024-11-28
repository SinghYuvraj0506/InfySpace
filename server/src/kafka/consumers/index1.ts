import { KAFKA_TOPICS } from "../../utils/constants";
import { consumeMessage } from "../kafka.helper";
import fileTranferConsumer from "./FileTransfer.consumer";

const Init = async () => {
  try {
    await consumeMessage({
      topics: [KAFKA_TOPICS.FILE_TRANSFER],
      eachMessageHandler: async (data) => {
        switch (data?.topic) {
          case KAFKA_TOPICS.FILE_TRANSFER:
            await fileTranferConsumer(data);
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