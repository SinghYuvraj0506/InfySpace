export const KAFKA_TOPICS = {
    FILE_TRANSFER: "file_transfer",
    VERIFY_FILE: "verify_file",
    UPDATE_DB: "update_db",
    DELETE_SOURCE: "delete_source",
    DEAD_LETTER: "dead_letter",
  };


  export const UPDATE_DB_KEYS = {
    UPDATE_UPLOAD_URI: "update_upload_uri",
    UPDATE_FINAL_FILE_ID: "update_final_file_id",
    UPDATE_FILE_PROGRESS: "update_file_progress",
  };


  export const FILE_PROGRESS_TYPES = {
    COPYING_PROGRESS: "copy_progress",
    VERIFICATION_PROGRESS: "verification_progress",
    DELETION_PROGRESS: "deletion_progress",
  };