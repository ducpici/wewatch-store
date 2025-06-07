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

export default function AddFunction() {
    type Function = {
        name: string;
        description: string;
    };
    const initFunction: Function = {
        name: "",
        description: "",
    };
    const [functionData, setFunctionData] = useState<Function>(initFunction);

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Chức vụ", path: "/functions" },
        { label: "Thêm mới" }, // Không có path => là trang hiện tại
    ];

    const navigate = useNavigate();

    const handleCreateFunction = async () => {
        if (!functionData.name || !functionData.description) {
            toast.error("Các trường không được để trống!");
            return;
        }
        try {
            await axios.post(`/functions`, functionData);
            toast.success("Thêm thành công!");
            navigate("/functions");
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
                <ComponentCard title="Thông tin chức năng">
                    <div>
                        <Label htmlFor="name">Tên chức năng:</Label>
                        <Input
                            type="text"
                            id="name"
                            onChange={(e) =>
                                setFunctionData({
                                    ...functionData,
                                    name: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label>Mô tả:</Label>
                        <TextArea
                            placeholder=""
                            rows={6}
                            value={functionData.description}
                            onChange={(e) =>
                                setFunctionData({
                                    ...functionData,
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
                    onClick={handleCreateFunction}
                >
                    Lưu
                </Button>
            </div>
        </>
    );
}
