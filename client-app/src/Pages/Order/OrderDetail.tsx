import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../libs/axiosConfig";
import {
    Calendar,
    Package,
    User,
    Phone,
    Mail,
    AlertCircle,
    CheckCircle,
    Truck,
    XCircle,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Actions from "../../components/common/Actions";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import ComponentCard from "../../components/common/ComponentCard";
import Radio from "../../components/form/input/Radio";

export default function OrderDetail() {
    type Product = {
        id: number;
        modal_num: string;
        brand: {
            id: number;
            name: string;
            description: string;
        };
        category: {
            id: number;
            name: string;
            description: string;
        };
        quantity: number;
        price: number;
        slug: string;
    };

    type orderDetail = {
        id: number;
        user: {
            id: number;
            name: string;
            email: string;
            phone_number: string;
            address: string;
        };
        shipping_address: {
            full_name: string;
            phone_num: string;
            city: string;
            district: string;
            ward: string;
            detail: string;
        };
        payment_method: {
            code: number;
            text: string;
        };
        items: [
            {
                id: number;
                name: string;
                image: string;
                slug: string;
                modal_num: string;
                brand: {
                    id: number;
                    name: string;
                    description: string;
                };
                category: {
                    id: number;
                    name: string;
                    description: string;
                };
                quantity: number;
                price: number;
            }
        ];
        order_state: {
            code: number;
            text: string;
        };
        total_price: number;
        created_at: string;
        updated_at: string;
    };

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [totalUser, setTotalUser] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);
    const [limitData, setLimitData] = useState(10);
    const [orderId, setOrderId] = useState(BigInt(0));
    const [productItems, setProductItems] = useState<Product[]>([]);
    const [dataOrderDetail, setDataOrderDetail] = useState<orderDetail>();

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Đơn hàng của tôi", path: "/don-hang" },
        { label: "Chi tiết đơn hàng" },
    ];

    const fetchOrderDetailById = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/orders/detail/${id}`);
            console.log(res);
            setDataOrderDetail(res.data);
            setProductItems(res.data.items);
        } catch (err) {
            console.error("Lỗi khi tải danh sách:", err);
            toast.error("Lỗi khi tải danh ");
        } finally {
            setLoading(false);
        }
    };

    const handleViewProduct = (slug: string) => {
        navigate(`/san-pham/${slug}`);
    };

    const renderStateMessage = (stateCode: number) => {
        switch (stateCode) {
            case 0:
                return (
                    <>
                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">
                                Đơn hàng của bạn chưa được xác nhận!
                            </h3>
                            <p className="text-sm text-gray-600">
                                Vui lòng đợi nhà bán xác nhận đơn hàng của bạn.
                            </p>
                        </div>
                    </>
                );
            case 1:
                return (
                    <>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-blue-500">
                                Đơn hàng đã được xác nhận
                            </h3>
                            <p className="text-sm text-blue-500">
                                Chúng tôi đang chuẩn bị giao hàng cho bạn.
                            </p>
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                            <Truck className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-yellow-600">
                                Đơn hàng đang được vận chuyển
                            </h3>
                            <p className="text-sm text-yellow-500">
                                Hãy chuẩn bị nhận hàng!
                            </p>
                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-green-600">
                                Đơn hàng đã giao thành công
                            </h3>
                            <p className="text-sm text-green-500">
                                Cảm ơn bạn đã mua hàng!
                            </p>
                        </div>
                    </>
                );
            case 4:
                return (
                    <>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-red-600">
                                Đơn hàng đã bị trả lại
                            </h3>
                            <p className="text-sm text-red-500">
                                Nếu có thắc mắc, hãy liên hệ bộ phận hỗ trợ.
                            </p>
                        </div>
                    </>
                );
            case 5:
                return (
                    <>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-red-500">
                                Đơn hàng đã bị hủy
                            </h3>
                            <p className="text-sm text-red-600">
                                Nếu có thắc mắc, hãy liên hệ bộ phận hỗ trợ.
                            </p>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    useEffect(() => {
        fetchOrderDetailById();
    }, [id]);

    return (
        <>
            <PageBreadcrumb items={breadcrumbItems} />
            <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
                {/* Header Alert */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {typeof dataOrderDetail?.order_state.code ===
                            "number" &&
                            renderStateMessage(
                                dataOrderDetail.order_state.code
                            )}
                    </div>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                        Hủy đơn
                    </button>
                </div>

                {/* Order Info */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="flex items-center space-x-3">
                            <Package className="w-5 h-5 text-gray-600" />
                            <div>
                                <p className="text-sm text-gray-600">
                                    Mã đơn hàng
                                </p>
                                <p className="font-semibold text-gray-800">
                                    #{dataOrderDetail?.id}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Calendar className="w-5 h-5 text-gray-600" />
                            <div>
                                <p className="text-sm text-gray-600">
                                    Thời gian đặt hàng
                                </p>
                                <p className="font-semibold text-gray-800">
                                    {dataOrderDetail?.created_at}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="border-t pt-6">
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                            <User className="w-5 h-5 mr-2" />
                            Thông tin nhận hàng
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">
                                    Địa chỉ:
                                </p>
                                <p className="text-gray-800 font-semibold">
                                    {dataOrderDetail?.shipping_address?.detail}{" "}
                                    {dataOrderDetail?.shipping_address?.ward},{" "}
                                    {
                                        dataOrderDetail?.shipping_address
                                            ?.district
                                    }
                                    , {dataOrderDetail?.shipping_address?.city}
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Người nhận:
                                    </p>
                                    <p className="font-semibold text-gray-800">
                                        {
                                            dataOrderDetail?.shipping_address
                                                ?.full_name
                                        }
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Số điện thoại:
                                    </p>
                                    <p className="text-gray-800 font-semibold">
                                        {
                                            dataOrderDetail?.shipping_address
                                                .phone_num
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <Package className="w-5 h-5 mr-2" />
                        Sản phẩm
                    </h4>

                    {/* Product Table Header */}
                    <div className="bg-green-600 text-white px-4 py-3 rounded-t-lg">
                        <div className="grid grid-cols-12 gap-4 font-medium">
                            <div className="col-span-6">Sản phẩm</div>
                            <div className="col-span-2 text-center">
                                Số lượng
                            </div>
                            <div className="col-span-2 text-center">
                                Đơn giá
                            </div>
                            <div className="col-span-2 text-center">
                                Thành tiền
                            </div>
                        </div>
                    </div>

                    {/* Product Items */}
                    <div className="border-l border-r border-gray-200">
                        {/* Product  */}
                        {dataOrderDetail?.items.map((item) => (
                            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 items-center">
                                <div className="col-span-6 flex items-center space-x-3">
                                    <img
                                        src={`https://admin.wewatch.com:4090${item.image}`}
                                        alt="Product"
                                        className="w-15 h-15 object-cover rounded-lg bg-gray-100 cursor-pointer"
                                        onClick={() =>
                                            navigate(`/san-pham/${item.slug}`)
                                        }
                                    />
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {item.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-span-2 text-center">
                                    <span className="font-medium">
                                        {item.quantity}
                                    </span>
                                </div>
                                <div className="col-span-2 text-center">
                                    <span className="font-medium">
                                        {item.price.toLocaleString("vi-VN")}
                                    </span>
                                </div>
                                <div className="col-span-2 text-center">
                                    <span className="font-semibold text-red-600">
                                        {(
                                            item.quantity * item.price
                                        ).toLocaleString("vi-VN")}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-gray-50 p-4 rounded-b-lg">
                        <h5 className="font-semibold text-gray-800 mb-4">
                            Thanh toán
                        </h5>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Phương thức thanh toán
                                </span>
                                <span className="font-medium">
                                    {dataOrderDetail?.payment_method.text}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Trạng thái đơn hàng
                                </span>
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                                    {dataOrderDetail?.order_state.text}
                                </span>
                            </div>
                            <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                                <span>Tổng thanh toán</span>
                                <span className="text-red-600">
                                    {dataOrderDetail?.total_price.toLocaleString(
                                        "vi-VN"
                                    )}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">
                                (Đã bao gồm VAT & Giảm giá)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
