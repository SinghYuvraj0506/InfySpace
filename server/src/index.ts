import dotenv from "dotenv";
import app from "./app";
import kafkaAdmin from "./kafka/admin";
dotenv.config();

kafkaAdmin()
  .then((e) => {
    app.on("error", (err: any) => {
      console.log("Error occured in express server", err);
      throw err;
    });

    app.listen(process.env.PORT, () => {
      console.log("Server running at port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("Caught error in connecting Kafka admin");
  });
