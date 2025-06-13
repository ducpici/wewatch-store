import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import useSession from "../hooks/useSession";
import axios from "../lib/axiosConfig";
import { useEffect, useState } from "react";

export default function UserProfiles() {
    const { user } = useSession();
    const [data, setData] = useState([]);

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Thông tin cá nhân", path: "/profile" },
    ];

    const fetchData = async () => {
        const res = await axios.get(`/employees/${user?.id}`);
        setData(res.data[0]);
    };

    useEffect(() => {
        fetchData();
    }, [user?.id]);

    return (
        <>
            <PageMeta
                title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb items={breadcrumbItems} />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                    Profile
                </h3>
                <div className="space-y-6">
                    <UserMetaCard />
                    <UserInfoCard />
                    <UserAddressCard />
                </div>
            </div>
        </>
    );
}
