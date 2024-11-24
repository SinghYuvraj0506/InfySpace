import moment from "moment";
import { produceMessage } from "../../kafka/kafka.helper";
import {
  FILE_PROGRESS_TYPES,
  KAFKA_TOPICS,
  UPDATE_DB_KEYS,
} from "../../utils/constants";
import GoogleManager from "../googleManager";
import { DriveFileType } from "../../types/custom";

interface driveFileTransferInterface {
  refreshTokenSenderAccount: string;
  refreshTokenRecieverAccount: string;
  file: DriveFileType;
  fileTransferId: string;
  resumableUri?: string;
}

const generateResumableUploadUri = async ({
  googleClient,
  file,
  fileTransferId,
}: {
  googleClient: GoogleManager;
  file: DriveFileType;
  fileTransferId: string;
}) => {
  try {
    const resumableUri = await googleClient.getResumableUploadUri(
      file?.name,
      file?.size,
      file?.mimeType
    );

    if (!resumableUri) {
      throw new Error("");
    }

    // update uri in db ----------------------
    await produceMessage({
      topic: KAFKA_TOPICS.UPDATE_DB,
      message: {
        key: UPDATE_DB_KEYS.UPDATE_UPLOAD_URI,
        value: JSON.stringify({
          fileTransferId: fileTransferId,
          uri: resumableUri,
          expiry: moment().add(7, "day").date(),
        }),
      },
    });

    return resumableUri;
  } catch (error) {
    throw new Error(
      `error -> APPS>HELPERS>GENERATERESUMABLEURI: ${file?.name}`
    );
  }
};

const updateFileChuncks = async ({
  googleClient,
  file,
  fileTransferId,
  uploadUri,
  sourceStream,
  fileSize
}: {
  googleClient: GoogleManager;
  file: DriveFileType;
  fileTransferId: string;
  uploadUri: string;
  sourceStream: any;
  fileSize: number
}) => {
  try {
    let startByte = 0;

    for await (const chunk of sourceStream) {
      const res = await googleClient.uploadChuncksOnUri(
        startByte,
        file?.size,
        chunk,
        uploadUri
      );

      // update final id in db and also progress ----------------------
      if (res) {
        await produceMessage({
          topic: KAFKA_TOPICS.UPDATE_DB,
          message: {
            key: UPDATE_DB_KEYS.UPDATE_FINAL_FILE_ID,
            value: JSON.stringify({
              fileTransferId: fileTransferId,
              id: res.id,
            }),
          },
        });
      }

      startByte += chunk.length;

      //  update the progresss -----------------------------------------
      await produceMessage({
        topic: KAFKA_TOPICS.UPDATE_DB,
        message: {
          key: FILE_PROGRESS_TYPES.COPYING_PROGRESS,
          value: JSON.stringify({
            fileTransferId: fileTransferId,
            value: ((startByte/fileSize) * 100).toFixed(0),
          }),
        },
      });

      console.log(`Uploaded chunk: ${startByte}/${file?.size}`);
    }
  } catch (error) {
    throw new Error(`error -> APPS>HELPERS>UPDATEFILECHUNCKS: ${file?.name}`);
  }
};

export const driveFileTransfer = async ({
  refreshTokenRecieverAccount,
  refreshTokenSenderAccount,
  file,
  fileTransferId,
  resumableUri,
}: driveFileTransferInterface) => {
  try {
    const senderGoogleClient = new GoogleManager(refreshTokenSenderAccount);
    const recieverGoogleClient = new GoogleManager(refreshTokenRecieverAccount);

    if (!resumableUri) {
      resumableUri = await generateResumableUploadUri({
        googleClient: recieverGoogleClient,
        file,
        fileTransferId,
      });
    }

    const sourceStream = await senderGoogleClient.getFileReadableStream(
      file.id,
      file.name
    );

    await updateFileChuncks({
      googleClient: recieverGoogleClient,
      file,
      fileTransferId,
      sourceStream: sourceStream?.data,
      uploadUri: resumableUri,
    });
  } catch (error) {
    console.log("error -> APPS>HELPERS>DRIVEFILETRANSFER :::----:::", error);
  }
};
