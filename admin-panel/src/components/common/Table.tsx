import { useState, useEffect, useRef } from "react";
import { Table, Button, Input, Space } from "antd";
import type { TableColumnType, InputRef, TableProps } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import type { ColumnsType } from "antd/es/table";
import { TableParams } from "@/types/Table";
import type { Columns } from "@/types/Table";
import { RootState } from "@/redux/store";
import { AnyAction } from "redux";

import { useAppDispatch, useAppSelector } from "@/hooks/storeHook";

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];
type DataIndex<T> = keyof T;
interface TableDataProps<T extends object> {
  columns: Columns<T>;
  selector: (state: RootState) => {
    list: T[];
    loading: boolean;
    tableParams: TableParams<T>;
  };
  actionFetch: () => AnyAction;
  actionSetParams: (params: TableParams<T>) => AnyAction;
  rowKey?: string;
  searchKeyword?: string;
}

export default function TableData<T extends object>({
  columns,
  selector,
  actionFetch,
  actionSetParams,
  rowKey = "id",
}: TableDataProps<T>) {
  const dispatch = useAppDispatch();
  const { list, loading, tableParams } = useAppSelector(selector);
  const { keyword } = useAppSelector((state) => state.user);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState<keyof T | string>("");
  const searchInput = useRef<InputRef>(null);

  // ---------- SEARCH COLUMN ----------
  const getColumnSearchProps = (
    dataIndex: DataIndex<T>
  ): TableColumnType<T> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${String(dataIndex)}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
          >
            Search
          </Button>
          <Button onClick={() => clearFilters?.()} size="small">
            Reset
          </Button>
        </Space>
      </div>
    ),

    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),

    onFilter: (value, record) => {
      const fieldValue = record[dataIndex];
      return fieldValue
        ? String(fieldValue).toLowerCase().includes(String(value).toLowerCase())
        : false;
    },

    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069" }}
          searchWords={[searchText]}
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex<T>
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(String(dataIndex));
  };

  // ---------- TABLE CHANGE ----------
  const handleChange: TableProps<T>["onChange"] = async (
    pagination,
    filters,
    sorter
  ) => {
    const params: Partial<TableParams<T>> = {
      pagination,
      filters,
      sortField: !Array.isArray(sorter) ? (sorter.field as keyof T) : null,
      sortOrder: !Array.isArray(sorter) ? sorter.order : null,
    };

    dispatch(actionSetParams(params));
    dispatch(actionFetch());
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<T> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Select Odd Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: "even",
        text: "Select Even Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  // load initial
  useEffect(() => {
    dispatch(actionFetch());
  }, [dispatch, actionFetch, keyword]);

  // ---------- APPLY SEARCH TO COLUMNS ----------
  const applySearchToColumns = (cols: Columns<T>): ColumnsType<T> => {
    return cols.map((col) => {
      // Nếu có children thì xử lý theo dạng group
      if ("children" in col && col.children) {
        return {
          ...col,
          children: applySearchToColumns(col.children as Columns<T>),
        };
      }

      // Nếu là column có search
      if (col.search && col.dataIndex) {
        return {
          ...col,
          ...getColumnSearchProps(col.dataIndex as keyof T),
        };
      }

      return col;
    });
  };
  const mappedColumns = applySearchToColumns(columns);

  return (
    <Table<T>
      rowKey={rowKey}
      columns={mappedColumns}
      dataSource={Array.isArray(list) ? list : []}
      loading={loading}
      locale={{
        emptyText: loading ? "Loading..." : "No data",
      }}
      size="middle"
      rowSelection={rowSelection}
      bordered
      scroll={{ x: "max-content" }}
      pagination={{
        ...tableParams.pagination,
        showTotal: (total) => `Tổng: ${total} mục`,
      }}
      onChange={handleChange}
    />
  );
}
