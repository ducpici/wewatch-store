import { Epic, ofType } from "redux-observable";
import {
  switchMap,
  map,
  catchError,
  of,
  concatWith,
  startWith,
  delay,
} from "rxjs";
import { positionService } from "@/services/positionService";
import type { RootState } from "@/redux/store";
import { PayloadAction } from "@reduxjs/toolkit";
import { Position } from "@/types/Position";
import { Action } from "redux";

import {
  getPosition,
  getPositionSuccess,
  getPositionError,
  addPosition,
  addPositionSuccess,
  addPositionError,
  updatePosition,
  updatePositionSuccess,
  updatePositionError,
  setLoading,
  getPositionById,
  getPositionByIdSuccess,
  setTableParams,
  deletePosition,
  deletePositionSuccess,
  deletePositionError,
} from "@/redux/slices/positionSlice";

// const getPositionEpic: Epic<Action, Action, RootState> = (action$, state$) =>
//   action$.pipe(
//     ofType(getPosition.type),
//     switchMap(() => {
//       const params = state$.value.position.tableParams;
//       const keyword = state$.value.position.keyword;
//       return positionService.getPosition(params, keyword).pipe(
//         map((res) => getPositionSuccess(res.response)),
//         catchError(() => of(getPositionError("Fail to get"))),
//         startWith(setLoading(true)),
//         concatWith(of(setLoading(false)).pipe(delay(500)))
//       );
//     })
//   );

const getPositionEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(getPosition.type),
    switchMap(() => {
      const params = state$.value.position.tableParams;
      const keyword = state$.value.position.keyword;

      const currentPage = params.pagination?.current || 1;

      return positionService.getPosition(params, keyword).pipe(
        switchMap((res) => {
          const { data, pagination } = res.response;
          const apiPage = pagination.page; // page API trả về
          const totalPages = pagination.totalPages;

          // 1) Nếu API báo currentPage > totalPages
          if (totalPages > 0 && currentPage > totalPages) {
            return of(
              setTableParams({
                pagination: {
                  ...params.pagination,
                  current: totalPages,
                },
              }),
              getPosition()
            );
          }

          // 2) Nếu data rỗng nhưng currentPage còn >1 → lùi 1 trang
          if (data.length === 0 && currentPage > 1) {
            return of(
              setTableParams({
                pagination: {
                  ...params.pagination,
                  current: currentPage - 1,
                },
              }),
              getPosition()
            );
          }

          // 3) Nếu API trả về page không trùng state → sync lại
          if (apiPage !== currentPage) {
            return of(
              setTableParams({
                pagination: {
                  ...params.pagination,
                  current: apiPage,
                },
              })
            );
          }

          // 4) Trường hợp OK → trả data
          return of(getPositionSuccess(res.response));
        }),

        catchError(() => of(getPositionError("Fail to get"))),

        startWith(setLoading(true)),
        concatWith(of(setLoading(false)).pipe(delay(150)))
      );
    })
  );

const getPositionByIdEpic: Epic<Action, Action, RootState> = (action$) =>
  action$.pipe(
    ofType(getPositionById.type),
    switchMap((payload) => {
      const id = (payload as PayloadAction<number>).payload;
      return positionService.getPositionById(id).pipe(
        map((res) => getPositionByIdSuccess(res.response)),
        catchError(() => of(getPositionError("Fail to get"))),
        startWith(setLoading(true)),
        concatWith(of(setLoading(false)).pipe(delay(500)))
      );
    })
  );

const createPositionEpic: Epic<Action, Action, RootState> = (action$) =>
  action$.pipe(
    ofType(addPosition.type),
    switchMap((action) => {
      const payload = (action as PayloadAction<Position>).payload;
      return positionService.createPosition(payload).pipe(
        map((res) => addPositionSuccess(res.response.message)),
        catchError(() => of(addPositionError("Fail to add position"))),
        startWith(setLoading(true)),
        concatWith(of(setLoading(false)).pipe(delay(500)))
      );
    })
  );

const updatePositionEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(updatePosition.type),
    switchMap((action) => {
      const id = state$.value.position.editPosition?.id;
      const data = (action as PayloadAction<Position>).payload;
      const payload = {
        ...data,
        id: Number(id),
      };
      return positionService.updatePosition(payload).pipe(
        map((res) => updatePositionSuccess(res.response.message)),
        catchError(() => of(updatePositionError("Fail to update position"))),
        startWith(setLoading(true)),
        concatWith(of(setLoading(false)).pipe(delay(500)))
      );
    })
  );

const deletePositionByIdEpic: Epic<Action, Action, RootState> = (action$) =>
  action$.pipe(
    ofType(deletePosition.type),
    switchMap((payload) => {
      const id = (payload as PayloadAction<number>).payload;
      return positionService.deletePositionById(id).pipe(
        map((res) => deletePositionSuccess(res.response.message)),
        catchError(() => of(deletePositionError("Fail to delete"))),
        startWith(setLoading(true)),
        concatWith(of(setLoading(false)).pipe(delay(500)))
      );
    })
  );

export const positionEpics = [
  getPositionEpic,
  getPositionByIdEpic,
  createPositionEpic,
  updatePositionEpic,
  deletePositionByIdEpic,
];
