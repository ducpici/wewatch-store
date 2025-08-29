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

interface Category {
    id: number;
    name: string;
    description: string;
}

export default function Categories() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);
    const [limitData, setLimitData] = useState(10);

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Loại sản phẩm", path: "/categories" },
    ];

    const fetchCategories = async (page: number, limit: number) => {
        try {
            const res = await axios.get(
                `/categories?page=${page}&limit=${limit}`
            );
            setLoading(true);
            setCategories(res.data.data);
            setLimitData(res.data.pagination.limit);
            setTotalPage(res.data.pagination.totalPages);
            setPage(page);
        } catch (err) {
            toast.error("Lỗi khi tải danh sách");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories(page, limitData);
    }, [page, limitData]);

    const handleDeleteCategory = async (id: number) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`/categories/${id}`);
            toast.success("Xóa thành công!");
            fetchCategories(page, limitData); // Gọi lại danh sách sau khi xóa
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            toast.error("Xóa thất bại!");
        }
    };

    const handlePageClick = (selectedItem: { selected: number }) => {
        fetchCategories(selectedItem.selected + 1, limitData);
    };

    const handleSearch = async (value: string) => {
        if (!value.trim()) {
            // Nếu rỗng thì load lại toàn bộ danh sách
            fetchCategories(1, limitData);
            return;
        }

        try {
            const res = await axios.get(`/categories/search`, {
                params: {
                    keyword: value,
                },
            });
            if (Array.isArray(res.data.data)) {
                setCategories(res.data.data);
            } else {
                // Nếu data không phải mảng thì reset state categories về mảng rỗng
                setCategories([]);
            }
            // setCategories(res.data.data);
            setTotalPage(1); // Khi tìm kiếm, không cần phân trang
        } catch (err) {
            toast.error("Lỗi khi tìm kiếm");
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
                            navigate("/categories/add-new");
                        }}
                        onSearch={() => {
                            handleSearch(searchValue);
                        }}
                    />
                    {loading ? (
                        <div>Đang tải danh sách...</div>
                    ) : (
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
                                                Mã nhà cung cấp
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                                            >
                                                Tên nhà cung cấp
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                                            >
                                                Mô tả
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
                                        {categories.map((data, index) => (
                                            <TableRow key={data.id}>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {data.id}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {data.name}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {data.description}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    <Actions
                                                        // onView={() =>
                                                        //     navigate(
                                                        //         `/categories/${data.id_user}`
                                                        //     )
                                                        // }
                                                        onEdit={() =>
                                                            navigate(
                                                                `/categories/edit/${data.id}`
                                                            )
                                                        }
                                                        onDelete={() =>
                                                            handleDeleteCategory(
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
                    )}
                </div>
            </div>
        </>
    );
}
