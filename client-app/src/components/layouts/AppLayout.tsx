// import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import Header from "./DefaultLayout/Header";
import Footer from "./DefaultLayout/Footer";

const LayoutContent: React.FC = () => {
  return (
    <div className="app text-gray-700">
      <Header />
      <div className="pt-[65px] md:pt-[180px] pb-2">
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
