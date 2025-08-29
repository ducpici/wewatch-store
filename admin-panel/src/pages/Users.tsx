import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import axios from "../lib/axiosConfig";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../components/ui/table";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Actions from "../components/common/Actions";
import { SearchAndAddBar } from "../components/common/SearchAndAdd";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

interface User {
    id: number; // bigint(20)
    name: string; // varchar(255)
    dob: string; // varchar(100), có thể là ngày sinh dạng string
    gender: string;
    email: string; // varchar(255)
    address: string; // varchar(255)
    phone_number: string; // varchar(100)
    username: string; // varchar(255)
    password: string; // varchar(255)
    state: string; //
}

export default function Users() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);
    const [limitData, setLimitData] = useState(10);

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Khách hàng", path: "/users" },
    ];

    const fetchAllUsers = async (page: number, limit: number) => {
        setLoading(true);
        try {
            const res = await axios.get(`/users?page=${page}&limit=${limit}`);
            setUsers(res.data.data);
            setPage(page);
            setLimitData(res.data.pagination.limit);
            setTotalPage(res.data.pagination.totalPages);
        } catch (err) {
            console.error("Lỗi khi tải danh sách:", err);
            toast.error("Lỗi khi tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllUsers(page, limitData);
    }, [page, limitData]);

    const handleDeleteUser = async (id: number) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`/users/${id}`);
            toast.success("Xóa người dùng thành công!");
            fetchAllUsers(page, limitData); // Gọi lại danh sách sau khi xóa
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            toast.error("Xóa người dùng thất bại!");
        }
    };

    const handlePageClick = (selectedItem: { selected: number }) => {
        fetchAllUsers(selectedItem.selected + 1, limitData);
    };

    const handleSearch = async (value: string) => {
        if (!value.trim()) {
            // Nếu rỗng thì load lại toàn bộ danh sách
            fetchAllUsers(1, limitData);
            return;
        }

        try {
            const res = await axios.get(`/users/search`, {
                params: {
                    keyword: value,
                },
            });
            if (Array.isArray(res.data.data)) {
                setUsers(res.data.data);
            } else {
                // Nếu data không phải mảng thì reset state users về mảng rỗng
                setUsers([]);
            }
            // setUsers(res.data.data);
            setTotalPage(1); // Khi tìm kiếm, không cần phân trang
        } catch (err) {
            console.error("Lỗi khi tìm kiếm:", err);
            toast.error("Lỗi khi tìm kiếm người dùng");
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
                            navigate("/users/add-user");
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
                                    <TableHeader className="text-center border-b border-gray-100 dark:border-white/[0.05]">
                                        <TableRow>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                                            >
                                                #
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                                            >
                                                Mã khách hàng
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                                            >
                                                Tên khách hàng
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                                            >
                                                Ngày sinh
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                                            >
                                                Giới tính
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                                            >
                                                Email
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                                            >
                                                Địa chỉ
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                                            >
                                                Số điện thoại
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                                            >
                                                Trạng thái tài khoản
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                                            >
                                                Thao tác
                                            </TableCell>
                                        </TableRow>
                                    </TableHeader>

                                    {/* Table Body */}
                                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                        {users.map((user, index) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {user.id}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {user.name}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {user.dob}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {user.gender}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {user.email}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {user.address}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {user.phone_number}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {user.state}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    <Actions
                                                        // onView={() =>
                                                        //     navigate(
                                                        //         `/users/${user.id}`
                                                        //     )
                                                        // }
                                                        onEdit={() =>
                                                            navigate(
                                                                `/users/edit-user/${user.id}`
                                                            )
                                                        }
                                                        onDelete={() =>
                                                            handleDeleteUser(
                                                                user.id
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
