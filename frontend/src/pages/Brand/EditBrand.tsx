import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useEffect, useState } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import TextArea from "../../components/form/input/TextArea";
import axios from "../../lib/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import { isValidEmail } from "../../lib/validationEmail";
import { isValidPhoneNum } from "../../lib/validatePhoneNum";

export default function EditBrand() {
    const { id } = useParams();

    type Brand = {
        id: BigInt;
        name: string;
        description: string;
        email: string;
        phone_num: string;
    };
    const initBrand: Brand = {
        id: BigInt(0),
        name: "",
        description: "",
        email: "",
        phone_num: "",
    };
    const [brandData, setBrandData] = useState<Brand>(initBrand);

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Nhà cung cấp", path: "/brands" },
        { label: "Cập nhật thông tin" }, // Không có path => là trang hiện tại
    ];

    const navigate = useNavigate();

    const getDataById = () => {
        if (!id) return;
        axios
            .get(`/brands/${id}`)
            .then((response) => {
                const data = response.data.data[0];
                if (data) {
                    setBrandData(data);
                } else {
                    toast.error("Không tìm thấy nhà cung cấp!");
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {});
    };

    const handleUpdateBrand = async () => {
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
            const { email, id } = brandData;

            const { data } = await axios.get("/brands/check", {
                params: {
                    email,
                    id,
                },
            });

            if (data.emailExists) {
                toast.error("Email đã được sử dụng!");
                return;
            }

            await axios.put(`/brands/${brandData.id}`, brandData);
            toast.success("Cập nhật thành công!");
            navigate("/brands");
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            toast.error("Cập nhật thất bại.");
        }
    };

    useEffect(() => {
        getDataById();
    }, [id]);

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
                            value={brandData.name}
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
                            value={brandData.email}
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
                            value={brandData.phone_num}
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
                    onClick={handleUpdateBrand}
                >
                    Lưu
                </Button>
            </div>
        </>
    );
}
