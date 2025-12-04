import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectEmployeeState = (state: RootState) => state.employee;

export const selectEmployeeData = createSelector(
  [selectEmployeeState],
  (employee) => ({
    list: employee.list || [],
    loading: employee.loading,
    tableParams: employee.tableParams,
    keyword: employee.keyword,
  })
);
