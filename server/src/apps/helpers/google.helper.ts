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
          expiry: moment(new Date()).add(7, 'days').toDate()
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
}: {
  googleClient: GoogleManager;
  file: DriveFileType;
  fileTransferId: string;
  uploadUri: string;
  sourceStream: any;
}) => {
  try {
    let startByte = 0;
    let byteFactor = 256 * 1024 * 10; // 2.5mb
    let previousBuffer = Buffer.alloc(0);

    for await (const chunk of sourceStream) {
      console.log(
        `Startbyte - ${startByte}, Buffer size: ${previousBuffer?.length} , Chunk Size: ${chunk?.length}`
      );
      // check for basic size --------------
      previousBuffer = Buffer.concat([previousBuffer, chunk]);

      if (previousBuffer.length < byteFactor) {
        continue;
      }

      const offset = previousBuffer?.length % byteFactor;
      const finalBuffer = previousBuffer?.slice(
        0,
        previousBuffer?.length - offset
      );

      const res = await googleClient.uploadChuncksOnUri(
        startByte,
        file?.size,
        finalBuffer,
        uploadUri
      );

      startByte += finalBuffer.length;
      previousBuffer = previousBuffer?.slice(previousBuffer?.length - offset);

      //  update the progresss -----------------------------------------
      await produceMessage({
        topic: KAFKA_TOPICS.UPDATE_DB,
        message: {
          key: UPDATE_DB_KEYS.UPDATE_FILE_PROGRESS,
          value: JSON.stringify({
            type: FILE_PROGRESS_TYPES.COPYING_PROGRESS,
            fileTransferId: fileTransferId,
            value: ((startByte / file?.size) * 100).toFixed(0),
          }),
        },
      });

      console.log(`Uploaded chunk: ${startByte}/${file?.size}`);
    }

    // deploy last chunk -------
    if (previousBuffer?.length > 0) {
      const res = await googleClient.uploadChuncksOnUri(
        startByte,
        file?.size,
        previousBuffer,
        uploadUri
      );

      // update final id in db and also progress ----------------------
      if (res?.id) {
        await produceMessage({
          topic: KAFKA_TOPICS.UPDATE_DB,
          message: {
            key: UPDATE_DB_KEYS.UPDATE_FINAL_FILE_ID,
            value: JSON.stringify({
              fileTransferId: fileTransferId,
              id: res?.id,
            }),
          },
        });
      }
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
      uploadUri: resumableUri
    });
  } catch (error) {
    console.log("error -> APPS>HELPERS>DRIVEFILETRANSFER :::----:::", error);
  }
};
