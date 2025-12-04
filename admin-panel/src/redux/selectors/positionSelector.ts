import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectPositionState = (state: RootState) => state.position;

export const selectPositionData = createSelector(
  [selectPositionState],
  (position) => ({
    list: position.list || [],
    loading: position.loading,
    tableParams: position.tableParams,
    keyword: position.keyword,
  })
);
