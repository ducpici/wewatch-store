import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Role } from "@/types/Role";
import { TableParams } from "@/types/Table";

interface RoleState {
  list: Role[] | null;
  editRole: Role | null;
  tableParams: TableParams<Role>;
  keyword: string;
  loading: boolean;
  message: string | null;
  error: string | null;
}

const initialState: RoleState = {
  list: [],
  editRole: null,
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

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    getAllRole: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },

    getRole: (state) => {
      state.message = null;
      state.error = null;
      state.loading = true;
    },
    getRoleSuccess: (
      state,
      action: PayloadAction<{
        data: Role[];
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
    getRoleError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    getRoleById: (state, action: PayloadAction<number>) => {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    getRoleByIdSuccess: (
      state,
      action: PayloadAction<{ message: string; data: Role }>
    ) => {
      state.error = null;
      state.editRole = action.payload.data;
    },
    getRoleByIdError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setTableParams: (
      state,
      action: PayloadAction<Partial<TableParams<Role>>>
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
    addRole: (state, action: PayloadAction<Role>) => {
      state.message = null;
      state.error = null;
    },
    addRoleSuccess: (state, action: PayloadAction<string>) => {
      state.error = null;
      state.message = action.payload;
    },
    addRoleError: (state, action: PayloadAction<string>) => {
      state.message = null;
      state.error = action.payload;
    },
    updateRole: (state, action: PayloadAction<{ data: Role; id: number }>) => {
      state.message = null;
      state.error = null;
    },
    updateRoleSuccess: (state, action: PayloadAction<string>) => {
      state.error = null;
      state.message = action.payload;
    },
    updateRoleError: (state, action: PayloadAction<string>) => {
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
  getAllRole,
  getRole,
  getRoleSuccess,
  getRoleError,
  setTableParams,
  setKeyword,
  addRole,
  addRoleSuccess,
  addRoleError,
  setLoading,
  getRoleById,
  getRoleByIdSuccess,
  getRoleByIdError,
  updateRole,
  updateRoleSuccess,
  updateRoleError,
  clearMessage,
} = roleSlice.actions;
export default roleSlice.reducer;
