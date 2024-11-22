import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";
import { Files } from "../../utils/types";
import { getFileSize } from "../../utils/helper";
import DialogWrapper from "../../components/hoc/DialogWrapper";
import AccountSelectDialog from "../../components/dialogs/AccountSelectDialog";

const Data = () => {
  const { accountId } = useParams();

  const [filesData, setFilesData] = useState<Files[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate()

  const getFiles = async () => {
    try {
      const res = await axiosInstance.get(
        `/accounts/getDriveFiles/${accountId}`
      );
      if (res?.data?.success) {
        setFilesData(res?.data?.data);
      }
    } catch (error) {
      console.log("Error in fetching user", error);
    }
  };

  const [selectedFiles, setSelectedFiles] = useState<
    { id: string; size: number, mimeType: string, name:string }[]
  >([]);

  // Handle checkbox selection
  const handleCheckboxChange = (fileId: string, fileSize: number, mimeType:string, fileName:string) => {
    setSelectedFiles((prevSelected) =>
      prevSelected?.map((e) => e?.id).includes(fileId)
        ? prevSelected.filter((file) => file?.id !== fileId)
        : [...prevSelected, { id: fileId, size: parseInt(fileSize.toString()), mimeType, name:fileName }]
    );
  };

  useEffect(() => {
    if (accountId) {
      getFiles();
    }
  }, [accountId]);

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  const handleAccountSelect = async (currentAccountId: string) => {
    try {
      const res = await axiosInstance.post(`/transfers/initialize`, {
        fromAccountId: accountId,
        toAccountId: currentAccountId,
        files: selectedFiles?.map((file)=>({
          ...file,
          size: file?.size.toString()
        })),
      });
      if (res?.data?.success) {
        setFilesData(res?.data?.data);
        closeDialog();
        navigate("/dashboard/transfers")
      }
    } catch (error) {
      console.log("Error in fetching user", error);
    }
  };

  return (
    <>
      {/* Dialog */}
      <DialogWrapper isOpen={isDialogOpen} onClose={closeDialog}>
        <AccountSelectDialog
          currentAccount={accountId as string}
          onSelectAccount={handleAccountSelect}
          onClose={closeDialog}
          selectedFilesData={{
            count: selectedFiles?.length,
            size: selectedFiles?.reduce((acc, curr) => (acc += curr?.size), 0),
          }}
        />
      </DialogWrapper>

      <div className="h-screen overflow-auto p-4 space-y-8">
        {/* Header with Copy to Drive button */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-2xl">Files</h2>
          <button
            onClick={openDialog}
            disabled={selectedFiles.length === 0}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              selectedFiles.length > 0
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Copy to Drive
          </button>
        </div>

        {/* File cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filesData?.map((file) => (
            <div
              key={file?.id}
              className="flex flex-col border rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow"
            >
              {/* Checkbox */}
              <div className="flex items-center p-2">
                <input
                  type="checkbox"
                  checked={selectedFiles?.map((e) => e?.id).includes(file?.id)}
                  onChange={() => handleCheckboxChange(file?.id, file?.size, file?.mimeType, file?.name)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              {/* Thumbnail */}
              <div className="h-40 w-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {file?.thumbnailLink ? (
                  <img
                    src={file?.thumbnailLink}
                    alt={file?.name}
                    className="h-full object-cover w-full"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">No Thumbnail</span>
                )}
              </div>

              {/* File details */}
              <div className="p-4 flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-700 truncate">
                  {file?.name}
                </span>
                <span className="text-xs text-gray-500">{file?.mimeType}</span>
                {file?.size && (
                  <span className="text-xs text-gray-500">
                    Size: {getFileSize(file?.size)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Data;
