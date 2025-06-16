import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useNavigate } from "react-router-dom";
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

interface Order {
    order_id: bigint;
    user_id: bigint;
    user_name: string;
    total_price: number | null;
    payment_method_name: string;
    created_at_text: string;
    order_state_name: string;
    order_state_code: number | null;
}

export default function Orders() {
    const navigate = useNavigate();

    const orderStateMap = [
        { id: 0, name: "Chờ xác nhận" },
        { id: 1, name: "Đã xác nhận" },
        { id: 2, name: "Đang giao hàng" },
        { id: 3, name: "Hoàn thành" },
        { id: 4, name: "Trả hàng" },
        { id: 5, name: "Đã hủy" },
    ];

    const { isOpen, openModal, closeModal } = useModal();

    const [orders, setOrders] = useState<Order[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalUser, setTotalUser] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);
    const [limitData, setLimitData] = useState(10);
    const [orderState, setOrderState] = useState("");
    const [orderId, setOrderId] = useState(BigInt(0));

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Đơn hàng", path: "/orders" },
    ];
    const handleSelectChange = (value: string) => {
        setOrderState(value);
    };

    const handlePressEdit = async (order_id: bigint) => {
        openModal();
        setOrderId(order_id);
        const res = await axios.get(`/orders/${order_id}`);
        setOrderState(String(res.data.order_state_code));
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
    const fetchOrders = async (page: number, limit: number) => {
        setLoading(true);
        try {
            const res = await axios.get(`/orders?page=${page}&limit=${limit}`);
            setOrders(res.data.orders);
            console.log(res);
            setLimitData(res.data.pagination.limit);
            setTotalPage(res.data.pagination.totalPages);
        } catch (err) {
            console.error("Lỗi khi tải danh sách:", err);
            toast.error("Lỗi khi tải danh ");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(page, limitData);
    }, [page, limitData]);

    // const handleDelete = async (id: number) => {
    //     const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa?");
    //     if (!confirmDelete) return;

    //     try {
    //         await axios.delete(`/orders/${id}`);
    //         toast.success("Xóa thành công!");
    //         fetchOrders(page, limitData); // Gọi lại danh sách sau khi xóa
    //     } catch (error) {
    //         console.error("Lỗi khi xóa:", error);
    //         toast.error("Xóa thất bại!");
    //     }
    // };

    const handlePageClick = (selectedItem: { selected: number }) => {
        fetchOrders(selectedItem.selected + 1, limitData);
    };

    const handleSearch = async (value: string) => {
        if (!value.trim()) {
            // Nếu rỗng thì load lại toàn bộ danh sách
            fetchOrders(1, limitData);
            return;
        }

        try {
            const res = await axios.get(`/orders/search`, {
                params: {
                    keyword: value,
                },
            });
            if (Array.isArray(res.data.data)) {
                setOrders(res.data.data);
            }
            // setOrders(res.data.data);
            setTotalPage(1); // Khi tìm kiếm, không cần phân trang
        } catch (err) {
            console.error("Lỗi khi tìm kiếm:", err);
            toast.error("Lỗi khi tìm kiếm nhân viên");
        }
    };

    return (
        <>
            <PageBreadcrumb items={breadcrumbItems} />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="space-y-6">
                    {/* <BasicTableOne /> */}
                    <SearchAndAddBar
                        onChange={setSearchValue}
                        value={searchValue}
                        onAdd={() => {}}
                        onSearch={() => {
                            handleSearch(searchValue);
                        }}
                    />
                    {/* {loading ? (
                        <div>Đang tải danh sách nhân viên...</div>
                    ) : ( */}
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
                                            Mã đơn hàng
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                                        >
                                            Mã khách hàng
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                                        >
                                            Tên khách hàng
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                                        >
                                            Tổng tiền
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                                        >
                                            Phương thức thanh toán
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                                        >
                                            Ngày tạo
                                        </TableCell>

                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                                        >
                                            Trạng thái
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                                        >
                                            Thao tác
                                        </TableCell>
                                    </TableRow>
                                </TableHeader>

                                {/* Table Body */}
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {orders.map((data, index) => (
                                        <TableRow key={data.order_id}>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {data.order_id}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {data.user_id}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {data.user_name}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {data.total_price?.toLocaleString(
                                                    "vi-VN"
                                                )}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {data.payment_method_name}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {data.created_at_text}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {data.order_state_name}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <Actions
                                                    onView={() => {
                                                        navigate(
                                                            `/orders/detail/${data.order_id}`
                                                        );
                                                    }}
                                                    onEdit={() =>
                                                        handlePressEdit(
                                                            data.order_id
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
                            <ReactPaginate
                                nextLabel="next >"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={2}
                                pageCount={totalPage}
                                previousLabel="< previous"
                                pageClassName="page-item"
                                pageLinkClassName="page-link p-2"
                                previousClassName="page-item"
                                previousLinkClassName="page-link"
                                nextClassName="page-item"
                                nextLinkClassName="page-link"
                                breakLabel="..."
                                breakClassName="page-item"
                                breakLinkClassName="page-link"
                                containerClassName="pagination flex font-semibol text-gray-500 text-theme-md dark:text-gray-400"
                                activeClassName="active text-blue-600"
                                renderOnZeroPageCount={null}
                            />
                        </div>
                        <Modal
                            isOpen={isOpen}
                            onClose={closeModal}
                            className="max-w-[500px] m-4"
                        >
                            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                                <div className="px-2 pr-14">
                                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                        Cập nhật trạng thái đơn hàng
                                    </h4>
                                </div>
                                <div className="custom-scrollbar h-[200px] overflow-y-auto px-2 pb-3">
                                    <div>
                                        <Select
                                            options={orderStateMap}
                                            value={orderState}
                                            defaultValue={orderState}
                                            placeholder="Chọn tình trạng"
                                            onChange={handleSelectChange}
                                            className="dark:bg-dark-900"
                                        />

                                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2"></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={closeModal}
                                    >
                                        Đóng
                                    </Button>
                                    <Button size="sm" onClick={handleSave}>
                                        Lưu thay đổi
                                    </Button>
                                </div>
                            </div>
                        </Modal>
                    </div>
                    {/* )} */}
                </div>
            </div>
        </>
    );
}
