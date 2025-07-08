import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import ComponentCard from "../components/common/ComponentCard";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Radio from "../components/form/input/Radio";
import DatePicker from "../components/form/date-picker";
import formatDate from "../libs/formatDate";
import Button from "../components/ui/button/Button";
import axios from "../libs/axiosConfig";
import { toast } from "react-toastify";
import useSession from "../hooks/useSession";
import { isValidEmail } from "../libs/validationEmail";
import { isValidName } from "../libs/validateName";
import { isValidPhoneNum } from "../libs/validatePhoneNum";
import { EyeCloseIcon, EyeIcon } from "../icons";
const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Thông tin cá nhân" },
];
const initialUser: User = {
    id: BigInt(0),
    name: "",
    dob: "",
    gender: "",
    email: "",
    address: "",
    phone_number: "",
    username: "",
    password: "",
    state: true,
};
type User = {
    id: BigInt;
    name: string;
    dob: string;
    gender: string;
    email: string;
    address: string;
    phone_number: string;
    username: string;
    password: string;
    state: boolean;
};

type Account = {
    old_pass: string;
    new_pass: string;
};

export default function Profile() {
    const { user } = useSession();
    const navigate = useNavigate();
    const [userData, setUserData] = useState<User>(initialUser);
    const [selectedValue, setSelectedValue] = useState<string>("1");
    const [showPassword, setShowPassword] = useState(false);
    const [dataChange, setDataChange] = useState<Account>({
        old_pass: "",
        new_pass: "",
    });
    const [activeTab, setActiveTab] = useState("info");
    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(e.target.value);
        setUserData({
            ...userData,
            gender: e.target.value,
        });
    };
    const handleUpdateUser = async () => {
        if (
            !userData.name ||
            !userData.dob ||
            userData.gender === undefined ||
            userData.gender === "" ||
            !userData.email ||
            !userData.address ||
            !userData.phone_number
        ) {
            toast.error("Các trường không được để trống!");
            return;
        }
        if (!isValidName(userData.name)) {
            toast.error("Họ tên không hợp lệ!");
            return;
        }
        if (!isValidPhoneNum(userData.phone_number)) {
            toast.error("Số điện thoại không hợp lệ!");
            return;
        }
        if (!isValidEmail(userData.email)) {
            toast.error("Email không hợp lệ!");
            return;
        }
        try {
            // 👇 Gọi API kiểm tra email và username
            const { email, username, id } = userData;

            const { data } = await axios.get("/users/check", {
                params: {
                    email,
                    username,
                    id,
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

            await axios.put(`/users/${userData.id}`, userData);

            toast.success("Cập nhật thành công!");
            navigate("/");
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            toast.error("Cập nhật thất bại.");
        }
    };

    const handleUpdatePassword = async () => {
        if (!dataChange.old_pass || !dataChange.new_pass) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (dataChange.new_pass.length < 6 || /\s/.test(dataChange.new_pass)) {
            toast.error(
                "Mật khẩu mới phải có ít nhất 6 ký tự và không chứa dấu cách"
            );
            return;
        }

        try {
            const payload = {
                id: userData.id,
                old_pass: dataChange.old_pass,
                new_pass: dataChange.new_pass,
            };

            const res = await axios.put("/users/change-password", payload);

            toast.success(res.data.message);
            setDataChange({ old_pass: "", new_pass: "" });
        } catch (error: any) {
            const msg =
                error.response?.data?.message ||
                "Đã xảy ra lỗi khi đổi mật khẩu";
            toast.error(msg);
            console.error("Lỗi đổi mật khẩu:", error);
        }
    };

    useEffect(() => {
        if (!user?.id) return;
        axios
            .get(`/users/${user?.id}`)
            .then((response) => {
                const user = response.data[0];
                setUserData(user);
                setSelectedValue(String(user.gender));
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {});
    }, [user?.id]); // chỉ gọi lại khi id thay đổi
    return (
        <>
            <PageBreadcrumb items={breadcrumbItems} />
            <div className="flex">
                <button
                    className={`cursor-pointer px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === "info"
                            ? "border-green-500 text-green-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("info")}
                >
                    Thông tin cá nhân
                </button>
                <button
                    className={`cursor-pointer px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === "account"
                            ? "border-green-500 text-green-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("account")}
                >
                    Đổi mật khẩu
                </button>
            </div>
            {activeTab === "account" && (
                <div>
                    <ComponentCard title="Thông tin tài khoản">
                        <div className="flex">
                            <Label htmlFor="username">Username:</Label>
                            {/* <Input
                                disabled
                                type="text"
                                id="email"
                                value={userData.username}
                            /> */}
                            <strong className="mx-4">
                                {userData.username}
                            </strong>
                        </div>
                        <div>
                            <Label htmlFor="pasword">Mật khẩu cũ:</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Nhập mật khẩu cũ"
                                    onChange={(e) =>
                                        setDataChange({
                                            ...dataChange,
                                            old_pass: e.target.value,
                                        })
                                    }
                                />
                                <span
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                >
                                    {showPassword ? (
                                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                    ) : (
                                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                    )}
                                </span>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="pasword_new">Mật khẩu mới:</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Nhập mật khẩu mới"
                                    onChange={(e) =>
                                        setDataChange({
                                            ...dataChange,
                                            new_pass: e.target.value,
                                        })
                                    }
                                />
                                <span
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                >
                                    {showPassword ? (
                                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                    ) : (
                                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                    )}
                                </span>
                            </div>
                        </div>
                    </ComponentCard>
                    <div className="w-full flex items-center justify-center">
                        <Button
                            className="mt-6 bg-amber-600 cursor-pointer"
                            size="sm"
                            variant="primary"
                            onClick={handleUpdatePassword}
                        >
                            Cập nhật
                        </Button>
                    </div>
                </div>
            )}
            {activeTab === "info" && (
                <div>
                    <div className="profile grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ComponentCard title="Thông tin cá nhân">
                            <div>
                                <Label htmlFor="name">Họ tên:</Label>
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
                        <ComponentCard title="Thông tin liên hệ">
                            <div>
                                <Label htmlFor="email">Email:</Label>
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
                                <Label htmlFor="phone_num">
                                    Số điện thoại:
                                </Label>
                                <Input
                                    type="number"
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
                                <Label htmlFor="address">Địa chỉ:</Label>
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
                    </div>{" "}
                    <div className="w-full flex items-center justify-center">
                        <Button
                            className="mt-6 bg-amber-600 cursor-pointer"
                            size="sm"
                            variant="primary"
                            onClick={handleUpdateUser}
                        >
                            Cập nhật
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
