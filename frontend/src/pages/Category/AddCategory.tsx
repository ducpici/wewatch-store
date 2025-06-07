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

export default function AddCategory() {
    type Category = {
        name: string;
        description: string;
    };
    const initBrand: Category = {
        name: "",
        description: "",
    };
    const [categoryData, setCategoryData] = useState<Category>(initBrand);

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Loại sản phẩm", path: "/categories" },
        { label: "Thêm mới" }, // Không có path => là trang hiện tại
    ];

    const navigate = useNavigate();

    const handleCreateBrand = async () => {
        if (!categoryData.name || !categoryData.description) {
            toast.error("Các trường không được để trống!");
            return;
        }
        try {
            await axios.post(`/categories`, categoryData);
            toast.success("Thêm thành công!");
            navigate("/categories");
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
                <ComponentCard title="Thông tin loại sản phẩm">
                    <div>
                        <Label htmlFor="name">Tên loại sản phẩm:</Label>
                        <Input
                            type="text"
                            id="name"
                            onChange={(e) =>
                                setCategoryData({
                                    ...categoryData,
                                    name: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label>Mô tả:</Label>
                        <TextArea
                            // placeholder="Nhập mô tả chức vụ"
                            rows={6}
                            value={categoryData.description}
                            onChange={(e) =>
                                setCategoryData({
                                    ...categoryData,
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
                    onClick={handleCreateBrand}
                >
                    Lưu
                </Button>
            </div>
        </>
    );
}
