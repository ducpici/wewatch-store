import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useEffect, useState } from "react";
import axios from "../../libs/axiosConfig";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/button/Button";
import useSession from "../../hooks/useSession";
import { toast } from "react-toastify";
import Select from "../..//components/form/Select";
import ReactPaginate from "react-paginate";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import Actions from "../../components/common/Actions";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import { MoreHorizontal, Package } from "lucide-react";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Đơn hàng của tôi" },
];
const orderStateMap = [
    // { id: 4, name: "Trả hàng" },
    { id: 5, name: "Hủy" },
];

interface Order {
    id: bigint;
    items: [
        {
            id: bigint;
            name: string;
            quantity: number;
            price: number;
            image: string;
        }
    ];
    order_state: {
        code: number;
        name: string;
    };
    payment_method: {
        code: number;
        name: string;
    };
    total: number;
}
export default function Order() {
    const { user } = useSession();
    const navigate = useNavigate();
    const { isOpen, openModal, closeModal } = useModal();
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderState, setOrderState] = useState("");
    const [orderId, setOrderId] = useState(BigInt(0));
    const [page, setPage] = useState(1);
    const [limitData, setLimitData] = useState(10);
    const [totalPage, setTotalPage] = useState(0);
    const [activeTab, setActiveTab] = useState("Tất cả");
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true); // ✅ thêm biến kiểm tra còn data
    const [currentStateFilter, setCurrentStateFilter] = useState<
        number[] | null
    >(null);
    const handlePageClick = (selectedItem: { selected: number }) => {
        fetchOrders(selectedItem.selected + 1, limitData);
    };
    const handleSelectChange = (value: string) => {
        setOrderState(value);
    };
    const handleTabChange = (tab: any) => {
        setActiveTab(tab.label);
        const stateArr = tab.id !== null ? [tab.id] : null;
        setCurrentStateFilter(stateArr); // 👉 lưu state filter hiện tại
        fetchOrders(1, limitData, false, stateArr); // bắt đầu lại từ trang 1
    };
    const handleSave = async () => {
        console.log({
            state: orderState,
            id: orderId,
        });

        const res = await axios.put(`/orders/${orderId}`, {
            state: parseInt(orderState),
            id: orderId,
        });
        console.log(res);
        if (res.data.status) {
            toast.success("Cập nhật thành công");
            fetchOrders(page, limitData);
        }

        closeModal();
    };
    const handlePressEdit = async (order_id: bigint, state: any) => {
        if (state !== 0) {
            toast.warning(
                "Chỉ có thể cập nhật khi đơn hàng đang chờ xác nhận!"
            );
            return; // Không mở modal
        }
        openModal();
        setOrderId(order_id);
        const res = await axios.get(`/orders/${order_id}`);
        // setOrderState(String(res.data.order_state_code));
    };
    const fetchOrders = async (
        page: number,
        limit: number,
        append = false,
        stateFilter: number[] | null = null
    ) => {
        try {
            let url = `/orders/user/${user?.id}?page=${page}&limit=${limit}`;
            if (stateFilter && Array.isArray(stateFilter)) {
                for (const state of stateFilter) {
                    url += `&state=${state}`;
                }
            }

            const res = await axios.get(url);
            const newOrders = res.data.orders;
            const totalPages = res.data.pagination.totalPages;

            if (append) {
                setOrders((prev) => [...prev, ...newOrders]);
            } else {
                setOrders(newOrders);
            }

            setPage(page);
            setLimitData(res.data.pagination.limit);
            setTotalPage(totalPages);
            setHasMore(page < totalPages); // ✅ kiểm tra còn nữa không
        } catch (err) {
            console.error("Lỗi khi tải danh sách:", err);
            toast.error("Lỗi khi tải danh ");
        } finally {
        }
    };

    const tabs = [
        { id: null, label: "Tất cả" },
        { id: 0, label: "Chờ xác nhận" },
        { id: 1, label: "Đã xác nhận" },
        { id: 2, label: "Đang giao hàng" },
        { id: 3, label: "Hoàn thành" },
        { id: 4, label: "Trả hàng" },
        { id: 5, label: "Đã hủy" },
    ];

    useEffect(() => {
        fetchOrders(page, limitData);
    }, []);
    return (
        <>
            <PageBreadcrumb items={breadcrumbItems} />
            <div className="max-w-6xl mx-auto bg-white">
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab)}
                            disabled={loading}
                            className={`cursor-pointer px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === tab.label
                                    ? "border-green-500 text-green-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            } ${
                                loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                        <span className="ml-2 text-gray-600">Đang tải...</span>
                    </div>
                )}

                {/* No Orders State */}
                {!loading && orders.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p>Không có đơn hàng nào</p>
                    </div>
                )}

                {/* Orders */}
                {!loading && orders.length > 0 && (
                    <div className="max-h-[700px] overflow-y-auto divide-y divide-gray-200 custom-scrollbar">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="p-6 cursor-pointer hover:bg-gray-50 transition duration-200 ease-in-out"
                                onClick={() =>
                                    navigate(`/don-hang/chi-tiet/${order.id}`)
                                }
                            >
                                {/* Order Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <Package className="w-5 h-5 text-gray-400" />
                                        <span className="font-medium text-gray-900">
                                            Mã đơn hàng: #{order.id}
                                        </span>
                                        <span className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                            {order.order_state.name}
                                        </span>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-start space-x-4"
                                        >
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <img
                                                    src={`${BASE_URL}${item.image}`}
                                                    alt=""
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="text-gray-900 font-medium mb-1">
                                                    {item.name}
                                                </h3>
                                                {/* <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <span>{item.color}</span>
                                                    <span>{item.size}</span>
                                                </div> */}
                                                <div className="flex items-center mt-2">
                                                    <span className="text-sm text-gray-500">
                                                        Số lượng:{" "}
                                                        {item.quantity}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <span className="text-lg font-medium text-gray-900">
                                                    {item.price.toLocaleString(
                                                        "vi-VN"
                                                    )}
                                                    ₫
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Total */}
                                <div className="flex items-center justify-end mt-6 pt-4 border-t border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-700">
                                            Tổng tiền:
                                        </span>
                                        <span className="text-xl font-bold text-red-500">
                                            {order.total.toLocaleString(
                                                "vi-VN"
                                            )}
                                            ₫
                                        </span>
                                        <s></s>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {hasMore && !loading && (
                    <div className="text-center py-4">
                        <button
                            onClick={() =>
                                fetchOrders(page + 1, limitData, true)
                            }
                            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                            Xem thêm
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
