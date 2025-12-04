import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Employee } from "@/types/Employee";
import { TableParams } from "@/types/Table";

interface EmployeeState {
  list: Employee[] | null;
  editEmployee: Employee | null;
  tableParams: TableParams<Employee>;
  keyword: string;
  loading: boolean;
  message: string | null;
  error: string | null;
}

const initialState: EmployeeState = {
  list: [],
  editEmployee: null,
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

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    getEmployee: (state) => {
      state.message = null;
      state.error = null;
      state.loading = true;
    },
    getEmployeeSuccess: (
      state,
      action: PayloadAction<{
        data: Employee[];
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
    getEmployeeError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    getEmployeeById: (state, action: PayloadAction<number>) => {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    getEmployeeByIdSuccess: (state, action: PayloadAction<Employee>) => {
      state.error = null;
      state.message = null;
      state.editEmployee = action.payload;
    },
    setTableParams: (
      state,
      action: PayloadAction<Partial<TableParams<Employee>>>
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
    addEmployee: (state, action: PayloadAction<Employee>) => {
      state.message = null;
      state.error = null;
    },
    addEmployeeSuccess: (state, action: PayloadAction<string>) => {
      state.error = null;
      state.message = action.payload;
    },
    addEmployeeError: (state, action: PayloadAction<string>) => {
      state.message = null;
      state.error = action.payload;
    },
    updateEmployee: (state, action: PayloadAction<Employee>) => {
      state.message = null;
      state.error = null;
    },
    updateEmployeeSuccess: (state, action: PayloadAction<string>) => {
      state.error = null;
      state.message = action.payload;
    },
    updateEmployeeError: (state, action: PayloadAction<string>) => {
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
  getEmployee,
  getEmployeeSuccess,
  getEmployeeError,
  setTableParams,
  setKeyword,
  addEmployee,
  addEmployeeSuccess,
  addEmployeeError,
  setLoading,
  getEmployeeById,
  getEmployeeByIdSuccess,
  updateEmployee,
  updateEmployeeSuccess,
  updateEmployeeError,
  clearMessage,
} = employeeSlice.actions;
export default employeeSlice.reducer;
