import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import DashboardLayout from "./pages/Dashboard/Layout";
import ProtectRoutes from "./utils/ProtectRoutes";
import { useAuth } from "./providers/AuthProvider";
import Accounts from "./pages/Dashboard/Accounts";

const router = (isAuthenticated: boolean, loading:boolean) => {
  return createBrowserRouter([
    {
      path: "/",
      element: <Landing />,
    },
    {
      path: "/login",
      element: (
        <ProtectRoutes navigateTo="/dashboard" allowed={!isAuthenticated} loading={loading} />
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
      element: <ProtectRoutes navigateTo="/login" allowed={isAuthenticated} loading={loading}/>,
      children: [
        {
          path: "/dashboard",
          element: <DashboardLayout />,
          children: [
            {
              path: "/dashboard/",
              element: <div>dashboard page</div>,
            },
            {
              path: "/dashboard/accounts",
              element: <Accounts/>,
            },
            {
              path: "/dashboard/data",
              element: <div>data</div>,
            },
          ],
        },
      ],
    },
  ]);
};

function App() {
  const {isAuthenticated, loading} = useAuth();

  return (
    <div className="w-full h-full">
      <RouterProvider router={router(isAuthenticated || false, loading || false)} />
    </div>
  );
}

export default App;
