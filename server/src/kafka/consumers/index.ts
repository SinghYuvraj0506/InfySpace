import { EachMessageHandler } from "kafkajs";
import { KAFKA_TOPICS } from "../../utils/constants";
import { produceMessage,consumeMessage } from "../kafka.helper";
import UpdateDBConsumer from "./UpdateDB.consumer";
import fileTranferConsumer from "./FileTransfer.consumer";

const CopyFileConsumer: EachMessageHandler = async ({ topic, message }) => {
  try {
    const { fileName, fileType, id } = JSON.parse(
      message.value?.toString() ?? ""
    );
    console.log(`Consuming message, topic: ${topic} , fileName: ${fileName}`);
    if (fileName && id) {
      await new Promise((res, rej) =>
        setTimeout(async () => {
          await produceMessage({
            topic: KAFKA_TOPICS.VERIFY_CHECKSUM,
            message: {
              key: "Verify Files",
              value: message.value,
            },
          });
          res("Copied file successfully");
        }, 5000)
      );
    }
  } catch (error) {
    console.log(
      `Error occured in topic: ${KAFKA_TOPICS.FILE_TRANSFER} , sarting dead letter queue ----------------`
    );
  }
};

const VerifyFileConsumer: EachMessageHandler = async ({ topic, message }) => {
  try {
    const { fileName, fileType, id } = JSON.parse(
      message.value?.toString() ?? ""
    );
    console.log(`Consuming message, topic: ${topic} , fileName: ${fileName}`);
    if (fileName && id) {
      await new Promise((res, rej) =>
        setTimeout(async () => {
          await produceMessage({
            topic: KAFKA_TOPICS.DELETE_SOURCE,
            message: {
              key: "Deleting Files",
              value: message.value,
            },
          });
          res("Verfied file successfully");
        }, 2000)
      );
    }
  } catch (error) {
    console.log(
      `Error occured in topic: ${KAFKA_TOPICS.VERIFY_CHECKSUM} , sarting dead letter queue ----------------`
    );
  }
};

const DeleteFileConsumer: EachMessageHandler = async ({ topic, message }) => {
  try {
    const { fileName, fileType, id } = JSON.parse(
      message.value?.toString() ?? ""
    );
    console.log(`Consuming message, topic: ${topic} , fileName: ${fileName}`);
    if (fileName && id) {
      await new Promise((res, rej) =>
        setTimeout(async () => {
          console.log("Finally completed the", fileName);
          res("Deleted file successfully");
        }, 1000)
      );
    }
  } catch (error) {
    console.log(
      `Error occured in topic: ${KAFKA_TOPICS.DELETE_SOURCE} , sarting dead letter queue ----------------`
    );
  }
};

const finalInit = async () => {
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


finalInit();