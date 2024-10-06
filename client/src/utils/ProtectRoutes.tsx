import { Navigate, Outlet } from "react-router-dom";

type Props = {
  navigateTo: string
  allowed: boolean;
  loading?: boolean
};

const ProtectRoutes = ({ navigateTo, allowed, loading = false }: Props) => {
  return loading ? <div>Loading....</div> : (allowed ? <Outlet/> : <Navigate to={navigateTo} />);;
};

export default ProtectRoutes;
