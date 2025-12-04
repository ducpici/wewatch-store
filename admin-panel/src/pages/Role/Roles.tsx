import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useNavigate } from "react-router-dom";
import axios from "@/lib/axiosConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Actions from "@/components/common/Actions";
import { SearchAndAddBar } from "@/components/common/SearchAndAdd";
import { useState } from "react";
import type { Column } from "@/types/Table";
import type { Role } from "@/types/Role";
import TableData from "@/components/common/Table";
import { getRole, setTableParams, setKeyword } from "@/redux/slices/roleSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHook";
import { selectRoleData } from "@/redux/selectors/roleSelector";

export default function Roles() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [reload, setReload] = useState(false);
  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Quyền", path: "/roles" },
  ];
  const { tableParams } = useAppSelector((state) => state.role);
  const columns: Column<Role>[] = [
    {
      title: "STT",
      dataIndex: "index",
      render: (_: unknown, __: Role, index: number) =>
        (tableParams.pagination!.current! - 1) *
          tableParams.pagination!.pageSize! +
        index +
        1,
    },
    {
      title: "Tên quyền",
      dataIndex: "name",
      sorter: true,
      search: true,
    },
    {
      title: "URL",
      dataIndex: "url",
      search: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      search: true,
    },
    {
      title: "Hành động",
      align: "center",
      fixed: "right",
      render: (_: unknown, record: Role) => (
        <Actions
          onEdit={() => navigate(`/roles/edit/${record.id}`)}
          onDelete={() => handleDeleteRole(record.id)}
        />
      ),
    },
  ];

  const handleSearch = (value: string) => {
    dispatch(setKeyword(value));
  };

  const handleDeleteRole = async (id: number) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/roles/${id}`);
      toast.success("Xóa thành công!");
      setReload(true);
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      toast.error("Xóa thất bại!");
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
              navigate("/roles/add-new");
            }}
          />
          <div className="w-full overflow-x-auto">
            <TableData<Role>
              columns={columns}
              selector={selectRoleData}
              actionFetch={getRole}
              actionSetParams={setTableParams}
              reload={reload}
            />
          </div>
        </div>
      </div>
    </>
  );
}
