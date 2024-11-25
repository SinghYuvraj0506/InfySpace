import React from "react";
import logo from "../../assets/loader.gif"

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      {/* <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-600 border-opacity-75"> */}
        <img src={logo} alt="" className="w-20"/>
      {/* </div> */}
    </div>
  );
};

export default Loader;
