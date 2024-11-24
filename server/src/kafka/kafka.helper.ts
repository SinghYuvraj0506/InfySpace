import { EachMessageHandler, Message } from "kafkajs";
import kafkaClient from "../config/kafka.config";

export const produceMessage = async ({
  topic,
  message,
}: {
  topic: string;
  message: Message;
}) => {
  try {
    const producer = kafkaClient.producer();
    await producer.connect();

    await producer.send({
      topic: topic,
      messages: [message],
    });
    console.log('Kafks message produced for topic:', topic)

    await producer.disconnect()
  } catch (error) {
    console.log("Error occured in producing message on topic: ", topic)
  }
};


export const consumeMessage = async ({
    topics,
    eachMessageHandler
  }: {
    topics: string[];
    eachMessageHandler: EachMessageHandler;
  }) => {
    try {
      const consumer = kafkaClient.consumer({groupId:'user-1'});
      await consumer.connect();

      await consumer.subscribe({
        topics: topics,
        fromBeginning: true
      });

      await consumer.run({
        eachMessage:  eachMessageHandler
    })
  
    } catch (error) {
      console.log("Error occured in consuming message on topics: ", topics)
    }
  };
