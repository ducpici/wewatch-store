import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PrivateRoute() {
    const { user } = useAuth();
    const location = useLocation();

    if (!user)
        return <Navigate to="/signin" state={{ from: location }} replace />;
    return <Outlet />;
}
