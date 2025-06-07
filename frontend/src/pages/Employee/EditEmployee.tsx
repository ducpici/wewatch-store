import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useEffect, useState } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import ComponentCard from "../../components/common/ComponentCard";
import DatePicker from "../../components/form/date-picker";
import Radio from "../../components/form/input/Radio";
import Button from "../../components/ui/button/Button";
import Switch from "../../components/form/switch/Switch";
import Select from "../../components/form/Select";
import axios from "../../lib/axiosConfig";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import formatDate from "../../lib/formatDate";

export default function EditEmployee() {
    type Employee = {
        id: BigInt;
        name: string;
        dob: string;
        gender: string;
        email: string;
        address: string;
        phone_number: string;
        position_id: string;
        username: string;
        password: string;
        state: boolean;
    };
    const initEmployee: Employee = {
        id: BigInt(0),
        name: "",
        dob: "",
        gender: "",
        email: "",
        address: "",
        phone_number: "",
        position_id: "",
        username: "",
        password: "",
        state: true || null,
    };

    const navigate = useNavigate();
    const { id } = useParams();
    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Nhân viên", path: "/employees" },
        { label: "Cập nhật thông tin" }, // Không có path => là trang hiện tại
    ];
    const [employeeData, setEmployeeData] = useState<Employee>(initEmployee);
    const [isEnabled, setIsEnabled] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>();
    const [positionData, setPositionData] = useState([]);

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

    const getDataById = () => {
        if (!id) return;
        axios
            .get(`/employees/${id}`)
            .then((response) => {
                const data = response.data[0];
                setEmployeeData(data);
                setSelectedValue(String(data.gender));
                setIsEnabled(data.state);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {});
    };

    useEffect(() => {
        getPositions();
        getDataById();
    }, [id]); // chỉ gọi lại khi id thay đổi

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
            position_id: value,
        });
    };

    const handleUpdateUser = async () => {
        if (
            !employeeData.name ||
            !employeeData.dob ||
            employeeData.gender === undefined ||
            employeeData.gender === "" ||
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
            const { email, username, id } = employeeData;

            const { data } = await axios.get("/employees/check", {
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

            await axios.put(`/employees/${employeeData.id}`, employeeData);

            toast.success("Cập nhật thành công!");
            navigate("/employees");
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            toast.error("Cập nhật thất bại.");
        }
    };

    if (!employeeData) return <div>Đang tải...</div>;

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
                            value={employeeData.name}
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
                            value={employeeData.position_id}
                            // defaultValue={selectedPosition}
                            placeholder="Chọn chức vụ"
                            onChange={handleSelectChange}
                            className="dark:bg-dark-900"
                        />
                    </div>
                </ComponentCard>
                <ComponentCard title="Tài khoản">
                    <div>
                        <Label htmlFor="username">Tên đăng nhập:</Label>
                        <Input
                            type="text"
                            id="username"
                            value={employeeData.username}
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
                            value={employeeData.password}
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
                            type="text"
                            id="email"
                            value={employeeData.email}
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
                            value={employeeData.phone_number}
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
                            value={employeeData.address}
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
                    onClick={handleUpdateUser}
                >
                    Lưu
                </Button>
            </div>
        </>
    );
}
