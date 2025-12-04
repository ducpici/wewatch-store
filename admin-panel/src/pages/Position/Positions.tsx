import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Actions from "@/components/common/Actions";
import { SearchAndAddBar } from "@/components/common/SearchAndAdd";
import type { Column } from "@/types/Table";
import type { Position } from "@/types/Position";
import TableData from "@/components/common/Table";
import {
  getPosition,
  setTableParams,
  setKeyword,
  deletePosition,
  clearMessage,
} from "@/redux/slices/positionSlice";
import { Tag } from "antd";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHook";
import { selectPositionData } from "@/redux/selectors/positionSelector";
import { useEffect } from "react";

export default function Positions() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Chức vụ", path: "/positions" },
  ];
  const { tableParams, message, error } = useAppSelector(
    (state) => state.position
  );
  const columns: Column<Position>[] = [
    {
      title: "STT",
      dataIndex: "index",
      render: (_: unknown, __: Position, index: number) =>
        (tableParams.pagination!.current! - 1) *
          tableParams.pagination!.pageSize! +
        index +
        1,
    },
    {
      title: "Tên chức vụ",
      dataIndex: "name",
      sorter: true,
      search: true,
    },
    {
      title: "Quyền",
      dataIndex: "role",
      width: 500,
      render: (_: unknown, record: Position) =>
        record?.roles?.length ? (
          record.roles.map((role) => (
            <Tag color={role.color} key={role.id}>
              {role.name}{" "}
            </Tag>
          ))
        ) : (
          <Tag color="red">Chưa có quyền</Tag>
        ),
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
      render: (_: unknown, record: Position) => (
        <Actions
          onEdit={() => navigate(`/positions/edit/${record.id}`)}
          onDelete={() => handleDeletePosition(record.id)}
        />
      ),
    },
  ];

  const handleSearch = (value: string) => {
    dispatch(setKeyword(value));
  };

  const handleDeletePosition = async (id: number) => {
    dispatch(deletePosition(id));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
      dispatch(getPosition());
    }
    if (error) {
      toast.error(error);
      dispatch(clearMessage());
    }
  }, [message, error, dispatch, navigate]);

  return (
    <>
      <PageBreadcrumb items={breadcrumbItems} />
      <div className="rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 w-full">
        <div className="space-y-2 md:space-y-4">
          <SearchAndAddBar
            placeholder="Tìm kiếm..."
            onSearch={handleSearch}
            onAdd={() => {
              navigate("/positions/add-new");
            }}
          />
          <div className="w-full overflow-x-auto">
            <TableData<Position>
              columns={columns}
              selector={selectPositionData}
              actionFetch={getPosition}
              actionSetParams={setTableParams}
            />
          </div>
        </div>
      </div>
    </>
  );
}
