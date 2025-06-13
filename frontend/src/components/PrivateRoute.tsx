import { Navigate, Outlet, useLocation } from "react-router-dom";
import useSession from "../hooks/useSession";

export default function PrivateRoute() {
    const { user, loading } = useSession();
    const location = useLocation();

    if (loading) return <p>Đang kiểm tra đăng nhập...</p>;
    if (!user)
        return <Navigate to="/signin" replace state={{ from: location }} />;

    return <Outlet />;
}
