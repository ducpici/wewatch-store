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

interface Product {
    id: number;
    modal_num: string;
    product_name: string;
    brand: {
        id: number;
        name: string;
        description: string;
    };
    origin: string;
    crystal_material: string;
    movement_type: string;
    dial_diameter: string;
    case_thickness: string;
    strap_material: string;
    water_resistance: string;
    category: {
        id: number;
        name: string;
        description: string;
    };
    quantity: number;
    price: number;
    state: string;
}

export default function Products() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalUser, setTotalUser] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);
    const [limitData, setLimitData] = useState(10);

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Sản phẩm", path: "/products" },
    ];

    const fetchProducts = async (page: number, limit: number) => {
        setLoading(true);
        try {
            const res = await axios.get(
                `/products?page=${page}&limit=${limit}`
            );
            setProducts(res.data.data);
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
        fetchProducts(page, limitData);
    }, [page, limitData]);

    const handleDeleteUser = async (id: number) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`/products/${id}`);
            toast.success("Xóa thành công!");
            fetchProducts(page, limitData); // Gọi lại danh sách sau khi xóa
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            toast.error("Xóa thất bại!");
        }
    };

    const handlePageClick = (selectedItem: { selected: number }) => {
        fetchProducts(selectedItem.selected + 1, limitData);
    };

    const handleSearch = async (value: string) => {
        if (!value.trim()) {
            // Nếu rỗng thì load lại toàn bộ danh sách
            fetchProducts(1, limitData);
            return;
        }

        try {
            const res = await axios.get(`/products/search`, {
                params: {
                    keyword: value,
                },
            });
            if (Array.isArray(res.data.data)) {
                setProducts(res.data.data);
            } else {
                // Nếu data không phải mảng thì reset state products về mảng rỗng
                setProducts([]);
            }
            // setProducts(res.data.data);
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
                        onAdd={() => {
                            navigate("/products/add-new");
                        }}
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
                                            Nhà cung cấp
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                                        >
                                            Xuất xứ
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                                        >
                                            Chất liệu mặt kính
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                                        >
                                            Loại động cơ
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                                        >
                                            Đường kính mặt số
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                                        >
                                            Độ dày thân
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                                        >
                                            Chất liệu dây đeo
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
                                            Số lượng
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                                        >
                                            Giá
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
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {data.brand.name}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {data.origin}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {data.crystal_material}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {data.movement_type}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {data.dial_diameter}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {data.case_thickness}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {data.strap_material}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {data.category.name}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {data.quantity}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {data.price}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {data.state}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <Actions
                                                    onEdit={() =>
                                                        navigate(
                                                            `/products/edit/${data.id}`
                                                        )
                                                    }
                                                    onDelete={() =>
                                                        handleDeleteUser(
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
                    </div>
                    {/* )} */}
                </div>
            </div>
        </>
    );
}
