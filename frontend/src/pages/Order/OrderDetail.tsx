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
    };

    type dataDetail = {
        id: 123;
        user: {
            id: 45;
            name: "Nguyễn Văn A";
            email: "a@example.com";
            phone: "0912345678";
        };
        shipping_address: {
            street: "123 Đường ABC";
            city: "Hà Nội";
            province: "Hà Nội";
            zip_code: "100000";
        };
        payment: {
            method: "COD"; // hoặc "Chuyển khoản", "Ví điện tử"
            status: "pending"; // pending, paid, failed...
        };
        items: [
            {
                id_product: 9;
                name: "Casio AE-1200WHD-1AVDF";
                image: "/uploads/casio1.jpg";
                price: 350000;
                quantity: 2;
                subtotal: 700000;
            },
            {
                id_product: 17;
                name: "Orient Bambino Gen 5";
                image: "/uploads/orient5.jpg";
                price: 1200000;
                quantity: 1;
                subtotal: 1200000;
            }
        ];
        order_state: {
            code: 2; // 0–4 như bạn mapping
            text: "Đang giao hàng";
        };
        total_price: 1930000; // tổng tiền hàng + phí
        created_at: "2025-06-14T10:00:00Z";
        updated_at: "2025-06-14T11:30:00Z";
    };

    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [totalUser, setTotalUser] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);
    const [limitData, setLimitData] = useState(10);
    const [orderId, setOrderId] = useState(BigInt(0));
    const [products, setProducts] = useState<Product[]>([]);

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Đơn hàng", path: "/orders" },
        { label: "Chi tiết đơn hàng", path: "/order-detail" },
    ];

    const fetchOrderDetailById = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/orders/detail/${id}`);
            setProducts(res.data.orders);
        } catch (err) {
            console.error("Lỗi khi tải danh sách:", err);
            toast.error("Lỗi khi tải danh ");
        } finally {
            setLoading(false);
        }
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
                    <div className="infoUser grid grid-cols-2 gap-4">
                        <ComponentCard title="Thông tin khách hàng">
                            <div className="space-y-0">
                                <Label htmlFor="name">
                                    Họ tên:
                                    <span className="ml-2">Phạm Đức</span>
                                </Label>
                                <Label htmlFor="address">
                                    Họ tên:
                                    <span className="ml-2">Phạm Đức</span>
                                </Label>
                            </div>
                        </ComponentCard>
                        <ComponentCard title="Thông tin địa chỉ nhận hàng">
                            <div>
                                <Label htmlFor="email">Email:</Label>
                            </div>
                            <div>
                                <Label htmlFor="phone_num">
                                    Số điện thoại:
                                </Label>
                            </div>
                            <div>
                                <Label htmlFor="address">Địa chỉ:</Label>
                            </div>
                        </ComponentCard>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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
                                            Mã sản phẩm
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
                                    {products.map((data, index) => (
                                        <TableRow key={data.id}>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {data.id}
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
                                                {data.price}
                                            </TableCell>
                                            {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {data.state_text}
                                            </TableCell> */}
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <Actions
                                                    onView={() => {
                                                        alert("view product");
                                                    }}
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
                    </div>
                    {/* )} */}
                </div>
            </div>
        </>
    );
}
