import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Position } from "@/types/Position";
import { TableParams } from "@/types/Table";

interface PositionState {
  list: Position[] | null;
  editPosition: Position | null;
  tableParams: TableParams<Position>;
  keyword: string;
  loading: boolean;
  message: string | null;
  error: string | null;
}

const initialState: PositionState = {
  list: [],
  editPosition: null,
  tableParams: {
    pagination: {
      current: 1,
      pageSize: 10,
      pageSizeOptions: ["10", "20", "50", "100"],
      showSizeChanger: true,
    },
    filters: {},
    sortField: null,
    sortOrder: null,
    Keyword: "",
  },
  keyword: "",
  loading: false,
  message: null,
  error: null,
};

const positionSlice = createSlice({
  name: "position",
  initialState,
  reducers: {
    getPosition: (state) => {
      state.message = null;
      state.error = null;
      state.loading = true;
    },
    getPositionSuccess: (
      state,
      action: PayloadAction<{
        data: Position[];
        pagination: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>
    ) => {
      const { data, pagination } = action.payload;
      const { page, total, limit } = pagination;

      state.list = data;
      // cập nhật pagination từ API
      if (state.tableParams.pagination) {
        state.tableParams.pagination.total = total;
        state.tableParams.pagination.current = page;
        state.tableParams.pagination.pageSize = limit;
      }

      state.loading = false;
    },
    getPositionError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    getPositionById: (state, action: PayloadAction<number>) => {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    getPositionByIdSuccess: (
      state,
      action: PayloadAction<{ data: Position; message: string }>
    ) => {
      state.error = null;
      state.message = null;
      state.editPosition = action.payload.data;
    },
    getPositionByIdError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.message = null;
    },
    // setTableParams: (
    //   state,
    //   action: PayloadAction<Partial<TableParams<Position>>>
    // ) => {
    //   state.tableParams = {
    //     ...state.tableParams,
    //     ...action.payload,
    //   };
    // },
    setTableParams: (
      state,
      action: PayloadAction<Partial<TableParams<Position>>>
    ) => {
      state.tableParams = {
        ...state.tableParams,
        ...action.payload,
        pagination: {
          ...state.tableParams.pagination,
          ...action.payload.pagination,
        },
      };
    },

    setKeyword: (state, action: PayloadAction<string>) => {
      if (state.keyword !== action.payload) {
        state.keyword = action.payload;
        state.tableParams.pagination!.current = 1;
      } else {
        state.keyword = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addPosition: (state, action: PayloadAction<Position>) => {
      state.message = null;
      state.error = null;
    },
    addPositionSuccess: (state, action: PayloadAction<string>) => {
      state.error = null;
      state.message = action.payload;
      const totalItems = state.tableParams.pagination?.total || 0;
      const pageSize = state.tableParams.pagination?.pageSize || 10;
      // tính page chứa item mới
      const newPage = Math.ceil((totalItems + 1) / pageSize);
      state.tableParams.pagination = {
        ...state.tableParams.pagination,
        current: newPage,
      };
    },
    addPositionError: (state, action: PayloadAction<string>) => {
      state.message = null;
      state.error = action.payload;
    },
    updatePosition: (state, action: PayloadAction<Position>) => {
      state.message = null;
      state.error = null;
    },
    updatePositionSuccess: (state, action: PayloadAction<string>) => {
      state.error = null;
      state.message = action.payload;
      // const curPage = state.tableParams.pagination?.current;
      // state.tableParams.pagination = {
      //   ...state.tableParams.pagination,
      //   current: curPage,
      // };
    },
    updatePositionError: (state, action: PayloadAction<string>) => {
      state.message = null;
      state.error = action.payload;
    },
    deletePosition: (state, action: PayloadAction<number>) => {
      state.message = null;
      state.error = null;
    },
    deletePositionSuccess: (state, action: PayloadAction<string>) => {
      state.error = null;
      state.message = action.payload;
    },
    deletePositionError: (state, action: PayloadAction<string>) => {
      state.message = null;
      state.error = action.payload;
    },
    clearMessage(state) {
      state.message = null;
      state.error = null;
    },
  },
});
export const {
  getPosition,
  getPositionSuccess,
  getPositionError,
  setTableParams,
  setKeyword,
  addPosition,
  addPositionSuccess,
  addPositionError,
  setLoading,
  getPositionById,
  getPositionByIdSuccess,
  getPositionByIdError,
  updatePosition,
  updatePositionSuccess,
  updatePositionError,
  deletePosition,
  deletePositionSuccess,
  deletePositionError,
  clearMessage,
} = positionSlice.actions;
export default positionSlice.reducer;
