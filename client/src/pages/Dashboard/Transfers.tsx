import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { Transfer } from "../../utils/types";
import { getFileSize } from "../../utils/helper";

const Transfers = () => {
  const [transferData, setTransferData] = useState<Transfer[]>([]);

  const getTransfers = async () => {
    try {
      const res = await axiosInstance.get(`/transfers/getAll`);
      if (res?.data?.success) {
        setTransferData(res?.data?.data);
      }
    } catch (error) {
      console.log("Error in fetching transfers data", error);
    }
  };

  useEffect(() => {
    getTransfers();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">File Transfers</h1>
      <p className="text-gray-600">
        Track the progress of your file transfers below.
      </p>

      {/* Transfers List */}
      <div className="space-y-4">
        {transferData?.map((transfer) => (
          <TransferItem
            key={transfer.id}
            transfer={transfer}
          />
        ))}
      </div>
    </div>
  );
};


const TransferItem = ({ transfer }: {transfer: Transfer}) => {
    const [showFiles, setShowFiles] = useState(false);
  
    return (
      <div className="border rounded-lg p-4 shadow-sm">
        {/* Transfer Overview */}
        <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-3">
            <img
              src={transfer?.fromAccount?.avatar}
              alt="From Account Avatar"
              className="w-10 h-10 rounded-full"
            />
             <span className="font-semibold">{transfer?.fromAccount?.accountEmail}</span>

             </div>
             <span className="text-gray-500 text-sm">→</span>
          <div className="flex items-center space-x-3">
            <img
              src={transfer?.toAccount?.avatar}
              alt="From Account Avatar"
              className="w-10 h-10 rounded-full"
            />
             <span className="font-semibold">{transfer?.toAccount?.accountEmail}</span>

             </div>
          </div>
          <div className="text-sm text-gray-500">
            <span>{new Date(transfer?.created_at).toLocaleDateString()}</span>
          </div>
        </div>
  
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress: {transfer?.progress}%</span>
            <span>Total Size: {getFileSize(parseInt(transfer?.transferSize))}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full"
              style={{ width: `${transfer?.progress}%` }}
            ></div>
          </div>
        </div>
  
        {/* Toggle Files */}
        <button
          onClick={() => setShowFiles((prev) => !prev)}
          className="text-blue-500 hover:underline text-sm"
        >
          {showFiles ? "Hide Files" : "View Files"}
        </button>
  
        {/* Files Section */}
        {showFiles && (
          <div className="mt-4 space-y-2">
            {transfer?.files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between border p-3 rounded-lg bg-gray-50"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{file.name}</span>
                  <span className="text-sm text-gray-500">
                    Size: {getFileSize(parseInt(file?.size))}
                  </span>
                </div>
                <div className="w-24">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{file?.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${file?.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

export default Transfers;