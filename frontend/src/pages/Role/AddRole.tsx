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

export default function AddRole() {
    type Role = {
        name: string;
        url: string;
        description: string;
    };
    const initRole: Role = {
        name: "",
        url: "",
        description: "",
    };
    const [roleData, setRoleData] = useState<Role>(initRole);

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Quyền", path: "/roles" },
        { label: "Thêm mới" }, // Không có path => là trang hiện tại
    ];

    const navigate = useNavigate();

    const handleCreateRole = async () => {
        if (!roleData.name || !roleData.description || !roleData.url) {
            toast.error("Các trường không được để trống!");
            return;
        }
        try {
            await axios.post(`/roles`, roleData);
            toast.success("Thêm thành công!");
            navigate("/roles");
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
                <ComponentCard title="Thông tin quyền">
                    <div>
                        <Label htmlFor="role">Tên quyền:</Label>
                        <Input
                            type="text"
                            id="role"
                            onChange={(e) =>
                                setRoleData({
                                    ...roleData,
                                    name: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label htmlFor="url">Đường dẫn:</Label>
                        <Input
                            type="text"
                            id="url"
                            onChange={(e) =>
                                setRoleData({
                                    ...roleData,
                                    url: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label>Mô tả:</Label>
                        <TextArea
                            placeholder=""
                            rows={6}
                            value={roleData.description}
                            onChange={(e) =>
                                setRoleData({
                                    ...roleData,
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
                    onClick={handleCreateRole}
                >
                    Lưu
                </Button>
            </div>
        </>
    );
}
