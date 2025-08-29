import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useEffect, useState } from "react";
import Label from "../../components/form/Label";
import Switch from "../../components/form/switch/Switch";
import FileInput from "../../components/form/input/FileInput";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import axios from "../../lib/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
const BASE_URL = import.meta.env.VITE_BASE_URL;
export default function EditBanner() {
    const { id } = useParams();
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
        { label: "Cập nhật" }, // Không có path => là trang hiện tại
    ];

    const navigate = useNavigate();

    const handleUpdateBanner = async () => {
        if (
            !bannerData.image_name &&
            typeof bannerData.image_name !== "string"
        ) {
            toast.warning(
                "Bạn chưa chọn ảnh mới. Ảnh hiện tại sẽ được giữ nguyên."
            );
        }
        try {
            const formData = new FormData();
            if (bannerData.image_name instanceof File) {
                formData.append("file", bannerData.image_name);
            }
            formData.append("state", bannerData.state ? "1" : "0");
            formData.append("type", "banners");
            await axios.put(`/banners/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Cập nhật thành công!");
            navigate("/banners");
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
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
    const getDataById = () => {
        if (!id) return;
        axios
            .get(`/banners/${id}`)
            .then((response) => {
                const data = response.data.data[0];

                if (data) {
                    setBannerData(data);
                    setIsEnabled(data.state);
                } else {
                    toast.error("Không tìm thấy!");
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {});
    };

    useEffect(() => {
        getDataById();
    }, [id]);

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
                    {bannerData.image_name &&
                        typeof bannerData.image_name === "string" && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600 mb-1">
                                    Ảnh hiện tại:
                                </p>
                                <img
                                    src={`${BASE_URL}${bannerData.image_name}`}
                                    alt="Ảnh banner hiện tại"
                                    className="w-64 rounded border"
                                />
                            </div>
                        )}
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
                    onClick={handleUpdateBanner}
                >
                    Lưu
                </Button>
            </div>
        </>
    );
}
