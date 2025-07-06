// import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import Header from "./DefaultLayout/Header";
import Footer from "./DefaultLayout/Footer";

const LayoutContent: React.FC = () => {
    return (
        <div className="app text-gray-700">
            <div className="py-2 bg-gray-200 hidden md:block">
                <p className="text-center font-semibold">
                    Đăng ký để nhận tin tức mới nhất!
                </p>
            </div>
            <Header />
            <div className="container px-3 md:max-w-6xl m-auto mb-10">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

const AppLayout: React.FC = () => {
    return <LayoutContent />;
};

export default AppLayout;
