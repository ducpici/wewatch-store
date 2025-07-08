import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import Input from "../../components/form/input/InputField";

import axios from "../../libs/axiosConfig";

import { toast } from "react-toastify";
import { isValidName } from "../../libs/validateName";
import { isValidPhoneNum } from "../../libs/validatePhoneNum";
type Address = {
    // user_id: bigint;
    full_name: string;
    phone_num: string;
    city: string;
    district: string;
    ward: string;
    detail: string;
    is_default: boolean;
};

const initAddr: Address = {
    // user_id: BigInt(0),
    full_name: "",
    phone_num: "",
    city: "",
    district: "",
    ward: "",
    detail: "",
    is_default: false,
};

const AddAddress = () => {
    const { state } = useLocation();
    // const [isEnabled, setIsEnabled] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate();
    const [address, setAddress] = useState<Address>(initAddr);
    const handleSave = async () => {
        if (
            !address.full_name ||
            !address.phone_num ||
            !address.city ||
            !address.district ||
            !address.ward
        ) {
            toast.error("Các trường không được để trống!");
            return;
        }
        if (!isValidPhoneNum(address.phone_num)) {
            toast.error("Số điện thoại không hợp lệ!");
            return;
        }
        if (!isValidName(address.city)) {
            toast.error("Địa chỉ không hợp lệ!");
            return;
        }
        if (!isValidName(address.district)) {
            toast.error("Địa chỉ không hợp lệ!");
            return;
        }
        if (!isValidName(address.ward)) {
            toast.error("Địa chỉ không hợp lệ!");
            return;
        }
        try {
            console.log(address);
            const res = await axios.post(`/address`, address);
            console.log(res);
            toast.success(res.data.message);
            navigate(-1);
        } catch (error) {
            console.error("Lỗi khi thêm địa chỉ:", error);
            toast.error("Thất bại");
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <IoIosArrowBack
                    className="text-xl cursor-pointer"
                    onClick={() => navigate(-1)}
                />
                <h1 className="text-lg font-semibold">Thêm địa chỉ</h1>
                <FaTrash className="text-red-500 cursor-pointer" />
            </div>

            {/* Họ tên & SĐT */}
            <div className="my-2">
                <Input
                    placeholder="Họ và tên"
                    onChange={(e) =>
                        setAddress({ ...address, full_name: e.target.value })
                    }
                />
            </div>
            <div className="my-2">
                <Input
                    placeholder="Số điện thoại"
                    onChange={(e) =>
                        setAddress({ ...address, phone_num: e.target.value })
                    }
                />
            </div>
            {/* Thông tin địa chỉ */}
            <div className="mb-4">
                <h2 className="text-sm font-semibold mb-2">
                    Thông tin địa chỉ
                </h2>
                <div className="my-2">
                    <Input
                        placeholder="Tỉnh/Thành phố"
                        onChange={(e) =>
                            setAddress({ ...address, city: e.target.value })
                        }
                    />
                </div>
                <div className="my-2">
                    <Input
                        placeholder="Quận/Huyện"
                        onChange={(e) =>
                            setAddress({ ...address, district: e.target.value })
                        }
                    />
                </div>
                <div className="my-2">
                    <Input
                        placeholder="Phường/Xã"
                        onChange={(e) =>
                            setAddress({ ...address, ward: e.target.value })
                        }
                    />
                </div>
                <div className="my-2">
                    <Input
                        placeholder="Số nhà/Tên đường"
                        onChange={(e) =>
                            setAddress({ ...address, detail: e.target.value })
                        }
                    />
                </div>
            </div>

            {/* Cài đặt */}
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm">Đặt làm mặc định</span>
                <input
                    type="checkbox"
                    checked={address.is_default}
                    onChange={(e) =>
                        setAddress({ ...address, is_default: e.target.checked })
                    }
                    className="w-5 h-5 accent-red-500"
                />
            </div>

            {/* Lưu */}

            <button
                className="bg-red-500 w-full text-white py-3 rounded font-semibold"
                onClick={handleSave}
            >
                Lưu
            </button>
        </div>
    );
};

export default AddAddress;
