import { useAuth } from "../../providers/AuthProvider";
import { getFileSize } from "../../utils/helper";

type Props = {
  onSelectAccount: (accountId: string) => void;
  onClose: () => void;
  currentAccount: string;
  selectedFilesData:{
    size:number,
    count: number
  }
};

const AccountSelectDialog = ({
  currentAccount,
  onSelectAccount,
  onClose,
  selectedFilesData
}: Props) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-bold mb-4">Select Account</h2>
      <p className="text-sm text-gray-600 mb-4">
        Choose the account where you want to copy the selected files.
      </p>

      {/* Data Summary */}
      <div className="p-4 bg-gray-100 rounded-lg mb-4">
        <p className="text-sm">
          <b>Files Selected:</b> {selectedFilesData?.count}
        </p>
        <p className="text-sm">
          <b>Total Size:</b> {getFileSize(selectedFilesData?.size)}
        </p>
      </div>

      {/* List of accounts */}
      <ul className="space-y-2">
        {user?.Accounts
          ?.filter((account) => account?.id !== currentAccount)
          ?.map((account) => (
            <li
              key={account.id}
              className="flex items-center justify-between border p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelectAccount(account.id)}
            >
              <span>{account.accountEmail}</span>
              <span className="text-sm text-gray-500">{account.provider}</span>
            </li>
          ))}
      </ul>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Cancel
      </button>
    </div>
  );
};

export default AccountSelectDialog;
