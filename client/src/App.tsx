import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import DashboardLayout from "./pages/Dashboard/Layout";
import ProtectRoutes from "./utils/ProtectRoutes";
import { useAuth } from "./providers/AuthProvider";
import Accounts from "./pages/Dashboard/Accounts";
import { Toaster } from "react-hot-toast";
import Data from "./pages/Dashboard/Data";
import Transfers from "./pages/Dashboard/Transfers";

const router = (isAuthenticated: boolean, loading: boolean) => {
  return createBrowserRouter([
    {
      path: "/",
      element: <Landing />,
    },
    {
      path: "/login",
      element: (
        <ProtectRoutes
          navigateTo="/dashboard"
          allowed={!isAuthenticated}
          loading={loading}
        />
      ),
      children: [
        {
          path: "/login",
          element: <Login />,
        },
      ],
    },
    {
      path: "/dashboard",
      element: (
        <ProtectRoutes
          navigateTo="/login"
          allowed={isAuthenticated}
          loading={loading}
        />
      ),
      children: [
        {
          path: "/dashboard",
          element: <DashboardLayout />,
          children: [
            {
              path: "",
              element: <div>dashboard page</div>,
            },
            {
              path: "accounts",
              element: <Accounts />,
            },
            {
              path: "transfers",
              element: <Transfers />,
            },
            {
              path: "data",
              children:[
                {
                  path: ":accountId",
                  element: <Data/>,
                },
              ]
            },
          ],
        },
      ],
    },
  ]);
};

function App() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <div className="w-full h-full">
      <RouterProvider
        router={router(isAuthenticated || false, loading || false)}
      />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default App;
