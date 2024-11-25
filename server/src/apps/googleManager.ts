import { OAuth2Client } from "google-auth-library";
import { drive_v3, google } from "googleapis";
import fs from "fs";
import axios from "axios";

class GoogleManager {
  public googleClient: OAuth2Client | null = null;
  private drive: drive_v3.Drive | null = null;

  private static client_id: string = process.env.GOOGLE_CLIENT_ID as string;
  private static client_secret: string = process.env
    .GOOGLE_CLIENT_SECRET as string;

  constructor(private refresh_token: string, private email: string) {
    this.refresh_token = refresh_token;
    this.email = email;
    this.googleClient = this.connectToGoogle();

    if (this.googleClient) {
      this.drive = google.drive({ version: "v3", auth: this.googleClient });
    } else {
      throw new Error("Failed to initialize Google Client.");
    }
  }

  private connectToGoogle(): OAuth2Client | null {
    try {
      if (
        !GoogleManager.client_id ||
        !GoogleManager.client_secret ||
        !this.refresh_token
      ) {
        throw new Error("Missing Google OAuth2 credentials or refresh token.");
      }
      const client = new google.auth.OAuth2(
        GoogleManager.client_id,
        GoogleManager.client_secret
      );
      client.setCredentials({ refresh_token: this.refresh_token });
      return client;
    } catch (error) {
      console.error("Error connecting to Google:", error);
      return null;
    }
  }

  private requestGoogle = async (
    requestType: "post" | "put",
    url: string,
    requestBody: any,
    headers?: any
  ) => {
    try {
      const accessToken = await this.googleClient?.getAccessToken();
      const res = await axios[requestType](url, requestBody, {
        headers: {
          Authorization: `Bearer ${accessToken?.token}`,
          "Content-Type": "application/json",
          ...headers,
        },
        validateStatus: (status) => {
          // Treat 308 as a valid response
          return (status >= 200 && status < 300) || status === 308;
        },
      });

      return res;
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
      console.log("Could not request axios");
      throw new Error("Error Request");
    }
  };

  public async listDriveFiles() {
    if (!this.drive) {
      throw new Error("Google Drive client is not initialized.");
    }

    const query = `mimeType != 'application/vnd.google-apps.folder' and mimeType != 'application/vnd.google-apps.shortcut' and trashed != true and '${this.email}' in owners` ;

    try {
      const res = await this.drive.files.list({
        q: query,
        pageSize: 20,
        fields: "nextPageToken, files(id, name, mimeType, thumbnailLink, size, md5Checksum, sha256Checksum, capabilities)",
      });

      const files = res.data.files;

      if (!files || files.length === 0) {
        console.log("No files found.");
        return [];
      }

      return files;
    } catch (error) {
      console.error("Error listing Drive files:", error);
      throw error;
    }
  }

  public async getDriveFileById(fileId: string) {
    if (!this.drive) {
      throw new Error("Google Drive client is not initialized.");
    }

    try {
      const file = await this.drive.files.get(
        {
          fileId: fileId,
          fields:'id, name, mimeType, thumbnailLink, size, md5Checksum, sha256Checksum, sha1Checksum, trashed'
        }
      );

      if (!file) {
        throw new Error("No File Found");
      }

      return file;
    } catch (error) {
      console.error("Error fethcing Drive files:", error);
      throw new Error("Error in Fetching the file from drive");
    }
  }

  public async getFileReadableStream(fileId: string, fileName: string) {
    if (!this.drive) {
      throw new Error("Google Drive client is not initialized.");
    }

    try {
      const file = await this.drive.files.get(
        {
          fileId: fileId,
          alt: "media",
        },
        {
          responseType: "stream",
        }
      );

      if (!file) {
        throw new Error("File Cannot be Downloaded");
      }

      return file;
    } catch (error) {
      console.error("Error fethcing Drive files:", error);
      throw new Error("Error in Fetching the file from drive");
    }
  }

  public async getResumableUploadUri(
    fileName: string,
    fileSize: number,
    mimeType?: string
  ) {
    if (!this.drive) {
      throw new Error("Google Drive client is not initialized.");
    }

    try {
      const requestBody = {
        name: fileName,
        mimeType: mimeType ?? "application/octet-stream",
        contentLength: fileSize,
      };

      const uriData = await this.requestGoogle(
        "post",
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable",
        requestBody
      );

      return uriData?.headers?.location as string;
    } catch (error) {
      console.error("Error in getting resumable uri's", error);
      throw new Error("Error in Uploading files:");
    }
  }

  public async trashFileById(fileId: string) {
    if (!this.drive) {
      throw new Error("Google Drive client is not initialized.");
    }

    try {
      const file = await this.drive.files.update(
        {
          fileId: fileId,
          requestBody:{
            'trashed': true
          }
        }
      );

      if (!file) {
        throw new Error("No File Found");
      }

      return file;
    } catch (error) {
      console.error("Error Trashing the Drive files:", error);
      throw new Error("Error Trashing the Drive files");
    }
  }

  public async uploadChuncksOnUri(
    startByte: number,
    totalSize: number,
    chunk: any,
    uploadURI: string
  ) {
    try {
      const endByte = startByte + chunk.length - 1;
      const headers = {
        "Content-Range": `bytes ${startByte}-${endByte}/${totalSize}`,
        "Content-Type": "application/octet-stream",
      };
      
      console.log(`Sending bytes ${startByte}-${endByte}/${totalSize}`);
      const res = await this.requestGoogle("put", uploadURI, chunk, headers);
      return res?.data;
    } catch (error) {
      console.error(
        `Error in uploading chunck: bytes ${startByte}-${
          startByte + chunk?.length - 1
        }`,
        error
      );
      throw error;
    }
  }
}

export default GoogleManager;
