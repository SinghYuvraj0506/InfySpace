
export const getFileSize = (size:number) => {
    try {
        const baseMetric = 1024;
        let tempSize = size/baseMetric   //(in kbs)
        if(tempSize < baseMetric){
            return `${tempSize.toFixed(2)} KB`
        }

        tempSize = tempSize/baseMetric  //(in mbs)
        if(tempSize < baseMetric){
             return `${tempSize.toFixed(2)} MB`
        }

        //(in gbs)
        return `${(tempSize/1024).toFixed(2)} GB`
        
    } catch (err) {
        console.log("errro in solving")
        return null
    }
}

export const getFileTypeChip = (mimeType:string) => {
    // Blob File Types
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType.startsWith('video/')) return 'Video';
    if (mimeType.startsWith('audio/')) return 'Audio';
    if (mimeType === 'application/pdf') return 'PDF';
    if (mimeType.startsWith('application/zip')) return 'Archive';

    // Google Workspace Document Types
    if (mimeType === 'application/vnd.google-apps.document') return 'Google Docs';
    if (mimeType === 'application/vnd.google-apps.spreadsheet') return 'Google Sheets';
    if (mimeType === 'application/vnd.google-apps.presentation') return 'Google Slides';

    // Folder Type
    if (mimeType === 'application/vnd.google-apps.folder') return 'Folder';

    // Shortcut and Third-party Shortcut
    if (mimeType === 'application/vnd.google-apps.shortcut') return 'Shortcut';
    if (mimeType === 'application/vnd.google-apps.drive-sdk') return 'Third-party Shortcut';

    // Default fallback for unrecognized MIME types
    return 'Unknown';
  };