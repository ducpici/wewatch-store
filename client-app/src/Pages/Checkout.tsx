import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";
import axios from "../libs/axiosConfig";
import { toast } from "react-toastify";
import { useMemo } from "react";
import useSession from "../hooks/useSession";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
const BASE_URL = import.meta.env.VITE_BASE_URL;
type Address = {
    id_ship: bigint;
    user_id: bigint;
    full_name: string;
    phone_num: string;
    city: string;
    district: string;
    ward: string;
    detail: string;
    is_default: boolean;
};

const initAddr: Address = {
    id_ship: BigInt(0),
    user_id: BigInt(0),
    full_name: "",
    phone_num: "",
    city: "",
    district: "",
    ward: "",
    detail: "",
    is_default: true,
};
const Checkout = () => {
    const { user } = useSession();
    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Thanh toán" },
    ];

    // const genOrderCode = () => {
    //     const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    //     const rand = Math.floor(1000 + Math.random() * 9000);
    //     return `DH${dateStr}-${rand}-${user?.id}`;
    // };
    // const orderCode = useMemo(() => genOrderCode(), []);
    const navigate = useNavigate();
    const { state } = useLocation();
    const [checkoutData, setCheckoutData] = useState<any>(null);
    const { items, subtotal, total, discount, voucherCode } = state;
    // setCheckoutData(state);
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState("0");
    const [address, setAddress] = useState<Address | null>(null);
    const [orderCode, setOrderCode] = useState("");

    const handlePlaceOrder = async () => {
        if (!address) {
            toast.error("Vui lòng chọn địa chỉ nhận hàng trước khi đặt hàng.");
            return;
        }
        const payload = {
            order_code: orderCode,
            payment: parseInt(paymentMethod),
            items,
            subtotal,
            total,
            discount,
            voucherCode,
        };

        const res = await axios.post("/orders", payload);
        toast.success(res.data.message);
        navigate("/");
    };

    const handleClickAddress = () => {
        navigate("/danh-sach-dia-chi", { state });
    };

    const fetchAddresDefault = async () => {
        try {
            const res = await axios.get(`/address?is_default=1`);
            if (res.data.data.length > 0) {
                setAddress(res.data.data[0]);
            } else {
                setAddress(null); // hoặc giữ null mặc định
            }
        } catch (error) {
            console.error("Lỗi khi fetch địa chỉ:", error);
        }
    };

    useEffect(() => {
        fetchAddresDefault();
    }, []);

    useEffect(() => {
        if (user?.id) {
            const dateStr = new Date()
                .toISOString()
                .slice(0, 10)
                .replace(/-/g, "");
            const rand = Math.floor(1000 + Math.random() * 9000);
            setOrderCode(`DH${dateStr}-${rand}-${user.id}`);
        }
    }, [user]);

    return (
        <div className="p-6 max-w-md mx-auto">
            <PageBreadcrumb items={breadcrumbItems} />
            <h1 className="text-xl font-bold mb-4">Xác nhận đơn hàng</h1>

            <div className="mb-6">
                <h2 className="font-semibold">Sản phẩm</h2>
                <ul>
                    {items.map((item: any) => (
                        <li
                            key={item.id}
                            className="flex gap-4 py-2 border-gray-300 border-b"
                        >
                            <img
                                src={`${BASE_URL}${item.image}`}
                                className="w-16 h-16 object-cover"
                            />
                            <div>
                                <p>{item.name}</p>
                                <p>Số lượng: {item.quantity}</p>
                                <p>
                                    Giá:{" "}
                                    {(
                                        item.price * item.quantity
                                    ).toLocaleString("vi-VN")}{" "}
                                    ₫
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-4">
                <h2 className="font-semibold mb-2">Địa chỉ nhận hàng</h2>
                <div
                    className="flex cursor-pointer"
                    onClick={handleClickAddress}
                >
                    <div className="m-2">
                        <HiOutlineLocationMarker />
                    </div>

                    <div className="flex justify-between w-full">
                        {address ? (
                            <div className="address">
                                <h3 className="font-semibold">
                                    {address.full_name} ({address.phone_num})
                                </h3>
                                <p>
                                    {address.detail && `${address.detail}, `}
                                    {address.ward}, {address.district},{" "}
                                    {address.city}
                                </p>
                            </div>
                        ) : (
                            <p className="text-red-500 text-sm">
                                Bạn chưa có địa chỉ nhận hàng. Bấm để chọn hoặc
                                thêm mới.
                            </p>
                        )}
                        <IoIosArrowForward />
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="font-semibold mb-2">Phương thức thanh toán</h2>
                <label className="flex gap-2 mb-1">
                    <input
                        type="radio"
                        value="0"
                        checked={paymentMethod === "0"}
                        onChange={() => setPaymentMethod("0")}
                    />
                    Thanh toán khi nhận hàng (COD)
                </label>
                <label className="flex gap-2">
                    <input
                        type="radio"
                        value="1"
                        checked={paymentMethod === "1"}
                        onChange={() => setPaymentMethod("1")}
                    />
                    Chuyển khoản ngân hàng
                </label>
                {paymentMethod === "1" && (
                    <div className="mt-4 border border-gray-300 p-4 rounded bg-gray-50">
                        <p className="font-semibold text-lg mb-2">
                            Thông tin chuyển khoản
                        </p>
                        <img
                            src="/images/qrcode.jpg"
                            alt="QR chuyển khoản"
                            className="w-40 h-40 mb-4"
                        />
                        <p>
                            <strong>Ngân hàng:</strong> Vietcombank (VCB)
                        </p>
                        <p>
                            <strong>Số tài khoản:</strong> 00264457999
                        </p>
                        <p>
                            <strong>Chủ tài khoản:</strong> PHAM VAN NAM
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            * Nội dung chuyển khoản:{" "}
                            <strong>
                                {orderCode
                                    ? `Thanh toan don hang #${orderCode}`
                                    : "Đang tạo mã..."}
                            </strong>
                        </p>
                    </div>
                )}
            </div>

            <div className="text-right">
                <p>Tạm tính: {subtotal.toLocaleString("vi-VN")} ₫</p>
                <p>Giảm giá: - {discount.toLocaleString("vi-VN")} ₫</p>
                <p className="text-lg font-bold">
                    Tổng cộng: {total.toLocaleString("vi-VN")} ₫
                </p>
                <button
                    className="bg-green-500 text-white px-6 py-2 mt-4 cursor-pointer hover:bg-red-400 rounded"
                    onClick={handlePlaceOrder}
                >
                    Đặt hàng
                </button>
            </div>
        </div>
    );
};

export default Checkout;
