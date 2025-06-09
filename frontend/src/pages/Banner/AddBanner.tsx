import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useEffect, useState } from "react";
import Label from "../../components/form/Label";
import Switch from "../../components/form/switch/Switch";
import FileInput from "../../components/form/input/FileInput";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import axios from "../../lib/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function AddBanner() {
    type Banner = {
        image_name: File | null;
        state: boolean;
    };
    const initBanner: Banner = {
        image_name: null,
        state: true,
    };
    const [bannerData, setBannerData] = useState<Banner>(initBanner);
    const [isEnabled, setIsEnabled] = useState(true);
    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Banner", path: "/banners" },
        { label: "Thêm mới" }, // Không có path => là trang hiện tại
    ];

    const navigate = useNavigate();

    const handleCreateBanner = async () => {
        if (!bannerData.image_name) {
            toast.error("Các trường không được để trống!");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("file", bannerData.image_name); // file ảnh thực
            formData.append("state", bannerData.state ? "1" : "0");
            formData.append("type", "banners");
            await axios.post(`/banners`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Thêm thành công!");
            navigate("/banners");
        } catch (error) {
            console.error("Lỗi khi thêm:", error);
            toast.error("Thêm thất bại.");
        }
    };
    const handleSwitchChange = (checked: boolean) => {
        setIsEnabled(checked);
        setBannerData({
            ...bannerData,
            state: checked,
        });
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setBannerData({
                ...bannerData,
                image_name: file,
            });
        }
    };

    useEffect(() => {}, []);

    return (
        <>
            <PageBreadcrumb items={breadcrumbItems} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ComponentCard title="Thông tin banner">
                    <div>
                        <Label>Upload file</Label>
                        <FileInput
                            onChange={handleFileChange}
                            className="custom-class"
                        />
                    </div>
                    <div className="flex items-center">
                        <Label className="mb-0">Trạng thái:</Label>
                        <div className="ml-6">
                            <Switch
                                label={isEnabled ? "Hoạt động" : "Vô hiệu"}
                                checked={isEnabled}
                                onChange={handleSwitchChange}
                            />
                        </div>
                    </div>
                </ComponentCard>
            </div>
            <div>
                <Button
                    className="mt-6"
                    size="sm"
                    variant="primary"
                    onClick={handleCreateBanner}
                >
                    Lưu
                </Button>
            </div>
        </>
    );
}
