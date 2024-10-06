import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ProviderProps } from "../utils/types";
import axiosInstance from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

type AuthContentProps = {
  user: any;
  loading: boolean;
  isAuthenticated: boolean;
  logout?: () => Promise<void>;
};

const authContent = createContext<AuthContentProps>({
  user: {},
  loading: false,
  isAuthenticated: false,
});

export const useAuth = () => {
  return { ...useContext(authContent) };
};

const AuthProvider: React.FC<ProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getUser = async () => {
    try {
      const res = await axiosInstance.get("/user/getAuthUserDetails");
      if (res?.data?.success) {
        setUser(res?.data?.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log("Error in fetching user", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const logout = async () => {
    try {
      const res = await axiosInstance.get("/auth/logout");
      if (res?.data?.success) {
        window.open("/","_self");
      }
    } catch (error) {
      console.log("Error in fetching user", error);
    }
  };

  return (
    <authContent.Provider value={{ loading, user, isAuthenticated, logout }}>
      {children}
    </authContent.Provider>
  );
};

export default AuthProvider;
