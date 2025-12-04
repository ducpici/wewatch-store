// src/redux/selectors/userSelector.ts
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectUserState = (state: RootState) => state.user;

export const selectUserData = createSelector([selectUserState], (user) => ({
  list: user.list || [],
  loading: user.loading,
  tableParams: user.tableParams,
  keyword: user.keyword,
}));
