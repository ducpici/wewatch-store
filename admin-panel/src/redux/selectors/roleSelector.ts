import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectRoleState = (state: RootState) => state.role;

export const selectRoleData = createSelector([selectRoleState], (role) => ({
  list: role.list || [],
  loading: role.loading,
  tableParams: role.tableParams,
  keyword: role.keyword,
}));
