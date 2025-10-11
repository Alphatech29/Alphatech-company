import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./authContext";

export default function PrivateRoute() {
  const { token } = useAuth();

  return token ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
