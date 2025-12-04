import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useNavigate } from "react-router-dom";
import axios from "@/lib/axiosConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Actions from "@/components/common/Actions";
import { SearchAndAddBar } from "@/components/common/SearchAndAdd";
import { Tag } from "antd";
import type { Column } from "@/types/Table";
import type { Employee } from "@/types/Employee";
import TableData from "@/components/common/Table";
import {
  getEmployee,
  setTableParams,
  setKeyword,
} from "@/redux/slices/employeeSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHook";
import { selectEmployeeData } from "@/redux/selectors/employeeSelector";

export default function Employees() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Nhân viên", path: "/employees" },
  ];
  const { tableParams } = useAppSelector((state) => state.employee);
  const columns: Column<Employee>[] = [
    {
      title: "STT",
      dataIndex: "index",
      render: (_: unknown, __: Employee, index: number) =>
        (tableParams.pagination!.current! - 1) *
          tableParams.pagination!.pageSize! +
        index +
        1,
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      sorter: true,
      search: true,
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      sorter: true,
      search: true,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      filters: [
        { text: "Nam", value: "1" },
        { text: "Nữ", value: "0" },
      ],
      filterMultiple: false,
    },
    {
      title: "Email",
      dataIndex: "email",
      search: true,
    },
    {
      title: "SĐT",
      dataIndex: "phone_number",
      search: true,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      search: true,
    },
    {
      title: "Chức vụ",
      dataIndex: "position",
      key: "position",
      filters: [],
      render: (_: unknown, record: Employee) => record.position?.name || "-",
    },
    {
      title: "Trạng thái",
      dataIndex: "state",
      filters: [
        { text: "Hoạt động", value: "1" },
        { text: "Chặn", value: "0" },
      ],
      filterMultiple: false,
      render: (_: unknown, record: Employee) => (
        <Tag color={record.state === "Hoạt động" ? "green" : "red"}>
          {record.state}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      fixed: "right",
      render: (_: unknown, record: Employee) => (
        <Actions
          onEdit={() => navigate(`/employees/edit/${record.id}`)}
          onDelete={() => handleDeleteEmployee(record.id)}
        />
      ),
    },
  ];

  const handleSearch = (value: string) => {
    dispatch(setKeyword(value));
  };

  const handleDeleteEmployee = async (id: number) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/employees/${id}`);
      toast.success("Xóa người dùng thành công!");
      dispatch(getEmployee());
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      toast.error("Xóa người dùng thất bại!");
    }
  };

  return (
    <>
      <PageBreadcrumb items={breadcrumbItems} />
      <div className="rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 w-full">
        <div className="space-y-2 md:space-y-4">
          <SearchAndAddBar
            placeholder="Tìm kiếm..."
            onSearch={handleSearch}
            onAdd={() => {
              navigate("/employees/add-new");
            }}
          />
          <div className="w-full overflow-x-auto">
            <TableData<Employee>
              columns={columns}
              selector={selectEmployeeData}
              actionFetch={getEmployee}
              actionSetParams={setTableParams}
            />
          </div>
        </div>
      </div>
    </>
  );
}
