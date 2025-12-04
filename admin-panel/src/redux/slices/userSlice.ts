import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/User";
import { TableParams } from "@/types/Table";

interface UserState {
  list: User[] | null;
  editUser: User | null;
  tableParams: TableParams<User>;
  keyword: string;
  loading: boolean;
  message: string | null;
  error: string | null;
}

const initialState: UserState = {
  list: [],
  editUser: null,
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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUser: (state) => {
      state.message = null;
      state.error = null;
      state.loading = true;
    },
    getUserSuccess: (
      state,
      action: PayloadAction<{
        data: User[];
        pagination: {
          total: number;
        };
      }>
    ) => {
      state.list = action.payload.data;
      if (state.tableParams.pagination) {
        state.tableParams.pagination.total = action.payload.pagination.total;
      }
      state.loading = false;
    },
    getUserError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    getUserById: (state, action: PayloadAction<number>) => {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    getUserByIdSuccess: (state, action: PayloadAction<User>) => {
      state.error = null;
      state.message = null;
      state.editUser = action.payload;
    },
    getUserByIdError: (state, action: PayloadAction<string>) => {
      state.message = null;
      state.error = action.payload;
    },
    setTableParams: (
      state,
      action: PayloadAction<Partial<TableParams<User>>>
    ) => {
      state.tableParams = {
        ...state.tableParams,
        ...action.payload,
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
    addUser: (state, action: PayloadAction<User>) => {
      state.message = null;
      state.error = null;
    },
    addUserSuccess: (state, action: PayloadAction<string>) => {
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
    addUserError: (state, action: PayloadAction<string>) => {
      state.message = null;
      state.error = action.payload;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.message = null;
      state.error = null;
    },
    updateUserSuccess: (state, action: PayloadAction<string>) => {
      state.error = null;
      state.message = action.payload;
    },
    updateUserError: (state, action: PayloadAction<string>) => {
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
  getUser,
  getUserSuccess,
  getUserError,
  setTableParams,
  setKeyword,
  addUser,
  addUserSuccess,
  addUserError,
  setLoading,
  getUserById,
  getUserByIdSuccess,
  getUserByIdError,
  updateUser,
  updateUserSuccess,
  updateUserError,
  clearMessage,
} = userSlice.actions;
export default userSlice.reducer;
