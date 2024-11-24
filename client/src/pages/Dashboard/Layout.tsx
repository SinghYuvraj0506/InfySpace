import Sidebar from "../../components/Sidebar";
import { Outlet } from "react-router-dom";

const Index = () => {
  return (
    <div className="w-screen h-screen flex items-start overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-auto h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Index;
