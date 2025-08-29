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

interface Role {
    id: number;
    name: string;
    url: string;
    description: string;
}

export default function Roles() {
    const navigate = useNavigate();
    const [roles, setRoles] = useState<Role[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);
    const [limitData, setLimitData] = useState(10);

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Quyền", path: "/roles" },
    ];

    const fetchRoles = async (page: number, limit: number) => {
        setLoading(true);
        try {
            const res = await axios.get(`/roles?page=${page}&limit=${limit}`);
            setRoles(res.data.data);
            setPage(page);
            setLimitData(res.data.pagination.limit);
            setTotalPage(res.data.pagination.totalPages);
        } catch (err) {
            console.error("Lỗi khi tải danh sách:", err);
            toast.error("Lỗi khi tải danh sách");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles(page, limitData);
    }, [page, limitData]);

    const handleDeleteRole = async (id: number) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`/roles/${id}`);
            toast.success("Xóa thành công!");
            fetchRoles(page, limitData); // Gọi lại danh sách sau khi xóa
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            toast.error("Xóa thất bại!");
        }
    };

    const handlePageClick = (selectedItem: { selected: number }) => {
        fetchRoles(selectedItem.selected + 1, limitData);
    };

    const handleSearch = async (value: string) => {
        if (!value.trim()) {
            // Nếu rỗng thì load lại toàn bộ danh sách
            fetchRoles(1, limitData);
            return;
        }

        try {
            const res = await axios.get(`/roles/search`, {
                params: {
                    keyword: value,
                },
            });
            if (Array.isArray(res.data.data)) {
                setRoles(res.data.data);
            } else {
                // Nếu data không phải mảng thì reset state roles về mảng rỗng
                setRoles([]);
            }
            // setRoles(res.data.data);
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
                            navigate("/roles/add-new");
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
                                                Mã quyền hạn
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                                            >
                                                Tên quyền hạn
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                                            >
                                                Url
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
                                        {roles.map((role, index) => (
                                            <TableRow key={role.id}>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {role.id}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {role.name}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {role.url}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {role.description}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    <Actions
                                                        // onView={() =>
                                                        //     navigate(
                                                        //         `/roles/${role.id_user}`
                                                        //     )
                                                        // }
                                                        onEdit={() =>
                                                            navigate(
                                                                `/roles/edit/${role.id}`
                                                            )
                                                        }
                                                        onDelete={() =>
                                                            handleDeleteRole(
                                                                role.id
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
