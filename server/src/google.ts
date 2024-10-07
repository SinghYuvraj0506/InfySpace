import * as fs from "fs";
import path from "path";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { drive_v3, google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

fs.promises;

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive","profile","email"];
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

async function loadSavedCredentialsIfExist() {
  try {
    const content = fs.readFileSync(TOKEN_PATH).toString();
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client: OAuth2Client) {
  const data = fs.readFileSync(CREDENTIALS_PATH).toString();
  const keys = JSON.parse(data);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  fs.writeFile(TOKEN_PATH, payload, () => {
    console.log("Toekn written successfully");
  });
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client as OAuth2Client;
  }

  let client2 = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  console.log(client2)
  if (client2.credentials) {
    await saveCredentials(client2);
  }
  return client;
}

async function listFiles(drive: drive_v3.Drive) {
  const res = await drive.files.list({
    pageSize: 10,
    // fields: "nextPageToken, files(id, name)",
  });
  const files = res.data.files;
  if (files?.length === 0) {
    console.log("No files found.");
    return;
  }

  return files;
}

async function getFileDetail(
  drive: drive_v3.Drive,
  fileId: string,
  fileName: string
) {
  try {
    const file = await drive.files.get(
      {
        fileId: fileId,
        alt: "media",
      },
      { responseType: "stream" }
    );

    if (file?.status !== 200) {
      console.log("Could not get file" + fileName);
      throw new Error("Could not get file" + fileName);
    }

    // Write the file to the filesystem
    const dest = fs.createWriteStream(`./public/${fileName}`);
    file.data.pipe(dest);

    dest.on("finish", () => {
      console.log("File written successfully - ", fileName);
    });

    dest.on("error", (err) => {
      console.error("Error writing file", err);
    });
  } catch (error: any) {
    console.error("Error downloading the file");
  }
}

async function uploadFile(authClient: OAuth2Client, filePath: string) {
  try {
    const drive = google.drive({ version: "v3", auth: authClient });

    const res = await drive.files.create({
      requestBody: {
        name: "Demo.txt",
      },
      media: {
        body: fs.createReadStream("Demo.txt"),
      },
    });

    console.log(res.data);
  } catch (error) {
    console.log(error);
    console.log("Got error while uploading the file");
  }
}

async function listAndDonwloadFiles(authClient: OAuth2Client) {
  const drive = google.drive({ version: "v3", auth: authClient });

  try {
    const files = await listFiles(drive);

    files?.forEach(async (file) => {
      console.log("Processing file - ", file?.name);
      await getFileDetail(drive, file?.id as string, file?.name as string);
    });
  } catch (error) {
    console.log("Error in listing and downloading files");
  }
}

// authorize().then((e)=>e && uploadFile(e,"")).catch(console.error);
authorize()
  // .catch(console.error);
