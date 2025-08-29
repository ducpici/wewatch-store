import { useState, useEffect } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import axios from "../libs/axiosConfig";
import useSession from "../hooks/useSession";
import { data } from "react-router";
import { toast } from "react-toastify";
import { Link } from "react-router";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Giỏ hàng" },
];

type Product = {
    id: number;
    name: string;
    modal_num: string;
    quantity: number;
    price: number;
    image: string;
    slug: string;
};

const Cart = () => {
    const navigate = useNavigate();
    const { user } = useSession();

    const [cartItems, setCartItems] = useState<Product[]>([]);
    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState(0);
    const [newTotal, setNewTotal] = useState(0);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const toggleSelectItem = (id: number) => {
        setSelectedItems((prev) =>
            prev.includes(id)
                ? prev.filter((itemId) => itemId !== id)
                : [...prev, id]
        );
    };

    const updateQuantity = (id: number, amount: number) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          quantity: Math.max(1, item.quantity + amount),
                      }
                    : item
            )
        );
    };
    const handleRemoveCoupon = () => {
        setCoupon("");
        setDiscount(0);
        setNewTotal(0);
        toast.info("Đã huỷ mã giảm giá");
    };

    const removeItem = (id: number) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    // const subtotal = cartItems.reduce(
    //     (total, item) => total + item.price * item.quantity,
    //     0
    // );
    const subtotal = cartItems.reduce((total, item) => {
        if (selectedItems.includes(item.id)) {
            return total + item.price * item.quantity;
        }
        return total;
    }, 0);

    const handleUpdateCart = async () => {
        try {
            const newCart = cartItems.map((item) => ({
                id: item.id,
                modal_num: item.modal_num,
                quantity: item.quantity,
            }));
            const res = await axios.put(`/cart/${user?.id}`, newCart);
            toast.success("Cập nhật giỏ hàng thành công");
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    const handleUseCoupon = async () => {
        const selectedItemsData = cartItems
            .filter((item) => selectedItems.includes(item.id))
            .map((item) => ({
                id: item.id,
                modal_num: item.modal_num,
                quantity: item.quantity,
            }));

        if (selectedItemsData.length === 0) {
            toast.warning("Bạn chưa chọn sản phẩm");
            return;
        }
        try {
            const res = await axios.post(`/cart/apply-voucher`, {
                voucherCode: coupon,
                cartTotal: subtotal,
            });

            const { total, discount, originalTotal, message } = res.data;

            toast.success(message || "Áp dụng mã giảm giá thành công");
            setNewTotal(total);
            setDiscount(discount);
            // const { total, discount, originalTotal } = res.data;
        } catch (error: any) {
            const msg =
                error.response?.data?.message ||
                "Không thể áp dụng mã giảm giá";
            toast.error(msg);
            console.log(error);
        }
    };

    // const handleCheckout = async () => {
    //     const selectedItemsData = cartItems
    //         .filter((item) => selectedItems.includes(item.id))
    //         .map((item) => ({
    //             id: item.id,
    //             name: item.name,
    //             quantity: item.quantity,
    //             price: item.price,
    //             image: item.image,
    //         }));

    //     if (selectedItemsData.length === 0) {
    //         toast.warning("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
    //         return;
    //     }

    //     try {
    //         const res = await axios.post(
    //             "/cart/check-availability",
    //             selectedItemsData
    //         );
    //         if (!res.data.success) {
    //             const failed = res.data.results.filter((r) => !r.ok);
    //             failed.forEach((item) => toast.error(item.message));
    //             return;
    //         }

    //         navigate("/dat-hang", {
    //             state: {
    //                 items: selectedItemsData,
    //                 subtotal,
    //                 total: newTotal || subtotal,
    //                 discount,
    //                 voucherCode: coupon || null,
    //             },
    //         });
    //     } catch (error) {}
    // };
    const handleCheckout = async () => {
        if (!user?.email) {
            toast.warning(
                "Vui lòng cập nhật thông tin cá nhân trước khi mua hàng"
            );
            navigate("/thong-tin-ca-nhan");
            return;
        }
        const selectedItemsData = cartItems
            .filter((item) => selectedItems.includes(item.id))
            .map((item) => ({
                id: item.id,
                modal_num: item.modal_num,
                quantity: item.quantity,
            }));

        if (selectedItemsData.length === 0) {
            toast.warning("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
            return;
        }

        try {
            const res = await axios.post(
                "/cart/check-availability",
                selectedItemsData
            );
            if (!res.data.success) {
                const failed = res.data.results.filter((r: any) => !r.ok);
                failed.forEach((item: any) => toast.error(item.message));
                return;
            }

            // Nếu OK thì tiếp tục điều hướng
            const fullItemData = cartItems
                .filter((item) => selectedItems.includes(item.id))
                .map((item) => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    image: item.image,
                }));

            navigate("/dat-hang", {
                state: {
                    items: fullItemData,
                    subtotal,
                    total: newTotal || subtotal,
                    discount,
                    voucherCode: coupon || null,
                },
            });
        } catch (error) {
            toast.error("Lỗi kiểm tra số lượng sản phẩm");
            console.error(error);
        }
    };
    const fetchCartItem = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/cart/${user?.id}`);
            setCartItems(res.data.carts);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchCartItem();
        }
    }, [user?.id]);

    return (
        <>
            {" "}
            <PageBreadcrumb items={breadcrumbItems} />
            {loading ? (
                <div className="loading-spinner text-center py-8">
                    <p>Đang tải dữ liệu...</p>
                </div>
            ) : cartItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Cart Table */}
                    <div className="md:col-span-2">
                        <table className="w-full text-left border-t border-gray-200">
                            <thead>
                                <tr className="bg-green-600 text-white px-4 py-3 rounded-t-lg">
                                    <th className="p-2">Sản phẩm</th>
                                    <th className="p-2">Giá</th>
                                    <th className="p-2">Số lượng</th>
                                    <th className="p-2">Tạm tính</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-gray-200"
                                    >
                                        <td className="flex items-center gap-4 p-2">
                                            <input
                                                type="checkbox"
                                                name=""
                                                id=""
                                                checked={selectedItems.includes(
                                                    item.id
                                                )}
                                                onChange={() =>
                                                    toggleSelectItem(item.id)
                                                }
                                            />
                                            <button
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    removeItem(item.id)
                                                }
                                            >
                                                ❌
                                            </button>

                                            <img
                                                src={`${BASE_URL}${item.image}`}
                                                // alt={item.name}
                                                className="w-20 h-20 cursor-pointer"
                                                onClick={() =>
                                                    navigate(
                                                        `/san-pham/${item.slug}`
                                                    )
                                                }
                                            />

                                            <span>{item.name}</span>
                                        </td>
                                        <td className="p-2 font-semibold text-black">
                                            {item.price.toLocaleString("vi-VN")}{" "}
                                            ₫
                                        </td>
                                        <td className="p-2">
                                            <div className="flex items-center border border-gray-300 rounded w-max">
                                                <button
                                                    className="px-2"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            -1
                                                        )
                                                    }
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="text"
                                                    value={item.quantity}
                                                    readOnly
                                                    className="w-10 text-center border-l border-r border-gray-300"
                                                />
                                                <button
                                                    className="px-2"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            1
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-2 font-semibold text-black">
                                            {(
                                                item.price * item.quantity
                                            ).toLocaleString("vi-VN")}{" "}
                                            ₫
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-between items-center mt-4">
                            {/* <button className="border border-black px-4 py-2">
                            ← TIẾP TỤC XEM SẢN PHẨM
                        </button> */}
                            <button
                                className="bg-gray-700 text-white px-4 py-2 cursor-pointer"
                                onClick={handleUpdateCart}
                            >
                                CẬP NHẬT GIỎ HÀNG
                            </button>
                        </div>
                    </div>

                    {/* Cart Summary */}
                    <div className="border border-gray-300 rounded p-6">
                        <h2 className="text-lg font-semibold mb-4">
                            CỘNG GIỎ HÀNG
                        </h2>
                        <div className="flex justify-between mb-2">
                            <span>Tạm tính</span>
                            <span>{subtotal.toLocaleString()} ₫</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Giảm trừ</span>
                            <span>- {discount.toLocaleString()} ₫</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg mb-4">
                            <span>Tổng</span>
                            <span>
                                {(newTotal || subtotal).toLocaleString()} ₫
                            </span>
                        </div>
                        <button
                            className="w-full bg-[#8a5d35] text-white py-3 font-semibold mb-4 cursor-pointer"
                            onClick={handleCheckout}
                        >
                            TIẾN HÀNH THANH TOÁN
                        </button>
                        {/* <Link
                        to="/thanh-toan"
                        className="w-full bg-[#8a5d35] text-white py-3 font-semibold mb-4 cursor-pointer block text-center"
                    >
                        TIẾN HÀNH THANH TOÁN
                    </Link> */}

                        <div>
                            <label className="flex items-center gap-2 font-semibold mb-2">
                                <span>🏷️ Phiếu ưu đãi</span>
                            </label>
                            <input
                                type="text"
                                value={coupon}
                                onChange={(e) => setCoupon(e.target.value)}
                                placeholder="Mã ưu đãi"
                                className="w-full border border-gray-300 px-3 py-2 mb-2"
                            />
                            {discount === 0 ? (
                                <button
                                    className="w-full border border-gray-700 py-2 cursor-pointer"
                                    onClick={handleUseCoupon}
                                >
                                    Áp dụng
                                </button>
                            ) : (
                                <button
                                    className="w-full text-red-600 border border-red-600 py-2 cursor-pointer"
                                    onClick={handleRemoveCoupon}
                                >
                                    Huỷ mã giảm giá
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="no-products text-center py-8 h-screen">
                    <p>Hiện chưa có sản phẩm nào trong giỏ hàng.</p>
                </div>
            )}
        </>
    );
};

export default Cart;
