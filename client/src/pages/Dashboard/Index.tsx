import React from "react";

const Dashboard: React.FC = () => {
  // Mock data for stats
  const stats = {
    totalTransfers: 120,
    filesTransferred: 340,
    totalSize: "1.2 TB",
  };

  return (
    <div className="p-6 bg-gray-100 h-screen">
      <h1 className="text-3xl font-bold text-teal-700 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Transfers */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Total Transfers</h2>
          <p className="text-4xl font-bold text-teal-600">{stats.totalTransfers}</p>
        </div>

        {/* Files Transferred */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Files Transferred</h2>
          <p className="text-4xl font-bold text-teal-600">{stats.filesTransferred}</p>
        </div>

        {/* Total Size */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Total Size</h2>
          <p className="text-4xl font-bold text-teal-600">{stats.totalSize}</p>
        </div>
      </div>

      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Transfers</h2>
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">
                File Name
              </th>
              <th className="px-4 py-2 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">
                Receiver
              </th>
              <th className="px-4 py-2 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">
                Size
              </th>
              <th className="px-4 py-2 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border-b border-gray-200 text-gray-700">Report.pdf</td>
              <td className="px-4 py-2 border-b border-gray-200 text-gray-700">john.doe@gmail.com</td>
              <td className="px-4 py-2 border-b border-gray-200 text-gray-700">15 MB</td>
              <td className="px-4 py-2 border-b border-gray-200 text-teal-600 font-semibold">Completed</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border-b border-gray-200 text-gray-700">Presentation.ppt</td>
              <td className="px-4 py-2 border-b border-gray-200 text-gray-700">jane.smith@yahoo.com</td>
              <td className="px-4 py-2 border-b border-gray-200 text-gray-700">20 MB</td>
              <td className="px-4 py-2 border-b border-gray-200 text-teal-600 font-semibold">Pending</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
