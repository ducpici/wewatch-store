import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useEffect, useState } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import ComponentCard from "../../components/common/ComponentCard";
import DatePicker from "../../components/form/date-picker";
import Radio from "../../components/form/input/Radio";
import Button from "../../components/ui/button/Button";
import Switch from "../../components/form/switch/Switch";
import axios from "../../lib/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import formatDate from "../../lib/formatDate";

export default function AddUser() {
    const initialUser: User = {
        // id_user: "",
        name: "",
        dob: "",
        gender: "", // hoặc false tuỳ mặc định
        email: "",
        address: "",
        phone_number: "",
        username: "",
        password: "",
        state: true, // hoặc false tuỳ mặc định
    };
    type User = {
        // id_user: BigInt;
        name: string; // varchar(255)
        dob: string; // varchar(100), có thể là ngày sinh dạng string
        gender: string;
        email: string; // varchar(255)
        address: string; // varchar(255)
        phone_number: string; // varchar(100)
        username: string; // varchar(255)
        password: string; // varchar(255)
        state: boolean; //
    };

    const [userData, setUserData] = useState<User>(initialUser);
    const [isEnabled, setIsEnabled] = useState(true);
    const [selectedValue, setSelectedValue] = useState<string>();

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Khách hàng", path: "/users" },
        { label: "Thêm mới" }, // Không có path => là trang hiện tại
    ];

    const navigate = useNavigate();

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(e.target.value);
        setUserData({
            ...userData,
            gender: e.target.value,
        });
    };

    const handleSwitchChange = (checked: boolean) => {
        setIsEnabled(checked);
        setUserData({
            ...userData,
            state: checked,
        });
    };

    const handleCreateUser = async () => {
        if (
            !userData.name ||
            !userData.dob ||
            !userData.gender ||
            !userData.email ||
            !userData.address ||
            !userData.phone_number ||
            !userData.username ||
            !userData.password ||
            userData.state === null ||
            userData.state === undefined
        ) {
            toast.error("Các trường không được để trống!");
            return;
        }
        try {
            // 👇 Gọi API kiểm tra email và username
            const { email, username } = userData;
            console.log(email, username);
            const { data } = await axios.get("/users/check", {
                params: {
                    email,
                    username,
                },
            });

            if (data.emailExists) {
                toast.error("Email đã được sử dụng!");
                return;
            }

            if (data.usernameExists) {
                toast.error("Username đã tồn tại!");
                return;
            }

            await axios.post(`/users`, userData);
            toast.success("Thêm thành công!");
            navigate("/users");
        } catch (error) {
            console.error("Lỗi khi thêm:", error);
            toast.error("Thêm thất bại.");
        }
    };

    return (
        <>
            <PageBreadcrumb items={breadcrumbItems} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ComponentCard title="Thông tin cá nhân">
                    <div>
                        <Label htmlFor="name">Họ tên:</Label>
                        <Input
                            type="text"
                            id="name"
                            onChange={(e) =>
                                setUserData({
                                    ...userData,
                                    name: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <DatePicker
                            id="date-picker"
                            label="Ngày sinh:"
                            placeholder="Select a date"
                            defaultDate={formatDate(
                                userData.dob,
                                "yyyy-MM-dd",
                                "dd-MM-yyyy"
                            )}
                            onChange={(dates, currentDateString) => {
                                setUserData({
                                    ...userData,
                                    dob: formatDate(
                                        currentDateString,
                                        "dd-MM-yyyy",
                                        "yyyy-MM-dd"
                                    ),
                                });
                            }}
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-8">
                        <Label className="mb-0">Giới tính:</Label>
                        <Radio
                            id="male"
                            name="gender"
                            value="1"
                            checked={selectedValue === "1"}
                            onChange={handleRadioChange}
                            label="Nam"
                        />
                        <Radio
                            id="female"
                            name="gender"
                            value="0"
                            checked={selectedValue === "0"}
                            onChange={handleRadioChange}
                            label="Nữ"
                        />
                    </div>
                </ComponentCard>
                <ComponentCard title="Tài khoản">
                    <div>
                        <Label htmlFor="username">Tên đăng nhập:</Label>
                        <Input
                            type="text"
                            id="username"
                            onChange={(e) =>
                                setUserData({
                                    ...userData,
                                    username: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">Mật khẩu:</Label>
                        <Input
                            type="password"
                            id="password"
                            onChange={(e) =>
                                setUserData({
                                    ...userData,
                                    password: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="flex items-center">
                        <Label className="mb-0">Trạng thái:</Label>
                        <div className="ml-6">
                            <Switch
                                label={
                                    isEnabled
                                        ? "Đang hoạt động"
                                        : "Ngưng hoạt động"
                                }
                                checked={isEnabled}
                                onChange={handleSwitchChange}
                            />
                        </div>
                    </div>
                </ComponentCard>
                <ComponentCard title="Thông tin liên hệ">
                    <div>
                        <Label htmlFor="email">Email:</Label>
                        <Input
                            type="email"
                            id="email"
                            onChange={(e) =>
                                setUserData({
                                    ...userData,
                                    email: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label htmlFor="phone_num">Số điện thoại:</Label>
                        <Input
                            type="text"
                            id="phone_num"
                            onChange={(e) =>
                                setUserData({
                                    ...userData,
                                    phone_number: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label htmlFor="address">Địa chỉ:</Label>
                        <Input
                            type="text"
                            id="address"
                            onChange={(e) =>
                                setUserData({
                                    ...userData,
                                    address: e.target.value,
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
                    onClick={handleCreateUser}
                >
                    Lưu
                </Button>
            </div>
        </>
    );
}
