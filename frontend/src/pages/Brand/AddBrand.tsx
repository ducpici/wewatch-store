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
import { isValidEmail } from "../../lib/validationEmail";
import { isValidName } from "../../lib/validateName";
import { isValidPhoneNum } from "../../lib/validatePhoneNum";

export default function AddBrand() {
    type Brand = {
        name: string;
        description: string;
        email: string;
        phone_num: string;
    };
    const initBrand: Brand = {
        name: "",
        description: "",
        email: "",
        phone_num: "",
    };
    const [brandData, setBrandData] = useState<Brand>(initBrand);

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Nhà cung cấp", path: "/brands" },
        { label: "Thêm mới" }, // Không có path => là trang hiện tại
    ];

    const navigate = useNavigate();

    const handleCreateBrand = async () => {
        if (
            !brandData.name ||
            !brandData.description ||
            !brandData.email ||
            !brandData.phone_num
        ) {
            toast.error("Các trường không được để trống!");
            return;
        }
        if (!isValidPhoneNum(brandData.phone_num)) {
            toast.error("Số điện thoại không hợp lệ!");
            return;
        }
        if (!isValidEmail(brandData.email)) {
            toast.error("Email không hợp lệ!");
            return;
        }
        try {
            // Gọi API kiểm tra email
            const { email } = brandData;

            const { data } = await axios.get("/brands/check", {
                params: {
                    email,
                },
            });

            if (data.emailExists) {
                toast.error("Email đã được sử dụng!");
                return;
            }
            await axios.post(`/brands`, brandData);
            toast.success("Thêm thành công!");
            navigate("/brands");
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
                <ComponentCard title="Thông tin nhà cung cấp">
                    <div>
                        <Label htmlFor="name">Tên nhà cung cấp:</Label>
                        <Input
                            type="text"
                            id="name"
                            onChange={(e) =>
                                setBrandData({
                                    ...brandData,
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
                            value={brandData.description}
                            onChange={(e) =>
                                setBrandData({
                                    ...brandData,
                                    description: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label htmlFor="email">Email:</Label>
                        <Input
                            type="text"
                            id="email"
                            onChange={(e) =>
                                setBrandData({
                                    ...brandData,
                                    email: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label htmlFor="phone_num">Số điện thoại:</Label>
                        <Input
                            type="number"
                            id="phone_num"
                            onChange={(e) =>
                                setBrandData({
                                    ...brandData,
                                    phone_num: e.target.value,
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
