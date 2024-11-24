
import React from "react";

const Login: React.FC = () => {
     const handleGoogleLogin = () => {
        window.open(`${import.meta.env.VITE_HOST_URL}/api/v1/auth/google`,"_self")
    }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-teal-700 mb-6">
          Welcome to InfySpace
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Manage all your drives in one place with secure access. Login with Google to get started.
        </p>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-4 bg-teal-600 text-white px-6 py-3 w-full rounded-md hover:bg-teal-700"
        >
          <img
            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
            alt="Google Logo"
            className="w-6 h-6"
          />
          <span className="text-lg font-medium">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
