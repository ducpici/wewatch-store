import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useEffect, useState } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import ComponentCard from "../../components/common/ComponentCard";
import DatePicker from "../../components/form/date-picker";
import Radio from "../../components/form/input/Radio";
import Select from "../../components/form/Select";
import Button from "../../components/ui/button/Button";
import Switch from "../../components/form/switch/Switch";
import axios from "../../lib/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import formatDate from "../../lib/formatDate";

export default function AddEmployee() {
    const initialEmployee: Employee = {
        name: "",
        dob: "",
        gender: "",
        email: "",
        address: "",
        phone_number: "",
        position_id: null,
        username: "",
        password: "",
        state: true,
    };
    type Employee = {
        name: string;
        dob: string;
        gender: string;
        email: string;
        address: string;
        phone_number: string;
        position_id: number | null;
        username: string;
        password: string;
        state: boolean;
    };

    const [employeeData, setEmployeeData] = useState<Employee>(initialEmployee);
    const [positionData, setPositionData] = useState([]);
    const [isEnabled, setIsEnabled] = useState(true);
    const [selectedValue, setSelectedValue] = useState<string>();

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Nhân viên", path: "/employees" },
        { label: "Thêm mới" }, // Không có path => là trang hiện tại
    ];

    const navigate = useNavigate();

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(e.target.value);
        setEmployeeData({
            ...employeeData,
            gender: e.target.value,
        });
    };

    const handleSwitchChange = (checked: boolean) => {
        setIsEnabled(checked);
        setEmployeeData({
            ...employeeData,
            state: checked,
        });
    };

    const handleSelectChange = (value: string) => {
        const num = parseInt(value);
        setEmployeeData({
            ...employeeData,
            position_id: num,
        });
    };

    const handleCreateEmployee = async () => {
        if (
            !employeeData.name ||
            !employeeData.dob ||
            !employeeData.gender ||
            !employeeData.email ||
            !employeeData.address ||
            !employeeData.phone_number ||
            !employeeData.position_id ||
            !employeeData.username ||
            !employeeData.password ||
            employeeData.state === null ||
            employeeData.state === undefined
        ) {
            toast.error("Các trường không được để trống!");
            return;
        }
        try {
            // 👇 Gọi API kiểm tra email và username
            const { email, username } = employeeData;
            console.log(email, username);
            const { data } = await axios.get("/employees/check", {
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

            await axios.post(`/employees`, employeeData);
            toast.success("Thêm thành công!");
            navigate("/employees");
        } catch (error) {
            console.error("Lỗi khi thêm:", error);
            toast.error("Thêm thất bại.");
        }
    };

    const getPositions = () => {
        let res = axios
            .get("/positions")
            .then((response) => {
                const data = response.data.data;
                setPositionData(data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {});
    };

    useEffect(() => {
        getPositions();
    }, []);

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
                                setEmployeeData({
                                    ...employeeData,
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
                                employeeData.dob,
                                "yyyy-MM-dd",
                                "dd-MM-yyyy"
                            )}
                            onChange={(dates, currentDateString) => {
                                setEmployeeData({
                                    ...employeeData,
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
                    <div>
                        <Label>Chức vụ:</Label>
                        <Select
                            options={positionData}
                            placeholder="Chọn chức vụ"
                            onChange={handleSelectChange}
                            className="dark:bg-dark-900"
                            value=""
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
                                setEmployeeData({
                                    ...employeeData,
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
                                setEmployeeData({
                                    ...employeeData,
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
                                setEmployeeData({
                                    ...employeeData,
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
                                setEmployeeData({
                                    ...employeeData,
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
                                setEmployeeData({
                                    ...employeeData,
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
                    onClick={handleCreateEmployee}
                >
                    Lưu
                </Button>
            </div>
        </>
    );
}
