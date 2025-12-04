import type { GetProp, TableProps } from "antd";
import type { ColumnType } from "antd/es/table";

type TablePaginationConfig = Exclude<
  GetProp<TableProps, "pagination">,
  boolean
>;

export type Column<T> = ColumnType<T> & { search?: boolean };
export type Columns<T> = Column<T>[];

export interface TableParams<T> {
  pagination?: TablePaginationConfig;
  sortField?: keyof T | null;
  sortOrder?: string | null;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
  Keyword?: string;
}
