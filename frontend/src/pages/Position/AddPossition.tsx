import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useEffect, useState } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import TextArea from "../../components/form/input/TextArea";
import axios from "../../lib/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function AddPosition() {
    type Position = {
        name: string;
        description: string;
    };
    const initPosition: Position = {
        name: "",
        description: "",
    };
    const [positionData, setPositionData] = useState<Position>(initPosition);

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Chức vụ", path: "/positions" },
        { label: "Thêm mới" }, // Không có path => là trang hiện tại
    ];

    const navigate = useNavigate();

    const handleCreatePosition = async () => {
        if (!positionData.name || !positionData.description) {
            toast.error("Các trường không được để trống!");
            return;
        }
        try {
            await axios.post(`/positions`, positionData);
            toast.success("Thêm thành công!");
            navigate("/positions");
        } catch (error) {
            console.error("Lỗi khi thêm:", error);
            toast.error("Thêm thất bại.");
        }
    };

    useEffect(() => {}, []);

    return (
        <>
            <PageBreadcrumb items={breadcrumbItems} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ComponentCard title="Thông tin cá nhân">
                    <div>
                        <Label htmlFor="name">Tên chức vụ:</Label>
                        <Input
                            type="text"
                            id="name"
                            onChange={(e) =>
                                setPositionData({
                                    ...positionData,
                                    name: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label>Mô tả:</Label>
                        <TextArea
                            placeholder="Nhập mô tả chức vụ"
                            rows={6}
                            value={positionData.description}
                            onChange={(e) =>
                                setPositionData({
                                    ...positionData,
                                    description: e.target.value,
                                })
                            }
                        />
                    </div>
                </ComponentCard>
            </div>
            <div>
                <Button
                    className="mt-6"
                    size="sm"
                    variant="primary"
                    onClick={handleCreatePosition}
                >
                    Lưu
                </Button>
            </div>
        </>
    );
}
