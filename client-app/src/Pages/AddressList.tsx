import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { LuPlus } from "react-icons/lu";
import { IoIosArrowForward } from "react-icons/io";
import axios from "../libs/axiosConfig";

type Address = {
    id_ship: number;
    user_id: string;
    full_name: string;
    phone_num: string;
    city: string;
    district: string;
    ward: string;
    detail: string;
    is_default?: number;
};

const AddressList = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState<Address[]>([]);

    const handleBack = () => {
        navigate("/dat-hang", { state });
    };

    const fetchAddress = async () => {
        try {
            const res = await axios.get(`/address`);
            setAddresses(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };
    const handleAddAddr = () => {
        navigate("/them-dia-chi", { state });
    };

    const handleEditAddr = (idShip: number) => {
        navigate("/cap-nhat-dia-chi", { state: { ...state, idShip } });
    };

    const handleChooseAddr = () => {};

    useEffect(() => {
        fetchAddress();
    }, []);

    return (
        <div className="max-w-md mx-auto p-4 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <IoIosArrowBack
                    className="cursor-pointer"
                    onClick={handleBack}
                />
                <h1 className="text-lg font-semibold">Địa chỉ của bạn</h1>
                <div></div>
            </div>

            {/* Thêm địa chỉ */}
            <div
                className="flex items-center justify-between border-gray-300 border-b py-3 cursor-pointer"
                onClick={handleAddAddr}
            >
                {" "}
                <LuPlus />
                <span>Thêm địa chỉ</span>
                <IoIosArrowForward />
            </div>

            {/* Danh sách địa chỉ */}
            <div className="mt-4 space-y-4">
                {addresses.map((addr) => (
                    <div
                        key={addr.id_ship}
                        className="border-gray-300 border-b pb-4 cursor-pointer"
                        onClick={handleChooseAddr}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">
                                    {addr.full_name}
                                </p>
                                <p className="text-gray-600">
                                    {addr.phone_num}
                                </p>
                            </div>
                            <button
                                className="text-red-500 font-medium cursor-pointer"
                                onClick={() => handleEditAddr(addr.id_ship)}
                            >
                                Chỉnh sửa
                            </button>
                        </div>
                        <p className="text-gray-700 mt-1">
                            {addr.detail && `${addr.detail}, `}
                            {addr.ward}, {addr.district}, {addr.city}
                        </p>
                        {addr.is_default === 1 && (
                            <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-200 rounded">
                                Mặc định
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddressList;
