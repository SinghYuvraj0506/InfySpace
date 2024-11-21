import { OAuth2Client } from "google-auth-library";
import { drive_v3, google } from "googleapis";

class GoogleManager {
    public googleClient: OAuth2Client | null = null;
    private drive: drive_v3.Drive | null = null;

    private static client_id: string = process.env.GOOGLE_CLIENT_ID as string;
    private static client_secret: string = process.env.GOOGLE_CLIENT_SECRET as string;

    constructor(private refresh_token: string,private access_token: string) {
        this.refresh_token = refresh_token;
        this.googleClient = this.connectToGoogle();

        if (this.googleClient) {
            this.drive = google.drive({ version: "v3", auth: this.googleClient });
        } else {
            throw new Error("Failed to initialize Google Client.");
        }
    }

    private connectToGoogle(): OAuth2Client | null {
        try {
            if (!GoogleManager.client_id || !GoogleManager.client_secret || !this.refresh_token || !this.access_token) {
                throw new Error("Missing Google OAuth2 credentials or refresh token.");
            }

            const client = new google.auth.OAuth2(
                GoogleManager.client_id,
                GoogleManager.client_secret
            );

            client.credentials = { refresh_token: this.refresh_token, access_token: this.access_token}
            client.refreshAccessToken()
            return client;
        } catch (error) {
            console.error("Error connecting to Google:", error);
            return null;
        }
    }


    public async listDriveFiles() {
        if (!this.drive) {
            throw new Error("Google Drive client is not initialized.");
        }

        try {
            const res = await this.drive.files.list({
                pageSize: 20,
                fields: "nextPageToken, files(id, name, mimeType, thumbnailLink, size)",
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
}

export default GoogleManager;
