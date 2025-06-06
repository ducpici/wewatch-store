import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useEffect, useState } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import ComponentCard from "../../components/common/ComponentCard";
import DatePicker from "../../components/form/date-picker";
import Radio from "../../components/form/input/Radio";
import Button from "../../components/ui/button/Button";
import Switch from "../../components/form/switch/Switch";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import formatDate from "../../lib/formatDate";
import { format } from "date-fns";
export default function UpdateUser() {
    const initialUser: User = {
        id_user: BigInt(0),
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
        id_user: BigInt;
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

    const navigate = useNavigate();
    const { id } = useParams();

    const [userData, setUserData] = useState<User>(initialUser);
    const [isEnabled, setIsEnabled] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>("1");

    useEffect(() => {
        if (!id) return;
        axios
            .get(`http://localhost:4090/api/v1/users/${id}`)
            .then((response) => {
                const user = response.data[0];
                setUserData(user);
                setSelectedValue(String(user.gender));
                setIsEnabled(user.state);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {});
    }, [id]); // chỉ gọi lại khi id thay đổi

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Khách hàng", path: "/users" },
        { label: "Cập nhật thông tin" }, // Không có path => là trang hiện tại
    ];

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

    const handleUpdateUser = async () => {
        if (
            !userData.name ||
            !userData.dob ||
            !userData.gender ||
            !userData.email ||
            !userData.address ||
            !userData.phone_number ||
            !userData.username ||
            !userData.password
        ) {
            toast.error("Các trường không được để trống!");
            return;
        }
        try {
            // 👇 Gọi API kiểm tra email và username
            const { email, username, id_user } = userData;

            const { data } = await axios.get(
                "http://localhost:4090/api/v1/users/check",
                {
                    params: {
                        email,
                        username,
                        id_user,
                    },
                }
            );

            if (data.emailExists) {
                toast.error("Email đã được sử dụng!");
                return;
            }

            if (data.usernameExists) {
                toast.error("Username đã tồn tại!");
                return;
            }

            await axios.put(
                `http://localhost:4090/api/v1/users/${userData.id_user}`,
                userData
            );

            toast.success("Cập nhật thành công!");
            navigate("/users");
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            toast.error("Cập nhật thất bại.");
        }
    };

    if (!userData) return <div>Đang tải...</div>;

    return (
        <>
            <PageBreadcrumb items={breadcrumbItems} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ComponentCard title="Thông tin cá nhân">
                    <div>
                        <Label htmlFor="input">Họ tên:</Label>
                        <Input
                            type="text"
                            id="name"
                            value={userData.name}
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
                        <Label htmlFor="input">Tên đăng nhập:</Label>
                        <Input
                            type="text"
                            id="username"
                            value={userData.username}
                            onChange={(e) =>
                                setUserData({
                                    ...userData,
                                    username: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label htmlFor="input">Mật khẩu:</Label>
                        <Input
                            type="password"
                            id="password"
                            value={userData.password}
                            onChange={(e) =>
                                setUserData({
                                    ...userData,
                                    password: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="flex items-center">
                        <Label className="mb-0" htmlFor="input">
                            Trạng thái:
                        </Label>
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
                        <Label htmlFor="input">Email:</Label>
                        <Input
                            type="text"
                            id="email"
                            value={userData.email}
                            onChange={(e) =>
                                setUserData({
                                    ...userData,
                                    email: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label htmlFor="input">Số điện thoại:</Label>
                        <Input
                            type="text"
                            id="phone_num"
                            value={userData.phone_number}
                            onChange={(e) =>
                                setUserData({
                                    ...userData,
                                    phone_number: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label htmlFor="input">Địa chỉ:</Label>
                        <Input
                            type="text"
                            id="address"
                            value={userData.address}
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
                    onClick={handleUpdateUser}
                >
                    Lưu
                </Button>
            </div>
        </>
    );
}
