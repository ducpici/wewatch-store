import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../lib/axiosConfig";
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
import { SearchAndAddBar } from "../../components/common/SearchAndAdd";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import ComponentCard from "../../components/common/ComponentCard";
import DatePicker from "../../components/form/date-picker";
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
        { label: "Đơn hàng", path: "/orders" },
        { label: "Chi tiết đơn hàng", path: "/order-detail" },
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

    const handleViewProduct = (id: number) => {
        navigate(`/products/edit/${id}`);
    };

    useEffect(() => {
        fetchOrderDetailById();
    }, [id]);

    return (
        <>
            <PageBreadcrumb items={breadcrumbItems} />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="space-y-6">
                    {/* {loading ? (
                        <div>Đang tải danh sách nhân viên...</div>
                    ) : ( */}
                    <div className="infoUser grid grid-cols-3 gap-4">
                        <ComponentCard title="Thông tin khách hàng">
                            <div className="space-y-0">
                                <Label htmlFor="name">
                                    Họ tên:
                                    <span className="ml-2">
                                        {dataOrderDetail?.user.name}
                                    </span>
                                </Label>
                                <Label htmlFor="phone">
                                    Số điện thoại:
                                    <span className="ml-2">
                                        {dataOrderDetail?.user.phone_number}
                                    </span>
                                </Label>
                                <Label htmlFor="address">
                                    Email:
                                    <span className="ml-2">
                                        {dataOrderDetail?.user.email}
                                    </span>
                                </Label>
                                <Label htmlFor="address">
                                    Địa chỉ:
                                    <span className="ml-2">
                                        {dataOrderDetail?.user.address}
                                    </span>
                                </Label>
                            </div>
                        </ComponentCard>
                        <ComponentCard title="Thông tin địa chỉ nhận hàng">
                            <div className="space-y-0">
                                <Label htmlFor="name">
                                    Họ tên:
                                    <span className="ml-2">
                                        {
                                            dataOrderDetail?.shipping_address
                                                .full_name
                                        }
                                    </span>
                                </Label>
                                <Label htmlFor="phone">
                                    Số điện thoại:
                                    <span className="ml-2">
                                        {
                                            dataOrderDetail?.shipping_address
                                                .phone_num
                                        }
                                    </span>
                                </Label>
                                <Label htmlFor="address">
                                    Địa chỉ:
                                    <span className="ml-2">
                                        {
                                            dataOrderDetail?.shipping_address
                                                .detail
                                        }
                                        {dataOrderDetail?.shipping_address.ward}
                                        ,{" "}
                                        {
                                            dataOrderDetail?.shipping_address
                                                .district
                                        }
                                        ,{" "}
                                        {dataOrderDetail?.shipping_address.city}
                                    </span>
                                </Label>
                            </div>
                        </ComponentCard>
                        <ComponentCard title="Thông tin đơn hàng">
                            <div className="space-y-0">
                                <Label htmlFor="order_id">
                                    Mã đơn hàng:
                                    <span className="ml-2">
                                        {dataOrderDetail?.id}
                                    </span>
                                </Label>
                                <Label htmlFor="total">
                                    Tổng tiền:
                                    <span className="ml-2">
                                        {dataOrderDetail?.total_price.toLocaleString(
                                            "vi-VN"
                                        )}{" "}
                                        VNĐ
                                    </span>
                                </Label>
                                <Label htmlFor="payment_method">
                                    Hình thức thanh toán:
                                    <span className="ml-2">
                                        {dataOrderDetail?.payment_method.text}
                                    </span>
                                </Label>
                                <Label htmlFor="order_state">
                                    Trạng thái đơn hàng:
                                    <span className="ml-2">
                                        {dataOrderDetail?.order_state.text}
                                    </span>
                                </Label>
                            </div>
                        </ComponentCard>
                    </div>
                    <div className="overflow-hidden rounded-xl dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <ComponentCard title="Thông tin sản phẩm">
                            <div className="max-w-full overflow-x-auto">
                                <Table>
                                    {/* Table Header */}
                                    <TableHeader className="text-left border-b border-gray-100 dark:border-white/[0.05]">
                                        <TableRow>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                                            >
                                                #
                                            </TableCell>

                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                                            >
                                                Số hiệu sản phẩm
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                                            >
                                                Loại sản phẩm
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                                            >
                                                Thương hiệu
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                                            >
                                                Số lượng
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                                            >
                                                Đơn giá
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                                            >
                                                Thành tiền
                                            </TableCell>
                                        </TableRow>
                                    </TableHeader>

                                    {/* Table Body */}
                                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                        {productItems.map((data, index) => (
                                            <TableRow key={data.id}>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {data.modal_num}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {data.category.name}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {data.brand.name}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {data.quantity}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {data.price.toLocaleString(
                                                        "vi-VN"
                                                    )}
                                                </TableCell>
                                                {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {data.state_text}
                                            </TableCell> */}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    <Actions
                                                        onView={() =>
                                                            handleViewProduct(
                                                                data.id
                                                            )
                                                        }
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="flex justify-between m-5">
                                <div></div>
                            </div>
                        </ComponentCard>
                    </div>
                    {/* )} */}
                </div>
            </div>
        </>
    );
}
