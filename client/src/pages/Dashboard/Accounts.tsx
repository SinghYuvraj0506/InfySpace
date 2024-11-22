import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

const Accounts = () => {
  const { user } = useAuth();
  const search = useSearchParams()
  const didMount = useRef(false);
  const navigate = useNavigate()

  const handleGoogleDriveLogin = () => {
    window.open(
      `${import.meta.env.VITE_HOST_URL}/api/v1/auth/drive/google?userId=${
        user?.id
      }`,
      "_self"
    );
  };

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    const query = search[0];

    const errorMessage = query.get("error");
    const successMessage = query.get("success");

    if (errorMessage) {
      toast.error(errorMessage);
    } 
    else if (successMessage) {
      toast.success(successMessage);
    }
  }, [search[0]?.get("error"), search[0]?.get("success")]);
  

  return (
    <div className="flex-1 p-10 text-gray-700">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold">Connected Accounts</h2>
        <button
          onClick={handleGoogleDriveLogin}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md"
        >
          Add Google Drive Account
        </button>
      </div>

      {/* Accounts List */}
      {user?.Accounts?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {user?.Accounts?.map((account) => (
            <div key={account.id} className="bg-white shadow-md rounded-lg p-6" onClick={()=>{
              navigate(`/dashboard/data/${account?.id}`)
            }}>
              <img src={account?.avatar} alt="" className="w-10 h-10 rounded-full"/>
              <h3 className="text-xl font-semibold mb-2">{account.accountEmail}</h3>
              <p className="text-gray-600">{account.provider} Drive</p>
              <span>{new Date(account?.updated_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No accounts connected.</p>
      )}
    </div>
  );
};

export default Accounts;
