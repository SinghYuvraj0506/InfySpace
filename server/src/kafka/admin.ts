
import kafkaClient from "../config/kafka.config";
import { KAFKA_TOPICS } from "../utils/constants";

export default async function init() {
  const admin = kafkaClient.admin();

  console.log("Connecting with kafka admin ......");
  await admin.connect();
  console.log("Admin Connected..");

  const topics = await admin.listTopics()
  console.log("Kafka topics", topics)

  if(!topics.includes(KAFKA_TOPICS.FILE_TRANSFER)){
    console.log("Creating topics");
    await admin.createTopics({
      topics: [
        { topic: KAFKA_TOPICS.FILE_TRANSFER, numPartitions: 1 },
        { topic: KAFKA_TOPICS.VERIFY_FILE, numPartitions: 1 },
        { topic: KAFKA_TOPICS.UPDATE_DB, numPartitions: 1 },
        { topic: KAFKA_TOPICS.DELETE_SOURCE, numPartitions: 1 },
        { topic: KAFKA_TOPICS.DEAD_LETTER, numPartitions: 1 },
      ],
    });
    console.log("Topic created successfully");

  }

  console.log("Admin disconnected");
  await admin.disconnect();
}

